import {BaseStore} from "~/stores/BaseStore";

export const useOrganizationsStore = BaseStore('organizations','/organizations',{
    tableName:'organizations',
});