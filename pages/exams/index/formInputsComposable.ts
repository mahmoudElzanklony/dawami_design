// pages/exams/formInputsComposable.ts
import type {FormField} from "@/types/formField";
import {useFieldsStore} from "~/stores/FieldsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('exam.form_inputs.title'),
        input_name: "name", // Changed from title to match ExamCardComponent expectations
        required: true,
        type: "text",
        icon: "fa-duotone fa-solid fa-circle-info",
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
        icon: "fa-duotone fa-solid fa-book",
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
        icon: "fa-duotone fa-solid fa-star",
        default_value: 1,
        FormExists: true
    },
    {
        label: t('exam.form_inputs.start_time'),
        input_name: "start_time",
        required: true,
        type: "datetime-local",
        icon: "fa-duotone fa-solid fa-calendar-days",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.time_in_minutes'),
        input_name: "time_in_minutes",
        required: true,
        type: "number",
        icon: "fa-duotone fa-solid fa-clock",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.allowed_time'),
        input_name: "allowed_time",
        required: true,
        type: "number",
        icon: "fa-duotone fa-solid fa-clock",
        FormExists: true
    },
    {
        label: t('exam.form_inputs.total_questions'),
        input_name: "total_questions",
        required: true,
        type: "number",
        icon: "fa-duotone fa-solid fa-clock",
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
        icon: "fa-duotone fa-solid fa-shuffle",
        default_value: false,
        FormExists: true
    },
    {
        label: t('exam.form_inputs.is_minus_mode'),
        input_name: "is_minus_mode",
        options_getting_data: "fixed",
        options: [
            {value: '0', label: t('fields.support_options.not_supported')},
            {value: '1', label: t('fields.support_options.supported')},
        ],
        item_title: "label",
        item_value: "value",
        required: true,
        type: "select",
        icon: "fa-duotone fa-solid fa-minus",
        default_value: false,
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
    }
];
