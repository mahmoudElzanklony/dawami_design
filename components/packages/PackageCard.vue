<template>
  <v-card class="package-card h-100" elevation="2" rounded="lg">
    <div class="card-header">
      <v-row align="center" class="px-4 pt-4 pb-2">
        <!-- Left Side: Package Icon -->
        <v-col cols="auto" class="mr-2">
          <v-avatar color="primary" size="42" class="icon-container">
            <i class="white--text fa-duotone fa-solid fa-box-open"></i>
          </v-avatar>
        </v-col>

        <v-col>
          <v-row class="align-center justify-space-between mb-0 no-gutters">
            <v-card-title class="text-h6 mb-0 text-truncate px-0 py-1">{{ package.name }}</v-card-title>

            <v-menu v-if="has_action_edit || has_action_delete">
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="plain" density="comfortable" class="action-btn">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <EditOrDeleteActionsComponent
                @edit_item="editItem"
                @delete_item="deleteItemComposable(store, package.id)"
                :has_action_delete="has_action_delete"
                :has_action_edit="has_action_edit"
                :item_info="package"
              >
                <template #extra-actions="{ item }">
                  <v-list-item @click="$emit('view-details', item)">
                    <v-list-item-title>
                      <span class="info">
                        <i class="fa-duotone fa-eye me-2"></i>
                      </span>
                      {{ $t('packages.view_details') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </EditOrDeleteActionsComponent>
            </v-menu>
          </v-row>

          <v-card-subtitle class="py-1 px-0 text-truncate">
            <v-icon small color="primary" class="mr-1">mdi-information-outline</v-icon>
            {{ truncateText(package.description, 35) }}
          </v-card-subtitle>
        </v-col>
      </v-row>

      <v-divider class="mx-4 my-2"></v-divider>
    </div>

    <v-card-text class="px-4 pt-2 pb-3">
      <!-- Package Stats Section -->
      <div class="chips-container mb-3">
        <v-chip
          size="small"
          class="ma-1"
          color="success"
          variant="tonal"
          density="comfortable"
        >
          <v-icon icon="mdi-cash" size="x-small" start></v-icon>
          {{ $t('packages.price') }}: {{ package.price }}
        </v-chip>
        
        <v-chip
          size="small"
          class="ma-1"
          color="primary"
          variant="tonal"
          density="comfortable"
        >
          <v-icon icon="mdi-account-group" size="x-small" start></v-icon>
          {{ $t('packages.max_users') }}: {{ package.max_users_number }}
        </v-chip>
      </div>

      <!-- Description Section -->
      <div class="description-section">
        <div class="text-caption font-weight-medium text-grey-darken-1 mb-2">{{ $t('packages.description') }}:</div>
        <div class="description-content">
          {{ package.description }}
        </div>
      </div>
    </v-card-text>

    <v-spacer></v-spacer>

    <!-- Package Footer -->
    <div class="package-footer pa-3 d-flex align-center">
      <v-avatar size="32" class="me-2 avatar-icon bg-grey-lighten-4">
        <v-icon color="primary">mdi-account-circle</v-icon>
      </v-avatar>
      <div class="d-flex flex-column justify-center">
        <div class="text-caption font-weight-medium">{{ package.user?.username || '-' }}</div>
        <div class="text-caption text-grey-darken-1">{{ formatDate(package.created_at) }}</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        rounded="pill"
        @click="$emit('view-details', package)"
      >
        {{ $t('packages.view_details') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { formatDate } from '~/composables/FormatDateComposable';
import { deleteItemComposable } from '~/composables/DeleteItemComposable';
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';

const props = defineProps({
  package: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  has_action_edit: {
    type: Boolean,
    default: true
  },
  has_action_delete: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['edit', 'view-details']);

const editItem = (obj) => {
  emit('edit', obj);
};

// Function to truncate text similar to the one in QuestionCardComponent
const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
</script>

<style lang="scss" scoped>
.package-card {
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  }
}

.card-header {
  position: relative;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 18px;
  }
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-card-title.text-truncate {
  max-width: calc(100% - 40px);
  font-weight: 600;
}

.action-btn {
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.description-section {
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  padding-top: 8px;
  margin-top: 4px;
}

.description-content {
  min-height: 60px;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.875rem;
}

.no-gutters {
  margin: 0 !important;
  padding: 0 !important;
}

.package-footer {
  margin-top: auto;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  .v-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .v-card-title {
    font-size: 1rem !important;
  }

  .v-card-subtitle {
    font-size: 0.85rem;
  }

  .icon-container {
    size: 36px;

    i {
      font-size: 16px;
    }
  }

  .package-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .v-btn {
      align-self: center;
      margin-top: 8px;
    }

    .d-flex.flex-column {
      width: 100%;
      text-align: center;
    }
    
    .avatar-icon {
      margin-right: 0 !important;
      margin-left: 0 !important;
      margin-bottom: 8px;
      align-self: center;
    }
  }
}
</style>