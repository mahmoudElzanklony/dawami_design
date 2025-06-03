import {defineStore} from 'pinia';

export interface BaseStoreConfig {     // this is used in case the user needs to override the default endpoints or add extra methods
    tableName: string;
    endpoints?: {
        get?: string;
        getAll?: string;
        create?: string;
        update?: string;
        delete?: string;
        [key: string]: string | undefined;
    };
    methods?: {
        [key: string]: (store: any, ...args: any[]) => Promise<any>;
    };
}

export const BaseStore = (StoreName: string, url: string, config: BaseStoreConfig) => {

    return defineStore(StoreName, {
        state() {

            return {
                data: {data: [] as any[]},
                item: {} as any,
                tableName: config.tableName,
                loading: false,
            }
        },
        actions: {
            async get_all_data(continue_url = '', put_at_store = true) {
                const {$axios} = useNuxtApp();
                this.loading = true;
                let res = await $axios.get((config?.endpoints?.getAll ?? url) + continue_url)
                console.log(res)
                console.log('current url ===>',(config?.endpoints?.getAll ?? url) + continue_url)

                if (put_at_store) {
                    this.data = res?.data
                }
                this.loading = false;
                return res?.data;
            },
            async get_by_id(id: number) {
                const {$axios} = useNuxtApp();
                let res =  await $axios.get(url+'/'+id)
                this.item = res.data
                return this.item;
            },
            async create_or_update(data: FormData | null, continue_url: string = '', append_put_method = true) {
                if (data == null) {
                    //
                    data = new FormData(event?.target as HTMLFormElement);
                }
                
                let response;
                if (data?.has('id')) {
                    response = await this.update(data, (config?.endpoints?.update ?? url) + continue_url, append_put_method);
                } else {
                    response = await this.create(data, (config?.endpoints?.create ?? url) + continue_url);
                }
                const allData = await this.get_all_data(continue_url);
                return {
                    status: response?.status,
                    create_or_update_data: response?.data?.data ?? response?.response?.data ,
                    data: allData
                };
            },
            async create(data: FormData, continue_url: string = '') {
                const {$axios} = useNuxtApp();
                const response = await $axios.post(continue_url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response;
            },
            async update(data: FormData, continue_url: string = '', append_put_method = true) {
                const {$axios} = useNuxtApp();
                if (append_put_method) {
                    data.append('_method', 'PUT')
                }
                const url = config?.endpoints?.update
                    ? continue_url
                    :`${continue_url}/${data.get('id')}`;
                return await $axios.post(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            },
            async delete(id: number | number[], continue_url: string = '') {
                const {$axios} = useNuxtApp();
                const params = new URLSearchParams();
                params.append('table', this.tableName);
                const ids = Array.isArray(id) ? id : [id];
                ids.forEach((idValue, index) => {
                    params.append(`id[${index}]`, idValue.toString());
                });


                await $axios.post(`/deleteitem?${params.toString()}${continue_url}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                return await this.get_all_data(continue_url);
            },
            ...config?.methods,
        }
    })
}
