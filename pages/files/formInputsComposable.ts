import type {FormField} from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {useBranchesStore} from "~/stores/BranchesStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('files.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },
    {
        label: t('files.type'),
        input_name: "type",
        required: true,
        type: "select",
        options: [
            {id: 'video', name: t('files.types.video')},
            {id: 'pdf', name: t('files.types.pdf')},
        ],
        options_getting_data: "fixed",
        item_title: "name",
        item_value: "id",
        icon: null,
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: false
    },
    {
        label: t('files.university'),
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
        label: t('files.branch'),
        input_name: "category",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useBranchesStore,
        continue_url_request: '?limit=9999999999&organization_id=',
        searchable: true,
        FormExists: true,
        dependency: {
            field: "organization",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('files.subject'),
        input_name: "fileable_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useFieldsStore,
        continue_url_request: '?limit=9999999999&category_id=',
        searchable: true,
        FormExists: true,
        dependency: {
            field: "category",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },
    {
        label: t('files.file'),
        input_name: "file",
        required: true,
        type: "file",
        searchable: false,
        FormExists: true,
        multiple: false,
        icon: "fa-duotone fa-solid fa-image",
        accept: ['video/mp4', 'video/mpeg', 'application/pdf'],
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
