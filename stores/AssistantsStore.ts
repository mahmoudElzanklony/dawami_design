import {BaseStore} from "~/stores/BaseStore";

export const useAssistantStore = BaseStore('assistants','/assistants',{
    tableName:'assistants',
    methods: {
        async delete(id: number | number[], continue_url: string = '') {
            const { $axios } = useNuxtApp();
            await $axios.delete(`/assistants/${id}${continue_url}`);
            return await this.get_all_data(continue_url);
        }
    }

});