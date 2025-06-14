<template>
  <v-card class="mx-auto pa-3 custom-card">
    <v-row class="h-100" align="start" no-gutters>
      <v-col cols="auto" class="d-flex align-center">
        <img
            class="uni-logo rounded"
            v-if="info?.image"
            :src="config.public.baseUrl + '/'+ info.image.file_name"
        />
        <img
            class="uni-logo"
            v-else
            src="/images/university-placeholder.png"
        />
      </v-col>

      <v-col class="d-flex flex-column h-100">
        <div class="d-flex flex-column flex-grow-1">
          <v-row class="align-center justify-space-between" no-gutters>
            <v-card-title class="text-h6 mb-0 line-clamp-2">{{ info?.name }}</v-card-title>
            <v-menu v-if="has_action_edit || has_action_delete">
              <template v-slot:activator="{ props: menuProps }">
                <v-btn icon v-bind="menuProps" variant="plain">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <EditOrDeleteActionsComponent
                  @edit_item="editItem"
                  @delete_item="deleteItem"
                  :has_action_edit="has_action_edit"
                  :has_action_delete="has_action_delete"
                  :item_info="info"
              />
            </v-menu>
          </v-row>

          <v-card-subtitle class="py-2 px-1 flex-grow-1 line-clamp-3">
            {{ info?.description }}
          </v-card-subtitle>

          <v-card-text class="pa-0">
            <v-row class="justify-space-between align-center">
              <v-col cols="auto" class="d-flex align-center">
              <span class="mr-1 icon primary-color">
                <i class="fa-duotone fa-solid fa-calendar-days me-2"></i>
              </span>
                <span>{{ formatDate(info?.created_at) }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import {formatDate} from "~/composables/FormatDateComposable";

const props = defineProps<{
  has_action_edit: boolean;
  has_action_delete: boolean;
  info: any;
  store: any;
}>();

const emit = defineEmits(['update:info_obj']);
const config = useRuntimeConfig();

function editItem(obj: any) {
  emit('update:info_obj', obj);
}

const deleteItem = async (id: number) => {
  await deleteItemComposable(props.store, id)
};
</script>

<style lang="scss" scoped>
.custom-card {
  height: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  /* Add line clamping for text overflow */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.uni-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  flex-shrink: 0;
}

.v-row {
  align-items: stretch;
}

@media (max-width: 600px) {
  .custom-card {
    min-height: 180px;
  }

  .uni-logo {
    width: 50px;
    height: 50px;
  }
  .icon:lang(en) {
    margin-right: 8px;
  }

  .icon:lang(ar) {
    margin-left: 8px;
  }

}
.custom-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
</style>
