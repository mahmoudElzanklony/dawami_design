<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-clipboard-list me-2 primary-color"></i>
            {{ $t('packages.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/packages', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('packages.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('packages.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-clipboard-list"
                  :dialog_title="$t('packages.modal_title')"
                  :store="packagesStore"
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
          :store_name="packagesStore"
      />

      <!-- Packages Cards View -->
      <v-row>
        <v-col v-for="item in packagesStore.data.data" :key="item.id" cols="12" md="4" lg="3">
          <PackageCard 
            :package="item" 
            :store="packagesStore"
            :has_action_edit="can('/packages', 'update')"
            :has_action_delete="can('/packages', 'delete')"
            @edit="update_current_item" 
            @view-details="handleViewDetails"
          />
        </v-col>
        <v-progress-linear
            v-if="packagesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>
      
      <!-- Fallback to table if needed -->
      <div v-if="packagesStore.data.data && packagesStore.data.data.length === 0" class="text-center my-4">
        <p>{{ $t('packages.no_packages') }}</p>
      </div>

      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="packagesStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : packagesStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="packagesStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
    </v-card-text>

    <!-- Package Details Modal -->
    <PackageDetailsModal 
      v-model="detailsDialog"
      :package="selectedItem"
      :loading="packagesStore.loading"
    />
  </div>
</template>

<script setup lang="ts">
import {getFormInputs} from '~/pages/packages/formInputsComposable';
import {deleteItemComposable} from '~/composables/DeleteItemComposable';
import ModalDialog from '~/components/global/ModalDialog.vue';
import SearchableFormComponent from '~/components/global/SearchableFormComponent.vue';
import {handleInputsApi} from '~/composables/HandleInputsApiFormComposable';
import {useSharedStateComposable} from '~/composables/UseSharedStateComposable';
import {callOnServerComposable} from '~/composables/CallOnServerComposable';
import {useRuntimeConfig} from '#imports';
import {formatDate} from '~/composables/FormatDateComposable';
import {usePackagesStore} from '~/stores/PackagesStore';
import {useI18n} from '#imports';
import PackageCard from '~/components/packages/PackageCard.vue';
import PackageDetailsModal from '~/components/packages/PackageDetailsModal.vue';
import {usePermissions} from '~/composables/usePermissions';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]); // Keeping this for future use if needed
const {t} = useI18n();
const {can} = usePermissions();

const packagesStore = usePackagesStore();
callOnServerComposable(packagesStore);

const formInputs = getFormInputs(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputs);

const finalInputsStructure = ref([...formInputs]);


onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

const detailsDialog = ref(false);
const selectedItem = ref(null);

const handleViewDetails = (item: any) => {
  selectedItem.value = item;
  detailsDialog.value = true;
};
</script>