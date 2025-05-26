import type { FormField } from "@/types/formField";
import {useUsersStore} from "~/stores/UsersStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('bills.inputs.doctor'),
        input_name: "doctor_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        icon:null,
        store_name:useUsersStore,
        continue_url_request: '?limit=9999999999&type=doctor',
        item_title: "username",
        item_value: "id",
        disable_option_in_update_if_option_equal_current:true,
        searchable:true,
        FormExists:true
    },
    {
        label: t('global.row_count'),
        input_name: "limit",
        required: false,
        type: "select",
        options_getting_data: "fixed", // fixed or api
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
        icon: "",
    },
    {
        label: t('global.start_date'),
        input_name: 'start_date',
        required: true,
        type: 'date',
        searchable: true,
        FormExists: true,
        icon: ''
    },
    {
        label: t('global.end_date'),
        input_name: 'end_date',
        required: true,
        type: 'date',
        searchable: true,
        FormExists: true,
        icon: ''
    },
    {
        label: t('bills.inputs.calculated_amount'),
        input_name: 'checked_amount',
        required: false,
        type: 'check-period-amount',
        searchable: false,
        FormExists: true,
        readonly: true,
        icon: ''
    },
    {
        label: t('bills.inputs.total_money'),
        input_name: 'paid',
        required: true,
        type: 'number',
        searchable: false,
        FormExists: true,
        icon: ''
    },
    {
        label: t('bills.inputs.notes'),
        input_name: "note",
        required: false,
        type: "textarea",
        icon:"fa-duotone fa-solid fa-circle-info",
        searchable:false,
        FormExists:true
    },
];

