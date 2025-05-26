import type { FormField } from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('branches.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon:"",
        searchable: true,
        FormExists: true
    },
    {
        label: t('branches.description'),
        input_name: "info",
        required: false,
        type: "textarea",
        icon:"fa-duotone fa-solid fa-circle-info",
        searchable: false,
        FormExists: true
    },
    {
        label: t('branches.university'),
        input_name: "organization_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api", // fixed or api
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useOrganizationsStore,
        continue_url_request: '?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
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
