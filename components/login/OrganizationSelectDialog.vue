<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title class="text-center py-4">
        {{ t('organization.select_title') }}
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="org in organizations"
            :key="org.id"
            @click="selectOrganization(org.organization_id)"
            class="mb-2"
          >
            <v-list-item-title>
              <v-btn
                block
                variant="outlined"
                color="primary"
                class="text-start"
              >
                {{ getOrgName(org) }}
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useI18n } from "#i18n";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  organizations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'select']);
const { t } = useI18n();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Function to get organization name - adapt this depending on your data structure
const getOrgName = (org: any) => {
  // If organization name is available in your data structure, use it instead
  return org.name || `Organization #${org.organization_id}`;
};

const selectOrganization = (organizationId: number) => {
  emit('select', organizationId);
};
</script>
