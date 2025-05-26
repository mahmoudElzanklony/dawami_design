<template>
  <v-list v-if="has_action_edit || has_action_delete|| hasExtraActions">
    <v-list-item @click="$emit('edit_item',item_info)" v-if="has_action_edit">
      <v-list-item-title>
        <span class="primary-color"><i class="fa-duotone fa-solid fa-pen-to-square"></i></span> {{ t('global.actions.edit') }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item @click="$emit('delete_item',item_info?.id)" v-if="has_action_delete">
      <v-list-item-title>
        <span class="red"><i class="fa-duotone fa-solid fa-trash"></i></span> {{ t('global.actions.delete') }}
      </v-list-item-title>
    </v-list-item>
    <slot name="extra-actions" :item="item_info"></slot>
  </v-list>
</template>

<script setup lang="ts">
  import {useI18n} from '#i18n'
  import {computed, useSlots} from 'vue'

  const {t} = useI18n()
  defineProps(['has_action_edit','has_action_delete','item_info']);
  const slots = useSlots();
  const hasExtraActions = computed(() => !!slots['extra-actions']);
</script>

<style scoped>

</style>
