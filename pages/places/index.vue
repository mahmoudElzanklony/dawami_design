<template>
  <div>
    <v-card-text>
      <v-row class="justify-space-between align-center mb-3">
        <v-col cols="auto">
          <h1 class="bigger-normal-font font-weight-medium text-gray flex items-center">
            <i class="fa-duotone fa-solid fa-map-location me-2 primary-color"></i>
            الأماكن
          </h1>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="dialogSwitch" max-width="600" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none font-weight-regular bg-primary-color white"
                  prepend-icon="mdi-plus"
                  text="اضافة مكان"
                  @click="resetCurrentItem"
                  v-bind="activatorProps"
              ></v-btn>
            </template>
            <ModalDialog
                v-model="dialogSwitch"
                dialog_icon="fa-duotone fa-solid fa-map-location"
                dialog_title="اضافة مكان"
                :store="placesStore"
                :info="currentItem"
                :inputs="finalInputsStructure"
            />
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>

      <!-- Search Form and List of Places -->
      <v-row class="mb-3">
        <SearchableFormComponent
            :inputs="finalInputsStructure"
            :page="page"
            :store_name="placesStore"
        />
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
              :has_action_edit="true"
              :info="place"
              @update:info_obj="update_current_item"
              :has_action_delete="true"
              :store="placesStore"
          />
        </v-col>
        <v-progress-linear
            v-if="placesStore.loading"
            indeterminate
        ></v-progress-linear>
      </v-row>

      <!-- Pagination -->
      <v-pagination
          v-model="page"
          :length="placesStore?.data?.meta?.last_page"
          :total-visible="placesStore?.data?.meta?.per_page"
      ></v-pagination>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import PlacesCardComponent from "~/components/places/PlacesCardComponent.vue";
import ModalDialog from "~/components/global/ModalDialog.vue";
import {formInputsComposable} from "~/pages/places/formInputsComposable";
import {handleInputsApi} from "~/composables/HandleInputsApiFormComposable";
import {useSharedStateComposable} from "~/composables/UseSharedStateComposable";
import {usePlacesStore} from "~/stores/PlacesStore";
import {callOnServerComposable} from "~/composables/CallOnServerComposable";

const nuxtApp = useNuxtApp();

const PlacesInputsMapping = {
  area_in_meters: 'location.area'
}
const {dialogSwitch, currentItem, update_current_item, page, tab, resetCurrentItem} =
    useSharedStateComposable(formInputsComposable,PlacesInputsMapping);

const placesStore = usePlacesStore();
callOnServerComposable(placesStore);

const finalInputsStructure = ref([...formInputsComposable]);

onMounted(async () => {
  await nuxtApp.runWithContext(async () => {
    await handleInputsApi(finalInputsStructure.value, currentItem.value);
  });
});
</script>
