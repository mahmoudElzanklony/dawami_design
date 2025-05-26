import {BaseStore} from "~/stores/BaseStore";

export const useFieldsStore = BaseStore('fields','/fields',{
    tableName:'fields'
});