<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-dollar-sign me-2 primary-color"></i>
            {{ $t('bills.title') }}
          </h1>
        </v-col>
        <v-col cols="auto" class="d-flex gap-2">
          <v-btn
              color="error"
              :disabled="selected.length===0"
              @click="handleBulkDelete"
          >
            {{ t('global.delete') }} ({{ selected.length }})
          </v-btn>

          <PdfExporter @export="handlePdfExport" :store="billsStore"/>

          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('bills.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog
                v-model="dialogSwitch"
                dialog_icon="fa-duotone fa-solid fa-dollar-sign"
                :dialog_title="$t('bills.add')"
                :store="billsStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
            />
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider
          class="mb-4"
      ></v-divider>
      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="billsStore"
      />
      <v-data-table
          :headers="headers"
          v-model="selected"
          :items="billsStore.data.data"
          :server-items-length="billsStore.data.meta?.total"
          class="elevation-1"
          :loading="billsStore.loading"
          :items-per-page="billsStore.data.meta?.per_page"
          hide-default-footer
          show-select
      >
        <template #item.doctor="{ item }">
          <span>{{ item.doctor.username }}</span>
        </template>

        <template #item.phone="{ item }">
          <span>{{ item.doctor.phone }}</span>
        </template>

        <template #item.amount_paid="{ item }">
          <span>{{ item.total_money - item.remain }}</span>
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
                :has_action_edit="false"
                :has_action_delete="true"
                @edit_item="update_current_item"
                @delete_item=deleteItemComposable(billsStore,item.id)
            />
          </v-menu>
        </template>
      </v-data-table>
      <v-pagination
          v-model="page"
          :length="billsStore?.data?.meta?.last_page"
          :total-visible="billsStore?.data?.meta?.per_page"
      ></v-pagination>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import {getFormInputs} from '~/pages/bills/formInputsComposable';
import {getTableHeaders} from '~/pages/bills/tableHeadersComposable';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {useBillsStore} from '~/stores/BillsStore';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {useRuntimeConfig} from '#imports';
import {useI18n} from '#imports';
import PdfExporter from '~/components/global/ExportToPdfComponent.vue';
import {usePdfExport} from '~/composables/usePdfExportComposable';
import {useBillsPdfFormat} from '~/pages/bills/pdfFormatComposable';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const {t} = useI18n();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport();

const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t));

const billsStore = useBillsStore();
const headers = getTableHeaders(t);
callOnServerComposable(billsStore);
const finalInputsStructure = ref([...getFormInputs(t)]);
onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      billsStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: t('bills.title'),
      headers,
      store: billsStore,
      fetchAllData: type === 'all',
      formatRow: useBillsPdfFormat().formatBillRow
    })
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
}

</script>

<style scoped>

</style>
