import {BaseStore} from "~/stores/BaseStore";

export const useWorkingDaysStore = BaseStore('working-days','/working-days',{
    tableName:'working-days'
});