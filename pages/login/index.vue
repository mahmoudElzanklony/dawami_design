<template>
  <div class="bg-grey-lighten-4 h-100vh d-flex flex-column justify-center align-center p-20">
    <v-card class="w-full md:w-4/5 max-h-800 max-w-600 pa-4 pa-sm-8 pa-md-14 elevation-3">
      <div class="w-full max-w-500 ma-auto pa-8">
        <div class="text-center mb-6">
          <v-img src="/images/logo-sm.png" class="mx-auto mb-16" width="128"/>
        </div>

        <v-alert v-if="submitError" type="error" density="compact" class="mb-4">
          {{ submitError }}
        </v-alert>

        <!-- Login Form -->
        <v-form @submit.prevent="handleLogin" ref="loginForm">
          <!-- Phone Input Component -->
          <PhoneInput
              v-model="phone"
              class="mb-4"
              name="phone"
          />

          <!-- Password Input -->
          <v-text-field
              v-model="password"
              type="password"
              :label="t('login.password')"
              variant="outlined"
              density="compact"
              color="primary"
              :rules="passwordRules"
              prepend-inner-icon="mdi-lock"
              class="mb-4"
              required
          ></v-text-field>

          <!-- Submit Button -->
          <v-btn
              type="submit"
              color="primary"
              variant="elevated"
              block
              :loading="store.loading"
              class="mb-4 bg-primary-color"
          >
            {{ t('login.login_button') }}
          </v-btn>
        </v-form>
      </div>
    </v-card>

    <!-- Footer -->
    <footer dir="ltr"
            class="mt-4 text-caption text-medium-emphasis d-flex justify-space-between w-full md:w-4/5 max-w-600 px-2">
      <div class="d-flex gap-3">
        <a href="#" class="text-primary text-decoration-none">{{ t('login.app_name') }}</a>
      </div>
      <span>{{ t('login.copyright', { year: new Date().getFullYear() }) }}</span>
    </footer>

    <!-- Organization Selection Dialog -->
    <OrganizationSelectDialog
      v-model="store.showOrgSelector"
      :organizations="store.organizations"
      @select="handleOrgSelection"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onBeforeUnmount} from 'vue'
import {useI18n} from '#i18n'
import {useAuthStore} from "~/stores/Auth/AuthStore"
import PhoneInput from '~/components/global/PhoneInputComponent/PhoneInput.vue'
import OrganizationSelectDialog from '~/components/login/OrganizationSelectDialog.vue'

definePageMeta({
  layout: "login",
  guest: true
})

const {t} = useI18n()
const store = useAuthStore()
const loginForm = ref()
const submitError = ref('')
const phone = ref('')
const password = ref('')

const passwordRules = [
  (v: string) => !!v || t('login.error.password_required')
]

const handleLogin = async () => {
  //if (!(await loginForm.value.validate()).valid) return
  console.log('test login')
  submitError.value = ''

  try {
    await store.login(
        {
          phone: phone.value,
          password: password.value
        }
    )
  } catch (error: any) {
    submitError.value = error.status ?
        t('login.error.invalid_credentials') :
        t('login.error.general_error')
  }
}

const handleOrgSelection = (organizationId: number) => {
  store.setOrganizationId(organizationId);
}

// Ensure dialog is closed when component is unmounted
onBeforeUnmount(() => {
  store.showOrgSelector = false;
})
</script>

<style scoped>
.h-100vh {
  height: 100vh;
  min-height: 700px;
}

.max-h-800 {
  max-height: 800px;
}

.max-w-600 {
  max-width: 600px;
}
</style>
