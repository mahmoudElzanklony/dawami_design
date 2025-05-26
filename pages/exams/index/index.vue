<template>
  <div>
    <v-row class="justify-space-between align-center mb-3">
      <v-col cols="auto">
        <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
          <i class="fa-duotone fa-solid fa-clipboard-check me-2 primary-color"></i>
          {{ t('exam.title') }}
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-dialog v-model="dialogSwitch" max-width="95vw" transition="fade-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                class="text-none font-weight-regular bg-primary-color white"
                prepend-icon="mdi-plus"
                :text="t('exam.add')"
                @click="resetCurrentItem"
                v-bind="activatorProps"
            ></v-btn>
          </template>
          <ModalDialog
              v-model="dialogSwitch"
              dialog_icon="fa-duotone fa-solid fa-clipboard-check"
              :dialog_title="t('exam.create_new')"
              :store="examsStore"
              :info="currentItem"
              :inputs="finalInputsStructure"
              :is_exam_modal="true"
          >

          </ModalDialog>
        </v-dialog>
      </v-col>
      <v-divider class="mb-4"></v-divider>
    </v-row>

    <SearchableFormComponent
        :inputs="finalInputsStructure"
        :page="page"
        :store_name="examsStore"
    />

    <v-row class="mb-3">
      <v-col cols="12" lg="3" md="4" sm="6" v-for="(exam, key) in examsStore?.data?.data" :key="key">
        <ExamCardComponent
            v-model="dialogSwitch"
            :has_action_edit="true"
            :info="exam"
            :has_action_delete="true"
            :store="examsStore"
            @update:info_obj="update_current_item"
        />
      </v-col>
      <v-progress-linear
          v-if="examsStore?.loading"
          indeterminate
      ></v-progress-linear>
    </v-row>

    <v-pagination
        v-model="page"
        :length="examsStore?.data?.meta?.last_page"
        :total-visible="examsStore?.data?.meta?.per_page"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import ExamCardComponent from "~/components/exams/ExamCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import { getFormInputs } from "~/pages/exams/index/formInputsComposable";
import { handleInputsApi } from "~/composables/HandleInputsApiFormComposable";
import { useSharedStateComposable } from "~/composables/UseSharedStateComposable";
import { useExamsStore } from "~/stores/ExamsStore";
import { callOnServerComposable } from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';
const {t} = useI18n();
const FieldsInputMappings = {
  ['questions']:(obj)=> obj.questions?.map(q => q.id) || [],
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
