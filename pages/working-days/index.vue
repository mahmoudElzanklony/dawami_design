<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-person-chalkboard me-2 primary-color"></i>
            {{ $t('working_days.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-btn
                v-if="can('/working-days', 'delete')"
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
            <PdfExporter @export="handlePdfExport" :store="workingDaysStore" class="w-100 w-sm-auto mb-2 mb-sm-0"/>

            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/working-days', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('working_days.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('working_days.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-person-chalkboard"
                  :dialog_title="$t('working_days.add')"
                  :store="workingDaysStore"
                  :info="currentItem"
                  :inputs="finalInputsStructure"
              />
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>

      <!-- Search Form -->
      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="workingDaysStore"
      />

      <!-- Working Days Data Table -->
      <v-data-table
          :headers="headers"
          v-model="selected"
          :items="workingDaysStore.data.data"
          :server-items-length="workingDaysStore.data.meta?.total"
          class="elevation-1 text-center"
          :loading="workingDaysStore.loading"
          :items-per-page="workingDaysStore.data.meta?.per_page"
          show-select
          hide-default-footer
      >
        <template #item.field_name="{ item }">
          {{ item.field?.name }}
        </template>

        <template #item.instructor="{ item }">
          {{ item.user?.username }}
        </template>

        <template #item.status="{ item }">
          <v-chip
              :color="item.status === 'online' ? 'success' : 'error'"
              text-color="white"
              size="small"
          >
            {{ item.status === 'online' ? $t('working_days.status_online') : $t('working_days.status_offline') }}
          </v-chip>
        </template>

        <template #item.check_location="{ item }">
          <v-icon :color="item.check_location ? 'success' : 'error'">
            {{ item.check_location ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
        </template>

        <template #item.groups="{ item }">
          <v-chip-group>
            <v-chip
                v-for="group in item.groups.slice(0, 2)"
                :key="group.id"
                size="small"
                class="ma-1"
                color="primary"
            >
              {{ group.name }}
            </v-chip>
            <v-chip
                v-if="item.groups.length > 2"
                size="small"
                class="ma-1"
                color="grey"
            >
              +{{ item.groups.length - 2 }}
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.time="{ item }">
          <div class="d-flex flex-column">
            <span>{{ $t('working_days.time_from') }}: {{ formatDateTime(item.time_start, $i18n.locale) }}</span>
            <span>{{ $t('working_days.time_to') }}: {{ formatDateTime(item.time_end, $i18n.locale) }}</span>
          </div>
        </template>

        <template #item.allowed_time="{ item }">
          {{ item.allowed_time }} {{ $t('working_days.minutes') }}
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
                :has_action_edit="can('/working-days', 'update')"
                :has_action_delete="can('/working-days', 'delete')"
                @edit_item="update_current_item"
                @delete_item="deleteItemComposable(workingDaysStore, item.id)">
              <template #extra-actions="{ item }">
                <v-list-item @click="handleViewQRCode(item)">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-solid fa-qrcode"></i>
                    </span>
                    {{ $t('working_days.show_qr') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="toggleStatus(item)" v-if="can('/working-days', 'update')">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-solid" :class="item.status === 'online' ? 'fa-lock' : 'fa-lock-open'"></i>
                    </span>
                    {{ item.status === 'online' ? $t('working_days.close') : $t('working_days.open') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </EditOrDeleteActionsComponent>
          </v-menu>
        </template>
      </v-data-table>

      <PaginationComponent 
        v-model="page"
        :store="workingDaysStore"
      />

    </v-card-text>

    <!-- QR Code Dialog -->
    <v-dialog v-model="qrDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center">{{ $t('working_days.qr_code_title') }}</v-card-title>
        <v-card-text class="text-center">
          <img v-if="selectedQRCode" :src="selectedQRCode" class="qr-image-large" alt="QR Code" />
          <p class="mt-4" v-if="selectedQRName">{{ selectedQRName }}</p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="qrDialog = false">{{ $t('working_days.qr_code_close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import PaginationComponent from '~/components/global/PaginationComponent.vue';
import {getFormInputs} from '~/pages/working-days/formInputsComposable';
import {formatRow} from '~/pages/working-days/formatRowComposable';
import {getTableHeaders} from '~/pages/working-days/getTableHeaders';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {formatDateTime} from '~/utilities/formatDateTime';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {useWorkingDaysStore} from '~/stores/WorkingDaysStore';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import PdfExporter from '~/components/global/ExportToPdfComponent.vue';
import {usePdfExport} from '~/composables/usePdfExportComposable';
import {usePermissions} from '~/composables/usePermissions';

const WorkingDaysInputMappings = {
  ['groups[]']: (obj) => obj.groups?.map(gp => gp.id) || [],
  ['places[]']: (obj) => [...new Set(obj.group_places?.map(pc => pc.place_id) || [])],
};
const {t, locale} = useI18n();
const {can} = usePermissions();
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t),WorkingDaysInputMappings);
const nuxtApp = useNuxtApp();
const workingDaysStore = useWorkingDaysStore();
callOnServerComposable(workingDaysStore);

const selected = ref<any[]>([]);
const qrDialog = ref(false);
const selectedQRCode = ref('');
const selectedQRName = ref('');
const finalInputsStructure = ref([...getFormInputs(t)]);
const {exportToPDF} = usePdfExport();

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      workingDaysStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
};

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: t('working_days.title'),
      headers,
      store: workingDaysStore,
      fetchAllData: type === 'all',
      formatRow: (item) => formatRow(item, t, locale.value)
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
};

const handleViewQRCode = (item: any) => {
  if (item.image?.file_path) {
    selectedQRCode.value =  item.image.file_path ;
    selectedQRName.value = item.name;
    qrDialog.value = true;
  }
};

const toggleStatus = async (item: any) => {
  const payload = new FormData();
  payload.append('id', item.id);
  payload.append('status', item.status === 'online' ? 'offline' : 'online');
  await workingDaysStore.create_or_update(payload, '');
};

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

const headers = getTableHeaders(t);
</script>

<style scoped lang="scss">
.qr-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin: auto;
}

.qr-image-large {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin: auto;
}
</style>