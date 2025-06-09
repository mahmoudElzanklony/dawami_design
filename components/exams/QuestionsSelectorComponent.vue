<template>
  <div class="questions-selector">
    <h3 class="mb-3">{{ $t('questions_selector.title') }}</h3>

    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="searchQuery"
            :label="$t('questions_selector.search_question')"
            prepend-inner-icon="mdi-magnify"
            clearable
            outlined
            dense
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <div class="questions-panel">
          <h4 class="mb-4">{{ $t('questions_selector.available_questions') }}</h4>
          <p v-if="!fieldId" class="text-caption text-grey">{{ $t('questions_selector.select_subject_first') }}</p>

          <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4"></v-progress-linear>

          <draggable
              v-else-if="fieldId"
              v-model="availableQuestionsList"
              class="questions-list two-column-list"
              ghost-class="ghost"
              group="questions"
              :item-key="(item) => item.id.toString()"
              @change="handleAvailableQuestionsChange"
          >
            <template #item="{element}">
              <v-list-item class="question-item mb-2 draggable-item two-column-item">
                <div class="w-100">
                  <div v-html="element.question"></div>

                  <div class="info-container mt-1">
                    <v-chip size="x-small" color="info" class="mr-1">
                      {{ getQuestionTypeName(element.type) }}
                    </v-chip>

                    <template v-if="element.type === 'True/False'">
                      <v-chip size="x-small" :color="getTrueFalseColor(element.answer)" class="mr-1">
                        {{ getTrueFalseText(element.answer) }}
                      </v-chip>
                    </template>
                    <template v-else-if="element.type === 'Select' && element.options && element.options.length">
                      <div class="correct-option">
                        <span class="text-caption font-italic">{{ getCorrectOptionText(element.options) }}</span>
                      </div>
                    </template>
                  </div>
                </div>
                <template v-slot:append>
                  <v-icon color="primary" size="small">mdi-drag-horizontal-variant</v-icon>
                </template>
              </v-list-item>
            </template>
          </draggable>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="questions-panel">
          <h4 class="mb-4">{{ $t('questions_selector.selected_questions') }} ({{ selectedQuestions.length }})</h4>
          <draggable
              v-model="selectedQuestions"
              class="questions-list two-column-list"
              ghost-class="ghost"
              group="questions"
              :item-key="(item) => item.id.toString()"
              @change="handleSelectedQuestionsChange"
          >
            <template #item="{element, index}">
              <v-list-item class="question-item mb-2 draggable-item two-column-item">
                <div class="w-100">
                  <div class="d-flex align-center">
                    <v-chip size="small" color="primary" class="me-2 position-chip">
                      {{ index + 1 }}
                    </v-chip>
                    <div v-html="element.question"></div>
                  </div>

                  <div class="info-container mt-1">
                    <v-chip size="x-small" color="info" class="mr-1">
                      {{ getQuestionTypeName(element.type) }}
                    </v-chip>

                    <template v-if="element.type === 'True/False'">
                      <v-chip size="x-small" :color="getTrueFalseColor(element.answer)" class="mr-1">
                        {{ getTrueFalseText(element.answer) }}
                      </v-chip>
                    </template>
                    <template v-else-if="element.type === 'Select' && element.options && element.options.length">
                      <div class="correct-option">
                        <span class="text-caption font-italic">{{ getCorrectOptionText(element.options) }}</span>
                      </div>
                    </template>
                  </div>
                </div>
                <template v-slot:append>
                  <v-icon
                      color="error"
                      size="small"
                      class="me-2"
                      @click.stop="deleteQuestion(element)"
                      title="Remove question"
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon color="primary" size="small">mdi-drag-horizontal-variant</v-icon>
                </template>
              </v-list-item>
            </template>
          </draggable>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuestionStore } from '~/stores/QuestionsStore';
import draggable from 'vuedraggable';
import { useI18n } from '#imports';

const { t } = useI18n();
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  fieldId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);
const questionStore = useQuestionStore();
const searchQuery = ref('');
const isLoading = ref(false);

const allQuestions = ref<any[]>([]);
const selectedQuestions = ref<any[]>([]);
const availableQuestionsList = ref<any[]>([]);
const isInternalUpdate = ref(false);


function getTrueFalseText(answer: string | number): string {
  return answer === "1" || answer === 1 ? t('questions_selector.true') : t('questions_selector.false');
}

function getTrueFalseColor(answer: string | number): string {
  // Return green for true answers and red for false answers
  return answer === "1" || answer === 1 ? "success" : "error";
}

function getCorrectOptionText(options: any[]): string {
  const correctOption = options.find(option => option.is_correct === 1 || option.is_correct === "1");
  return correctOption ? correctOption.option : t('questions_selector.not_specified');
}


watch(() => props.fieldId, async (newVal, oldVal) => {
  if (newVal !== oldVal && oldVal !== undefined) {
    selectedQuestions.value = [];
    emit('update:modelValue', []);
  }

  if (newVal) {
    await fetchQuestions();
  } else {
    allQuestions.value = [];
    selectedQuestions.value = [];
    availableQuestionsList.value = [];
    emit('update:modelValue', []);
  }
}, { immediate: true });


watch(() => props.modelValue, (newVal) => {

  if (isInternalUpdate.value) return;


  if (newVal && newVal.length && typeof newVal[0] !== 'object') {
    const questionObjects = newVal.map(id => {
      const question = allQuestions.value.find(q => q.id === id) || { id };
      return question;
    });
    selectedQuestions.value = questionObjects;
  } else if (Array.isArray(newVal)) {
    selectedQuestions.value = [...newVal];
  } else {
    selectedQuestions.value = [];
  }

  updateAvailableQuestions();
}, { immediate: true });

watch(searchQuery, () => {
  updateAvailableQuestions();
});

function updateAvailableQuestions() {

  const availableQuestions = allQuestions.value.filter(
    question => !selectedQuestions.value.some(q => q.id === question.id)
  );

  if (!searchQuery.value) {
    availableQuestionsList.value = availableQuestions;
  } else {
    availableQuestionsList.value = availableQuestions.filter(question =>
      question.question.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
}

function handleAvailableQuestionsChange(event: any) {
  if (event.removed) {
    updateSelectedQuestions();
  }
  updateAvailableQuestions();
}


function updateSelectedQuestions() {
  isInternalUpdate.value = true;
  emit('update:modelValue', selectedQuestions.value.map(q => q.id));
  setTimeout(() => {
    isInternalUpdate.value = false;
  }, 0);
}

async function fetchQuestions() {
  if (!props.fieldId) return;

  try {
    isLoading.value = true;
    await questionStore.get_all_data(`?field_id=${props.fieldId}&limit=999999`);
    allQuestions.value = questionStore.data.data;

    if (props.modelValue.length) {
      selectedQuestions.value = props.modelValue.map(id => {
        const question = allQuestions.value.find(q => q.id === id) || { id };
        return question;
      });
    }
    updateAvailableQuestions();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
  } finally {
    isLoading.value = false;
  }
}

function getQuestionTypeName(type: string | number): string {
  const questionTypes: {[key: string]: string} = {
    'Select': t('questions_selector.multiple_choice'),
    'True/False': t('questions_selector.true_false'),
  };

  return questionTypes[type] || t('questions_selector.question');
}

function handleSelectedQuestionsChange(event: any) {
  if (event.added || event.removed) {
    updateSelectedQuestions();
  }
  updateAvailableQuestions();
}

// Add the deleteQuestion function
function deleteQuestion(question: any) {
  selectedQuestions.value = selectedQuestions.value.filter(q => q.id !== question.id);
  updateSelectedQuestions();
  updateAvailableQuestions();
}

onMounted(async () => {
  if (props.fieldId) {
    await fetchQuestions();
  }
});
</script>

<style scoped>
.questions-selector {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.questions-panel {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  min-height: 670px;
  display: flex;
  flex-direction: column;
}

.questions-list {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 300px;
}

.question-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
}

.question-item:hover {
  background-color: #f5f5f5;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.cursor-move {
  cursor: move;
}

.info-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.answer-info {
  padding-right: 4px;
}

.correct-option {
  font-size: 0.8rem;
  padding: 2px 4px;
  background-color: rgba(76, 175, 76, 0.1);
  border-radius: 4px;
  display: inline-block;
}

.draggable-item {
  cursor: grab;
}

.draggable-item:active {
  cursor: grabbing;
}

.w-100 {
  width: 100%;
}

/* Position chip for question numbers */
.position-chip {
  min-width: 30px;
  justify-content: center;
}

/* Two-column layout for question items */
.two-column-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start; /* Keep items at the top */
  overflow-y: auto;
  padding: 4px;
}

.two-column-item {
  width: calc(50% - 6px);
  margin-bottom: 0;
  flex-grow: 0;
}

@media (max-width: 900px) {
  .two-column-item {
    width: 100%;
  }
  .two-column-list {
    gap: 8px;
  }
}
</style>