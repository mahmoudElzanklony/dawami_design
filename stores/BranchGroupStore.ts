import {BaseStore} from "~/stores/BaseStore";

export const useGroupBranchStore = BaseStore('group_branch','/branch-group',{
    tableName:'branch-group',
});