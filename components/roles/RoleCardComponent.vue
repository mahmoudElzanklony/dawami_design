<template>
  <v-card class="role-card" elevation="2" rounded="lg">
    <v-row align="center" no-gutters>
      <!-- Left Side: Icon -->
      <v-col cols="auto">
        <div class="logo-container">
          <i class="fa-solid fa-shield-halved primary-color role-icon"></i>
        </div>
      </v-col>

      <v-col>
        <div class="card-content px-3 py-2">
          <v-row class="align-center justify-space-between mb-1">
            <v-card-title class="text-h6 pb-0">{{ info?.name }}</v-card-title>

            <v-menu v-if="has_action_edit || has_action_delete">
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="plain" class="action-button" density="comfortable">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <EditOrDeleteActionsComponent
                  @edit_item="editItem"
                  @delete_item="deleteItemComposable(props.store, info.id)"
                  :has_action_delete="has_action_delete"
                  :has_action_edit="has_action_edit"
                  :item_info="info">
                <template #extra-actions="{ item }">
                  <v-list-item @click="showPermissionsModal = true">
                    <v-list-item-title>
                      <span class="info">
                        <i class="fa-solid fa-key"></i>
                      </span>
                      {{ $t('roles.view_permissions') }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </EditOrDeleteActionsComponent>
            </v-menu>
          </v-row>

          <v-card-subtitle class="py-1 px-0 subtitle-text">
            {{ $t('roles.permissions_count') }}: {{ info?.permissions?.length || 0 }}
          </v-card-subtitle>


          <div class="permissions-section mt-3">
            <!-- Always show header -->
            <div class="section-header d-flex align-center mb-2">
              <i class="fa-solid fa-key me-1 primary-color"></i>
              <span class="text-subtitle-2 font-weight-medium">{{ $t('roles.permissions') }}:</span>
            </div>


            <div class="permissions-content">
              <span v-if="!info?.permissions?.length" class="no-permissions">{{ $t('roles.no_permissions') }}</span>
              <div v-else class="chips-container">
                <v-chip
                    v-for="(permission, index) in info?.permissions?.slice(0, maxVisiblePermissions)"
                    :key="index"
                    size="small"
                    :color="getPermissionChipColor(formatPermission(permission.full_name).action)"
                    variant="outlined"
                    class="mr-1 mb-1 permission-chip"
                >
                  <v-avatar v-if="formatPermission(permission.full_name).icon" start>
                    <i :class="formatPermission(permission.full_name).icon"></i>
                  </v-avatar>
                  {{ formatPermission(permission.full_name).display }}
                </v-chip>

                <v-tooltip v-if="info?.permissions?.length > maxVisiblePermissions" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-chip
                        v-bind="props"
                        size="small"
                        color="primary"
                        variant="flat"
                        class="mr-1 mb-1 more-chip"
                    >
                      +{{ info?.permissions?.length - maxVisiblePermissions }}
                    </v-chip>
                  </template>
                  <div class="pa-2">
                    <div v-for="(permission, index) in info?.permissions?.slice(maxVisiblePermissions)" :key="index + maxVisiblePermissions">
                      {{ formatPermission(permission.full_name).display }}
                    </div>
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>


          <div class="card-footer mt-3 pt-2">
            <div class="d-flex align-center">
              <span class="text-caption text-grey-darken-1">
                <i class="fa-solid fa-calendar-days me-1 primary-color"></i>
                {{ formatDate(info?.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Permissions Modal -->
    <RolePermissionsModal
      v-model="showPermissionsModal"
      :role="info"
    />
  </v-card>
</template>

<script setup lang="ts">
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import {formatDate} from "~/composables/FormatDateComposable"
import {useFormatPermission} from "~/composables/useFormatPermission";
import RolePermissionsModal from "~/components/roles/RolePermissionModal.vue";

const props = defineProps(['has_action_edit', 'has_action_delete', 'info', 'store']);

const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const {formatPermission, getPermissionChipColor} = useFormatPermission();
const maxVisiblePermissions = 3;
const showPermissionsModal = ref(false);

const editItem = (obj: any) => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    dialog_switch.value = true;
  }
};
</script>

<style lang="scss" scoped>
.role-card {
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  height: 100%;
  display: flex;
  padding: 12px 5px;

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

.role-icon {
  font-size: 60px; /* Increased from 42px to 60px for a bigger icon */
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

.permissions-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 80px;
}

.permissions-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 40px;
}

.section-header {
  margin-bottom: 8px;
}

.no-permissions {
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
  padding: 8px 0;
  display: block;
  min-height: 32px;
}

.permission-chip {
  font-size: 12px;
  transition: background-color 0.2s;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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

  .role-icon {
    font-size: 40px;
  }

  .permissions-section {
    min-height: 70px;
  }

  .permissions-content {
    min-height: 32px;
  }
}
</style>
