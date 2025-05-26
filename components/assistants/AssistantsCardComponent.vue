<template>
  <v-card 
    class="assistant-card mx-auto" 
    elevation="2"
    :class="{ 'on-hover': hover }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-row align="center" no-gutters>
      <v-col cols="auto" class="icon-container">
        <v-avatar color="primary" class="robot-avatar">
          <i class="fa-duotone fa-solid fa-user-robot"></i>
        </v-avatar>
      </v-col>

      <v-col>
        <v-row class="align-center justify-space-between">
          <v-card-title class="title-text pb-1">{{ info?.name }}</v-card-title>

          <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-btn 
                icon="fa-duotone fa-solid fa-ellipsis-vertical" 
                v-bind="props" 
                variant="text"
                density="comfortable"
                class="menu-button"
              ></v-btn>
            </template>
            <EditOrDeleteActionsComponent
                @edit_item="editItem"
                @delete_item="deleteItemComposable(props.store,info.id)"
                :has_action_delete="has_action_delete"
                :has_action_edit="has_action_edit"
                :item_info="info"></EditOrDeleteActionsComponent>
          </v-menu>
        </v-row>

        <div class="description-container">
          <p class="description-text">{{ info?.description }}</p>
          <div class="date-display">
            <v-icon icon="fa-duotone fa-solid fa-calendar-days" size="small" color="primary" class="date-icon"></v-icon>
            <span class="date-text">{{ formatDate(info?.created_at) }}</span>
          </div>
        </div>
        
        <div class="files-container">
          <a 
            :href="config.public.fileAssistantBaseUrl+'/'+i?.path" 
            target="_blank" 
            v-for="(i,key) in info?.files"
            :key="key"
            class="file-link"
          >
            <v-chip
                :model-value="true"
                v-if="chips_files[key]?.visible"
                size="small"
                class="file-chip"
                :color="getFileChipColor(key)"
                variant="outlined"
                elevation="1"
            >
              <template #close>
                <v-icon icon="mdi-close-circle" @click.stop="handleDeleteFile(key , $event)" class="close-icon"/>
              </template>
              <v-icon icon="mdi-file" start class="file-icon"></v-icon>
              {{ truncateText(i?.path?.split('/').pop(), 20) }}
            </v-chip>
          </a>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
let props = defineProps(['has_action_edit', 'has_action_delete', 'info', 'store']);
import {inject, ref} from 'vue';
import {deleteItemComposable} from "~/composables/DeleteItemComposable";
import {formatDate} from "~/composables/FormatDateComposable";
import EditOrDeleteActionsComponent from "~/components/global/ExtraActionsComponent.vue";

const truncateText = inject('truncateText');
const dialog_switch = defineModel<boolean>();
const emit = defineEmits(['update:info_obj']);
const config = useRuntimeConfig();
const hover = ref(false);

const editItem = (obj) => {
  emit('update:info_obj', obj);
  if (props.has_action_edit) {
    dialog_switch.value = true
  }
};

const handleDeleteFile = async (index, $event) => {
  $event.preventDefault()
  await deleteItemComposable(props.store, 'delete-file/' + chips_files.value[index]?.id)
  chips_files.value[index].visible = false
};

const chips_files = ref(
    props.info?.files.map((e) => ({...e, visible: true})) || []
);

const getFileChipColor = (index) => {
  const colors = ['primary', 'info', 'success', 'warning', 'error'];
  return colors[index % colors.length];
};
</script>

<style lang="scss" scoped>
.assistant-card {
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid var(--v-primary-base);
  
  &.on-hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
}

.icon-container {
  margin-right: 16px;
}

.robot-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 1.5rem;
    color: white;
  }
}

.title-text {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 4px;
}

.description-container {
  padding: 8px 0;
}

.description-text {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 8px;
  line-height: 1.5;
}

.date-display {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.date-icon {
  margin-right: 6px;
}

.date-text {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
}

.files-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
}

.file-link {
  text-decoration: none;
  margin-right: 8px;
  margin-bottom: 8px;
  
  &:hover {
    text-decoration: none;
  }
}

.file-chip {
  transition: transform 0.15s ease;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .file-icon {
    margin-right: 4px;
  }
  
  .close-icon {
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
    }
  }
}

// RTL support
:lang(ar) {
  .icon-container {
    margin-right: 0;
    margin-left: 16px;
  }
  
  .date-icon {
    margin-right: 0;
    margin-left: 6px;
  }
  
  .file-icon {
    margin-right: 0;
    margin-left: 4px;
  }
  
  .assistant-card {
    border-left: none;
    border-right: 4px solid var(--v-primary-base);
  }
}
</style>
