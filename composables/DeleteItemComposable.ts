import { BaseStore } from "~/stores/BaseStore";

export async function deleteItemComposable(store_name: any, id: number | number[], continue_url_search: string = '') {
    const {$swal} = useNuxtApp();
    const nuxtApp = useNuxtApp()
    const t = nuxtApp.$i18n.t.bind(nuxtApp.$i18n) // make sure to bind the instance
    const result = await $swal.fire({
        title: t('delete_modal.title'),
        text: t('delete_modal.text'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t('delete_modal.confirm_button'),
        confirmButtonColor: "#fa0828",
        cancelButtonText: t('delete_modal.cancel_button'),
        cancelButtonColor: '#ddd',
        reverseButtons: true,
        customClass: {
            confirmButton: 'my-confirm-button',
            cancelButton: 'my-cancel-button'
        }
    });
    if (result.isConfirmed) {
        await store_name.delete(id, continue_url_search);
        return true;
    } else {
        return false;
    }
}
