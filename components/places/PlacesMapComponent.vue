<template>
  <div>
    <div class="search-container mb-3">
      <v-text-field
        v-model="searchQuery"
        :label="$t('places.map.search_location')"
        prepend-icon="mdi-magnify"
      >
        <template v-slot:append>
          <v-btn icon @click="searchLocation">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      
      <div v-if="searchResults.length > 0" class="search-results">
        <v-list density="compact">
          <v-list-item
            v-for="(result, index) in searchResults"
            :key="index"
            @click="selectLocation(result)"
          >
            <v-list-item-title>{{ result.display_name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
    
    <client-only>
      <div class="map-container" style="height: 400px;">
        <l-map 
          v-if="isClient" 
          ref="mapRef" 
          :zoom="zoom" 
          :center="center"
          :use-global-leaflet="false"
          @click="handleMapClick"
          @ready="onMapReady"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          
          <template v-if="mapType === 'gps' || mapType === 'maps'">
            <l-marker 
              :lat-lng="markerPosition" 
              draggable 
              @dragend="updateMarkerPosition"
            ></l-marker>
          </template>
          
          <template v-if="mapType === 'polygon'">
            <l-polygon 
              :lat-lngs="polygonPositions"
              @update="updatePolygon"
              :use-global-leaflet="false"
            ></l-polygon>
          </template>
        </l-map>
        <div v-else class="loading-placeholder">
          {{ $t('places.map.loading') }}
        </div>
      </div>
    </client-only>
    
    <div class="mt-2">
      <template v-if="mapType === 'gps' || mapType === 'maps'">
        <div class="d-flex">
          <v-text-field
            v-model="latitude"
            :label="$t('places.map.latitude')"
            class="mr-2"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="longitude"
            :label="$t('places.map.longitude')"
            readonly
          ></v-text-field>
        </div>

        <!-- Hidden inputs for form submission -->
        <input
          type="hidden"
          :name="`location[0][latitude]`"
          :value="latitude"
        />
        <input
          type="hidden"
          :name="`location[0][longitude]`"
          :value="longitude"
        />
      </template>
      
      <template v-if="mapType === 'polygon'">
        <v-textarea
          v-model="polygonCoordinatesString"
          :label="$t('places.map.area_coordinates')"
          readonly
          rows="2"
        ></v-textarea>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from '#imports';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  mapType: {
    type: String,
    default: 'maps',
    validator: (value) => ['gps', 'maps', 'polygon'].includes(value)
  }
});

const emit = defineEmits(['update:modelValue']);

const mapRef = ref(null);
const isClient = ref(false);
const mapReady = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const zoom = ref(13);
const searchTimeout = ref(null);

const latitude = ref(30.033333);
const longitude = ref(31.233334);

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const center = computed(() => {
  return [latitude.value, longitude.value];
});

const markerPosition = computed(() => {
  return [latitude.value, longitude.value];
});

const polygonPositions = ref([
  [24.7136, 46.6753],
  [24.7236, 46.6853],
  [24.7036, 46.6953]
]);

const polygonCoordinatesString = computed(() => {
  return JSON.stringify(polygonPositions.value);
});

// Get location object for emitting
const getLocationObject = () => {
  if (props.mapType === 'polygon') {
    return {
      coordinates: polygonPositions.value
    };
  } else {
    return {
      lat: latitude.value,
      lang: longitude.value
    };
  }
};

onMounted(() => {
  isClient.value = true;
  
  if (props.modelValue) {
    try {
      if (props.modelValue.coordinates) {
        latitude.value = props.modelValue.coordinates[0].latitude;
        longitude.value = props.modelValue.coordinates[0].longitude;
      }
    } catch (e) {
      console.error("Error parsing location:", e);
    }
  }
});

// Map ready handler
const onMapReady = () => {
  mapReady.value = true;
  nextTick(() => {
    if (mapRef.value && mapRef.value.leafletObject) {
      mapRef.value.leafletObject.invalidateSize();
    }
  });
};

watch([latitude, longitude], () => {
  if (props.mapType !== 'polygon') {
    const locationObj = getLocationObject();
    emit('update:modelValue', JSON.stringify(locationObj));
  }
}, { deep: true });

watch(polygonPositions, () => {
  if (props.mapType === 'polygon') {
    const locationObj = getLocationObject();
    emit('update:modelValue', JSON.stringify(locationObj));
  }
}, { deep: true });


watch(searchQuery, (newValue) => {
  if (newValue.trim().length < 3) {
    searchResults.value = [];
    return;
  }

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    searchLocation();
  }, 500); // 500ms debounce delay
});

const searchLocation = async () => {
  if (!searchQuery.value && !searchQuery.value.trim()) return;
  
  try {
    // Using Nominatim API for geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery.value)}&format=json&limit=5`);
    const data = await response.json();
    searchResults.value = data;
  } catch (error) {
    console.error('Error searching for location:', error);
  }
};

const selectLocation = (result) => {
  latitude.value = parseFloat(result.lat);
  longitude.value = parseFloat(result.lon);
  searchResults.value = [];
  searchQuery.value = result.display_name;
  
  // Update map center
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.setView([latitude.value, longitude.value], zoom.value);
  }
};

const handleMapClick = (event) => {
  if (props.mapType === 'polygon') return;
  
  const { lat, lng } = event.latlng;
  latitude.value = lat;
  longitude.value = lng;
};

const updateMarkerPosition = (event) => {
  const { lat, lng } = event.target.getLatLng();
  latitude.value = lat;
  longitude.value = lng;
};

const updatePolygon = (event) => {
  const latLngs = event.target.getLatLngs()[0];
  polygonPositions.value = latLngs.map(latLng => [latLng.lat, latLng.lng]);
};
</script>

<style scoped>
.search-container {
  position: relative;
  z-index: 1000;
}

.search-results {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.loading-placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
</style>