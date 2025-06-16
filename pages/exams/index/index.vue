<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-solid fa-files me-2 primary-color"></i>
            {{ t('exam.title') }}
          </h1>
        </v-col>
        <v-col cols="12" sm="auto" class="pt-0 pt-sm-3">
          <div class="d-flex flex-column flex-sm-row gap-2 justify-center justify-sm-end">
            <v-dialog v-model="dialogSwitch" max-width="95vw" transition="fade-transition">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none font-weight-bold bg-primary-color white w-100 w-sm-auto"
                    size="small"
                    v-bind="activatorProps"
                    v-if="can('/exams', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ t('exam.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ t('exam.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-solid fa-files"
                  :dialog_title="t('exam.create_new')"
                  :store="examsStore"
                  :info="currentItem"
                  :inputs="finalInputsStructure"
                  :is_exam_modal="true"
              >
              </ModalDialog>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>

      <SearchableFormComponent
          :inputs="finalInputsStructure"
          :page="page"
          :store_name="examsStore"
      />

      <v-row class="mt-3">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(exam, key) in examsStore?.data?.data" :key="key">
          <ExamCardComponent
              v-model="dialogSwitch"
              :has_action_edit="can('/exams', 'update')"
              :info="exam"
              :has_action_delete="can('/exams', 'delete')"
              :store="examsStore"
              @update:info_obj="update_current_item"
          />
        </v-col>
        <v-progress-linear
            v-if="examsStore?.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <PaginationComponent 
        v-model="page"
        :store="examsStore"
      />
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import ExamCardComponent from "~/components/exams/ExamCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import PaginationComponent from "~/components/global/PaginationComponent.vue";
import { getFormInputs } from "~/pages/exams/index/formInputsComposable";
import { handleInputsApi } from "~/composables/HandleInputsApiFormComposable";
import { useSharedStateComposable } from "~/composables/UseSharedStateComposable";
import { useExamsStore } from "~/stores/ExamsStore";
import { callOnServerComposable } from "~/composables/CallOnServerComposable";
import { useI18n } from '#imports';
import { usePermissions } from '~/composables/usePermissions';

const {t} = useI18n();
const {can} = usePermissions();

const FieldsInputMappings = {
  ['questions']:(obj)=> obj.questions?.map(q => q.id) || [],
  start_time:"start_at"
};
const { dialogSwitch, currentItem, update_current_item, page, resetCurrentItem } = useSharedStateComposable(getFormInputs(t),FieldsInputMappings);
const nuxtApp = useNuxtApp();
const examsStore = useExamsStore();
callOnServerComposable(examsStore);


const finalInputsStructure = ref([...getFormInputs(t)]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

if (!currentItem.value.questions) {
  currentItem.value.questions = [];
}
</script>