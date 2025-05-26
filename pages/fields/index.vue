<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-play me-2 primary-color"></i>
            {{ $t('fields.title') }}
          </h1>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('fields.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog
                v-model="dialogSwitch"
                dialog_icon="fa-duotone fa-solid fa-university"
                :dialog_title="$t('fields.dialog_title')"
                :store="subjectsStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
            />
          </v-dialog>
        </v-col>
      </v-row>

      <v-divider
          class="mb-6"
      ></v-divider>

      <!-- Search Form and List of Universities -->
      <v-row class="mb-3">
        <SearchableFormComponent
            :inputs="finalInputsStructure"
            :page="page"
            :store_name="subjectsStore"
        />
        <v-col
            cols="12"
            lg="3"
            md="4"
            sm="6"
            v-for="(uni, key) in subjectsStore?.data?.data"
            :key="key"
        >
          <SubjectComponent
              v-model="dialogSwitch"
              :has_action_edit="true"
              :info="uni"
              @update:info_obj="update_current_item"
              :has_action_delete="true"
              :store="subjectsStore"
          />
        </v-col>
        <v-progress-linear
            v-if="subjectsStore?.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <v-pagination
          v-model="page"
          :length="subjectsStore?.data?.meta?.last_page"
          :total-visible="subjectsStore?.data?.meta?.per_page"
      ></v-pagination>

    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import SubjectComponent from "~/components/subjects/SubjectCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {getFormInputs} from "~/pages/fields/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useFieldsStore} from "~/stores/FieldsStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';

const {t} = useI18n();
const nuxtApp = useNuxtApp();
const FieldsInputMappings = {
  ['instructors[]']: (obj) => obj.instructors?.map(loc => loc.id) || [],
  ['places[]']: (obj) => obj.places?.map(place => place.id) || [],
};
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(getFormInputs(t), FieldsInputMappings);
const subjectsStore = useFieldsStore();
callOnServerComposable(subjectsStore);
const finalInputsStructure = ref([...getFormInputs(t)]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>
