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

        <!-- verification form -->
        <v-form v-if="requireVerification" @submit.prevent="verifyDevice" ref="verificationForm">
          <v-alert type="success" density="compact" closable class="mb-4">
            {{t('login.verification_sent')}}
          </v-alert>

          <v-text-field
          v-model="verificationCode"
          :label="t('login.verification_code')"
          variant="outlined"
          :rules="verificationCodeRules"
          density="compact"
          color="primary"
          class="mb-4 "
          required
          >
          </v-text-field>
          <v-btn
          type="submit"
          variant="elevated"
          block
          :loading="verificationLoading"
          class="mb-4 bg-primary-color text-white"
          >
            {{t('login.verify')}}
          </v-btn>
        </v-form>

        <!-- Login Form -->
        <v-form v-else @submit.prevent="handleLogin" ref="loginForm">
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
import {useTrustedDevicesStore} from "~/stores/TrustedDevicesStore";

definePageMeta({
  layout: "login",
  guest: true
})

const {t} = useI18n()
const store = useAuthStore()
const loginForm = ref()
const verificationForm = ref()
const submitError = ref('')
const phone = ref('')
const password = ref('')
const requireVerification = ref(false);
const trustedDevicesStore = useTrustedDevicesStore();
const verificationCode = ref('');
const verificationLoading = ref(false);
const userId = ref(null);
const passwordRules = [
  (v: string) => !!v || t('login.error.password_required')
]
const verificationCodeRules = [
  (v: string) => !!v || t('login.error.verification_code_required'),
  (v: string) => /^[\da-zA-Z\-_]{4,}$/.test(v) || t('login.error.verification_code_invalid')
]

const handleLogin = async () => {
  //if (!(await loginForm.value.validate()).valid) return
  console.log('test login')
  submitError.value = ''

  try {
    const response = await store.login(
        {
          phone: phone.value,
          password: password.value
        }
    );
    if(response?.require_verify_device){
      requireVerification.value = true;
      userId.value = response.user_id;
    }
  } catch (error: any) {
    submitError.value = error.status ?
        t('login.error.invalid_credentials') :
        t('login.error.general_error')
  }
}

const verifyDevice = async () => {
  if (!(await verificationForm.value.validate()).valid) return
  verificationLoading.value = true;
  const verificationData = new FormData();
  verificationData.append('user_id', userId.value);
  verificationData.append('verified_code', verificationCode.value);
  const response = await trustedDevicesStore.create_or_update(verificationData);
  if (response.status === 200) {
    await handleLogin();
  }
  verificationLoading.value = false;
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
