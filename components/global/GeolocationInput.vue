<template>
  <div>
    <v-text-field
        :label="label"
        variant="outlined"
        density="compact"
        :model-value="formattedLocation"
        :readonly="true"
        :loading="location.loading"
        :error="!!location.error"
        :error-messages="location.error"
        :prepend-inner-icon="icon"
        :placeholder="placeholder || 'انقر على أيقونة GPS لتحديد موقعك'"
    >
      <template v-slot:append>
        <v-btn
            icon
            variant="text"
            @click="getLocation"
            :loading="location.loading"
            :disabled="disabled"
        >
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    
    <!-- Submit as JSON string (default) -->
    <input
        v-if="!submit_as_array"
        type="hidden"
        :name="name"
        :value="locationValue"
    />
    
    <!-- Submit as array notation -->
    <template v-else>
      <input
          type="hidden"
          :name="`${name}[0][latitude]`"
          :value="location.latitude"
      />
      <input
          type="hidden"
          :name="`${name}[0][longitude]`"
          :value="location.longitude"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import {useGeolocation} from '~/composables/useGeolocation';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'fa-duotone fa-solid fa-location-dot'
  },
  placeholder: {
    type: String,
    default: ''
  },
  autoDetect: {
    type: Boolean,
    default: true
  },
  submit_as_array: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const {location, getCurrentPosition, formatLocation, getLocationObject} = useGeolocation();


onMounted(() => {
  console.log(props.modelValue)
  if (props.modelValue) {
    try {
      if (props.modelValue.coordinates) {
        location.latitude = props.modelValue.coordinates[0].latitude;
        location.longitude = props.modelValue.coordinates[0].longitude;
      }
    } catch (e) {
      console.error("Error parsing location:", e);
    }
  }

  if (props.autoDetect && !props.modelValue && !props.disabled) {
    nextTick(() => {
      getLocation();
    });
  }
});

async function getLocation() {
  try {
    await getCurrentPosition();
    updateModelValue();
  } catch (error) {
    console.error("Error getting location:", error);
  }
}

function updateModelValue() {
  const locationObj = getLocationObject();
  if (locationObj) {
    emit('update:modelValue', locationObj);
  }
}

watch(() => location, updateModelValue, {deep: true});
const formattedLocation = computed(() => formatLocation());
const locationValue = computed(() => {
  const locationObj = getLocationObject();
  return locationObj ? JSON.stringify(locationObj) : '';
});
</script>
