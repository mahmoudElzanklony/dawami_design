import {BaseStore} from "~/stores/BaseStore";

export const useRolesStore = BaseStore('roles','/roles',{
    tableName:'roles'
});