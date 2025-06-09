<template>
  <div class="chapters-input">
    <div class="d-flex justify-space-between align-center mb-3">
      <h3 class="text-subtitle-1 font-weight-medium">{{ label }}</h3>
      <v-btn 
        color="primary" 
        size="small" 
        variant="tonal" 
        prepend-icon="mdi-plus" 
        @click="addChapter"
      >
        {{ $t('assistants.inputs.add_chapter') }}
      </v-btn>
    </div>
    
    <v-alert v-if="chapters.length === 0" type="info" variant="tonal" class="my-3">
      {{ $t('assistants.inputs.no_chapters') }}
    </v-alert>
    
    <v-card variant="outlined" v-for="(chapter, index) in chapters" :key="index" class="mb-3">
      <v-card-text>
        <div class="d-flex align-center">
          <div class="chapter-number mr-3">
            <v-avatar size="32" color="primary" class="white--text">
              {{ index + 1 }}
            </v-avatar>
          </div>
          <v-text-field
            v-model="chapters[index].name"
            :label="$t('assistants.inputs.chapter_name')"
            :placeholder="$t('assistants.inputs.chapter_name_placeholder')"
            density="compact"
            variant="outlined"
            class="flex-grow-1"
            hide-details
            @update:model-value="updateChapters"
            :name="null"
          ></v-text-field>
          <!-- Only render hidden inputs for the required fields -->
          <input 
            type="hidden" 
            :name="`chapters[${index}][name]`" 
            :value="chapter.name" 
          />
          <input 
            v-if="chapter.id" 
            type="hidden" 
            :name="`chapters[${index}][id]`" 
            :value="chapter.id" 
          />
          <v-btn
            icon
            variant="text"
            color="error"
            class="ml-2"
            @click="removeChapter(index)"
            size="small"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from '#imports';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const chapters = ref(props.modelValue?.length ?
  props.modelValue.map(item => {
    if (typeof item === 'string') {
      return { name: item };
    } else {
      return {
        id: item.id, 
        name: typeof item.name === 'string' ? item.name : ''
      };
    }
  }) :
  []
);

// Watch for external changes to model value
watch(() => props.modelValue, (newValue) => {
  if (newValue !== chapters.value) {
    chapters.value = newValue?.length ?
      newValue.map(item => {
        if (typeof item === 'string') {
          return { name: item };
        } else {
          return {
            id: item.id, 
            name: typeof item.name === 'string' ? item.name : ''
          };
        }
      }) :
      [];
  }
}, { deep: true });

// Ensure the updateChapters function runs on component mount to initialize properly
onMounted(() => {
  updateChapters();
});

// Improved update function with more robust cleanup
const updateChapters = () => {
  // Update parent without passing unnecessary data
  const formattedChapters = chapters.value.map(chapter => {
    // Only include essential properties
    const result = {};
    if (chapter.id) {
      result.id = chapter.id;
    }
    result.name = chapter.name || '';
    return result;
  });
  
  emit('update:modelValue', formattedChapters);
};

// Add a new empty chapter
const addChapter = () => {
  chapters.value.push({ name: '' });
  updateChapters();
};

// Remove a chapter at the specified index
const removeChapter = (index: number) => {
  chapters.value.splice(index, 1);
  updateChapters();
};
</script>

<style scoped>
.chapters-input {
  margin-bottom: 16px;
}

.chapter-number {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* RTL support */
:lang(ar) {
  .chapter-number {
    margin-right: 0;
    margin-left: 12px;
  }

  .v-btn.ml-2 {
    margin-left: 0;
    margin-right: 8px;
  }
}
</style>