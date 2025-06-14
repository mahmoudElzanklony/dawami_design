<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-solid fa-university me-2 primary-color"></i>
            {{ $t('organizations.title') }}
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
                    v-if="can('/organizations', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('organizations.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('organizations.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-solid fa-university"
                  :dialog_title="$t('organizations.add')"
                  :store="universitiesStore"
                  :info="currentItem"
                  :inputs="finalInputsStructure"
              />
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>

        <SearchableFormComponent
            :inputs="finalInputsStructure"
            :page="page"
            :store_name="universitiesStore"
        />
      <v-row class="mt-3">
        <v-col
            cols="12"
            lg="3"
            md="4"
            sm="6"
            v-for="(uni, key) in universitiesStore?.data?.data"
            :key="key"
        >
          <UniversityComponent
              v-model="dialogSwitch"
              :has_action_edit="can('/organizations', 'update')"
              :info="uni"
              @update:info_obj="update_current_item"
              :has_action_delete="can('/organizations', 'delete')"
              :store="universitiesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="universitiesStore?.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="universitiesStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : universitiesStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="universitiesStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import UniversityComponent from "~/components/universities/UniversityCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import SearchableFormComponent from "~/components/global/SearchableFormComponent.vue";
import {getFormInputs} from "~/pages/organizations/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';
import {usePermissions} from '~/composables/usePermissions';

definePageMeta({
  access:"admin",
});

const nuxtApp = useNuxtApp();
const {t} = useI18n();
const {can} = usePermissions();

const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t));

const universitiesStore = useOrganizationsStore();
callOnServerComposable(universitiesStore);

const finalInputsStructure = ref([...getFormInputs(t)]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>
