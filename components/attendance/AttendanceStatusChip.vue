<template>
  <v-chip
    :color="statusColor"
    text-color="white"
    :size="size"
  >
    {{ formattedStatus }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#imports';

const { t } = useI18n();

const props = defineProps({
  status: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default'
  }
});

const statusColor = computed(() => {
  if (props.status === 'attend') return 'success';
  if (props.status === 'absent') return 'error';
  if (props.status === 'late') return 'warning';
  return 'info';
});

const formattedStatus = computed(() => {
  if (props.status === 'attend') return t('attendance.status.attend');
  if (props.status === 'absent') return t('attendance.status.absent');
  if (props.status === 'late') return t('attendance.status.late');
  return props.status || '';
});
</script>
