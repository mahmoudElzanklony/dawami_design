import type {FormField} from "@/types/formField";
import {useAssistantStore} from "~/stores/AssistantsStore";

export const manualFormInputsComposable = (t: (key: string) => string): FormField[] => [
    {
        label: t('questions.inputs.name'),
        input_name: "question",
        required: true,
        type: "text",
        icon:"",
        searchable:true,
        FormExists:true,
        visibility:{create:true,update:true}
    },
    {
        label: t('questions.inputs.assistant'),
        input_name: "assistant_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api", // fixed or api
        item_title: "name",
        item_value: "id",
        icon:null,
        store_name:useAssistantStore,
        continue_url_request:'?limit=9999999999',
        disable_option_in_update_if_option_equal_current:true,
        searchable:true,
        FormExists:true,
        visibility:{create:true,update:false}
    },
    {
        label: "options",
        input_name: "options",
        required: true,
        type: "options",
        icon:null,
        disable_option_in_update_if_option_equal_current:true,
        searchable:false,
        FormExists:true,
        visibility:{create:true,update:true}
    },
    {
        label: t('questions.inputs.complexity'),
        input_name: "complexity",
        required: true,
        type: "select",
        options: [
            {id:'easy',name:t('questions.levels.easy')},
            {id:'medium',name:t('questions.levels.medium')},
            {id:'hard',name:t('questions.levels.hard')},
        ],
        options_getting_data: "fixed",
        item_title: "name",
        item_value: "id",
        icon:null,
        searchable:false,
        FormExists:true,
        visibility:{create:true,update:true}
    },
];