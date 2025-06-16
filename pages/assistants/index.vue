<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-duotone fa-solid fa-user-robot me-2 primary-color"></i>
            {{t('assistants.title')}}
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
                    v-if="can('/assistants', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="ms-1">{{ t('assistants.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog v-model="dialogSwitch"
                          dialog_icon="fa-duotone fa-solid fa-user-robot"
                          :dialog_title="t('assistants.add')"
                          :store="assistantsStore"
                          :info="currentItem"
                          :inputs="finalInputsStructure"></ModalDialog>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider
          class="mb-4"
      ></v-divider>


        <SearchableFormComponent :inputs="finalInputsStructure" :page="page"
                                :store_name="assistantsStore"></SearchableFormComponent>
      <v-row class="mt-3">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in assistantsStore?.data?.data" :key="key">
          <AssistantsCardComponent v-model="dialogSwitch" 
                                  :has_action_edit="can('/assistants', 'update')"
                                  :info="i"
                                  :store="assistantsStore"
                                  @update:info_obj="update_current_item"
                                  :has_action_delete="can('/assistants', 'delete')"></AssistantsCardComponent>
        </v-col>
        <v-progress-linear
            v-if="assistantsStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <PaginationComponent 
        v-model="page"
        :store="assistantsStore"
      />
    </v-card-text>
  </div>
</template>


<script setup lang="ts">
import AssistantsCardComponent from "~/components/assistants/AssistantsCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {getFormInputs} from "~/pages/assistants/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useAssistantStore} from "~/stores/AssistantsStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';
import {usePermissions} from '~/composables/usePermissions';
import PaginationComponent from '~/components/global/PaginationComponent.vue';

const {t} = useI18n();
const {can} = usePermissions();
const fields = getFormInputs(t);

const {
  dialogSwitch,
  currentItem,
  update_current_item,
  page,
  resetCurrentItem
} = useSharedStateComposable(fields);
const nuxtApp = useNuxtApp();


const assistantsStore = useAssistantStore()
callOnServerComposable(assistantsStore);


const finalInputsStructure = ref([...fields]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

</script>