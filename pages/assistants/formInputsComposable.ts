import type { FormField } from "@/types/formField";
import {useBranchesStore} from "~/stores/BranchesStore";
import {useFieldsStore} from "~/stores/FieldsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t("assistants.inputs.name"),
        input_name: "name",
        required: true,
        type: "text",
        icon:"",
        searchable:true,
    },
    {
        label: t("assistants.inputs.description"),
        input_name: "description",
        required: true,
        type: "textarea",
        icon:"",
        searchable:false,
        FormExists:true
    },
    {
        label: t("assistants.inputs.branch"),
        input_name: "branch_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api", // fixed or api
        item_title: "name",
        item_value: "id",
        icon:null,
        store_name:useBranchesStore,
        continue_url_request:'?limit=9999999999',
        disable_option_in_update_if_option_equal_current:true,
        searchable:true,
        FormExists:true
    },
    {
        label: t("assistants.inputs.field"),
        input_name: "field_id",
        required: false,
        type: "select",
        options: [],
        options_getting_data: "api", // fixed or api
        item_title: "name",
        item_value: "id",
        icon:null,
        store_name:useFieldsStore,
        continue_url_request:'?limit=9999999999&branch_id=',
        disable_option_in_update_if_option_equal_current:true,
        searchable:true,
        FormExists:true,
        dependency:{
            field:'branch_id',
            disabledWhenEmpty:true,
            updateUrl:true
        }
    },
    {
        label: t("assistants.inputs.chapters"),
        input_name: "chapters",
        required: false,
        type: "chapters",
        icon:null,
        FormExists:true
    },
    {
        label: t("assistants.inputs.files"),
        input_name: "files",
        required: true,
        type: "file",
        icon:"fa-duotone fa-solid fa-file",
        accept:['application/pdf'],
        multiple:true,
        FormExists:true
    },
];
