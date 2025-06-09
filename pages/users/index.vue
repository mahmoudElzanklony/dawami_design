<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-users me-2 primary-color"></i>
            {{ $t('users.title') }}
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

          <PdfExporter @export="handlePdfExport" :store="usersStore"/>
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-bold bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="t('users.register')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
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
        </v-col>
      </v-row>
      <v-divider
          class="mb-4"
      ></v-divider>

      <!-- Search Form -->
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
                :has_action_edit="true"
                :has_action_delete="true"
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
                <v-list-item @click="resetDevice(item)">
                  <v-list-item-title>
                    <span class="info">
                      <i class="fa-solid fa-mobile-screen"></i>
                    </span>
                    {{ $t('users.actions.resetDevice') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="toggleAccountBlockStatus(item)" :disabled="Boolean(item.is_block)">
                  <v-list-item-title>
                    <span class="info">
                        <i class="fa-solid fa-ban"></i>
                    </span>
                    {{ $t('users.actions.blockAccount') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="toggleAccountBlockStatus(item)" :disabled="Boolean(!item.is_block)">
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
      <v-pagination
          v-model="page"
          :length="usersStore?.data?.meta?.last_page"
          :total-visible="usersStore?.data?.meta?.per_page"
          :active-color="'#1e64ff'"
          rounded="circle"
      ></v-pagination>

      <!-- Updated User Groups Details Dialog -->
      <v-dialog v-model="showGroupsDialog" max-width="600">
        <v-card>
          <v-card-title class="headline primary-color white--text">
            <i class="fa-solid fa-users-viewfinder me-2"></i>
            {{ $t('users.groups_details.modal_title') }}
            <span v-if="selectedUser" class="ms-2">- {{ selectedUser.username }}</span>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="selectedUser && selectedUser.groups && selectedUser.groups.length">
              <v-list>
                <div v-for="(groupItem, index) in selectedUser.groups" :key="groupItem.id">
                  <v-card flat class="mb-3 pa-3" outlined>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-2 font-weight-medium primary--text">
                          {{ $t('users.groups_details.group_label') }}
                        </div>
                        <div class="text-body-1 mb-2">{{ groupItem.group.name }}</div>

                        <div class="text-subtitle-2 font-weight-medium primary--text">
                          {{ $t('users.groups_details.branch_label') }}
                        </div>
                        <div class="text-body-1">{{ groupItem.branch.name }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-2 font-weight-medium primary--text">
                          {{ $t('users.groups_details.organization_label') }}
                        </div>
                        <div class="text-body-1 mb-2">{{ groupItem.branch.organization.name }}</div>

                        <div class="text-subtitle-2 font-weight-medium primary--text">
                          {{ $t('users.groups_details.info_label') }}
                        </div>
                        <div class="text-body-1">{{ groupItem.branch.info || '-' }}</div>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-divider></v-divider>
                </div>
              </v-list>
            </div>
            <div v-else class="text-center pa-4">
              <v-icon large color="grey">mdi-account-group-outline</v-icon>
              <p class="mt-2 text-grey">{{ $t('users.groups_details.no_groups') }}</p>
            </div>
          </v-card-text>
          <v-card-actions class="pb-4 px-4">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              rounded
              elevation="0"
              @click="showGroupsDialog = false"
            >
              {{ $t('users.groups_details.close_button') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import UsersModalDialog from '~/components/users/UsersModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
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

const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]);
const {exportToPDF} = usePdfExport()
const {t} = useI18n()

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
      title: 'تقرير المستخدمين',
      headers,
      store: usersStore,
      fetchAllData: type === 'all',
      formatRow: (item) => {
        return [
          item.username,
          item.phone,
          item.type === 'admin' ? 'أدمن' : 'دكتور',
          item.nationality,
          item.ip ? 'مسجل' : 'غير مسجل',
          item.is_block ? 'محظور' : 'نشط',
          item.unique_students,
          formatDate(item.created_at)
        ]
      }
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
