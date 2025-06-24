import type {FormField} from "@/types/formField";
import {usePlacesStore} from "~/stores/PlacesStore";
import {useBranchesStore} from "~/stores/BranchesStore";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {useUsersStore} from "~/stores/UsersStore";
import {usePermissionsStore} from "~/stores/PermissionsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('fields.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true,
    },
    {
        label: "الصلاحيات",
        input_name: "permissions[]",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        icon: null,
        store_name: usePermissionsStore,
        continue_url_request: '?limit=9999999999',
        item_title: "full_name",
        item_value: "id",
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
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