<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card>
      <v-card-title class="headline primary-color white--text">
        <i class="fa-solid fa-users-viewfinder me-2"></i>
        {{ $t('users.groups_details.modal_title') }}
        <span v-if="user" class="ms-2">- {{ user.username }}</span>
      </v-card-title>
      <v-card-text class="pt-4">
        <div v-if="user && user.groups && user.groups.length">
          <v-list>
            <div v-for="(groupItem, index) in user.groups" :key="groupItem.id">
              <v-card flat class="mb-3 pa-3" outlined>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="text-subtitle-2 font-weight-medium primary--text">
                      {{ $t('users.groups_details.group_label') }}
                    </div>
                    <div class="text-body-1 mb-2">{{ groupItem.group.name }}</div>

                    <div class="text-subtitle-2 font-weight-medium primary--text">
                      {{ $t('users.groups_details.branch_label') }}
                    </div>
                    <div class="text-body-1">{{ groupItem.branch.name }}</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="text-subtitle-2 font-weight-medium primary--text">
                      {{ $t('users.groups_details.organization_label') }}
                    </div>
                    <div class="text-body-1 mb-2">{{ groupItem.branch.organization.name }}</div>

                    <div class="text-subtitle-2 font-weight-medium primary--text">
                      {{ $t('users.groups_details.info_label') }}
                    </div>
                    <div class="text-body-1">{{ groupItem.branch.info || '-' }}</div>
                  </v-col>
                </v-row>
              </v-card>
              <v-divider></v-divider>
            </div>
          </v-list>
        </div>
        <div v-else class="text-center pa-4">
          <v-icon large color="grey">mdi-account-group-outline</v-icon>
          <p class="mt-2 text-grey">{{ $t('users.groups_details.no_groups') }}</p>
        </div>
      </v-card-text>
      <v-card-actions class="pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          rounded
          elevation="0"
          @click="closeDialog"
        >
          {{ $t('users.groups_details.close_button') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const closeDialog = () => {
  dialogModel.value = false;
};
</script>
