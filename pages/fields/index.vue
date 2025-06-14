<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-play me-2 primary-color"></i>
            {{ $t('fields.title') }}
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
                    v-if="can('/fields', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('fields.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('fields.add') }}</span>
                </v-btn>
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
          </div>
        </v-col>
      </v-row>

      <v-divider class="mb-4"></v-divider>


        <SearchableFormComponent
            :inputs="finalInputsStructure"
            :page="page"
            :store_name="subjectsStore"
        />
      <v-row class="mt-3">
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
              :has_action_edit="can('/fields', 'update')"
              :info="uni"
              @update:info_obj="update_current_item"
              :has_action_delete="can('/fields', 'delete')"
              :store="subjectsStore"
          />
        </v-col>
        <v-progress-linear
            v-if="subjectsStore?.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="subjectsStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : subjectsStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="subjectsStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>

    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import SubjectComponent from "~/components/subjects/SubjectCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import SearchableFormComponent from "~/components/global/SearchableFormComponent.vue";
import {getFormInputs} from "~/pages/fields/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useFieldsStore} from "~/stores/FieldsStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from '#imports';
import {usePermissions} from '~/composables/usePermissions';

const {t} = useI18n();
const {can} = usePermissions();
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
