<template dir="ltr">
  <div>
    <v-row no-gutters class="">
      <v-col cols="12" sm="3">
        <v-select
            v-model="selectedCountry"
            :items="countries"
            item-title="label"
            item-value="label"
            variant="outlined"
            density="compact"
            :menu-props="{ maxHeight: '400px' }"
            :rules="[v => !!v || t('phone_input.country_code_required')]"
            return-object
            class="country-select"
        >
          <template #selection="{ item }">
            <div class="country-selection-container">
              <img :src="(item.raw as Country).avatar.src" class="country-flag" alt=""/>
              <span class="country-code">{{ item.raw.label }}</span>
            </div>
          </template>
          <template #item="{ item, props: menuItemProps }">
            <v-list-item v-bind="menuItemProps">
              <template #prepend>
                <img :src="(item.raw as Country).avatar.src" class="country-flag me-1" alt=""/>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" sm="9" class="ps-sm-3">
        <v-text-field
            v-model="phoneNumber"
            variant="outlined"
            density="compact"
            :rules="phoneRules"
            :disabled="disabled"
            :required="props.required"
            type="tel"
            :placeholder="t('phone_input.enter_phone')"
            :label="t('phone_input.phone_label')"
            autocomplete="tel"
            class="hide-spin-buttons"
            dir="ltr"
            @update:modelValue="handleInput"
            @keydown="allowOnlyNumbers"
            @paste="handlePaste"
        />
      </v-col>
    </v-row>

    <input type="hidden" :name="name" :value="fullPhoneNumber"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, onMounted} from 'vue'
import {useI18n} from '#i18n'
import Countries from './CountriesComposable';

const {t} = useI18n()

interface Country {
  label: string
  country: string
  regex: RegExp
  avatar: { src: string }
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'phone'
  },
  required: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:model-value', 'validation'])

const countries = Countries
const selectedCountry = ref<Country>(countries[0])
const phoneNumber = ref('')
const errorMessages = ref<string[]>([])

const phoneRules = computed(() => [
  (v: string) => !!v || t('phone_input.phone_required'),
  (v: string) => selectedCountry.value.regex.test(v) || t('phone_input.invalid_phone')
])

const fullPhoneNumber = computed(() =>
    `${selectedCountry.value.label}${phoneNumber.value}`
)

const extractPhoneNumberWithoutCode = (input: string) => {
  for (const country of countries) {
    if (input.startsWith(country.label)) {
      return input.slice(country.label.length)
    }
  }
  return input
}

function parseInitialValue(value: string) {
  if (!value) return
  const sanitizedValue = extractPhoneNumberWithoutCode(value)
  const country = countries.find(c => value.startsWith(c.label));
  if (country) {
    selectedCountry.value = country
  }
  phoneNumber.value = sanitizedValue
}

function sanitizePhoneNumber(value: string) {
  const countryLabel = selectedCountry.value.label;
  for (let i = 0; i < countryLabel.length; ++i) {
    const prefixToRemove = countryLabel.slice(i);
    if (value.startsWith(prefixToRemove)) {
      value = value.slice(prefixToRemove.length);
      break;
    }
  }
  return value;
}

function handleInput(value: string) {
  value = sanitizePhoneNumber(value)
  phoneNumber.value = value
  emitUpdate()
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const clipboardData = e.clipboardData || (window as any).clipboardData;
  let pastedData = clipboardData.getData('Text');
  pastedData = sanitizePhoneNumber(pastedData);
  pastedData = pastedData.replace(/\D/g, '');
  
  const target = e.target as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  
  let newCursorPosition: number;
  if (selectionStart !== selectionEnd) {
    const before = phoneNumber.value.substring(0, selectionStart);
    const after = phoneNumber.value.substring(selectionEnd);
    phoneNumber.value = before + pastedData + after;
    newCursorPosition = selectionStart + pastedData.length;
  } else {
    const before = phoneNumber.value.substring(0, selectionStart);
    const after = phoneNumber.value.substring(selectionStart);
    phoneNumber.value = before + pastedData + after;
    newCursorPosition = selectionStart + pastedData.length;
  }
  
  emitUpdate();

  setTimeout(() => {
    target.setSelectionRange(newCursorPosition, newCursorPosition);
    target.focus();
  }, 0);
};

function emitUpdate() {
  emit('update:model-value', fullPhoneNumber.value)
  validateInput()
}

const allowOnlyNumbers = (e: KeyboardEvent) => {
  if (
      [
        'Backspace', 'Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
      ].includes(e.key) ||
      (e.ctrlKey)
  ) {    return
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

function validateInput() {
  const errors = phoneRules.value
      .map(rule => rule(phoneNumber.value))
      .filter(result => typeof result === 'string') as string[]

  errorMessages.value = errors
  emit('validation', errors.length === 0)
  return errors.length === 0
}

watch(selectedCountry, () => {
  phoneNumber.value = ''
  emitUpdate()
})

onMounted(() => {
  parseInitialValue(props.modelValue)
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

* {
  direction: ltr !important;
}

.country-flag {
  width: 24px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.hide-spin-buttons::-webkit-outer-spin-button,
.hide-spin-buttons::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.hide-spin-buttons {
  -moz-appearance: textfield;
}

.country-select {
  direction: ltr !important;
}

.country-select :deep(.v-field__append-inner) {
  padding-inline-start: 4px;
}

.country-selection-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  justify-content: start;
  direction: ltr !important;
  width: auto;
  padding-right: 0;
}

.country-code {
  white-space: nowrap;
}
</style>