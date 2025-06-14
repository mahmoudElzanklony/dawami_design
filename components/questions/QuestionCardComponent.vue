<template>
  <v-card class="mx-auto card-container" elevation="2" rounded="lg">
    <v-row align="center" class="px-4 pt-4 pb-2">
      <!-- Left Side: Tag Icon -->
      <v-col cols="auto" class="ms-2">
        <v-avatar color="primary" size="42" class="icon-container">
          <i class="white--text fa-duotone fa-solid fa-question"></i>
        </v-avatar>
      </v-col>

      <v-col>

        <v-row class="align-center justify-space-between mb-0 no-gutters">
          <client-only>
            <v-tooltip
                activator="parent"
                location="bottom"
            > {{ info?.question }}
            </v-tooltip>
          </client-only>
          <v-card-title class="text-h6 mb-0 text-truncate px-0 py-1">{{ truncateText(info?.question, 28) }}</v-card-title>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                  icon="mdi-dots-vertical"
                  v-bind="props"
                  variant="plain"
                  density="comfortable"
                  class="action-btn"
              ></v-btn>
            </template>
            <EditOrDeleteActionsComponent
                @edit_item="editItem"
                @delete_item=deleteItemComposable(props.store,info.id)
                :has_action_delete="has_action_delete"
                :has_action_edit="has_action_edit"
                :item_info="info"
            ></EditOrDeleteActionsComponent>
          </v-menu>
        </v-row>
        <client-only>
          <v-tooltip
              activator="parent"
              location="bottom"
          >
            {{ info?.type.toLowerCase() == 'select' ? info?.options[info?.answer]?.option : (info?.answer == 1 ? $t('questions.types.true') : $t('questions.types.false')) }}
          </v-tooltip>
        </client-only>
        <v-card-subtitle class="py-1 px-0 text-truncate answer-text">
          <v-icon
              small
              :color="info?.type.toLowerCase() == 'select' ? 'primary' : (info?.answer == 1 ? 'success' : 'error')"
              class="ms-1"
          >{{ info?.type.toLowerCase() == 'select' ? 'mdi-check-circle-outline' : (info?.answer == 1 ? 'mdi-check-circle' : 'mdi-close-circle') }}</v-icon>
          {{ info?.type.toLowerCase() == 'select' ? truncateText(info?.options[info?.answer]?.option) : (info?.answer == 1 ? $t('questions.types.true') : $t('questions.types.false')) }}
        </v-card-subtitle>
      </v-col>
    </v-row>

    <v-divider class="mx-4 my-2"></v-divider>

    <v-card-text class="px-4 pt-2 pb-4">
      <!-- Category Chips -->
      <div class="chips-container mb-3">
        <v-chip
            size="small"
            class="ma-1"
            color="success"
            variant="outlined"
            density="comfortable"
        >
          <v-icon icon="mdi-label" size="x-small" start></v-icon>
          {{ info?.type }}
        </v-chip>
        <v-chip
            size="small"
            class="ma-1"
            color="primary"
            variant="outlined"
            density="comfortable"
        >
          <v-icon icon="mdi-robot" size="x-small" start></v-icon>
          {{ info?.assistant?.name }}
        </v-chip>
        <v-chip v-if="info?.page && false"
                size="small"
                class="ma-1"
                color="purple"
                variant="outlined"
                density="comfortable"
        >
          <v-icon icon="mdi-file-find" size="x-small" start></v-icon>
          {{ $t('questions.card.page') }}({{ info?.page }})
        </v-chip>
        <v-chip
            size="small"
            class="ma-1"
            color="teal"
            variant="outlined"
            density="comfortable"
        >
          <v-icon icon="mdi-tag" size="x-small" start></v-icon>
          {{ info?.complexity }}
        </v-chip>
      </div>

      <!-- Options Section -->
      <div v-if="info?.options && info.options.length > 0" class="options-section">
        <div class="text-caption font-weight-medium text-grey-darken-1 mb-2">{{ $t('questions.card.options') }}:</div>
        <div class="options-container">
          <v-chip
              v-for="(option, key) in info?.options"
              :key="key"
              size="small"
              class="ma-1 option-chip"
              :color="option?.is_correct == 1 ? 'success' : 'error'"
              :variant="option?.is_correct == 1 ? 'tonal' : 'outlined'"
              density="comfortable"
          >
            <client-only>
              <v-tooltip
                  activator="parent"
                  location="bottom"
              > {{ option?.option }}
              </v-tooltip>
            </client-only>
            <v-icon :icon="option?.is_correct == 1 ? 'mdi-check' : 'mdi-close'" size="x-small" start></v-icon>
            {{ truncateText(option?.option, 20) }}
          </v-chip>
        </div>
      </div>

      <v-chip
          v-if="false"
          size="small"
          class="ma-1 mt-2"
          color="primary"
          variant="outlined"
          density="comfortable"
      >
        <v-icon icon="mdi-calendar" size="x-small" start></v-icon>
        {{ info?.created_at }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {deleteItemComposable} from "~/composables/DeleteItemComposable";

let props = defineProps(['has_action_edit','has_action_delete','info','store']);
import { inject } from 'vue';
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";

const truncateText = inject('truncateText');
const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const editItem = (obj) => {
  emit('update:info_obj', obj);
  if(props.has_action_edit){
    dialog_switch.value = true
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  }
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
}

.action-btn {
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.answer-text {
  font-weight: 500;
  line-height: 1.2;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.options-section {
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  padding-top: 8px;
  margin-top: 4px;
}

.options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.option-chip {
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.no-gutters {
  margin: 0 !important;
  padding: 0 !important;
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

  .options-container .v-chip {
    margin: 2px !important;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .option-chip {
    max-width: calc(50% - 8px);
  }
}

.icon:lang(en) {
  margin-inline-end: 8px;
}

.icon:lang(ar) {
  margin-inline-start: 8px;
}

.cat-logo {
  width: 70px;
}
</style>