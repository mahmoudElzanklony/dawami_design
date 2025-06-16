<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-users me-2 primary-color"></i>
            {{ $t('users.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-btn
                v-if="can('/users', 'delete')"
                :disabled="selected.length === 0"
                color="error"
                size="small"
                @click="handleBulkDelete"
                class="w-100 w-sm-auto"
            >
              <v-icon class="me-1">mdi-delete</v-icon>
              <span>{{ t('global.delete') }} ({{ selected.length }})</span>
            </v-btn>

            <PdfExporter @export="handlePdfExport" :store="usersStore" class="w-100 w-sm-auto mb-2 mb-sm-0"/>
            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/users', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ t('users.register') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ t('users.register') }}</span>
                </v-btn>
              </template>
              <UsersModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-duotone fa-solid fa-user"
                  :dialog_title="t('users.modal.title')"
                  :store="usersStore"
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
          :store_name="usersStore"
      />

      <v-data-table
          :headers="headers"
          v-model="selected"
          :items="usersStore.data.data"
          :server-items-length="usersStore.data.meta?.total"
          class="elevation-1 text-center"
          :loading="usersStore.loading"
          :items-per-page="usersStore.data.meta?.per_page"
          show-select
          hide-default-footer
      >
        <template #item.avatar="{ item }">
          <img
              v-if="item?.image"
              :src="item.image.path"
              class="user-logo"
              alt="User Avatar"
          />
          <img
              v-else
              src="/images/default-user.jpg"
              class="user-logo"
              alt="Default Avatar"
          />
        </template>

        <template #item.type="{ item }">
          <UserType :type="item.type"/>
        </template>

        <template #item.is_block="{ item }">
          <AvailabilityAlert :isBlocked="item.is_block"/>
        </template>

        <template #item.ip="{ item }">
          <IpStatus :ip="item.ip"/>
        </template>

        <template #item.created_at="{ item }">
          <span>{{ formatDate(item.created_at) }}</span>
        </template>

        <template #item.phone="{ item }">
          <span dir="ltr">{{ item.phone }}</span>
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
                :has_action_edit="can('/users', 'update')"
                :has_action_delete="can('/users', 'delete')"
                @edit_item="update_current_item">
              <template #extra-actions="{ item }">
                <v-list-item @click="handleViewDetails(item)">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-duotone fa-eye"></i>
                    </span>
                    {{ $t('users.actions.viewDetails') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="resetDevice(item)" v-if="can('/users', 'update')">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-solid fa-mobile-screen"></i>
                    </span>
                    {{ $t('users.actions.resetDevice') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                    @click="toggleAccountBlockStatus(item)"
                    v-if="can('/users', 'update') && !item.is_block">
                  <v-list-item-title>
                    <span class="info">
                        <i class="fa-solid fa-ban"></i>
                    </span>
                    {{ $t('users.actions.blockAccount') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                    @click="toggleAccountBlockStatus(item)"
                    v-if="can('/users', 'update') && item.is_block">
                  <v-list-item-title>
                    <span class="info">
                        <i class="fa-solid fa-circle-check"></i>
                    </span>
                    {{ t('users.actions.unblockAccount') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </EditOrDeleteActionsComponent>
          </v-menu>
        </template>
      </v-data-table>

      <PaginationComponent 
        v-model="page"
        :store="usersStore"
      />

      <UserGroupsDetailsDialog
        v-model="showGroupsDialog"
        :user="selectedUser"
      />

    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import UsersModalDialog from '~/components/users/UsersModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import PaginationComponent from '~/components/global/PaginationComponent.vue';
import {getFormInputs} from '~/pages/users/formInputsComposable';
import {getTableHeaders} from '~/pages/users/tableHeadersComposable';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {useUsersStore} from '~/stores/UsersStore';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {formatDate} from '~/composables/FormatDateComposable';
import AvailabilityAlert from '~/components/global/AvailabilityAlert.vue';
import IpStatus from '~/components/users/IpStatusComponent.vue';
import UserType from '~/components/users/UserTypeComponent.vue';
import PdfExporter from '~/components/global/ExportToPdfComponent.vue'
import {usePdfExport} from '~/composables/usePdfExportComposable'
import {useI18n} from '#imports'
import {usePermissions} from '~/composables/usePermissions';
import UserGroupsDetailsDialog from '~/components/users/UserGroupsDetailsDialog.vue';
import {formatRowComposable} from '~/pages/users/formatRowComposable';

const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport()
const {t} = useI18n()
const {can} = usePermissions();
const {formatUserRow} = formatRowComposable();

const formInputs = getFormInputs(t);
const headers = getTableHeaders(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputs);

const usersStore = useUsersStore();
callOnServerComposable(usersStore);

const finalInputsStructure = ref([...formInputs]);

const handleBulkDelete = async () => {
  const success = await deleteItemComposable(
      usersStore,
      selected.value
  );
  if (success) {
    selected.value = [];
  }
}

const handlePdfExport = async (type: 'visible' | 'all') => {
  try {
    await exportToPDF({
      title: t('users.pdf_report_title'),
      headers,
      store: usersStore,
      fetchAllData: type === 'all',
      formatRow: formatUserRow
    })
  } catch (error) {

  }
}

const resetDevice = async (item: any) => {
  const payload = new FormData();
  payload.append('id', item.id);
  payload.append('ip', '');
  await usersStore.create_or_update(payload, '', false);
}

const toggleAccountBlockStatus = async (item: any) => {
  const payload = new FormData();
  payload.append('id', item.id);
  payload.append('is_block', (item.is_block ^ 1));  // xor the current value , if blocked unblock it and vice versa
  await usersStore.create_or_update(payload, '', false);
}

const showGroupsDialog = ref(false);
const selectedUser = ref<any>(null);

const handleViewDetails = (item: any) => {
  selectedUser.value = item;
  showGroupsDialog.value = true;
};

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

</script>

<style scoped lang="scss">
.user-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
</style>