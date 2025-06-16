<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-solid fa-tags me-2 primary-color"></i>
            {{ $t('branches.title') }}
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
                    v-if="can('/branches', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('branches.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('branches.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog 
                v-model="dialogSwitch"
                dialog_icon="fa-solid fa-solid fa-tags"
                :dialog_title="$t('branches.add')"
                :store="branchesStore"
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
          :store_name="branchesStore"
        />
      <v-row class="mt-3">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in branchesStore?.data?.data" :key="key">
          <CategoryComponent 
            v-model="dialogSwitch" 
            :has_action_edit="can('/branches', 'update')"
            :info="i"
            @update:info_obj="update_current_item"
            :has_action_delete="can('/branches', 'delete')"
            :store="branchesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="branchesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>
      
      <PaginationComponent 
        v-model="page"
        :store="branchesStore"
      />
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
import {usePermissions} from '~/composables/usePermissions';
import PaginationComponent from '~/components/global/PaginationComponent.vue';

const {t} = useI18n();
const {can} = usePermissions();
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