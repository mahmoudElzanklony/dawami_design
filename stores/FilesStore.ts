import {BaseStore} from "~/stores/BaseStore";

export const useFilesStore = BaseStore('files','/fields-files',{
    tableName:'files'
});