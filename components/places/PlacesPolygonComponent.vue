<template>
  <div>
    <v-alert
      type="info"
      variant="tonal"
      density="compact"
      icon="mdi-information-outline"
      class="mb-3"
    >
      <p>أضف على الأقل 4 نقاط لتشكيل المنطقة.</p>
    </v-alert>

    <v-btn
      block
      prepend-icon="mdi-crosshairs-gps"
      color="primary"
      variant="tonal"
      class="mb-3"
      @click="addCurrentLocation"
      :loading="locationLoading"
      :disabled="disabled"
    >
      إضافة موقعك الحالي كنقطة
    </v-btn>

    <v-alert
      v-if="locationError"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-3"
      closable
      @click:close="locationError = ''"
    >
      {{ locationError }}
    </v-alert>
    
    <!-- Map for adding points -->
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
          
          <l-polygon 
            v-if="points.length >= 4"
            :latLngs="displayPoints"
            :use-global-leaflet="false"
            color="green"
          ></l-polygon>
          
          <l-marker 
            v-for="(point, index) in points"
            :key="index"
            :lat-lng="[point.latitude, point.longitude]"
            :draggable="true"
            :use-global-leaflet="false"
            @dragend="updateMarkerPosition($event, index)"
          >
            <l-tooltip :permanent="true">{{ index + 1 }}</l-tooltip>
          </l-marker>
          
          <l-polyline 
            v-if="points.length >= 2"
            :latLngs="displayPoints"
            :use-global-leaflet="false"
            color="blue"
          ></l-polyline>
        </l-map>
        <div v-else class="loading-placeholder">
          Loading map...
        </div>
      </div>
    </client-only>

    <!-- Hidden inputs for form submission -->
    <div style="display: none;">
      <input
        v-for="(point, index) in points"
        :key="`lng-${index}`"
        :name="`${inputName}[${index}][longitude]`"
        :value="point.longitude"
        type="hidden"
      />
      <input
        v-for="(point, index) in points"
        :key="`lat-${index}`"
        :name="`${inputName}[${index}][latitude]`"
        :value="point.latitude"
        type="hidden"
      />
    </div>

    <v-card class="mt-3">
      <v-card-title class="pb-0">
        <div class="d-flex justify-space-between align-center">
          <h3 class="text-subtitle-1">النقاط المحددة ({{ points.length }})</h3>
          <v-btn
            v-if="points.length > 0"
            icon="mdi-delete-sweep"
            variant="text"
            color="error"
            density="compact"
            @click="clearPoints"
            title="مسح كل النقاط"
          ></v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="points.length < 4"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          يجب إضافة {{ 4 - points.length }} نقاط على الأقل لتشكيل المنطقة.
        </v-alert>

        <v-alert
          v-if="points.length >= 4"
          type="success"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          تم تحديد المنطقة بنجاح ({{ points.length }} نقاط)
        </v-alert>

        <v-list density="compact" v-if="points.length > 0">
          <v-list-item v-for="(point, index) in points" :key="index">
            <template v-slot:prepend>
              <v-chip size="small" class="me-2">{{ index + 1 }}</v-chip>
            </template>
            <template v-slot:default>
              <v-list-item-title>
                  <span class="text-body-2">
                    Lat: {{ Number(point.latitude).toFixed(6) }}, Lng: {{ Number(point.longitude).toFixed(6) }}
                  </span>
              </v-list-item-title>
            </template>
            <template v-slot:append>
              <v-btn icon size="small" color="error" @click="removePoint(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <div v-if="calculatedArea && points.length >= 4" class="mt-3 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-ruler-square</v-icon>
          <span><strong>المساحة التقريبية:</strong> {{ calculatedArea }} متر مربع</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
  },
  inputName: {
    type: String,
    default: 'location'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue','area-calculated']);

const mapRef = ref(null);
const isClient = ref(false);
const zoom = ref(13);
const points = ref([]);
const calculatedArea = ref(null);
const locationLoading = ref(false);
const locationError = ref('');

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const center = computed(() => {
  if (points.value.length > 0) {
    return [points.value[0].latitude, points.value[0].longitude];
  }
  return [24.7136, 46.6753];
});

const displayPoints = computed(() => {
  return points.value.map(point => [point.latitude, point.longitude]);
});


async function addCurrentLocation() {
  if (props.disabled) return;

  locationLoading.value = true;
  locationError.value = '';

  try {
    const position = await getCurrentPosition();
    const { latitude, longitude, accuracy } = position.coords;
    points.value.push({ latitude, longitude, accuracy });

    if (points.value.length === 1 && mapRef.value && mapRef.value.leafletObject) {
      mapRef.value.leafletObject.setView([latitude, longitude], zoom.value);
    }

    updateModel();
  } catch (error) {
    locationError.value = `فشل في الحصول على الموقع: ${error.message}`;
    console.error("Geolocation error:", error);
  } finally {
    locationLoading.value = false;
  }
}
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('يبدو أن متصفحك لا يدعم تحديد الموقع الجغرافي'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الوصول إلى الموقع الجغرافي';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع الجغرافي';
            break;
          default:
            errorMessage = 'حدث خطأ غير معروف';
            break;
        }
        reject(new Error(errorMessage));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

function calculateArea() {
  if (points.value.length <4) {
    calculatedArea.value = null;
    return;
  }
  const earthRadius = 6371000; // Earth's radius in meters
  let area = 0;
  const pts = [...points.value];

  // Always add the first point to close the polygon for area calculation
    pts.push(pts[0]);


  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const lat1 = p1.latitude * Math.PI / 180;
    const lat2 = p2.latitude * Math.PI / 180;
    const lon1 = p1.longitude * Math.PI / 180;
    const lon2 = p2.longitude * Math.PI / 180;

    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs(area * earthRadius * earthRadius / 2);
  calculatedArea.value = Math.round(area);

  emit('area-calculated', calculatedArea.value);
}

onMounted(() => {
  isClient.value = true;
  if (props.modelValue) {
    try {
      // Extract coordinates from the new model value structure
      const coordinates = props.modelValue?.coordinates || [];
      if (Array.isArray(coordinates) && coordinates.length > 0) {
        points.value = coordinates.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude
        }));

        calculateArea();
      }
    } catch (e) {
      console.error("Error parsing polygon coordinates:", e);
      points.value = [];
    }
  }
});

const onMapReady = () => {
  nextTick(() => {
    if (mapRef.value && mapRef.value.leafletObject) {
      mapRef.value.leafletObject.invalidateSize();
      if (points.value.length > 1) {
        const bounds = displayPoints.value;
        mapRef.value.leafletObject.fitBounds(bounds);
      }
    }
  });
};

function handleMapClick(event) {
  const { lat, lng } = event.latlng;
  points.value.push({
    latitude: lat,
    longitude: lng
  });

  updateModel();
}
function removePoint(index) {
  points.value.splice(index, 1);
  updateModel();
}
function clearPoints() {
  points.value = [];
  calculatedArea.value = null;
  updateModel();
}

function updateMarkerPosition(event, index) {
  const { lat, lng } = event.target.getLatLng();
  points.value[index] = {
    latitude: lat,
    longitude: lng
  };

  updateModel();
}

function updateModel() {
  calculateArea();
  const formattedData = {};
  points.value.forEach((point, index) => {
    formattedData[`${props.inputName}[${index}][longitude]`] = point.longitude;
    formattedData[`${props.inputName}[${index}][latitude]`] = point.latitude;
  });

  emit('update:modelValue', formattedData);
}

watch(points, () => {
  console.log(points.value);
  calculateArea();
}, { deep: true });
</script>

<style scoped>
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
