import {BaseStore} from "~/stores/BaseStore";

export const useGroupsStore = BaseStore('groups', '/groups', {
    tableName: 'groups',
});