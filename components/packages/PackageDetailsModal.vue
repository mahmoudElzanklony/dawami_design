<template>
  <v-dialog v-model="dialogModel" max-width="800" transition="fade-transition">
    <v-card v-if="package">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span>
          <i class="fa-solid fa-box-open me-2 primary-color"></i>
          {{ $t('packages.details_title') }}
        </span>
        <v-btn icon variant="text" @click="dialogModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
        <v-row class="px-4">
          <!-- Package Information -->
          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-package-variant</v-icon>
                {{ $t('packages.details.package_info') }}
              </v-card-title>
              <v-card-text>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-tag</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.name') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.name }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-text-box</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.description') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.description }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-cash</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.price') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.price }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account-group</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.max_users') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.max_users_number }}</v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- User Information -->
          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="subtitle-1 font-weight-bold">
                <v-icon class="me-2">mdi-account</v-icon>
                {{ $t('packages.details.creator_info') }}
              </v-card-title>
              <v-card-text>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account-circle</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.username') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.user?.username || '-' }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.phone') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ package.user?.phone || '-' }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('packages.details.created_at') }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(package.created_at) }}</v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      <v-progress-linear
          v-if="loading"
          indeterminate
      ></v-progress-linear>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialogModel = false">{{ $t('packages.details.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { formatDate } from '~/composables/FormatDateComposable';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  package: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>