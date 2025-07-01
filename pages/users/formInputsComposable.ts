import type {FormField} from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";
import {useBranchesStore} from "~/stores/BranchesStore";
import {useGroupsStore} from "~/stores/GroupsStore";
import {useGroupBranchStore} from "~/stores/BranchGroupStore";
import {useRolesStore} from "~/stores/RolesStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('users.inputs.username'),
        input_name: "username",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },
    {
        label: t('users.inputs.phone'),
        input_name: "phone",
        required: true,
        type: "phone",
        icon: "",
        searchable: false,
        FormExists: true
    },
    {
        label: t('users.inputs.nationality'),
        input_name: "nationality",
        required: true,
        type: "select",
        options: [
            {id: 'مصري', name: t('nationalities.egyptian')},
            {id: 'سعودي', name: t('nationalities.saudi')},
            {id: 'إماراتي', name: t('nationalities.emirati')},
            {id: 'لبناني', name: t('nationalities.lebanese')},
            {id: 'سوري', name: t('nationalities.syrian')},
            {id: 'أردني', name: t('nationalities.jordanian')},
            {id: 'فلسطيني', name: t('nationalities.palestinian')},
            {id: 'عراقي', name: t('nationalities.iraqi')},
            {id: 'قطري', name: t('nationalities.qatari')},
            {id: 'كويتي', name: t('nationalities.kuwaiti')},
            {id: 'بحريني', name: t('nationalities.bahraini')},
            {id: 'تونسي', name: t('nationalities.tunisian')},
            {id: 'ليبي', name: t('nationalities.libyan')},
            {id: 'جزائري', name: t('nationalities.algerian')},
            {id: 'مغربي', name: t('nationalities.moroccan')},
            {id: 'سوداني', name: t('nationalities.sudanese')},
            {id: 'يمني', name: t('nationalities.yemeni')},
            {id: 'عماني', name: t('nationalities.omani')}
        ],
        options_getting_data: "fixed", // fixed or api
        item_title: "name",
        item_value: "id",
        icon: null,
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
    },
    {
        label: t('users.user_type'),
        input_name: "type",
        required: true,
        type: "select",
        inline: true,
        options: [
            {name: 'Client'},
        ],
        options_getting_data: "api",
        store_name: useRolesStore,
        continue_url_request: '?limit=9999999999',
        item_title: "name",
        item_value: "name",
        searchable: false,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-image",
    },

    {
        label: t('users.university'),
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
        searchable: false,
        FormExists: true,
    },
    {
        label: t('users.inputs.branch'),
        input_name: "branch_id",
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
        label: t('users.inputs.group'),
        input_name: "groups_id",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        store_name: useGroupBranchStore,
        continue_url_request: '?limit=9999999999&branch_id=',
        item_title: "group.name",
        item_value: "id",
        icon: null,
        searchable: false,
        FormExists: true,
        dependency: {
            field: "branch_id",
            disabledWhenEmpty: true,
            updateUrl: true
        }
    },

    {
        label: t('users.account_status'),
        input_name: "is_block",
        required: false,
        type: "select",
        options_getting_data: "fixed", // fixed or api
        options: [
            {value: '1', label: t('global.status.blocked')},
            {value: '0', label: t('global.availability.available')},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: false,
        icon: "fa-duotone fa-solid fa-image",
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
