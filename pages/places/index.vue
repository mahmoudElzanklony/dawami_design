<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3 flex-column flex-sm-row">
        <v-col cols="12" sm="auto" class="pb-0 pb-sm-3 text-center text-sm-start mb-4 mb-sm-0">
          <h1 class="bigger-normal-font font-weight-medium text-gray d-flex justify-center justify-sm-start align-center">
            <i class="fa-solid fa-location-dot me-2 primary-color"></i>
            {{ $t('places.title') }}
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
                    v-if="can('/places', 'create')"
                    @click="resetCurrentItem"
                >
                  <v-icon>mdi-plus</v-icon>
                  <span class="d-none d-sm-block ms-1">{{ t('places.add') }}</span>
                  <span class="d-block d-sm-none ms-1">{{ t('places.add') }}</span>
                </v-btn>
              </template>
              <ModalDialog
                  v-model="dialogSwitch"
                  dialog_icon="fa-solid fa-location-dot"
                  :dialog_title="t('places.add')"
                  :store="placesStore"
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
            :store_name="placesStore"
        />
      <v-row class="mt-3">
        <v-col
            cols="12"
            lg="3"
            md="4"
            sm="6"
            v-for="(place, key) in placesStore?.data?.data"
            :key="key"
        >
          <PlacesCardComponent
              v-model="dialogSwitch"
              :has_action_edit="can('/places', 'update')"
              :info="place"
              @update:info_obj="update_current_item"
              :has_action_delete="can('/places', 'delete')"
              :store="placesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="placesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <PaginationComponent 
        v-model="page"
        :store="placesStore"
      />
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import PlacesCardComponent from "~/components/places/PlacesCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {getFormInputs} from "~/pages/places/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {usePlacesStore} from "~/stores/PlacesStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";
import {useI18n} from "#imports";
import {usePermissions} from '~/composables/usePermissions';
import PaginationComponent from '~/components/global/PaginationComponent.vue';

const nuxtApp = useNuxtApp();
const {t} = useI18n();
const {can} = usePermissions();

const PlacesInputsMapping = {
  area_in_meters: 'location.area'
}
const formInputs = getFormInputs(t);
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputs, PlacesInputsMapping);

const placesStore = usePlacesStore();
callOnServerComposable(placesStore);

const finalInputsStructure = ref([...formInputs]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>