<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
          color="primary"
          v-bind="props"
          :disabled="loading"
      >
        {{ $t('global.export_pdf') }}
        <v-icon icon="mdi-menu-down"></v-icon>
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