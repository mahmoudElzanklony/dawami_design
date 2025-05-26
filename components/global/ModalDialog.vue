<template>
  <v-card class="pa-3" id="modal_form">
    <v-card-title>
      <span><i :class="'primary-color '+dialog_icon"></i></span>
      <span class="mx-2">{{ dialog_title }}</span>
    </v-card-title>
    <form @submit.prevent="save" method="post" enctype="multipart/form-data">
      <input type="hidden" name="id" v-if="info?.id" :value="info?.id">
      <v-row class="ma-0 pa-0">
        <v-col
            v-for="(i, key) in inputs"
            :key="key"
            :cols="props.is_exam_modal ? (i.type === 'question-selector' ? 8 : 4) : 12"
            class="ma-0 pa-0"
        >
          <FormInputRenderer
            :input="i"
            :model-value="info"
            :should-show-input="shouldShowInput"
            :is-disabled="isDisabled"
            :loading-states="loadingStates"
            :get-item-props="getItemProps"
          />
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :text="t('global.actions.cancel')" class="close_form" purpose="close" variant="plain" @click="dialog_switch = false"></v-btn>
        <v-btn
            :disabled="submit_form"
            type="submit"
            class="primary-color"
            :text="t('global.actions.submit')"
            variant="tonal"
        ></v-btn>
      </v-card-actions>
    </form>
    <v-progress-linear v-if="progress"
                       color="#699190"
                       indeterminate
    ></v-progress-linear>
  </v-card>
</template>

<script setup lang="ts">
import {ref, computed, watch, nextTick} from 'vue';
import FormInputRenderer from "~/components/global/FormInputRenderer.vue";
import getValueByPath from '~/composables/getValueByPathComposable';
import {useI18n} from '#imports'
const {t} = useI18n()

let props = defineProps([
  'dialog_title',
  'dialog_icon',
  'inputs',
  'store',
  'info',
  'disable_put_at_update',
  'continue_url',
  'is_exam_modal',
]);

const emits = defineEmits(['submission-complete']);
const dialog_switch = defineModel<boolean>();
let selected = ref(null)
const progress = ref(false);
let submit_form = ref(false);
const loadingStates = ref<Record<string, boolean>>({});

function getItemProps(select_obj) {
  return (item) => {
    return {
      disabled: select_obj?.disable_option_in_update_if_option_equal_current == true && item?.id == props?.info?.id
    };
  };
}

const shouldShowInput = computed(() => (input) => {
  if (input?.FormExists === false) return false
  const visibility = input?.visibility || {}
  const isUpdate = !!props.info?.id
  if (isUpdate && visibility.update === false) {
    return false;
  }
  if (!isUpdate && visibility.create === false) return false
  if (input?.conditional) {
    const dependentValue = props.info?.[input?.conditional?.dependsOn]
    return (dependentValue === input?.conditional?.value || input?.conditional?.value === '*')
  }
  return true
})

function isDisabled(input) {
  const hasEmptyDependency = input.dependency?.disabledWhenEmpty &&
      !props.info?.[input.dependency.field];

  return hasEmptyDependency || loadingStates.value[input.input_name];
}


const dependencyValues = computed(() => {
  const values: Record<string, any> = {};
  for (const input of props.inputs) {
    if (input?.dependency && input.dependency.updateUrl) {
      values[input.dependency.field] = props.info[input.dependency.field];
    }
  }
  return values;
});

watch(
    dependencyValues,
    async (newDeps, oldDeps) => {
      const changedDeps = Object.keys(newDeps).filter(key => newDeps[key] !== oldDeps?.[key]);

      if (changedDeps.length > 0) {
        await nextTick();

        const promises = props.inputs.map(async (input) => {
          if (input?.dependency?.updateUrl && changedDeps.includes(input.dependency.field)) {
            loadingStates.value[input.input_name] = true;
            try {
              await handleInputsApi([input], props.info);
            } finally {
              loadingStates.value[input.input_name] = false;
            }
          }
        });

        await Promise.all(promises);
      }
    },
    {deep: true}
);

// Track fields with updateValue dependencies
const updateValueDependencies = computed(() => {
  return props.inputs
      .filter(input => input.dependency?.updateValue)
      .map(input => ({
        target: input.input_name,
        source: input.dependency.field,
        valuePath: input.dependency.valuePath || input.input_name
      }));
});

watch(
    () => ({...props.info}),
    (newInfo) => {
      for (const dep of updateValueDependencies.value) {
        const sourceValue = newInfo[dep.source];
        const sourceField = props.inputs.find(i => i.input_name === dep.source);

        if (sourceField?.type === 'select' && sourceField.options) {
          const selectedOptions = Array.isArray(sourceValue)
              ? sourceValue.map(val =>
                  sourceField.options.find(opt =>
                      opt[sourceField.item_value] === val
                  )
              ).filter(Boolean)
              : [sourceField.options.find(opt =>
                  opt[sourceField.item_value] === sourceValue
              )].filter(Boolean);
          const values = selectedOptions.map(opt => opt?.[dep.valuePath] || 0);
          props.info[dep.target] = values.join(' , ');

        }
      }
    },
    {deep: true}
);

async function save(event) {
  progress.value = true;
  submit_form.value = true;
  try {
    const data = new FormData(event.target);
    for (const key in props.info) {
      if (Array.isArray(props.info[key])) {
        props.info[key].forEach((value, index) => {
          data.append(`${key}[${index}]`, value);
        });
        data.delete(`${key}[]`);
      }
    }

    const result = await props.store.create_or_update(
        data,
        props.continue_url ?? '',
        props.disable_put_at_update ?? true
    );

    // Emit the submission-complete event with the response data
    emits('submission-complete', result);

    if (result && result.status===200) {
      dialog_switch.value = false;
    }
  } finally {
    progress.value = false;
    submit_form.value = false;
  }
}
</script>

<style scoped>

</style>
