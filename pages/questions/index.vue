<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-solid fa-seal-question me-2 primary-color"></i>
            {{ $t('questions.title') }}
          </h1>      </v-col>
        <v-col cols="12" sm="auto" class="d-flex flex-column flex-sm-row">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white mb-3 mb-sm-0 mx-sm-2"
                  prepend-icon="mdi-plus"
                  :text="$t('questions.add_ai_questions')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>

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
                  class="text-none font-weight-regular bg-primary-color white mx-sm-2"
                  prepend-icon="mdi-plus"
                  :text="$t('questions.add_manual_questions')"
                  @click="dialogManualSwitch = true; resetCurrentItem()"
                  v-bind="activatorProps"
              ></v-btn>

            </template>
            <ModalDialog v-model="dialogManualSwitch"
                         dialog_icon="fa-solid fa-solid fa-seal-question"
                         :dialog_title="$t('questions.add_question')"
                         :store="store"
                         :info="currentItem"
                         :inputs="finalManualFormInputsComposable"></ModalDialog>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="mb-7"></v-divider>
      <v-row class="mb-3">
        <SearchableFormComponent :inputs="finalInputsStructure" :page="page"
                                 :store_name="store"></SearchableFormComponent>
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in store?.data?.data" :key="key">
          <QuestionCardComponent v-model="dialogSwitch"
                                 :has_action_edit="true"
                                 :info="i"
                                 @update:info_obj="update_current_item"
                                 :has_action_delete="true"></QuestionCardComponent>
        </v-col>
        <v-progress-linear
            v-if="store.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <v-pagination
          v-model="page"
          :length="store?.data?.meta?.last_page"
          :total-visible="store?.data?.meta?.per_page"
      ></v-pagination>

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

const {t} = useI18n();

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
