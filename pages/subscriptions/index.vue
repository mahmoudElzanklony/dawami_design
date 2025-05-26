<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-circle-check me-2 primary-color"></i>
            {{ $t('subscriptions.title') }}
          </h1>
        </v-col>
        <v-col cols="auto" class="d-flex gap-2">
          <v-btn
              color="error"
              :disabled="selected.length===0"
              @click="handleBulkDelete"
          >
            {{ $t('subscriptions.delete') }} ({{ selected.length }})
          </v-btn>

          <!-- Export PDF Button -->
          <PdfExporter @export="handlePdfExport" :store="subscriptionsStore"/>

          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-bold bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('subscriptions.register')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog
                v-model="dialogSwitch"
                dialog_icon="fa-solid fa-circle-check"
                :dialog_title="$t('subscriptions.register')"
                :store="subscriptionsStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
            />
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider
          class="mb-4"
      ></v-divider>

      <!-- Search Form -->
      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="subscriptionsStore"
      />

      <!-- Users Data Table -->
      <v-data-table
          :headers="headers"
          v-model="selected"
          :items="subscriptionsStore.data.data"
          :server-items-length="subscriptionsStore.data.meta?.total"
          class="elevation-1 text-center"
          :loading="subscriptionsStore.loading"
          :items-per-page="subscriptionsStore.data.meta?.per_page"
          show-select
          hide-default-footer
      >

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
                :has_action_delete="false"
                @edit_item="update_current_item"/>
          </v-menu>
        </template>
      </v-data-table>
      <v-pagination
          v-model="page"
          :length="subscriptionsStore?.data?.meta?.last_page"
          :total-visible="subscriptionsStore?.data?.meta?.per_page"
          :active-color="'#1e64ff'"
          rounded="circle"
      ></v-pagination>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import {getFormInputs} from '~/pages/subscriptions/formInputsComposable';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {useSubscriptionsStore} from '~/stores/SubscriptionsStore';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {useRuntimeConfig, useI18n} from '#imports';
import {formatDate} from '~/composables/FormatDateComposable';
import PdfExporter from '~/components/global/ExportToPdfComponent.vue'
import {usePdfExport} from '~/composables/usePdfExportComposable'
import {getTableHeaders} from '~/pages/subscriptions/tableHeadersComposable';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {t} = useI18n();
const headers = getTableHeaders(t);
const {exportToPDF} = usePdfExport()
const FieldsInputMappings = {
  ['paid']:(obj)=> obj.price,
};

const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t), FieldsInputMappings);

const subscriptionsStore = useSubscriptionsStore();
callOnServerComposable(subscriptionsStore);

const finalInputsStructure = ref([...getFormInputs(t)]);

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      subscriptionsStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: t('subscriptions.report'),
      headers,
      store: subscriptionsStore,
      fetchAllData: type === 'all',
      formatRow: (item) => {
        return [
          item.id,
          item.user.username,
          item.username,
          item.field.name,
          0,
          0,
          item.price,
          item.discount,
          item.note,
          formatDate(item.created_at)
        ]
      }
    })
  } catch (error) {

  }
}

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});


</script>

<style scoped lang="scss">

</style>
