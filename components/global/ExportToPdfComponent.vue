<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
          color="primary"
          v-bind="props"
          :disabled="loading"
          size="small"
          class="w-100 w-sm-auto"
      >
        <v-icon class="d-block d-sm-none me-1">mdi-file-pdf-box</v-icon>
        <span class="d-none d-sm-block">{{ $t('global.export_pdf') }}</span>
        <span class="d-block d-sm-none">{{ $t('global.export_pdf') }}</span>
        <v-icon size="small" class="ms-auto ms-sm-1">mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="emitExport('visible')">
        <v-list-item-title> {{ $t('global.export_visible_data') }}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="emitExport('all')">
        <v-list-item-title> {{ $t('global.export_all_data') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import {useI18n} from '#imports'

const {t} = useI18n()
const emit = defineEmits(['export'])
const props = defineProps(['store']);
const loading = toRef(props.store, 'loading');
const emitExport = (type: 'visible' | 'all') => {
  emit('export', type)
}
</script>
