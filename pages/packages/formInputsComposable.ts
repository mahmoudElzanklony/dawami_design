import type {FormField} from "@/types/formField";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('packages.inputs.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },
    {
        label: t('packages.inputs.description'),
        input_name: "description",
        required: true,
        type: "textarea",
        icon: "",
        searchable: false,
        FormExists: true
    },
    {
        label: t('packages.inputs.price'),
        input_name: "price",
        required: true,
        type: "number",
        icon: "mdi-cash",
        searchable: false,
        FormExists: true
    },
    {
        label: t('packages.inputs.max_users'),
        input_name: "max_users_number",
        required: true,
        type: "number",
        icon: "mdi-account-group",
        searchable: false,
        FormExists: true
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
        icon: "fa-duotone fa-solid fa-list-ol"
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
        label:t('global.end_date'),
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    }
];

