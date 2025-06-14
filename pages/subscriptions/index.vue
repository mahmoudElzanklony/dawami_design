<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-circle-check me-2 primary-color"></i>
            {{ $t('subscriptions.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-btn
                v-if="can('/subscriptions', 'delete')"
                :disabled="selected.length === 0"
                color="error"
                size="small"
                @click="handleBulkDelete"
                class="w-100 w-sm-auto"
            >
              <v-icon class="me-1">mdi-delete</v-icon>
              <span>{{ t('global.delete') }} ({{ selected.length }})</span>
            </v-btn>

            <!-- Export PDF Button -->
            <PdfExporter @export="handlePdfExport" :store="subscriptionsStore" class="w-100 w-sm-auto mb-2 mb-sm-0"/>

            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/subscriptions', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('subscriptions.register') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('subscriptions.register') }}</span>
                </v-btn>
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
          </div>
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
                :has_action_edit="can('/subscriptions', 'update')"
                :has_action_delete="can('/subscriptions', 'delete')"
                @edit_item="update_current_item"/>
          </v-menu>
        </template>
      </v-data-table>
      
      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="subscriptionsStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : subscriptionsStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="subscriptionsStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
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
import {usePermissions} from '~/composables/usePermissions';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {t} = useI18n();
const {can} = usePermissions();
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