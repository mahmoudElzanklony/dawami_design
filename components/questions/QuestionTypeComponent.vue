<template>
    <v-tabs v-model="question_type">
      <v-tab value="Select">
        <span><i class="fa-duotone fa-solid fa-list-ul"></i></span>
        <span class="mx-1">{{ t('questions.types.select') }}</span>
      </v-tab>
      <v-tab value="True/False">
        <span><i class="fa-duotone fa-thin fa-check"></i></span>
        <span class="mx-1">{{ t('questions.types.true_false') }}</span>
      </v-tab>
    </v-tabs>
  <v-tabs-window v-model="question_type">
    <v-window-item v-model="question_type" value="Select">
      <input type="hidden" name="type" value="select">
      <div class="options" v-if="info?.type == 'Select'">
        <options-question-component :info="info"></options-question-component>
      </div>
      <options-question-component :info="info" v-else></options-question-component>


    </v-window-item>
    <v-window-item v-model="question_type" value="True/False">
      <input type="hidden" name="type" value="True/False">
      <div class="radio-option">
        <label class="radio-block">
          <input type="radio" class="radio-btn" name="answer" value="1"
                 :checked="info?.type == 'True/False' && info?.answer == 1"> <span class="mx-2">{{$t('questions.types.true')}}</span>
        </label>
      </div>
      <div class="radio-option">
        <label class="radio-block">
          <input type="radio" class="radio-btn" name="answer" value="0"
                 :checked="info?.type == 'True/False' && info?.answer == 0"> <span class="mx-2">{{$t('questions.types.false')}}</span>
        </label>
      </div>
    </v-window-item>
  </v-tabs-window>



</template>

<script setup lang="ts">
import OptionsQuestionComponent from "~/components/questions/OptionsQuestionComponent.vue";
const { t } = useI18n();
let props = defineProps(['info']);
const question_type = defineModel<string>('question_type', {
  default: 'Select'
});

// Set the initial tab based on the question type when component mounts
onMounted(() => {
  if (props.info?.type === 'True/False' || props.info?.type === 'Select') {
    question_type.value = props.info.type;
  }
});


</script>

<style scoped>
.radio-block {
  display: block;
  margin-bottom: 10px;
}

.radio-option {
  padding: 5px 0;
}
</style>
