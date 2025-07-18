<template>
  <v-card class="mx-auto pa-3 pa-sm-4 exam-card h-100 d-flex flex-column">
    <v-row align="center" class="flex-grow-0">
      <v-col cols="auto" class="pe-2 pe-sm-3">
        <span><i class="primary-color big-font fa-duotone fa-solid fa-clipboard-check"></i></span>
      </v-col>

      <v-col class="d-flex flex-column flex-grow-1">
        <v-row class="align-center justify-space-between flex-nowrap">
          <v-col class="pa-0 text-truncate">
            <v-card-title class="text-h6 text-sm-h5 mb-2 normal-font text-truncate">{{ info?.name }}</v-card-title>
          </v-col>

          <v-col cols="auto" class="pa-0 ms-2">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="plain" density="comfortable">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <EditOrDeleteActionsComponent
                  @edit_item="editItem"
                  @delete_item="deleteItemComposable(props.store, info.id)"
                  :has_action_delete="has_action_delete"
                  :has_action_edit="has_action_edit"
                  :item_info="info"/>
            </v-menu>
          </v-col>
        </v-row>

        <v-row class="ma-0 align-center mb-2">
          <v-col class="pa-0">
            <div class="d-flex align-center gap-2 text-truncate">
              <span class="primary-color me-2 flex-shrink-0"><i class="fa-duotone fa-solid fa-book"></i></span>
              <span class="text-truncate">{{ info?.field?.name }}</span>
            </div>
          </v-col>
        </v-row>

        <div class="flex-grow-1 d-flex flex-column">
          <v-row class="ma-0 mt-2">
            <v-col cols="12" sm="6" class="pa-0 d-flex align-center mb-2 mb-sm-0">
              <span class="primary-color me-2 flex-shrink-0"><i class="fa-duotone fa-solid fa-clock"></i></span>
              <span class="text-body-2">{{ info?.time_in_minutes }} {{ t('exam.card.minutes') }}</span>
            </v-col>
            <v-col cols="12" sm="6" class="pa-0 d-flex align-center">
              <span class="primary-color me-2 flex-shrink-0"><i class="fa-duotone fa-solid fa-question"></i></span>
              <span class="text-body-2">{{ info?.total_questions }} {{ t('exam.card.questions') }}</span>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </div>

        <v-row class="ma-0 mt-auto pt-2 align-center">
          <v-col cols="12" sm="6" class="pa-0 d-flex align-center mb-2 mb-sm-0">
            <span class="primary-color me-2 flex-shrink-0"><i class="fa-duotone fa-solid fa-calendar"></i></span>
            <span class="text-caption text-sm-body-2">{{ formatDate(info?.created_at) }}</span>
          </v-col>
          <v-col cols="12" sm="6" class="pa-0 d-flex align-center justify-start justify-sm-end">
            <v-chip :color="examStatus.color" size="small" class="text-caption">{{ examStatus.text }}</v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '~/composables/FormatDateComposable';
import { deleteItemComposable } from '~/composables/DeleteItemComposable';
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import { useI18n } from '#imports'
const { t } = useI18n();

interface ExamCardProps {
  has_action_edit: boolean;
  has_action_delete: boolean;
  info: any;
  store: any
}

const props = defineProps<ExamCardProps>();
const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const config = useRuntimeConfig();

const editItem = (obj: any): void => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    dialog_switch.value = true;
  }
};

// Calculate exam status based on start date
const examStatus = computed(() => {
  if (!props.info?.start_at) {
    return { text: t('exam.card.status.no_date'), color: 'warning' };
  }

  const now = new Date();
  const startDate = new Date(props.info.start_at);
  
  // Calculate exam end time (start time + duration + allowed entry time)
  const totalMinutes = (props.info.time_in_minutes || 0) + (props.info.allowed_time || 0);
  const endDate = new Date(startDate.getTime() + totalMinutes * 60000);
  
  // Check if exam is finished
  if (now > endDate) {
    return { text: t('exam.card.status.finished'), color: 'error' };
  }
  
  // Check if exam is in progress
  if (now >= startDate && now <= endDate) {
    return { text: t('exam.card.status.in_progress'), color: 'success' };
  }
  
  // Calculate days until exam starts
  const diffTime = startDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Check if exam starts today
  if (diffDays === 0) {
    // Calculate hours until exam starts
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      // Calculate minutes until exam starts
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return { 
        text: t('exam.card.status.starts_in_minutes', { minutes: diffMinutes }), 
        color: 'warning' 
      };
    }
    return { 
      text: t('exam.card.status.starts_today', { hours: diffHours }), 
      color: 'warning' 
    };
  }
  
  // Check if exam starts tomorrow
  if (diffDays === 1) {
    return { text: t('exam.card.status.starts_tomorrow'), color: 'info' };
  }
  
  // Exam starts in the future
  return { 
    text: t('exam.card.status.starts_in_days', { days: diffDays }), 
    color: 'info' 
  };
});
</script>

<style lang="scss" scoped>
.exam-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-right: 4px solid var(--v-primary-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
}

.big-font {
  font-size: 1.75rem;
}

@media (max-width: 600px) {
  .big-font {
    font-size: 1.5rem;
  }
}

/* RTL support */
:lang(ar) .exam-card {
  border-right: none;
  border-left: 4px solid var(--v-primary-base);
}
</style>