<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" class="min-h-screen d-flex flex-column justify-space-between">
    <div>
      <v-app-bar flat absolute="false" class="mb-12 smooth-elevation" height="100">
        <v-container>
          <div class="d-flex justify-center gap-6 py-3">
            <div class="pa-2">
              <v-img src="/images/logo-sm.png" width="80" />
            </div>
          </div>
        </v-container>
      </v-app-bar>

      <v-container>
        <v-sheet color="grey-lighten-4" rounded="lg" class="px-8 py-8 mb-12">
          <div class="text-h6 text-grey-darken-1">
            <h1 class="text-h4 font-weight-medium mb-4">
              {{ $t('privacy.title') }}
            </h1>
            <p class="mb-10">
              {{ $t('privacy.introduction') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.collected_info.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.collected_info.content') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.info_usage.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.info_usage.content') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.info_sharing.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.info_sharing.content') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.data_security.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.data_security.content') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.third_party.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.third_party.content') }}
            </p>

            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              {{ $t('privacy.policy_updates.title') }}
            </h2>
            <p class="mb-8">
              {{ $t('privacy.policy_updates.content') }}
            </p>
          </div>
        </v-sheet>
      </v-container>
    </div>

    <v-footer :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" class="py-8 text-caption bg-grey-lighten-4 px-2">
      <v-container>
        <div class="d-flex justify-space-between align-center w-100">
          <a class="text-decoration-none transition-duration-300 hover-text-primary" href="#">
            {{ $t('login.app_name') }}
          </a>
          <p>
            {{ $t('login.copyright', { year: new Date().getFullYear() }) }}
          </p>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports';

definePageMeta({
  layout: 'login',
})

const { t } = useI18n();
</script>

<style scoped>
.smooth-elevation {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
}

.transition-duration-300 {
  transition-duration: 300ms;
}
</style>