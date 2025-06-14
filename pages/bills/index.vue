<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-dollar-sign me-2 primary-color"></i>
            {{ $t('bills.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-btn
                color="error"
                size="small"
                v-if="can('/bills', 'delete')"
                :disabled="selected.length===0"
                @click="handleBulkDelete"
                class="w-100 w-sm-auto"
            >
              <v-icon class="me-1">mdi-delete</v-icon>
              <span>{{ t('global.delete') }} ({{ selected.length }})</span>
            </v-btn>

            <PdfExporter @export="handlePdfExport" :store="billsStore" class="w-100 w-sm-auto mb-2 mb-sm-0"/>

            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/bills', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('bills.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('bills.add') }}</span>
                </v-btn>
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
          </div>
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
                :has_action_edit="can('/bills', 'update')"
                :has_action_delete="can('/bills', 'delete')"
                @edit_item="update_current_item"
                @delete_item="deleteItemComposable(billsStore, item.id)"
            />
          </v-menu>
        </template>
      </v-data-table>
      
      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="billsStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : billsStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="billsStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
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
import {usePermissions} from '~/composables/usePermissions';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const {t} = useI18n();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport();
const {can} = usePermissions();

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
