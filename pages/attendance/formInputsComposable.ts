import type {FormField} from "@/types/formField";
import {useWorkingDaysStore} from "~/stores/WorkingDaysStore";
import {useUsersStore} from "~/stores/UsersStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('attendance.inputs.working_day'),
        input_name: "working_day_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: "",
        store_name: useWorkingDaysStore,
        continue_url_request: '?limit=9999999999',
        searchable: true,
        FormExists: true
    },
    {
        label: t('attendance.inputs.user'),
        input_name: "user_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "username",
        item_value: "id",
        icon: "",
        store_name: useUsersStore,
        continue_url_request: '?limit=9999999999',
        searchable: true,
        FormExists: true
    },
    {
        label: t('attendance.inputs.registration_type'),
        input_name: "type",
        required: true,
        type: "radio",
        inline: true,
        options: [
            {value: 'auto', label: t('attendance.types.auto')},
            {value: 'manual', label: t('attendance.types.manual')}
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: "",
        visibility:{
            create:true,
            update:false,
        }
    },
    {
        label: t('attendance.inputs.location'),
        input_name: "location",
        required: true,
        type: "geolocation",
        icon: "",
        searchable: false,
        FormExists: true,
        conditional: {
            dependsOn: 'type',
            value: 'auto'
        },
        visibility:{
            create:true,
            update:false,
        }
    },
    {
        label: t('attendance.inputs.status'),
        input_name: "status",
        required: true,
        type: "select",
        inline: true,
        options: [
            {value: 'attend', label: t('attendance.status.attend')},
            {value: 'absent', label: t('attendance.status.absent')}
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: ""
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
        label: t('global.end_date'),
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    }
];

