<template>
  <div>
    <v-tabs v-model="tab" :mobile="false" class="bg-primary-color white">
      <v-tab value="Info">Info</v-tab>
      <v-tab value="Visualization">Visualization</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window class="pa-1" v-model="tab">
        <v-tabs-window-item value="Visualization">
          <HorizontalTreeComponent/>
        </v-tabs-window-item>

        <v-tabs-window-item class="pa-1" value="Info">
          <v-row class="justify-space-between align-center mb-3">
            <v-col cols="auto">
              <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
                <i class="fa-solid fa-clipboard-user me-2 primary-color"></i>
                سجل الحضور
              </h1>
            </v-col>
            <v-col cols="auto" class="d-flex gap-2">
              <v-btn
                  color="error"
                  :disabled="selected.length===0"
                  @click="handleBulkDelete"
              >
                حذف ({{ selected.length }})
              </v-btn>

              <!-- Export PDF Button -->
              <PdfExporter @export="handlePdfExport" :store="attendanceStore"/>

              <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                      class="text-none font-weight-bold bg-primary-color white"
                      prepend-icon="mdi-plus"
                      text="تسجيل حضور"
                      @click="resetCurrentItem"
                      v-bind="activatorProps"
                  ></v-btn>
                </template>
                <ModalDialog
                    v-model="dialogSwitch"
                    dialog_icon="fa-duotone fa-solid fa-clipboard-user"
                    dialog_title="تسجيل حضور"
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

            <template #item.status="{ item }">
              <v-chip
                  :color="item.status === 'attend' ? 'success' :
                          item.status === 'absent' ? 'error' : 'warning'"
                  text-color="white"
              >
                {{ formatStatus(item.status) }}
              </v-chip>
            </template>

            <template #item.checked_in="{ item }">
              <span>{{ formatDate(item.checked_in) }}</span>
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
                >
                  <template #extra-actions="{ item }">
                    <v-list-item @click="handleViewDetails(item)">
                      <v-list-item-title>
                        <span class="info">
                          <i class="fa-duotone fa-eye"></i>
                        </span>
                        عرض التفاصيل
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
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import {formInputsComposable} from '~/pages/attendance/formInputsComposable';
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
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport();

const attendanceStore = useAttendanceStore();
callOnServerComposable(attendanceStore);

const attendanceFieldMappings = {

};

const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputsComposable, attendanceFieldMappings);

const finalInputsStructure = ref([...formInputsComposable]);

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      attendanceStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: 'تقرير الحضور',
      headers,
      store: attendanceStore,
      fetchAllData: type === 'all',
      formatRow: (item) => {
        return [
          item.user?.username || '',
          item.working_day?.name || '',
          item.status === 'attend' ? 'حاضر' : item.status === 'absent' ? 'غائب' : 'متأخر',
          formatDate(item.checked_in),
          item.checks_number,
          item.note || '',
          formatDate(item.created_at)
        ]
      }
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

const headers = [
  {title: 'المستخدم', key: 'user.username', align: 'center'},
  {title: 'يوم العمل', key: 'working_day.name', align: 'center'},
  {title: 'الحالة', key: 'status', align: 'center'},
  {title: 'وقت الحضور', key: 'checked_in', align: 'center'},
  {title: 'عدد مرات التسجيل', key: 'checks_number', sortable: false, align: 'center'},
  {title: 'ملاحظات', key: 'note', sortable: false, align: 'center'},
  {title: 'تاريخ الإنشاء', key: 'created_at', align: 'center'},
  {title: '', key: 'actions', sortable: false, align: 'center'},
];

const handleViewDetails = (item: any) => {

};

const formatStatus = (status: string) => {
  if (status === 'attend') return 'حاضر';
  if (status === 'absent') return 'غائب';
  if (status === 'late') return 'متأخر';
  return status;
};
</script>


<style scoped lang="scss">

</style>
