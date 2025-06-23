<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-sitemap me-2 primary-color"></i>
            {{ $t('roles.title') }}
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
                    v-if="can('/roles', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ $t('roles.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ $t('roles.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog 
                v-model="dialogSwitch"
                dialog_icon="fa-solid fa-shield-halved"
                :dialog_title="$t('roles.add')"
                :store="rolesStore"
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
        :store_name="rolesStore"
      />

      <v-row class="mt-3">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(i,key) in rolesStore?.data?.data" :key="key">
          <RoleCardComponent
            v-model="dialogSwitch"
            :has_action_edit="can('/roles', 'update')"
            :info="i"
            @update:info_obj="update_current_item"
            :has_action_delete="can('/roles', 'delete')"
            :store="rolesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="rolesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <PaginationComponent
        v-model="page"
        :store="rolesStore"
      />
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import RoleCardComponent from "~/components/roles/RoleCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import SearchableFormComponent from "~/components/global/SearchableFormComponent.vue";
import PaginationComponent from "~/components/global/PaginationComponent.vue";
import {getFormInputs} from "~/pages/roles/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {useRolesStore} from "~/stores/RolesStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {deleteItemComposable, useI18n} from '#imports';
import {usePermissions} from '~/composables/usePermissions';
import {useFormatPermission} from "~/composables/useFormatPermission";

const {t} = useI18n();
const {can} = usePermissions();
const formInputs = getFormInputs(t);
const { formatPermission, getPermissionChipColor } = useFormatPermission();


const RolesInputMappings = {
  ['permissions[]']: (obj) => obj.permissions?.map(perm => perm.id) || [],
};

const {
  dialogSwitch,
  currentItem,
  update_current_item,
  page,
  tab,
  resetCurrentItem
} = useSharedStateComposable(formInputs,RolesInputMappings);
const nuxtApp = useNuxtApp();

const rolesStore = useRolesStore();
callOnServerComposable(rolesStore);

const finalInputsStructure = ref([...formInputs]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
    const permissionsInput = finalInputsStructure.value.find(input => input.input_name === 'permissions[]');
    if (permissionsInput && permissionsInput?.options && Array.isArray(permissionsInput?.options)) {
      permissionsInput?.options.map(item => {
          item.full_name = formatPermission(item.full_name).display;
        return item;
      });
    }
  });
});
</script>