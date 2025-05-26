<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-play me-2 primary-color"></i>
            {{ $t('files.title') }}
          </h1>
        </v-col>
        <v-col cols="auto" class="d-flex ga-2">
          <v-btn
              color="error"
              :disabled="selected.length===0"
              @click="handleBulkDelete"
          >
            {{ $t('files.delete') }} ({{ selected.length }})
          </v-btn>
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('files.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
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
        </v-col>
      </v-row>
      <v-divider
          class="mb-6"
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
                :has_action_edit="true"
                :has_action_delete="true"
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


      <v-pagination
          v-model="page"
          :length="filesStore?.data?.meta?.last_page"
          :total-visible="filesStore?.data?.meta?.per_page"
      ></v-pagination>
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

const nuxtApp = useNuxtApp();
const {t} = useI18n();
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

<style scoped>

</style>
