<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

import { provide } from 'vue';

// Global truncate function
const truncateText = (text: string, maxLength = 25): string => {
  if (!text) return ''; // Handle undefined/null cases
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Provide globally
provide('truncateText', truncateText);

</script>
