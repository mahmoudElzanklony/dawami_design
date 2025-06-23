import {BaseStore} from "~/stores/BaseStore";

export const usePermissionsStore = BaseStore('permissions','/permissions',{
    tableName:'permissions'
});