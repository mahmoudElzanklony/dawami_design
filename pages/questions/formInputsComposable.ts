import type {FormField} from "@/types/formField";
import {useAssistantStore} from "~/stores/AssistantsStore";

export const formInputsComposable = (t: (key: string) => string): FormField[] => [
    {
        label: t('questions.inputs.name'),
        input_name: "question",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true,
        visibility: {create: false, update: true}
    },
    {
        label: t('questions.inputs.assistant'),
        input_name: "questionable_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api", // fixed or api
        item_title: "name",
        item_value: "id",
        icon:null,
        store_name:useAssistantStore,
        continue_url_request:'?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true,
        visibility: {create: true, update: false}
    },
    {
        label: t('questions.number_of_true_false_questions'),
        input_name: "true_false_questions",
        required: true,
        type: "number",
        icon: "fa-duotone fa-solid fa-circle-info",
        searchable: false,
        FormExists: true,
        visibility: {create: true, update: false}
    },
    {
        label:t('questions.number_of_select_questions'),
        input_name: "select_questions",
        required: true,
        type: "number",
        icon: "fa-duotone fa-solid fa-circle-info",
        searchable: false,
        FormExists: true,
        visibility: {create: true, update: false}
    },
    {
        label: t('questions.chapter_and_notes'),
        input_name: "keywords",
        required: false,
        type: "text",
        icon: "",
        searchable: false,
        FormExists: true,
        visibility: {create: true, update: false}
    },
    {
        label: "Type",
        input_name: "type",
        required: true,
        type: "select",
        options: [
            {id: 'Select', name: 'Select'},
            {id: 'True/False', name: 'True/False'},
        ],
        options_getting_data: "fixed", // fixed or api
        item_title: "name",
        item_value: "id",
        icon: null,
        searchable: false,
        FormExists: true,
        visibility: {create: false, update: false}
    },
    {
        label: "options",
        input_name: "options",
        required: true,
        type: "options",
        icon: null,
        disable_option_in_update_if_option_equal_current: true,
        searchable: false,
        FormExists: true,
        visibility: {create: false, update: true}
    },
    {
        label: t('questions.inputs.complexity'),
        input_name: "complexity",
        required: true,
        type: "select",
        options: [
            {id: 'Easy', name: t('questions.levels.easy')},
            {id: 'Medium', name: t('questions.levels.medium')},
            {id: 'Hard', name: t('questions.levels.hard')},
        ],
        options_getting_data: "fixed",
        item_title: "name",
        item_value: "id",
        icon: null,
        searchable: false,
        FormExists: true,
        visibility: {create: false, update: true}
    },
];