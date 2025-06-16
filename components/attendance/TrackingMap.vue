<template>
  <div class="map-container" style="height: 400px;">
    <client-only>
      <l-map
        ref="trackingMapRef"
        :zoom="mapZoom"
        :center="mapCenter"
        :use-global-leaflet="false"
      >
        <l-tile-layer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        ></l-tile-layer>
        
        <l-marker
          v-for="(track, index) in trackingData"
          :key="index"
          :lat-lng="getTrackingLatLng(track)"
          :icon="redMarkerIcon"
        >
          <l-tooltip :options="tooltipOptions">
            <div class="tracking-tooltip">
              <div class="tracking-title">
                {{ formatTrackingType(track.type) }} - {{ formatDate(track.created_at) }}
              </div>
              <div class="tracking-detail">
                <v-icon small color="primary">mdi-map-marker</v-icon>
                {{ getTrackingLocationString(track) }}
              </div>
              <div class="tracking-detail">
                <v-icon small color="primary">mdi-calendar-clock</v-icon>
                {{ $t('attendance.details.created_at') }}: {{ formatTime(track.created_at) }}
              </div>
              <div class="tracking-detail">
                <v-icon small color="primary">mdi-battery</v-icon>
                {{ $t('attendance.details.battery') }}: {{ track.battery }}%
              </div>
              <div class="tracking-detail">
                <v-icon small color="primary">mdi-walk</v-icon>
                {{ $t('attendance.details.steps') }}: {{ track.steps }}
              </div>
              <div class="tracking-detail">
                <v-icon small :color="track.is_connected_net ? 'success' : 'error'">mdi-wifi</v-icon>
                {{ track.is_connected_net ? $t('attendance.details.connected') : $t('attendance.details.disconnected') }}
              </div>
              <div class="tracking-detail">
                <v-icon small :color="track.is_existence ? 'success' : 'error'">
                  {{ track.is_existence ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                </v-icon>
                {{ track.is_existence ? $t('attendance.details.existent') : $t('attendance.details.non_existent') }}
              </div>
            </div>
          </l-tooltip>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from '#imports';
import { formatDate } from '~/composables/FormatDateComposable';
import { formatDateTime, formatTime } from '~/utilities/formatDateTime';

const { t } = useI18n();

const props = defineProps({
  trackingData: {
    type: Array,
    default: () => []
  }
});

// Map and tracking related refs
const trackingMapRef = ref(null);
const mapZoom = ref(13);
const defaultCenter = [30.033333, 31.233334]; // Cairo, Egypt default

// Compute center based on tracking data
const mapCenter = computed(() => {
  if (props.trackingData && props.trackingData.length > 0) {
    // Find first tracking record with valid location
    for (const track of props.trackingData) {
      const coords = getTrackingCoordinates(track);
      if (coords) {
        return [coords.latitude, coords.longitude];
      }
    }
  }
  return defaultCenter;
});

// Parse tracking location data
const getTrackingCoordinates = (track) => {
  try {
    if (track.location) {
      return typeof track.location === 'string'
        ? JSON.parse(track.location)
        : track.location;
    }
    return null;
  } catch (error) {
    console.error('Error parsing tracking location:', error);
    return null;
  }
};

// Get tracking lat/lng for marker
const getTrackingLatLng = (track) => {
  const coords = getTrackingCoordinates(track);
  return coords ? [coords.latitude, coords.longitude] : defaultCenter;
};

// Get tracking location as a string
const getTrackingLocationString = (track) => {
  try {
    if (track.location) {
      const location = typeof track.location === 'string'
        ? JSON.parse(track.location)
        : track.location;

      return `${location.latitude}, ${location.longitude}`;
    }
    return '-';
  } catch (error) {
    console.error('Error parsing tracking location:', error);
    return '-';
  }
};

const formatTrackingType = (type) => {
  if (type === 'checkin') return t('attendance.tracking_type.checkin');
  if (type === 'checkout') return t('attendance.tracking_type.checkout');
  return type;
};

// Create a red marker icon
const redMarkerIcon = ref(null);

onMounted(() => {
  if (process.client) {
    import('leaflet').then((L) => {
      redMarkerIcon.value = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    });
  }
});

// Detect RTL mode
const isRTL = computed(() => {
  if (process.client) {
    return document.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
  }
  return false;
});

const tooltipOptions = computed(() => {
  const options = { 
    permanent: false, 
    sticky: true,
    className: isRTL.value ? 'leaflet-tooltip-rtl' : ''
  };
  
  if (isRTL.value) {
    // Adjust offset for RTL mode
    options.direction = 'right';
    options.offset = [15, 0]; // Shift tooltip to the right in RTL mode
  }
  
  return options;
});
</script>

<style scoped>
.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Add RTL-specific styling for Leaflet tooltips */
:global(.leaflet-tooltip-rtl) {
  direction: rtl;
  text-align: right;
  margin-right: 12px !important;
  transform: translateX(-12px);
}

.tracking-tooltip {
  padding: 8px;
  min-width: 200px;
  direction: inherit;
}

.tracking-title {
  font-weight: bold;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.tracking-detail {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  gap: 4px;
}
</style>