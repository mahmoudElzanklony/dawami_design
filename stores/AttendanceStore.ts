import {BaseStore} from "~/stores/BaseStore";

export const useAttendanceStore = BaseStore('attendance','/attendance',{
    tableName:'attendance',
    endpoints:{
        delete:'/assistants',
    },
});