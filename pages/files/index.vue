<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-play me-2 primary-color"></i>
            {{ $t('files.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-btn
                color="error"
                size="small"
                v-if="can('/files', 'delete')"
                :disabled="selected.length===0"
                @click="handleBulkDelete"
                class="w-100 w-sm-auto"
            >
              <v-icon class="me-1">mdi-delete</v-icon>
              <span>{{ t('global.delete') }} ({{ selected.length }})</span>
            </v-btn>
            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/files', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('files.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('files.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-play"
                  :dialog_title="$t('files.add')"
                  :store="filesStore"
                  :info="currentItem"
                  :inputs="finalInputsStructure"
              />
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider
          class="mb-4"
      ></v-divider>

      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="filesStore"
      />

      <v-data-table
          :headers="headers"
          :items="filesStore.data.data"
          :server-items-length="filesStore.data.meta?.total"
          class="elevation-1"
          v-model="selected"
          :loading="filesStore.loading"
          :items-per-page="filesStore.data.meta?.per_page"
          hide-default-footer
          show-select
      >

        <template #item.created_at="{ item }">
          <span>{{ formatDate(item.created_at) }}</span>
        </template>

        <template #item.extension="{ item }">
          <span>{{ getArabicFileType(item.extension) }}</span>
        </template>

        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="plain">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <EditOrDeleteActionsComponent
                :item_info="item"
                :has_action_edit="can('/files', 'update')"
                :has_action_delete="can('/files', 'delete')"
                @edit_item="update_current_item"
                @delete_item=deleteItemComposable(filesStore,item.id)
            >
              <template #extra-actions="{ item }">
                <v-list-item @click.stop="previewFile(item)">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-solid fa-circle-play"></i>
                    </span>
                    {{ $t('files.preview') }}
                  </v-list-item-title>
                </v-list-item>
                <VideoPlayModal
                    v-model="videoDialog"
                    :video-url="selectedVideoUrl"
                />
              </template>
            </EditOrDeleteActionsComponent>
          </v-menu>
        </template>
      </v-data-table>

      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="filesStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : filesStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="filesStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import {getFormInputs} from '~/pages/files/formInputsComposable';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {useFilesStore} from '~/stores/FilesStore';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {formatDate} from '~/composables/FormatDateComposable';
import {deleteItemComposable, useRuntimeConfig, useI18n} from '#imports';
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import VideoPlayModal from "~/components/files/VideoModal.vue";
import {getTableHeaders} from '~/pages/files/tableHeadersComposable';
import {usePermissions} from '~/composables/usePermissions';

const nuxtApp = useNuxtApp();
const {t} = useI18n();
const {can} = usePermissions();
const selected = ref<any[]>([]);

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      filesStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}
const headers = getTableHeaders(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t));

const filesStore = useFilesStore();
callOnServerComposable(filesStore);

const finalInputsStructure = ref([...getFormInputs(t)]);

const videoDialog = ref(false);
const selectedVideoUrl = ref('');

const previewFile = (item: any) => {
  if (item?.type === 'pdf') {
    window.open(item?.file_path, '_blank');
  } else if (item?.type === 'video' && item.qualities?.length) {
    const hdQuality = item.qualities.find((q: any) => q.quality === 'HD');
    selectedVideoUrl.value = hdQuality ? hdQuality.file_path : item.qualities[0].file_path;
    videoDialog.value = true;
  }
};

const getArabicFileType = (type: string) => {
  const fileTypes: { [key: string]: string } = {
    pdf: t('files.types.pdf'),
    mp4: t('files.types.video'),
  };
  return fileTypes[type] || type;
};

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>
