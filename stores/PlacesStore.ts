import {BaseStore} from "~/stores/BaseStore";

export const usePlacesStore = BaseStore('places','/places',{
    tableName:'places'
});