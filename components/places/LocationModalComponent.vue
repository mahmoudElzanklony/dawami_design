<template>
  <v-dialog v-model="internalOpen" persistent max-width="800">
    <v-card>
      <v-card-title class="headline">Search Location</v-card-title>
      <v-card-text>
        <!-- Search Input with Suggestions -->
        <v-autocomplete
            v-model="searchQuery"
            :items="searchResults"
            item-title="display_name"
            label="Enter a location"
            @update:search="searchLocation"
            clearable
            return-object
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.display_name"></v-list-item>
          </template>
        </v-autocomplete>

        <!-- Map Container -->
        <div style="height: 400px; width: 100%;">
          <LMap
              ref="map"
              style="height: 350px"
              :zoom="zoom"
              :center="center"
              :use-global-leaflet="false"
              @ready="onMapReady"
          >
            <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base"
                name="OpenStreetMap"
            />
            <LMarker v-if="markerPosition" :lat-lng="markerPosition" />
          </LMap>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import type  LMap  from '@nuxtjs/leaflet'

interface SearchResult {
  display_name: string
  lat: string
  lon: string
}

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open'])

const internalOpen = ref(props.open)
const map = ref<typeof LMap | null>(null)
const searchQuery = ref<string | SearchResult>('')
const searchResults = ref<SearchResult[]>([])
const zoom = ref(6)
const center = ref<[number, number]>([30.0444, 31.2357]) // Cairo coordinates
const markerPosition = ref<[number, number] | null>(null)

watch(() => props.open, (newVal) => {
  internalOpen.value = newVal
})

watch(internalOpen, (val) => {
  emit('update:open', val)
})

const onMapReady = (mapInstance: any) => {
  map.value = mapInstance
}

const closeModal = () => {
  internalOpen.value = false
  searchResults.value = []
}
const timeoutId = ref<number | null>(null)

const searchLocation = async (query: string) => {
  if (!query) {
    searchResults.value = []
    return
  }

  // Clear existing timeout
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }

  // Set new timeout
  timeoutId.value = setTimeout(async () => {
    try {
      const { data } = await axios.get<SearchResult[]>(
          'https://nominatim.openstreetmap.org/search',
          {
            params: {
              q: query,
              format: 'json',
              addressdetails: 1,
              limit: 5
            },
          }
      )

      searchResults.value = data
    } catch (err) {
      console.error('Error searching for location:', err)
      searchResults.value = []
    }
  }, 300) // 300ms delay after typing stops
}


watch(searchQuery, (newVal) => {
  if (newVal && typeof newVal !== 'string') {
    const lat = parseFloat(newVal.lat)
    const lon = parseFloat(newVal.lon)
    center.value = [lat, lon]
    markerPosition.value = [lat, lon]
    zoom.value = 13

    if (map.value?.leafletObject) {
      map.value.leafletObject.flyTo([lat, lon], 13)
    }
  }
})
</script>