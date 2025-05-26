import {BaseStore} from "~/stores/BaseStore";

export const useExamsStore = BaseStore('exams','/exams',{
    tableName:'exams'
});