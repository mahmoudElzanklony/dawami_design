export async function callOnServerComposable(store_name: any, continue_url_search: string = '') {
    const { data, error } = await useAsyncData(
        "server-data",
        async () => {
            try {
                await store_name.get_all_data(continue_url_search);
                return true;
            } catch (err) {
                console.error("Error fetching data:", err);
                return null;
            }
        }
    );
}