<template>
  <ModalDialog
      v-bind="$props"
      :inputs="finalInputs"
      :info="localInfo"
      v-model="dialogModel"
      @submission-complete="handleSubmissionComplete"
  />
</template>

<script setup lang="ts">
import {ref, computed, watch, toRef} from 'vue';
import ModalDialog from '~/components/global/ModalDialog.vue';
import { useI18n } from '#imports';

const { t } = useI18n();
const props = defineProps([
  'dialog_title',
  'dialog_icon',
  'inputs',
  'store',
  'info',
  'disable_put_at_update',
  'continue_url',
  'modelValue'
]);

const emits = defineEmits(['update:modelValue', 'submission-complete']);
const {$axios, $swal} = useNuxtApp();
// Create two-way binding for dialog visibility
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
});

const localInfo = ref({...props.info});

const finalInputs = ref([...(props.inputs || [])]);

watch(() => props.info, (newInfo) => {
  localInfo.value = {...newInfo};
}, {deep: true});


const isUserAlreadyAddedError = (response) => {
  if (!response?.errors_info?.phone) return false;
  const phoneError = response?.errors_info?.phone;
  return phoneError.status === 'added_before' && phoneError.user_id;
};

const handleUserAddToGroup = async (userId) => {
  try {
    const groupId = localInfo.value['groups_id[0]'];

    const result = await $swal.fire({
      title: t('users.modal.confirm'),
      text: t('users.modal.user_already_added'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('users.modal.yes'),
      cancelButtonText: t('users.modal.no'),
      confirmButtonColor: "#0869fa",
      cancelButtonColor: '#ddd',
      customClass: {
        confirmButton: 'my-confirm-button',
        cancelButton: 'my-cancel-button'
      },
      reverseButtons: true
    });

    // Only proceed if user confirmed
    if (result.isConfirmed) {
      try {
        // Make the POST request to add user to group
        const response = await $axios.post('/users/add-to-group', {
          user_id: userId,
          group_branch_id: groupId
        });

        if (response.status === 200 || response.status === 201) {
          await $swal.fire({
            title: t('users.modal.success'),
            text: t('users.modal.user_added_successfully'),
            icon: 'success',
          });

          emits('submission-complete', {
            success: true,
            data: response.data,
            message: 'User added to group successfully'
          });

          dialogModel.value = false;
        } else {
          throw new Error('Request returned non-success status: ' + response.status);
        }
      } catch (requestError) {
        console.error('Error adding user to group:', requestError);
        await $swal.fire({
          title: t('users.modal.error'),
          text: t('users.modal.failed_to_add_user'),
          icon: 'error',
        });
      }
    }
  } catch (error) {
    console.error('Error adding user to group:', error);
    await $swal.fire({
      title: t('users.modal.error'),
      text: t('users.modal.failed_to_add_user'),
      icon: 'error',
    });
    emits('submission-complete', {
      success: false,
      error: error,
      message: 'Failed to add user to group'
    });
  }
};


const handleSubmissionComplete = (result) => {
  if (result.create_or_update_data && isUserAlreadyAddedError(result.create_or_update_data)) {
    const userId = result.create_or_update_data.errors_info.phone.user_id;
    handleUserAddToGroup(userId);
    return;
  }
  emits('submission-complete', result);
};
</script>
