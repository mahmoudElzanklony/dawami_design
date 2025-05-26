<template>
  <v-alert
      :type="alertType"
      elevation="0"
      icon="false"
      variant="text"
      rounded="rounded"
      class="font-weight-medium availability-alert"
  >
    {{ alertText }}
  </v-alert>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from '#imports'
const {t} = useI18n()
const props = defineProps({
  isBlocked: Number,
});


const alertType = computed(() => {
  return props.isBlocked ? 'error' : 'success';
});

const alertText = computed(() => {
  return t(`global.availability.${props.isBlocked ? 'blocked' : 'available'}`);
});
</script>

<style scoped>
.availability-alert :deep(.v-alert__prepend) {
  margin-inline-end: -10px;
}
</style>
