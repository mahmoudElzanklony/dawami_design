<script setup lang="ts">

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);


const updatePage = (newPage) => {
  emit('update:modelValue', newPage);
};
</script>

<template>
  <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
    <v-pagination
      :model-value="modelValue"
      @update:model-value="updatePage"
      :length="store?.data?.meta?.last_page"
      :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : store?.data?.meta?.per_page"
      :active-color="'#1e64ff'"
      :disabled="store.loading"
      density="comfortable"
    ></v-pagination>
  </div>
</template>

<style scoped>

</style>