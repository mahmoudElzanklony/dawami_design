<template>
  <div class="d-flex align-center">
    <v-text-field
      :label="t('bills.inputs.calculated_amount')"
      :name="'checked_amount'"
      :prepend-inner-icon="icon"
      :required="required"
      type="number"
      :hint="hint"
      persistent-hint
      v-model="info[name]"
      readonly
      variant="outlined"
      density="compact"
      :disabled="disabled"
      class="flex-grow-1"
    ></v-text-field>
    <v-btn
      color="primary"
      class=" ms-2 bg-primary-color text-white mb-5"
      @click="checkPeriodAmount"
      :loading="loading"
      :disabled="loading || !canCheck"
      min-width="80"
      density="compact"
      variant="flat"
      height="40px"
      style="margin-top: 0; margin-bottom: 0;"
    >
      {{ t('bills.check_button') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useNuxtApp } from '#app';
import { useI18n } from '#i18n';

const { t } = useI18n();

const props = defineProps({
  info: {
    type: Object,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ""
  },
  hint: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: "calculated_amount"
  }
});

const loading = ref(false);

const canCheck = computed(() => {
  const hasDoctor = !!props.info?.doctor_id;
  const hasStartDate = !!props.info?.start_date;
  const hasEndDate = !!props.info?.end_date;

  return hasDoctor && hasStartDate && hasEndDate;
});

async function checkPeriodAmount() {
  if (!canCheck.value) return;

  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post('/bills-data/check-period', {
      doctor_id: props.info.doctor_id,
      start_date: props.info.start_date,
      end_date: props.info.end_date
    });

    props.info[props.name] = response.data.money;
  } catch (error) {
    console.error('Error checking period amount:', error);
  } finally {
    loading.value = false;
  }
}
</script>
