import {BaseStore} from "~/stores/BaseStore";

export const useBranchesStore = BaseStore('branches','/branches',{
    tableName:'branches',
});