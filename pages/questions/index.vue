<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-solid fa-seal-question me-2 primary-color"></i>
            {{ $t('questions.title') }}
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
                    v-if="can('/questions', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('questions.add_ai_questions') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('questions.add_ai_questions') }}</span>
                </v-btn>
              </template>
              <ModalDialog v-model="dialogSwitch"
                         dialog_icon="fa-solid fa-solid fa-seal-question"
                         :dialog_title="$t('questions.add_question')"
                         :store="store"
                         :info="currentItem"
                         :inputs="finalInputsStructure"></ModalDialog>
            </v-dialog>

            <v-dialog v-model="dialogManualSwitch" max-width="600" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/questions', 'create')"
                    @click="dialogManualSwitch = true; resetCurrentItem()"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('questions.add_manual_questions') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('questions.add_manual_questions') }}</span>
                </v-btn>
              </template>
              <ModalDialog v-model="dialogManualSwitch"
                         dialog_icon="fa-solid fa-solid fa-seal-question"
                         :dialog_title="$t('questions.add_question')"
                         :store="store"
                         :info="currentItem"
                         :inputs="finalManualFormInputsComposable"></ModalDialog>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>
      
      <SearchableFormComponent 
          :inputs="finalInputsStructure" 
          :page="page"
          :store_name="store"
      />
      
      <v-row class="mb-3">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in store?.data?.data" :key="key">
          <QuestionCardComponent 
              v-model="dialogSwitch"
              :has_action_edit="can('/questions', 'update')"
              :info="i"
              @update:info_obj="update_current_item"
              :has_action_delete="can('/questions', 'delete')"
              :store="store"
          />
        </v-col>
        <v-progress-linear
            v-if="store.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <PaginationComponent 
        v-model="page"
        :store="store"
      />

    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import QuestionCardComponent from "~/components/questions/QuestionCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {formInputsComposable} from "~/pages/questions/formInputsComposable";
import {manualFormInputsComposable} from "~/pages/questions/manualFormInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useQuestionStore} from "~/stores/QuestionsStore"
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {usePermissions} from '~/composables/usePermissions';
import PaginationComponent from '~/components/global/PaginationComponent.vue';

const {t} = useI18n();
const {can} = usePermissions();

const {
  dialogSwitch,
  currentItem,
  update_current_item,
  page,
  tab,
  resetCurrentItem
} = useSharedStateComposable(formInputsComposable(t));

const nuxtApp = useNuxtApp();
const store = useQuestionStore()
callOnServerComposable(store)
const dialogManualSwitch = ref(false);
const finalInputsStructure = ref([...formInputsComposable(t)])
const finalManualFormInputsComposable = ref([...manualFormInputsComposable(t)])
onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
    await handleInputsApi(finalManualFormInputsComposable.value, currentItem.value);
  });
});

</script>