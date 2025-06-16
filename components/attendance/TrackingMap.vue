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
            :icon="getMarkerIcon(index)"
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
const divIcons = ref({});

// Get marker icon with index
const getMarkerIcon = (index) => {
  if (divIcons.value[index]) {
    return divIcons.value[index];
  }
  return redMarkerIcon.value;
};

onMounted(() => {
  if (process.client) {
    import('leaflet').then((L) => {
      // Create a div icon for each marker with index
      if (props.trackingData) {
        props.trackingData.forEach((_, index) => {
          divIcons.value[index] = L.divIcon({
            className: 'custom-marker-icon',
            html: `
              <div class="marker-wrapper">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" 
                     class="marker-image" />
                <div class="marker-index-container">
                  <span class="marker-index-text">${index + 1}</span>
                </div>
              </div>
            `,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          });
        });
      }
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

/* Custom marker styling */
:global(.custom-marker-icon) {
  background: none !important;
  border: none !important;
}

:global(.marker-wrapper) {
  position: relative;
  width: 25px;
  height: 41px;
}

:global(.marker-image) {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

:global(.marker-index-container) {
  position: absolute;
  top: -5px;
  right: -8px;
  z-index: 2;
}

:global(.marker-index-text) {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: bold;
  font-size: 10px;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 2px rgba(0,0,0,0.3);
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