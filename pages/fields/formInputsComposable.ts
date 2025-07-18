import type {FormField} from "@/types/formField";
import {usePlacesStore} from "~/stores/PlacesStore";
import {useBranchesStore} from "~/stores/BranchesStore";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {useUsersStore} from "~/stores/UsersStore";

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
        label: "الدكتور",
        input_name: "instructors[]",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        icon: null,
        store_name: useUsersStore,
        continue_url_request: '?limit=9999999999&type=doctor',
        item_title: "username",
        item_value: "id",
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
    },
    {
        label: t('fields.places'),
        input_name: "places",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        icon: null,
        store_name: usePlacesStore,
        continue_url_request: '?limit=9999999999',
        item_title: "name",
        item_value: "id",
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
    },
    {
        label: t('fields.university'),
        input_name: "organization_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useOrganizationsStore,
        continue_url_request: '?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true,
    },
    {
        label: t('fields.branch'),
        input_name: "branch_id",
        required: true,
        type: "select",
        options_getting_data: "api",
        options: [],
        store_name: useBranchesStore,
        continue_url_request: '?limit=9999999999&organization_id=',
        item_title: "name",
        item_value: "id",
        searchable: false,
        FormExists: true,
        icon: "",
        dependency: {
            field: "organization_id",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('fields.groups'),
        input_name: "year_groups[]",
        required: true,
        type: "select",
        options_getting_data: "api",
        options: [],
        store_name: useGroupsStore,
        continue_url_request: '?limit=9999999999&branch_id=',
        item_title: "name",
        item_value: "id",
        searchable: false,
        FormExists: true,
        icon: "",
        dependency: {
            field: "branch_id",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('fields.semester'),
        input_name: "semester",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'الاول', label: t('fields.semester_options.first')},
            {value: 'الثاني', label: t('fields.semester_options.second')},
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: "",
    },
    {
        label: t('fields.price'),
        input_name: "price",
        required: true,
        type: "number",
        searchable: false,
        FormExists: true,
        icon: "",
    },
    {
        label: t('fields.image'),
        input_name: "image",
        required: true,
        type: "file",
        searchable: false,
        FormExists: true,
        multiple: false,
        icon: "fa-duotone fa-solid fa-image",
        accept: ['image/png', 'image/jpg'],

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