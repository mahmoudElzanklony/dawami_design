import {BaseStore} from "~/stores/BaseStore";

export const useBillsStore = BaseStore('bills','/bills',{
    tableName:'bills',
});