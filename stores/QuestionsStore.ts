import {BaseStore} from "~/stores/BaseStore";

export const useQuestionStore = BaseStore('questions','/questions',{
    tableName:'questions'
});