import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import { pl, zhHans, en as vuetifyEn, ar as vuetifyAr } from 'vuetify/locale';

const en = { ...vuetifyEn };
const ar = { ...vuetifyAr };

export default defineNuxtPlugin((nuxtApp) => {

  const initialLocale = nuxtApp.$i18n?.locale || 'ar'

  const vuetify = createVuetify({
    directives,
    theme: {
      defaultTheme: 'light',
    },
    locale: {
      locale: initialLocale,
      fallback: 'en',
      messages: { pl, zhHans, en, ar },
      rtl: { ar: true },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
