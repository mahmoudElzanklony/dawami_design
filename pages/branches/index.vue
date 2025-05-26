<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-solid fa-tags me-2 primary-color"></i>
            {{ $t('branches.title') }}
          </h1>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('branches.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog v-model="dialogSwitch"
                         dialog_icon="fa-solid fa-solid fa-tags"
                         :dialog_title="$t('branches.add')"
                         :store="branchesStore"
                         :info="currentItem"
                         :inputs="finalInputsStructure"></ModalDialog>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="mb-7"></v-divider>
      <v-row class="mb-3">
        <SearchableFormComponent :inputs="finalInputsStructure" :page="page"
                                 :store_name="branchesStore"></SearchableFormComponent>
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in branchesStore?.data?.data" :key="key">
          <CategoryComponent v-model="dialogSwitch" :has_action_edit="true"
                             :info="i"
                             @update:info_obj="update_current_item"
                             :has_action_delete="true"
                             :store="branchesStore"></CategoryComponent>
        </v-col>
        <v-progress-linear
            v-if="branchesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>
      <v-pagination
          v-model="page"
          :length="branchesStore?.data?.meta?.last_page"
          :total-visible="branchesStore?.data?.meta?.per_page"
          rounded="circle"
      ></v-pagination>
    </v-card-text>


  </div>

</template>


<script setup lang="ts">
import CategoryComponent from "~/components/categories/CategoryCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import SearchableFormComponent from "~/components/global/SearchableFormComponent.vue";
import {getFormInputs} from "~/pages/branches/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useBranchesStore} from "~/stores/BranchesStore"
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';

const {t} = useI18n();
const formInputs = getFormInputs(t);

const {
  dialogSwitch,
  currentItem,
  update_current_item,
  page,
  tab,
  resetCurrentItem
} = useSharedStateComposable(formInputs);
const nuxtApp = useNuxtApp();


const branchesStore = useBranchesStore()
callOnServerComposable(branchesStore)

const finalInputsStructure = ref([...formInputs]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

</script>
