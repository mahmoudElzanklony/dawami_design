<template>
  <v-card class="mx-auto pa-3 h-100 d-flex flex-column">
    <v-row align="center">
      <!-- Left Side: Tag Icon -->
      <v-col cols="auto">
        <img class="cat-logo rounded" v-if="info?.image" :src="config.public.baseUrl+info?.image?.path">
        <img class="cat-logo" v-else src="/images/branch-placeholder.png">
      </v-col>

      <v-col class="d-flex flex-column flex-grow-1">
        <v-row class="align-center justify-space-between">
          <v-card-title class="text-h6 mb-0">{{ truncateText(info?.name, 25) }}</v-card-title>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" variant="plain">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <EditOrDeleteActionsComponent
                @edit_item="editItem"
                @delete_item="deleteItemComposable(props.store, info.id)"
                :has_action_delete="has_action_delete"
                :has_action_edit="has_action_edit"
                :item_info="info"></EditOrDeleteActionsComponent>
          </v-menu>
        </v-row>

        <v-card-subtitle class="py-2 px-1">{{ info?.description }}</v-card-subtitle>

        <v-spacer class="flex-grow-1"></v-spacer>

        <v-card-text class="pa-0">
          <v-row class="justify-space-between align-center">
            <v-col cols="auto" class="d-flex align-center">
              <span class="primary-color me-1"><i class="fa-solid fa-building"></i></span>
              <span>{{ truncateText( info?.organization?.name,14) }}</span>
            </v-col>

            <!-- Right: Date -->
            <v-col cols="auto" class="d-flex align-center">
              <span class="primary-color me-1"><i class="fa-duotone fa-solid fa-calendar-days"></i></span>
              <span>{{formatDate(info?.created_at)}}</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup lang="ts">
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import {formatDate} from "~/composables/FormatDateComposable"
import { inject } from 'vue';

let props = defineProps(['has_action_edit', 'has_action_delete', 'info', 'store']);

const dialog_switch = defineModel<boolean>();
const config = useRuntimeConfig();
const emit = defineEmits(['update:info_obj']);

const truncateText = inject('truncateText');
const editItem = (obj: any) => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    dialog_switch.value = true
  }
};
</script>

<style lang="scss" scoped>
.cat-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.icon:lang(en) {
  margin-right: 8px;
}

.icon:lang(ar) {
  margin-left: 8px;
}
</style>
