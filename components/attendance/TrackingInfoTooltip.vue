<template>
  <div v-if="tracking && tracking.length">
    <v-tooltip location="top">
      <template v-slot:activator="{ props }">
        <span v-bind="props" class="pointer">
          <span class="font-weight-medium">{{ tracking.length }}</span> {{ $t('attendance.tracking') }}
          <v-icon size="small" class="ms-1">mdi-information-outline</v-icon>
        </span>
      </template>
      <div class="text-center pa-2">
        <div v-for="(track, index) in displayTracks" :key="index" class="mb-1">
          <strong>{{ formatTrackingType(track.type) }}</strong>:
          {{ formatDate(track.created_at) }}
        </div>
        <div v-if="hasMoreTracks" class="mt-1 text-caption">
          +{{ tracking.length - maxDisplayTracks }} {{ $t('attendance.more_tracking') }}
        </div>
      </div>
    </v-tooltip>
  </div>
  <span v-else>-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#imports';
import { formatDate } from '~/composables/FormatDateComposable';

const { t } = useI18n();

const props = defineProps({
  tracking: {
    type: Array,
    default: () => []
  }
});

const maxDisplayTracks = 3;

const displayTracks = computed(() => {
  return props.tracking.slice(0, maxDisplayTracks);
});

const hasMoreTracks = computed(() => {
  return props.tracking.length > maxDisplayTracks;
});

const formatTrackingType = (type: string) => {
  if (type === 'checkin') return t('attendance.tracking_type.checkin');
  if (type === 'checkout') return t('attendance.tracking_type.checkout');
  return type;
};
</script>
