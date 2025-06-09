<template>
    <client-only>
      <v-app-bar density="compact" v-if="$vuetify.display.mobile">
        <v-app-bar-nav-icon @click="drawer = !drawer">
          <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-app-bar-nav-icon>
        <img src="/images/logo-sm.png" alt="" width="40" class="ms-2">
        <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        :location="drawerLocation"
        :permanent="$vuetify.display.mdAndUp"
        :temporary="$vuetify.display.mobile"
        width="250"
        mobile-breakpoint="sm"
        class="d-flex flex-column drawer bg-gray-50-color pa-4"
    >
      <div class="d-flex justify-center align-center mb-4"><img src="/images/logo-sm.png" alt="" width="80">
      </div>

      <!-- Add language switcher at the top of the sidebar -->
      <div class="d-flex justify-center mb-4">
        <LanguageSwitcherComponent />
      </div>

      <v-list class="!p-0 flex-grow-1  " style="overflow-y: auto">
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            :to="localePath(item.to)"
            active-class="active-menu-item"
            base-color="primary"
            class="d-flex align-center"
        >
          <v-list-item-title class="mx-3 font-weight-medium text-gray ">{{ t(`navigation.${item.key}`) }}</v-list-item-title>
          <template v-slot:prepend>
            <i :class="'primary-color ' + item?.icon"></i>
          </template>
        </v-list-item>
      </v-list>

      <div class="border-t" >
        <v-card class="p-0 sm:p-4 rounded-b flex gap-4 items-center text-gray-600 py-3 px-2 bg-white border mt-3" >
          <div class="w-full">
            <template v-if="user">
              <p class="hidden md:block mb-3 text-xs font-medium">
                {{ t('account.currentAccount') }}
                {{ getUserTypeDisplay(user?.type) }}
              </p>
              <p class="md:block mb-3 text-lg font-bold p-1 bg-primary-50 rounded-lg px-3">
                {{ t('account.welcome') }} <span class="primary-color">{{ user?.username }}</span>
              </p>
            </template>
            <div class="d-flex align-center mb-2">
              <v-btn
                block
                @click="authStore.logout()"
                class="bg-primary-color text-white"
                :loading="authStore.loading"
              >
                <span class="white md:block">{{ t('account.logout') }}</span>
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>

    </v-navigation-drawer>
    </client-only>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useAuthStore} from '~/stores/Auth/AuthStore';
import { useDisplay } from 'vuetify';
import {useI18n, useLocalePath} from '#imports'
const {t, locale} = useI18n()
import LanguageSwitcherComponent from '~/components/global/LanguageSwitcherComponent.vue';

const localePath = useLocalePath()
const { smAndDown } = useDisplay();

const drawer = ref(true);
const authStore = useAuthStore();

const drawerLocation = computed(() => locale.value === 'en' ? 'left' : 'right');

// Function to get the translated user type display
const getUserTypeDisplay = (type: string) => {
  if (type === 'superadmin') return t('users.types.superadmin');
  if (type === 'admin') return t('users.types.admin');
  if (type === 'doctor') return t('users.types.doctor');
  if (type === 'employee') return t('users.types.employee');
  if (type === 'organization') return t('users.types.organization');
  if (type === 'client') return t('users.types.client');
  return type;
}

const items = [
  // {title: 'Home', to: '/', icon: 'fa-duotone fa-solid fa-house'},
  {key: 'users', to: '/users', icon: 'fa-solid fa-users'},
  {key: 'organizations', to: '/organizations', icon: 'fa-solid fa-solid fa-university'},
  {key: 'branches', to: '/branches', icon: 'fa-solid fa-solid fa-tags'},
  {key: 'groups', to: '/groups', icon: 'fa-solid fa-people-group'},
  {key: 'fields', to: '/fields', icon: 'fa-solid fa-book-open'},
  {key: 'files', to: '/files', icon: 'fa-solid fa-play'},
  {key: 'subscriptions', to: '/subscriptions', icon: 'fa-solid fa-circle-check'},
  {key: 'bills', to: '/bills', icon: 'fa-solid fa-dollar-sign'},
  {key: 'assistants', to: '/assistants', icon: 'fa-solid fa-solid fa-user-robot'},
  {key: 'questions', to: '/questions', icon: 'fa-solid fa-solid fa-seal-question'},
  {key: 'exams', to: '/exams', icon: 'fa-solid fa-solid fa-files'},
  {key: 'places', to: '/places', icon: 'fa-solid fa-location-dot'},
  {key: 'packages', to: '/packages', icon: 'fa-solid fa-clipboard-list'},
  {key: 'lessons', to: '/working-days', icon: 'fa-solid fa-person-chalkboard'},
  {key: 'attendance', to: '/attendance', icon: 'fa-solid fa-clipboard-user'},
];
const user = authStore?.user;

onMounted(() => {
  drawer.value = !smAndDown.value
})
</script>

<style lang="scss">
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.active-menu-item {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.2) !important;
}

.active-menu-item .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600 !important;
}

.active-menu-item i {
  color: $primary-color;
}

.v-app-bar {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.v-navigation-drawer {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>