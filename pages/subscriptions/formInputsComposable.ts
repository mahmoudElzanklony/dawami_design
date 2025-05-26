import type {ConditionalField, DependencyField, FieldType, FormField} from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {useBranchesStore} from "~/stores/BranchesStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('subscriptions.inputs.university'),
        input_name: "organization",
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
        label: t('subscriptions.inputs.branches'),
        input_name: "branches",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useBranchesStore,
        continue_url_request: '?limit=9999999999&organization_id=',
        searchable: false,
        FormExists: true,
        dependency: {
            field: "organization",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('subscriptions.inputs.subject'),
        input_name: "field_id",
        required: true,
        type: "select",
        multiple:true,
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useFieldsStore,
        continue_url_request: '?limit=9999999999&branch_id=',
        searchable: false,
        FormExists: true,
        dependency: {
            field: "branches",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('subscriptions.inputs.price'),
        input_name: "price",
        required: false,
        type: "text",
        icon: null,
        continue_url_request: '?limit=9999999999&branch_id=',
        searchable: false,
        FormExists: true,
        readonly:true,
        dependency: {
            field: "field_id",
            updateValue: true,
            valuePath: "price"
        },
        hint: t('subscriptions.inputs.priceHint')
    },
    {
        label: t('subscriptions.inputs.discount'),
        input_name: "discount",
        required: false,
        type: "number",
        icon: null,
        searchable: false,
        FormExists: true,
    },
    {
        label: t('subscriptions.inputs.student'),
        input_name: "user_id",
        required: true,
        type: "select",
        multiple:true,
        options: [],
        options_getting_data: "api",
        item_title: "username",
        item_value: "id",
        icon: null,
        store_name: useUsersStore,
        continue_url_request: '?limit=9999999999&type=client',
        searchable: true,
        FormExists: true,
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
        label: t('subscriptions.inputs.notes'),
        input_name: "note",
        required: false,
        type: "textarea",
        icon:"fa-duotone fa-solid fa-circle-info",
        searchable:false,
        FormExists:true
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

