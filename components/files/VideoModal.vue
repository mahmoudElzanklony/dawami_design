<script setup lang="ts">
defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <v-dialog
      :model-value="modelValue"
      @update:model-value="val => emit('update:modelValue', val)"
      max-width="1400"
  >
    <v-card class="bg-black rounded-lg overflow-hidden">
      <video
          class="w-full"
          style="height: 650px;"
          controls
          :src="videoUrl"
          autoplay
      >
        <source :src="videoUrl" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </v-card>
  </v-dialog>
</template>