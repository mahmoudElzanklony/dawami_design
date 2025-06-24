<template>
  <v-dialog v-model="dialog" max-width="800" scrollable transition="dialog-bottom-transition">
    <v-card class="permission-modal">
      <v-card-title class="modal-header primary-bg-gradient d-flex align-center">
        <div class="d-flex align-center">
          <v-avatar class="modal-icon-bg me-3" size="42">
            <i class="fa-solid fa-shield-halved"></i>
          </v-avatar>
          <div>
            <div class="text-h6 white--text">{{ $t('roles.permissions_details') }}</div>
            <div class="text-subtitle-2 white--text font-weight-regular">{{ role?.name }}</div>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-4 px-4">
        <v-row v-if="role?.permissions?.length">
          <v-col cols="12">
            <div v-for="(group, route) in groupedPermissions" :key="route" class="permission-group mb-5">
              <div class="section-header mb-3 d-flex align-center">
                <v-avatar size="36" class="me-2 route-avatar" :color="getRouteColor(route)">
                  <i v-if="routeIcons[route]" :class="routeIcons[route]" class="white--text"></i>
                  <span v-else class="text-uppercase white--text">{{ route.charAt(0) }}</span>
                </v-avatar>
                <h3 class="section-title">{{ getRouteTranslation(route) }}</h3>
                <v-chip class="ms-2" size="small" color="grey-lighten-3" variant="flat">
                  {{ group.length }}
                </v-chip>
              </div>

              <div class="permission-chips-container px-2">
                <v-chip
                  v-for="(permission, index) in group"
                  :key="index"
                  size="medium"
                  :color="getPermissionChipColor(formatPermission(permission.full_name).action)"
                  variant="outlined"
                  class="permission-chip ma-1"
                  elevation="1"
                >
                  <template v-if="formatPermission(permission.full_name).icon">
                    <v-avatar start size="24" class="me-1">
                      <i :class="formatPermission(permission.full_name).icon"></i>
                    </v-avatar>
                  </template>
                  <span class="chip-text">{{ formatPermission(permission.full_name).display }}</span>
                </v-chip>
              </div>

              <v-divider class="mt-4"></v-divider>
            </div>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" class="empty-state text-center pa-6">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-shield-off-outline</v-icon>
            <p class="text-body-1 text-grey-darken-1">
              {{ $t('roles.no_permissions') }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" prepend-icon="mdi-close" @click="dialog = false">
          {{ $t('attendance.details.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormatPermission } from '~/composables/useFormatPermission';
import { useI18n } from '#imports';

const props = defineProps({
  modelValue: Boolean,
  role: Object
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const { formatPermission, getPermissionChipColor } = useFormatPermission();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Group permissions by route
const groupedPermissions = computed(() => {
  if (!props.role?.permissions) return {};

  const grouped = {};

  props.role.permissions.forEach(permission => {
    const parts = permission.full_name.split('|');
    const route = parts[1]?.replace(/\//g, '') || 'other';

    if (!grouped[route]) {
      grouped[route] = [];
    }

    grouped[route].push(permission);
  });

  // sorting by number of permissions (descending)
  return Object.fromEntries(
    Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)
  );
});

const routeIcons = {
  users: 'fa-solid fa-users',
  organizations: 'fa-solid fa-university',
  branches: 'fa-solid fa-tags',
  groups: 'fa-solid fa-people-group',
  fields: 'fa-solid fa-book-open',
  files: 'fa-solid fa-play',
  subscriptions: 'fa-solid fa-circle-check',
  bills: 'fa-solid fa-dollar-sign',
  assistants: 'fa-solid fa-user-robot',
  questions: 'fa-solid fa-seal-question',
  exams: 'fa-solid fa-files',
  places: 'fa-solid fa-location-dot',
  "working-days": 'fa-solid fa-person-chalkboard',
  attendance: 'fa-solid fa-clipboard-user',
  packages: 'fa-solid fa-clipboard-list',
  roles: 'fa-solid fa-sitemap',
  other: 'fa-solid fa-circle-question'
};

const routeColors = {
  users: 'indigo',
  organizations: 'blue-darken-3',
  branches: 'teal-darken-1',
  groups: 'deep-purple',
  fields: 'green-darken-1',
  files: 'amber-darken-2',
  subscriptions: 'cyan-darken-1',
  bills: 'green-darken-2',
  assistants: 'deep-orange',
  questions: 'red-darken-1',
  exams: 'blue-grey',
  places: 'red-darken-2',
  "working-days": 'purple-darken-1',
  attendance: 'orange-darken-2',
  packages: 'teal-darken-2',
  roles: 'indigo-darken-2',
  other: 'grey'
};


const getRouteTranslation = (route) => {
  return t(`navigation.${route}`, route);
};

const getRouteColor = (route) => {
  return routeColors[route] || 'grey';
};
</script>

<style lang="scss" scoped>
.permission-modal {
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
}

.primary-bg-gradient {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  color: white;
}

.modal-icon-bg {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.section-header {
  position: relative;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.route-avatar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.permission-group {
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.02);
  }
}

.permission-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 44px;
}

.permission-chip {
  font-size: 0.875rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: auto !important;
  padding: 6px 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  &:deep(.v-chip__content) {
    display: flex;
    align-items: center;
    white-space: normal;
    line-height: 1.4;
  }

  .chip-text {
    display: inline-block;
  }
}

.empty-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 16px 0;
}

// RTL support
:deep([dir="rtl"]) {
  .me-1, .me-2, .me-3 {
    margin-right: 0 !important;
  }

  .me-1 {
    margin-left: 4px !important;
  }

  .me-2 {
    margin-left: 8px !important;
  }

  .me-3 {
    margin-left: 12px !important;
  }

  .ms-2 {
    margin-left: 0 !important;
    margin-right: 8px !important;
  }

  .permission-chips-container {
    padding-left: 0;
    padding-right: 44px;
  }
}

// Responsive adjustments
@media (max-width: 600px) {
  .permission-chips-container {
    padding-left: 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;

    .route-avatar {
      margin-bottom: 8px;
    }

    .section-title {
      margin-bottom: 4px;
    }
  }

  :deep([dir="rtl"]) {
    .permission-chips-container {
      padding-right: 0;
    }
  }
}
</style>
