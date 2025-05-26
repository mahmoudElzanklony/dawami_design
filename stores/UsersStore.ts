import {BaseStore} from "~/stores/BaseStore";

export const useUsersStore = BaseStore('users','/users',{
    tableName:'User',
    endpoints:{
        create:'/auth/register',
        update:'/profile/update-info',
    },
    methods: {
        // Add additional methods specific to users if needed
        async addToGroup(userId: number, groupId: number) {
            const { $axios } = useNuxtApp();
            return await $axios.post('/users/add-to-group', {
                user_id: userId,
                group_id: groupId
            });
        }
    }
});