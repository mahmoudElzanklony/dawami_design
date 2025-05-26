<template>
  <div>
    <v-card-text>


    <v-row class="justify-space-between align-center mb-3">
      <v-col cols="auto">
        <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
          <i class="fa-duotone fa-solid fa-user-robot me-2 primary-color"></i>
          {{t('assistants.title')}}
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                class="text-none font-weight-regular bg-primary-color white"
                prepend-icon="mdi-plus"
                :text="t('assistants.add')"
                @click="resetCurrentItem"
                v-bind="activatorProps"
            ></v-btn>
          </template>
          <ModalDialog v-model="dialogSwitch"
                       dialog_icon="fa-duotone fa-solid fa-user-robot"
                       :dialog_title="t('assistants.add')"
                       :store="assistantsStore"
                       :info="currentItem"
                       :inputs="finalInputsStructure"></ModalDialog>
        </v-dialog>
      </v-col>
      <v-divider
          class="mb-4"
      ></v-divider>
    </v-row>
    <v-row class="mb-3">
      <SearchableFormComponent :inputs="finalInputsStructure" :page="page"
                               :store_name="assistantsStore"></SearchableFormComponent>
      <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in assistantsStore?.data?.data" :key="key">
        <AssistantsCardComponent v-model="dialogSwitch" :has_action_edit="true"
                                 :info="i"
                                 :store="assistantsStore"
                                 @update:info_obj="update_current_item"
                                 :has_action_delete="true"></AssistantsCardComponent>
      </v-col>
      <v-progress-linear
          v-if="assistantsStore.loading"
          indeterminate
      ></v-progress-linear>
    </v-row>

    <v-pagination
        v-model="page"
        :length="assistantsStore?.data?.meta?.last_page"
        :total-visible="assistantsStore?.data?.meta?.per_page"
    ></v-pagination>

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

const {t} = useI18n();
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
callOnServerComposable(assistantsStore)


const finalInputsStructure = ref([...fields]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});

</script>