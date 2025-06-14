<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-people-group me-2 primary-color"></i>
            {{ $t('groups.title') }}
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
                    v-if="can('/groups', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('groups.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('groups.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog 
                v-model="dialogSwitch"
                dialog_icon="fa-solid fa-people-group"
                :dialog_title="$t('groups.add')"
                :store="groupsStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
              />
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>
      
      <v-row class="mb-3">
        <SearchableFormComponent 
          :inputs="finalInputsStructure" 
          :page="page"
          :store_name="groupsStore"
        />
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in groupsStore?.data?.data" :key="key">
          <GroupCardComponent 
            v-model="dialogSwitch" 
            :has_action_edit="can('/groups', 'update')"
            :info="i"
            @update:info_obj="update_current_item"
            :has_action_delete="can('/groups', 'delete')"
            :store="groupsStore"
          />
        </v-col>
        <v-progress-linear
            v-if="groupsStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>
      
      <div class="d-flex justify-center mt-4 px-2 overflow-x-auto">
        <v-pagination
            v-model="page"
            :length="groupsStore?.data?.meta?.last_page"
            :total-visible="$vuetify.display.xs ? 3 : $vuetify.display.sm ? 5 : groupsStore?.data?.meta?.per_page"
            :active-color="'#1e64ff'"
            rounded="circle"
            :disabled="groupsStore.loading"
            density="comfortable"
            variant="outlined"
            :size="$vuetify.display.smAndDown ? 'small' : 'default'"
        ></v-pagination>
      </div>
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
import {usePermissions} from '~/composables/usePermissions';

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


const groupsStore = useGroupsStore()
callOnServerComposable(groupsStore)

const finalInputsStructure = ref([...formInputs]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>
