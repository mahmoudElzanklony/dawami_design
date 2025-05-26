<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-solid fa-university me-2 primary-color"></i>
            {{ $t('organizations.title') }}
          </h1>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('organizations.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
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
        </v-col>
      </v-row>
      <v-divider class="mb-7"></v-divider>

      <!-- Search Form and List of Universities -->
      <v-row class="mb-3">
        <SearchableFormComponent
            :inputs="finalInputsStructure"
            :page="page"
            :store_name="universitiesStore"
        />
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
              :has_action_edit="true"
              :info="uni"
              @update:info_obj="update_current_item"
              :has_action_delete="true"
              :store="universitiesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="universitiesStore?.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <v-pagination
          v-model="page"
          :length="universitiesStore?.data?.meta?.last_page"
          :total-visible="universitiesStore?.data?.meta?.per_page"
      ></v-pagination>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import UniversityComponent from "~/components/universities/UniversityCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {getFormInputs} from "~/pages/organizations/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';

definePageMeta({
  access:"admin",
});

const nuxtApp = useNuxtApp();
const {t} = useI18n();

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
