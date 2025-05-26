<template>
  <div class="pa-2" v-if="shouldShowInput(input)">
    <div class="position-relative">
      <QuestionTypeComponent v-if="input['type'] == 'options'" :info="info"></QuestionTypeComponent>
      <v-textarea
        v-else-if="input.type === 'textarea'"
        :label="input.label"
        :name="input.input_name"
        v-model="modelValue[input.input_name]"
        :required="input.required"
        variant="outlined"
        density="compact"
        :disabled="isDisabled(input)"
      ></v-textarea>
      <PlacesMapComponent
        v-else-if="input.type === 'map'"
        v-model="modelValue[input.input_name]"
        :disabled="isDisabled(input)"
      ></PlacesMapComponent>
      <geolocation-input
        v-else-if="input.type === 'geolocation'"
        :name="input.input_name"
        :label="input.label"
        :required="input.required"
        :icon="input.icon"
        v-model="modelValue[input.input_name]"
        :disabled="isDisabled(input)"
        :submit_as_array="input.submit_as_array"
      ></geolocation-input>
      <PlacesPolygonComponent
        v-else-if="input.type === 'polygon-map'"
        :input-name="input.input_name"
        v-model="modelValue[input.input_name]"
        :disabled="isDisabled(input)"
      ></PlacesPolygonComponent>
      <template v-else-if="input.type === 'question-selector'">
        <QuestionsSelectorComponent
          v-model="modelValue[input.input_name]"
          :fieldId="modelValue.field_id"
        ></QuestionsSelectorComponent>
      </template>
      <template v-else-if="input.type === 'phone'">
        <phone-input
          :name="input.input_name"
          :label="input.label"
          :required="input.required"
          density="compact"
          variant="outlined"
          v-model="modelValue[input.input_name]"
          :disabled="isDisabled(input)"
          :multiple="input.multiple"
          :loading="loadingStates[input.input_name]"
          :item-props="getItemProps(input)"
        ></phone-input>
      </template>
      <CheckPeriodAmountComponent
        v-else-if="input.type === 'check-period-amount'"
        :info="modelValue"
        :label="input.label"
        :name="input.input_name"
        :icon="input.icon"
        :required="input.required"
        :hint="input?.hint"
        :disabled="isDisabled(input)"
      />
      <v-text-field
        v-else-if="input.type !== 'select' && input.type !== 'file' && input.type !== 'radio'"
        :label="input.label"
        :name="input.input_name"
        :prepend-inner-icon="input.icon"
        :required="input.required"
        :type="input.type"
        :hint="input?.hint"
        persistent-hint
        v-model="modelValue[input.input_name]"
        :readonly="input.readonly"
        variant="outlined"
        density="compact"
        :disabled="isDisabled(input)"
      ></v-text-field>
      <template v-else-if="input.type === 'select'">
        <v-select
          :items="input.options"
          :name="input.multiple ? input.input_name + '[]' : input.input_name"
          :item-value="input.item_value"
          :item-title="(item) => getValueByPath(item, input.item_title)"
          :label="input.label"
          :required="input.required"
          density="compact"
          variant="outlined"
          v-model="modelValue[input.input_name]"
          :disabled="isDisabled(input)"
          :multiple="input.multiple"
          :chips="input.multiple"
          deletable-chips
          :clearable="input.multiple"
          :loading="loadingStates[input.input_name]"
          :item-props="getItemProps(input)"
          :hint="input?.hint"
          persistent-hint
        ></v-select>
      </template>
      <v-file-input
        v-else-if="input.type === 'file'"
        :label="input.label"
        :name="input.multiple ? input.input_name + '[]' : input.input_name"
        :prepend-inner-icon="input.icon"
        variant="outlined"
        :required="input.required && !modelValue?.id"
        :accept="input.accept"
        :multiple="input.multiple"
        density="compact"
        :disabled="isDisabled(input)"
      ></v-file-input>
      <v-radio-group
        v-else-if="input.type === 'radio'"
        v-model="modelValue[input.input_name]"
        :label="input.label"
        :inline="!!input.inline"
        :required="input.required"
        :disabled="isDisabled(input)"
        :name="input.input_name"
        density="comfortable"
      >
        <v-radio
          v-for="(option, index) in input.options"
          :key="index"
          :label="option[input.item_title]"
          :value="option[input.item_value]"
        ></v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionTypeComponent from "~/components/questions/QuestionTypeComponent.vue";
import QuestionsSelectorComponent from "~/components/exams/QuestionsSelectorComponent.vue";
import GeolocationInput from "~/components/global/GeolocationInput.vue";
import PlacesMapComponent from "~/components/places/PlacesMapComponent.vue";
import PlacesPolygonComponent from "~/components/places/PlacesPolygonComponent.vue";
import CheckPeriodAmountComponent from "~/components/bills/CheckPeriodAmountComponent.vue";
import PhoneInput from "~/components/global/PhoneInputComponent/PhoneInput.vue";
import getValueByPath from '~/composables/getValueByPathComposable';

const props = defineProps({
  input: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  shouldShowInput: {
    type: Function,
    required: true
  },
  isDisabled: {
    type: Function,
    required: true
  },
  loadingStates: {
    type: Object,
    required: true
  },
  getItemProps: {
    type: Function,
    required: true
  }
});
</script>
