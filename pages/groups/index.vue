<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-solid fa-people-group me-2 primary-color"></i>
            {{ $t('groups.title') }}
          </h1>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  :text="$t('groups.add')"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog v-model="dialogSwitch"
                         dialog_icon="fa-solid fa-people-group"
                         :dialog_title="$t('groups.add')"
                         :store="groupsStore"
                         :info="currentItem"
                         :inputs="finalInputsStructure"></ModalDialog>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="mb-7"></v-divider>
      <v-row class="mb-3">
        <SearchableFormComponent :inputs="finalInputsStructure" :page="page"
                                 :store_name="groupsStore"></SearchableFormComponent>
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in groupsStore?.data?.data" :key="key">
          <GroupCardComponent v-model="dialogSwitch" :has_action_edit="true"
                              :info="i"
                              @update:info_obj="update_current_item"
                              :has_action_delete="true"
                              :store="groupsStore"></GroupCardComponent>
        </v-col>
        <v-progress-linear
            v-if="groupsStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>
      <v-pagination
          v-model="page"
          :length="groupsStore?.data?.meta?.last_page"
          :total-visible="groupsStore?.data?.meta?.per_page"
          rounded="circle"
      ></v-pagination>
    </v-card-text>
  </div>
</template>


<script setup lang="ts">
import GroupCardComponent from "~/components/groups/GroupCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import SearchableFormComponent from "~/components/global/SearchableFormComponent.vue";
import {getFormInputs} from "~/pages/groups/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useGroupsStore} from "~/stores/GroupsStore"
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


const groupsStore = useGroupsStore()
callOnServerComposable(groupsStore)

const finalInputsStructure = ref([...formInputs]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>