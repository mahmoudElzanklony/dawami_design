export async function handleInputsApi(formInputsComposable: any, info: Record<string, any>) {
    const inputs = formInputsComposable;
    const nuxtApp = useNuxtApp();
    const itemsToFetch = [];

    for (const item of inputs) {
        if (item?.type === 'select' && item?.options_getting_data === 'api') {
            item.loading = true;
            itemsToFetch.push(item);
        }
    }
    await nextTick();

    const apiPromises = itemsToFetch.map(async (item) => {
        if (item?.dependency && !info[item?.dependency?.field]) {
            item.options = [];
            item.loading = false;
            return;
        }

        const updatedUrl = item.dependency?.updateUrl
            ? `${item.continue_url_request || ''}${info[item?.dependency?.field] || ''}`
            : item?.continue_url_request;
        try {
            const res = await nuxtApp.runWithContext(() =>
                item.store_name().get_all_data(updatedUrl ?? '', false)
            );

            if (item.dependency) {
                info[item.input_name] = item.multiple ? [] : null;
            }
            item.options = res?.data;
        } catch (error) {
            console.error("API fetch failed:", error);
            item.options = [];
        } finally {
            item.loading = false;
        }
    });

    await Promise.all(apiPromises);
    return inputs;
}