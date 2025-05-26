<template>
  <span :class="badgeClass">{{ displayText }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {useI18n} from '#i18n'
const {t} = useI18n()

interface Props {
  ip: string | null | undefined
}

const props = defineProps<Props>()


const displayText = computed(() => {
  return t(`users.status.${props.ip ? 'registered' : 'notRegistered'}`)
})

const badgeClass = computed(() => {
  return props.ip
      ? 'rounded-full border border-green-500 text-green-500 bg-green-100 px-3 py-1'
      : 'inline-block rounded-full border border-gray-500 text-gray-500 bg-gray-100 px-3 py-1'
})
</script>
