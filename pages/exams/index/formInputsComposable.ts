// pages/exams/formInputsComposable.ts
import type {FormField} from "@/types/formField";
import {useFieldsStore} from "~/stores/FieldsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('exam.form_inputs.title'),
        input_name: "name", // Changed from title to match ExamCardComponent expectations
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },
    {
        label: t('exam.form_inputs.field'),
        input_name: "field_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: "",
        store_name: useFieldsStore,
        continue_url_request: '?limit=9999999999',
        searchable: true,
        FormExists: true
    },
    {
        label: t('exam.form_inputs.question_mark'),
        input_name: "question_mark",
        required: true,
        type: "number",
        icon: "",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.start_time'),
        input_name: "start_time",
        required: true,
        type: "datetime-local",
        icon: "",
        hint: t('exam.form_inputs.start_time_hint'),
        FormExists: true
    },
    {
        label: t('exam.form_inputs.time_in_minutes'),
        input_name: "time_in_minutes",
        required: true,
        type: "number",
        icon: "",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.allowed_time'),
        input_name: "allowed_time",
        required: true,
        type: "number",
        icon: "",
        hint: t('exam.form_inputs.allowed_time_hint'),
        FormExists: true
    },
    {
        label: t('exam.form_inputs.total_questions'),
        input_name: "total_questions",
        required: true,
        type: "number",
        icon: "",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.is_random_questions_mode'),
        input_name: "is_random_questions_mode",
        required: false,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 0, label: t('fields.support_options.not_supported')},
            {value: 1, label: t('fields.support_options.supported')},
        ],
        item_title: "label",
        item_value: "value",
        icon: "",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.is_minus_mode'),
        input_name: "is_minus_mode",
        options_getting_data: "fixed",
        options: [
            {value: 0, label: t('fields.support_options.not_supported')},
            {value: 1, label: t('fields.support_options.supported')},
        ],
        item_title: "label",
        item_value: "value",
        required: true,
        type: "select",
        icon: "fa-duotone fa-solid fa-minus",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.questions'),
        input_name: "questions",
        required: true,
        type: "question-selector",
        icon: "fa-duotone fa-solid fa-list-check",
        FormExists: true,
        dependency: {
            disabledWhenEmpty: true,
            field: "field_id"
        },
    },
    {
        label: t('global.row_count'),
        input_name: "limit",
        required: false,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: '10', label: '10'},
            {value: '20', label: '20'},
            {value: '30', label: '30'},
            {value: '40', label: '40'},
            {value: '50', label: '50'},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: false,
        icon: "fa-duotone fa-solid fa-image",
    },
    {
        label: t('global.start_date'),
        input_name: 'start_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    },
    {
        label: t('global.end_date'),
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    }
];