import {BaseStore} from "~/stores/BaseStore";

export const usePackagesStore = BaseStore('packages','/packages',{
    tableName:'packages'
});