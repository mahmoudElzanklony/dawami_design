<template>
  <v-card class="group-card" elevation="2" rounded="lg">
    <v-row align="center" no-gutters>
      <!-- Left Side: Icon -->
      <v-col cols="auto">
        <div class="logo-container">
          <img class="group-logo" src="/images/groups-placeholder.png" alt="Group logo">
        </div>
      </v-col>

      <v-col>
        <div class="card-content px-3 py-2">
          <v-row class="align-center justify-space-between mb-1">
            <v-card-title class="text-h6 pb-0">{{ info?.name }}</v-card-title>

            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="fa-duotone fa-solid fa-ellipsis-vertical" 
                       v-bind="props" 
                       variant="plain" 
                       class="action-button"
                       density="comfortable"></v-btn>
              </template>
              <EditOrDeleteActionsComponent
                  @edit_item="editItem"
                  @delete_item="deleteItemComposable(props.store, info.id)"
                  :has_action_delete="has_action_delete"
                  :has_action_edit="has_action_edit"
                  :item_info="info"></EditOrDeleteActionsComponent>
            </v-menu>
          </v-row>

          <v-card-subtitle class="py-1 px-0 subtitle-text">
            {{ $t('groups.places_count') }}: {{ info?.places?.length }}
          </v-card-subtitle>

          <!-- Places section with consistent height -->
          <div class="places-section mt-3">
            <!-- Always show header -->
            <div class="section-header d-flex align-center mb-2">
              <i class="fa-solid fa-location-dot me-1 primary-color"></i>
              <span class="text-subtitle-2 font-weight-medium">{{ $t('groups.places') }}:</span>
            </div>

            <!-- Content area with consistent height -->
            <div class="places-content">
              <span v-if="info?.places?.length === 0" class="no-places">{{ $t('groups.no_places') }}</span>
              <div v-else class="chips-container">
                <v-chip
                    v-for="(place, index) in info?.places?.slice(0, maxVisiblePlaces)"
                    :key="index"
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="mr-1 mb-1 place-chip"
                >
                  {{ place.name }}
                </v-chip>

                <v-tooltip v-if="info?.places?.length > maxVisiblePlaces" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-chip
                        v-bind="props"
                        size="small"
                        color="primary"
                        variant="flat"
                        class="mr-1 mb-1 more-chip"
                    >
                      +{{ info?.places?.length - maxVisiblePlaces }}
                    </v-chip>
                  </template>
                  <div class="pa-2">
                    <div v-for="(place, index) in info?.places?.slice(maxVisiblePlaces)" :key="index + maxVisiblePlaces">
                      {{ place.name }}
                    </div>
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>

          <!-- Footer with date -->
          <div class="card-footer mt-3 pt-2">
            <div class="d-flex align-center">
              <span class="text-caption text-grey-darken-1">{{ formatDate(info?.created_at) }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import {formatDate} from "~/composables/FormatDateComposable"

const props = defineProps(['has_action_edit', 'has_action_delete', 'info', 'store']);

const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const maxVisiblePlaces = 3;

const editItem = (obj: any) => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    dialog_switch.value = true
  }
};
</script>

<style lang="scss" scoped>
.group-card {
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  height: 100%;
  display: flex;
  padding: 5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
  }
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 0 0 12px 0;
  padding: 12px;
  height: 100%;
  min-height: 100px;
  width: 100px;
}

.group-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.subtitle-text {
  opacity: 0.8;
}

.places-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 80px; /* Ensure minimum height */
}

.places-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 40px; /* Minimum height for content area */
}

.section-header {
  margin-bottom: 8px;
}

.no-places {
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
  padding: 8px 0;
  display: block;
  min-height: 32px; /* Matches the height of a chip row */
}

.place-chip {
  font-size: 12px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.1);
  }
}

.more-chip {
  font-weight: bold;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.card-footer {
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.action-button {
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.04);
  }
}

// RTL support for icons
:deep([dir="rtl"]) {
  .mr-1 {
    margin-right: 0 !important;
    margin-left: 8px !important;
  }
}

@media (max-width: 600px) {
  .logo-container {
    width: 80px;
    min-height: 80px;
    padding: 8px;
  }
  
  .group-logo {
    width: 50px;
    height: 50px;
  }
  
  .places-section {
    min-height: 70px;
  }
  
  .places-content {
    min-height: 32px;
  }
}
</style>
