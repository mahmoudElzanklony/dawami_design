<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
          v-bind="props"
          class="language-switch-btn"
          rounded
          variant="outlined"
          color="primary"
          prepend-icon="mdi-translate"
      >
        {{ currentLocale.name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
      >
        <v-list-item-title>{{ locale.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {useLocale} from 'vuetify'
import {useHead,useI18n} from '#imports'

const {current, t, n} = useLocale()
const {locale: nuxtLocale, setLocale} = useI18n()

const availableLocales = [
  {code: 'en', name: 'English'},
  {code: 'ar', name: 'العربية'},
]

const currentLocale = computed(() =>
    availableLocales.find(locale => locale.code === current.value) || availableLocales[0]
)

useHead({
  htmlAttrs: {
    lang: currentLocale.value.code,
  }
})

async function switchLanguage(localeCode: string) {
  current.value = localeCode
  await setLocale(localeCode)
  document.documentElement.lang = localeCode
  document.documentElement.dir = localeCode === 'ar' ? 'rtl' : 'ltr'
  window.location.reload();
}

onMounted(() => {
  document.documentElement.lang = current.value
  document.documentElement.dir = current.value === 'ar' ? 'rtl' : 'ltr'
})
</script>

<style scoped>
.language-switch-btn {
  min-width: 110px;
}
</style>
