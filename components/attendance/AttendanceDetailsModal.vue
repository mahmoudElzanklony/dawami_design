<template>
  <v-dialog v-model="localModelValue" max-width="800" transition="fade-transition">
    <v-card v-if="item">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span>
          <i class="fa-solid fa-clipboard-user me-2 primary-color"></i>
          {{ $t('attendance.details_title') }}
        </span>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-row class="d-flex flex-wrap">
          <!-- User Information -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card variant="outlined" class="mb-4 d-flex flex-column fill-height w-100">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-account</v-icon>
                {{ $t('attendance.details.user_info') }}
              </v-card-title>
              <v-card-text class="flex-grow-1">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account-circle</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.username') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.user?.username || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.phone') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.user?.phone || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account-group</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.user_type') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.user?.type || '-' }}</v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Working Day Information -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card variant="outlined" class="mb-4 d-flex flex-column fill-height w-100">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-calendar-clock</v-icon>
                {{ $t('attendance.details.working_day_info') }}
              </v-card-title>
              <v-card-text class="flex-grow-1">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.day_name') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.working_day?.name || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-clock-start</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.start_time') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(item.working_day?.time_start) || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-clock-end</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.end_time') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(item.working_day?.time_end) || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-clock-alert</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.allowed_time') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.working_day?.allowed_time || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-state-machine</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.status') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <AttendanceStatusChip :status="item.working_day?.attendance_status" size="small" />
                  </v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Attendance Place -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card variant="outlined" class="mb-4 d-flex flex-column fill-height w-100">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-map-marker</v-icon>
                {{ $t('attendance.details.place_info') }}
              </v-card-title>
              <v-card-text class="flex-grow-1">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-office-building-marker</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.place_name') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.attendance_place?.name || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-office-building</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.organization') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.attendance_place?.organization?.name || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-map</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.place_type') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.attendance_place?.type || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="item.attendance_place?.location?.coordinates?.length > 0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-map-marker-radius</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.coordinates') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.attendance_place.location.coordinates[0].latitude }},
                    {{ item.attendance_place.location.coordinates[0].longitude }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Distance Information -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card variant="outlined" class="mb-4 d-flex flex-column fill-height w-100">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-map-marker-distance</v-icon>
                {{ $t('attendance.details.distance_info') }}
              </v-card-title>
              <v-card-text class="flex-grow-1">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-ruler</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.distance_from_place') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                        size="small"
                        :color="getDistanceColor(calculateDistance(item))"
                        text-color="white"
                    >
                      {{ formatDistance(calculateDistance(item)) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-note-text</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('attendance.details.notes') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.note || $t('attendance.details.no_notes') }}</v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Tracking Information -->
          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-map-marker-path</v-icon>
                {{ $t('attendance.details.tracking_info') }}
              </v-card-title>
              <v-card-text>
                <div v-if="item.tracking && item.tracking.length > 0">
                  <TrackingMap :tracking-data="item.tracking" />
                </div>
                <div v-else class="text-center pa-4">
                  {{ $t('attendance.details.no_tracking_data') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">{{ $t('attendance.details.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from '#imports';
import { formatDate } from '~/composables/FormatDateComposable';
import { useDistanceCalculation } from '~/composables/useDistanceCalculation';
import AttendanceStatusChip from '~/components/attendance/AttendanceStatusChip.vue';
import TrackingMap from '~/components/attendance/TrackingMap.vue';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  localModelValue.value = newValue;
});

watch(localModelValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const close = () => {
  emit('update:modelValue', false);
};

// Get distance calculation utilities
const { calculateDistance, formatDistance, getDistanceColor } = useDistanceCalculation();
</script>

<style scoped>

</style>