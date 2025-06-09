<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-clipboard-user me-2 primary-color"></i>
            {{ $t('attendance.title') }}
          </h1>
        </v-col>
        <v-col cols="auto" class="d-flex gap-2">
          <v-btn
              color="error"
              :disabled="selected.length===0"
              @click="handleBulkDelete"
          >
            {{ $t('global.delete') }} ({{ selected.length }})
          </v-btn>

          <!-- Export PDF Button -->
          <PdfExporter @export="handlePdfExport" :store="attendanceStore"/>

          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-bold bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('attendance.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog
                v-model="dialogSwitch"
                dialog_icon="fa-solid fa-clipboard-user"
                :dialog_title="$t('attendance.modal_title')"
                :store="attendanceStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
            />
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>

      <!-- Search Form -->
      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="attendanceStore"
      />

      <v-data-table
          :headers="headers"
          v-model="selected"
          :items="attendanceStore.data.data"
          :server-items-length="attendanceStore.data.meta?.total"
          class="elevation-1 text-center"
          :loading="attendanceStore.loading"
          :items-per-page="attendanceStore.data.meta?.per_page"
          show-select
          hide-default-footer
      >
        <template #item.user.username="{ item }">
          <span>{{ item.user?.username || '' }}</span>
        </template>

        <template #item.working_day.name="{ item }">
          <span>{{ item.working_day?.name || '' }}</span>
        </template>

        <template #item.working_day.status="{ item }">
          <span>{{ item.working_day?.status || '' }}</span>
        </template>

        <template #item.status="{ item }">
          <AttendanceStatusChip :status="item.working_day?.attendance_status" />
        </template>

        <template #item.tracking_info="{ item }">
          <TrackingInfoTooltip :tracking="item.tracking" />
        </template>

        <template #item.distance="{ item }">
          <span>{{ formatDistance(calculateDistance(item)) }}</span>
        </template>

        <template #item.note="{ item }">
          <span>{{ item.note || '-' }}</span>
        </template>

        <template #item.created_at="{ item }">
          <span>{{ formatDate(item.created_at) }}</span>
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
                @delete_item="deleteItemComposable(attendanceStore, item.id)"
            >
              <template #extra-actions="{ item }">
                <v-list-item @click="handleViewDetails(item)">
                  <v-list-item-title>
                        <span class="info">
                          <i class="fa-duotone fa-eye"></i>
                        </span>
                    {{ $t('attendance.view_details') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </EditOrDeleteActionsComponent>
          </v-menu>
        </template>
      </v-data-table>
      <v-pagination
          v-model="page"
          :length="attendanceStore?.data?.meta?.last_page"
          :total-visible="attendanceStore?.data?.meta?.per_page"
          :active-color="'#1e64ff'"
          rounded="circle"
      ></v-pagination>
    </v-card-text>

    <AttendanceDetailsModal 
      v-model="detailsDialog"
      :item="selectedItem"
    />

  </div>
</template>

<script setup lang="ts">
import {getFormInputs} from '~/pages/attendance/formInputsComposable';
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {useRuntimeConfig} from '#imports';
import {formatDate} from '~/composables/FormatDateComposable';
import PdfExporter from '~/components/global/ExportToPdfComponent.vue'
import {usePdfExport} from '~/composables/usePdfExportComposable'
import {useAttendanceStore} from '~/stores/AttendanceStore';
import {useI18n} from '#imports'
import AttendanceDetailsModal from '~/components/attendance/AttendanceDetailsModal.vue';
import AttendanceStatusChip from '~/components/attendance/AttendanceStatusChip.vue';
import TrackingInfoTooltip from '~/components/attendance/TrackingInfoTooltip.vue';
import {getTableHeaders} from '~/pages/attendance/tableHeadersComposable';
import {useAttendancePdfFormat} from '~/pages/attendance/pdfFormatComposable';
import {useDistanceCalculation} from '~/composables/useDistanceCalculation';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport();
const {t} = useI18n();

const attendanceStore = useAttendanceStore();
callOnServerComposable(attendanceStore);

const attendanceFieldMappings = {
  status:'working_day.attendance_status'
};

const formInputs = getFormInputs(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputs, attendanceFieldMappings);

const finalInputsStructure = ref([...formInputs]);

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      attendanceStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}

const { calculateDistance, formatDistance } = useDistanceCalculation();
const { formatAttendanceRow } = useAttendancePdfFormat(t);

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: t('attendance.pdf_report_title'),
      headers,
      store: attendanceStore,
      fetchAllData: type === 'all',
      formatRow: (item) => formatAttendanceRow(item, calculateDistance)
    })
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

const headers = getTableHeaders(t);
const detailsDialog = ref(false);
const selectedItem = ref(null);

const handleViewDetails = (item: any) => {
  selectedItem.value = item;
  detailsDialog.value = true;
};
</script>