<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-clipboard-list me-2 primary-color"></i>
            {{ $t('packages.title') }}
          </h1>
        </v-col>
        <v-col cols="auto" class="d-flex gap-2">

          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-bold bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('packages.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
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
            :has_action_edit="true"
            :has_action_delete="true"
            @edit="update_current_item" 
            @view-details="handleViewDetails"
          />
        </v-col>
      </v-row>
      
      <!-- Fallback to table if needed -->
      <div v-if="packagesStore.data.data && packagesStore.data.data.length === 0" class="text-center my-4">
        <p>{{ $t('packages.no_packages') }}</p>
      </div>

      <v-pagination
          v-model="page"
          :length="packagesStore?.data?.meta?.last_page"
          :total-visible="packagesStore?.data?.meta?.per_page"
          :active-color="'#1e64ff'"
          rounded="circle"
      ></v-pagination>
    </v-card-text>

    <!-- Package Details Modal -->
    <v-dialog v-model="detailsDialog" max-width="800" transition="fade-transition">
      <v-card v-if="selectedItem">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span>
            <i class="fa-solid fa-box-open me-2 primary-color"></i>
            {{ $t('packages.details_title') }}
          </span>
          <v-btn icon variant="text" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        
        <v-card-text class="pa-4">
          <v-row>
            <!-- Package Information -->
            <v-col cols="12">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="subtitle-1 font-weight-bold">
                  <v-icon class="me-2">mdi-package-variant</v-icon>
                  {{ $t('packages.details.package_info') }}
                </v-card-title>
                <v-card-text>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-tag</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.name') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.name }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-text-box</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.description') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.description }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-cash</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.price') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.price }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-account-group</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.max_users') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.max_users_number }}</v-list-item-subtitle>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-col>
            
            <!-- User Information -->
            <v-col cols="12">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="subtitle-1 font-weight-bold">
                  <v-icon class="me-2">mdi-account</v-icon>
                  {{ $t('packages.details.creator_info') }}
                </v-card-title>
                <v-card-text>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-account-circle</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.username') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.user?.username || '-' }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-phone</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.phone') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.user?.phone || '-' }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>{{ $t('packages.details.created_at') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(selectedItem.created_at) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-col>
            <v-progress-linear
                v-if="packagesStore.loading"
                indeterminate
            ></v-progress-linear>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="detailsDialog = false">{{ $t('packages.details.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const selected = ref<any[]>([]); // Keeping this for future use if needed
const {t} = useI18n();

const packagesStore = usePackagesStore();
callOnServerComposable(packagesStore);

const formInputs = getFormInputs(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputs);

const finalInputsStructure = ref([...formInputs]);

// handleBulkDelete function removed as the button has been removed

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