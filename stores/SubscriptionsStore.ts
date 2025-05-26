import {BaseStore} from "~/stores/BaseStore";

export const useSubscriptionsStore = BaseStore('subscriptions','/subscriptions',{
    tableName:'subscriptions'
});