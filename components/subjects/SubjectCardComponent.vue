<template>
  <v-card 
    class="subject-card mx-auto" 
    elevation="3"
    :class="{'subject-card--enabled': isEnabled}"
  >
    <v-row no-gutters>
      <v-col cols="auto" class="subject-image-container">
        <img
          class="subject-logo"
          v-if="info?.category?.image"
          :src="config.public.baseUrl + info.category.image.path"
          :alt="info?.name"
        />
        <img
          class="subject-logo"
          v-else
          src="/images/university-placeholder.png"
          alt="Subject"
        />
      </v-col>

      <v-col class="d-flex flex-column">
        <div class="card-header">
          <div>
            <v-card-title class="text-h5 font-weight-bold pb-1">{{ info?.name }}</v-card-title>
            <v-card-subtitle class="text-caption pb-0">
              <span class="semester-badge">{{t('fields.semester')}} {{ info.semester }}</span>
            </v-card-subtitle>
          </div>
          
          <v-menu v-if="has_action_edit || has_action_delete">
            <template v-slot:activator="{ props: menuProps }">
              <v-btn
                icon
                v-bind="menuProps"
                variant="plain"
                class="menu-button"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <EditOrDeleteActionsComponent
              @edit_item="editItem"
              @delete_item="deleteItemComposable(props.store, info.id)"
              :has_action_edit="has_action_edit"
              :has_action_delete="has_action_delete"
              :item_info="info"
            />
          </v-menu>
        </div>

        <v-divider class="my-2"></v-divider>

        <v-card-text class="py-2 px-1">
          <div v-if="info.note" class="note-text mb-3">
            <v-icon color="info" size="small" class="me-1">mdi-information</v-icon>
            {{ info.note }}
          </div>
          <div v-else class="note-text-empty mb-3">
            <v-icon color="grey" size="small" class="me-1">mdi-information-outline</v-icon>
            <span class="text-grey">{{ t('fields.no_additional_info') }}</span>
          </div>

          <!-- Features Section -->
          <div class="features-section mb-3">
            <div class="price-badge">
              <i class="fa-solid fa-dollar-sign me-1"></i>
              <span class="font-weight-medium">{{ info.price || '0' }}</span>
            </div>
            
            <div class="feature-badges">

              <div>
                  <div class="feature-badge" :class="info.support_ai ? 'feature-enabled' : 'feature-disabled'">
                    <v-icon size="small">{{ info.support_ai ? 'mdi-robot-happy' : 'mdi-robot-confused' }}</v-icon>
                    <span class="feature-label">{{ t('fields.ai_support') }}</span>
                  </div>

              </div>


              <div>
                  <div class="feature-badge" :class="info.support_bluetooth ? 'feature-enabled' : 'feature-disabled'" >
                    <v-icon size="small">{{ info.support_bluetooth ? 'mdi-bluetooth-connect' : 'mdi-bluetooth-off' }}</v-icon>
                    <span class="feature-label">{{ t('fields.bluetooth_support') }}</span>
                  </div>
              </div>

              <div >
                  <div class="feature-badge" :class="info.support_attendance ? 'feature-enabled' : 'feature-disabled'" >
                    <v-icon size="small">{{ info.support_attendance ? 'mdi-account-check' : 'mdi-account-cancel' }}</v-icon>
                    <span class="feature-label">{{ t('navigation.attendance') }}</span>
                  </div>
              </div>
            </div>
          </div>

          <!-- Instructors -->
          <div v-if="info.instructors?.length" class="instructors-section">
            <div class="instructors-label">
              <v-icon size="small" color="primary">mdi-account-group</v-icon>
              <span class="text-caption">{{ t('fields.instructors') }}:</span>
            </div>
            <div class="instructors-chips">
              <v-chip
                v-for="instructor in info.instructors"
                :key="instructor.id"
                size="small"
                variant="outlined"
                color="primary"
                class="instructor-chip"
                :prepend-icon="instructor.is_block ? 'mdi-account-cancel' : 'mdi-account'"
                :class="{'blocked-instructor': instructor.is_block === 1}"
              >
                {{ instructor.username }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-spacer></v-spacer>

        <v-card-actions class="pa-2 card-footer">
          <v-row no-gutters align="center">
            <v-col cols="auto">
              <div class="d-flex align-center creation-date">
                <span class="icon primary-color">
                  <i class="fa-duotone fa-solid fa-calendar-days"></i>
                </span>
                <span class="text-caption">{{ formatDate(info.created_at) }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import EditOrDeleteActionsComponent from '~/components/global/ExtraActionsComponent.vue';
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import { formatRelativeDate } from '~/utilities/dateHelpers';
import { useI18n } from '#imports';
const {t} = useI18n();

const props = defineProps<{
  has_action_edit: boolean;
  has_action_delete: boolean;
  info: any;
  store: any;
}>();

const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const config = useRuntimeConfig();

// Check if subject has any enabled features
const isEnabled = computed(() => {
  return props.info.support_ai || props.info.support_bluetooth || props.info.support_attendance;
});

function editItem(obj: any) {
  emit('update:info_obj', obj);
  dialog_switch.value = true;
}

function formatDate(dateString: string) {
  try {
    return formatRelativeDate(dateString);
  } catch (e) {
    return dateString;
  }
}
</script>

<style lang="scss" scoped>
.subject-card {
  position: relative;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 10px;
  height: 100%; /* Ensure card takes full height of its container */
  display: flex; /* Add flex display */
  flex-direction: column; /* Stack content vertically */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
  }
}

.subject-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.subject-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 4px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 16px 0 0;
}

.menu-button {
  margin-top: -8px;
}

.term-badge, .semester-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 4px;
}

.semester-badge {
  background-color: rgba(var(--v-theme-secondary), 0.3);
  color: black;
}

.note-text, .note-text-empty {
  font-size: 13px;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(var(--v-theme-info), 0.05);
}

.note-text-empty {
  background-color: #f5f5f5;
  font-style: italic;
}

.features-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.price-badge {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-radius: 20px;
  font-weight: 500;
}

.feature-badges {
  display: flex;
  gap: 8px;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 16px;
  cursor: default;

  &.feature-enabled {
    background-color: rgba(var(--v-theme-success), 0.1);
    color: rgb(var(--v-theme-success));
  }

  &.feature-disabled {
    background-color: rgba(var(--v-theme-error), 0.05);
    color: rgb(var(--v-theme-error));
  }

  .feature-label {
    font-size: 11px;
    font-weight: 500;
  }
}

.instructors-section {
  margin-top: 12px;
}

.instructors-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.instructors-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.instructor-chip {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.blocked-instructor {
    text-decoration: line-through;
    opacity: 0.7;
  }
}

.card-footer {
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.creation-date {
  color: var(--v-text-color, rgba(0,0,0,0.6));
  font-size: 12px;
}

.icon {
  margin-right: 6px;
  font-size: 14px;

  &:lang(ar) {
    margin-left: 6px;
    margin-right: 0;
  }
}

/* Ensure the v-row inside the card fills the height */
.v-card > .v-row {
  flex: 1;
  min-height: 100%;
}

/* Ensure the main column grows to fill available space */
.v-card .v-col.d-flex.flex-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  .subject-image-container {
    padding: 12px;
  }

  .subject-logo {
    width: 60px;
    height: 60px;
  }

  .feature-badges {
    margin-top: 8px;
    justify-content: flex-start;
    width: 100%;
  }

  .price-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>