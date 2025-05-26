<template>
  <span>{{ displayType }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {useI18n} from '#i18n'
const {t} = useI18n()
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const displayType = computed(() => {
  return t(`users.types.${props.type}`, props.type === 'admin' ? 'Admin' : props.type === 'doctor' ? 'Doctor' : 'Client');
});
</script>
