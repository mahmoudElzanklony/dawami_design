<template>
  <v-card 
    class="place-card mb-4" 
    elevation="2"
    rounded="lg"
    :class="{'place-card--has-image': info.image}"
  >
    <v-img
      v-if="info.image"
      :src="info.image"
      height="180"
      cover
      class="gradient-overlay"
    ></v-img>
    <v-card-title class="d-flex justify-space-between align-center px-4 py-3">
      <span class="text-h6 font-weight-bold text-truncate">{{ info.name }}</span>
      <div v-if="hasActions">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn 
              icon
              v-bind="props" 
              variant="plain"
              density="comfortable"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <EditOrDeleteActionsComponent
            @edit_item="editItem"
            @delete_item="deleteItemComposable(store, info.id)"
            :has_action_delete="has_action_delete"
            :has_action_edit="has_action_edit"
            :item_info="info"
          ></EditOrDeleteActionsComponent>
        </v-menu>
      </div>
    </v-card-title>
    <v-card-text class="px-4 pb-4 card-content">
      <div class="info-section" v-if="info.organization">
        <div class="info-item">
          <v-icon class="info-icon me-1" color="primary">mdi-domain</v-icon>
          <span class="info-text">{{ info.organization.name }}</span>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <v-icon class="info-icon me-1" color="primary">mdi-map-marker</v-icon>
          <span class="info-text">{{ getPlaceTypeLabel(info.type) }}</span>
        </div>
        
        <div class="info-item">
          <v-icon class="info-icon me-1" color="primary">mdi-clipboard-check</v-icon>
          <span class="info-text">{{ getAttendanceTypeLabel(info.attendance_action) }}</span>
        </div>
      </div>

      <div class="info-section" >
        <div class="info-item" v-if="(info?.location?.area) ">
          <v-icon class="info-icon me-1" color="primary">mdi-ruler</v-icon>
          <span class="info-text">{{ info?.location?.area }} متر مربع</span>
        </div>
        
        <div class="info-item" v-if="info?.location?.coordinates">
          <v-icon class="info-icon me-1" color="primary">mdi-map-marker-radius</v-icon>
          <span class="info-text text-truncate">{{ Number(info?.location?.coordinates[0]?.latitude).toFixed(6) }}, {{ Number(info?.location?.coordinates[0]?.longitude).toFixed(6) }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import { deleteItemComposable } from "~/composables/DeleteItemComposable";

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({})
  },
  has_action_edit: {
    type: Boolean,
    default: false
  },
  has_action_delete: {
    type: Boolean,
    default: false
  },
  store: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:model-value', 'update:info_obj']);
const modelValue = defineModel();

const hasActions = computed(() => props.has_action_edit || props.has_action_delete);

const getPlaceTypeLabel = (type) => {
  const types = {
    'gps': 'موقع GPS',
    'maps': 'موقع على الخريطة',
    'polygon': 'منطقة جغرافية'
  };
  return types[type] || type;
};

const getAttendanceTypeLabel = (type) => {
  const types = {
    'check_in': 'تسجيل دخول',
    'check_in_check_out': 'تسجيل دخول وخروج'
  };
  return types[type] || type;
};

const editItem = (obj) => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    modelValue.value = true;
  }
};
</script>

<style scoped>
.place-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 270px;
  display: flex;
  flex-direction: column;
}

.place-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.place-card--has-image .v-card-title {
  margin-top: -20px;
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 8px 8px 0 0;
}

.gradient-overlay {
  position: relative;
}

.gradient-overlay::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65%;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
}

.card-content {
  flex: 1;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  margin-right: 12px;
  opacity: 0.9;
  font-size: 18px;
}

.info-text {
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .v-card-title {
    font-size: 1.1rem;
  }
  
  .info-text {
    font-size: 0.9rem;
  }
}
</style>