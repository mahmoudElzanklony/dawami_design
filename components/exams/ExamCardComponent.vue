<template>
  <v-card class="mx-auto pa-3 exam-card">
    <v-row align="center">
      <v-col cols="auto">
        <span><i class="primary-color big-font fa-duotone fa-solid fa-clipboard-check"></i></span>
      </v-col>

      <v-col>
        <v-row class="align-center justify-space-between">
          <v-card-title class="text-h6 mb-2 normal-font">{{ info?.name }}</v-card-title>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="fa-duotone fa-solid fa-ellipsis-vertical" v-bind="props" variant="plain"></v-btn>
            </template>
            <EditOrDeleteActionsComponent
                @edit_item="editItem"
                @delete_item="deleteItemComposable(props.store, info.id)"
                :has_action_delete="has_action_delete"
                :has_action_edit="has_action_edit"
                :item_info="info"/>
          </v-menu>
        </v-row>

        <v-row class="ma-0 align-center">
          <v-col class="pa-0">
            <div class="d-flex align-center gap-2">
              <span class="icon primary-color"><i class="fa-duotone fa-solid fa-book"></i></span>
              <span>{{ info?.field?.name }}</span>
            </div>
          </v-col>
        </v-row>

        <v-row class="ma-0 mt-2">
          <v-col cols="6" class="pa-0 d-flex align-center">
            <span class="icon primary-color"><i class="fa-duotone fa-solid fa-clock"></i></span>
            <span>{{ info?.time_in_minutes }} {{ t('exam.card.minutes') }}</span>
          </v-col>
          <v-col cols="6" class="pa-0 d-flex align-center">
            <span class="icon primary-color"><i class="fa-duotone fa-solid fa-question"></i></span>
            <span>{{ info?.total_questions }} {{ t('exam.card.questions') }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 mt-2">
          <v-col cols="6" class="pa-0 d-flex align-center">
            <span class="icon primary-color"><i class="fa-duotone fa-solid fa-calendar"></i></span>
            <span>{{ formatDate(info?.created_at) }}</span>
          </v-col>
          <v-col cols="6" class="pa-0 d-flex align-center">
            <v-chip color="success" size="small" v-if="info?.is_active">{{ t('exam.card.active') }}</v-chip>
            <v-chip color="error" size="small" v-else>{{ t('exam.card.inactive') }}</v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup lang="ts">
import { formatDate } from '~/composables/FormatDateComposable';
import { deleteItemComposable } from '~/composables/DeleteItemComposable';
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";
import {useI18n} from '#imports'
const {t} = useI18n();

interface ExamCardProps {
  has_action_edit: boolean;
  has_action_delete: boolean;
  info: any;
  store:any
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

.icon {
  margin-inline-end: 8px;
}
</style>