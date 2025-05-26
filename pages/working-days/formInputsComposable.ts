import type {FormField} from "@/types/formField";
import {useFieldsStore} from "~/stores/FieldsStore";
import {useGroupsStore} from "~/stores/GroupsStore";
import {usePlacesStore} from "~/stores/PlacesStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t("working_days.inputs.name"),
        input_name: "name",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },
    {
        label: t("working_days.inputs.field"),
        input_name: "field_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useFieldsStore,
        continue_url_request: '?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true,
    },

    {
        label: t("working_days.inputs.groups"),
        input_name: "groups[]",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: useGroupsStore,
        continue_url_request: '?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
    },
    {
        label: t("working_days.inputs.places"),
        input_name: "places[]",
        required: true,
        type: "select",
        multiple: true,
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: null,
        store_name: usePlacesStore,
        continue_url_request: '?limit=9999999999',
        disable_option_in_update_if_option_equal_current: true,
        searchable: true,
        FormExists: true
    },
    {
        label: t("working_days.inputs.status"),
        input_name: "status",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'offline', label: t("working_days.status_closed")},
            {value: 'online', label: t("working_days.status_open")},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: ""
    },
    {
        label: t("working_days.inputs.check_location"),
        input_name: "check_location",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 1, label: t("working_days.yes")},
            {value: 0, label: t("working_days.no")},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: ""
    },
    {
        label: t("working_days.inputs.time_start"),
        input_name: "time_start",
        required: true,
        type: "datetime-local",
        searchable: false,
        FormExists: true,
        icon: ""
    },
    {
        label: t("working_days.inputs.time_end"),
        input_name: "time_end",
        required: true,
        type: "datetime-local",
        searchable: false,
        FormExists: true,
        icon: ""
    },
    {
        label: t("working_days.inputs.allowed_time"),
        input_name: "allowed_time",
        required: true,
        type: "number",
        searchable: false,
        FormExists: true,
        icon: "",
        hint: t("working_days.hints.allowed_time")
    },
    {
        label: t("working_days.inputs.repeat_times"),
        input_name: "repeat_times",
        required: false,
        type: "number",
        searchable: false,
        FormExists: true,
        icon: "",
        hint: t("working_days.hints.repeat_times"),
        visibility: {
            create:true,
            update: false
        }
    },
    {
        label: t("working_days.inputs.remove_days"),
        input_name: "remove_days[]",
        required: false,
        type: "select",
        multiple: true,
        options_getting_data: "fixed",
        options: [
            {value: 'Saturday', label: t("working_days.days.saturday")},
            {value: 'Sunday', label: t("working_days.days.sunday")},
            {value: 'Monday', label: t("working_days.days.monday")},
            {value: 'Tuesday', label: t("working_days.days.tuesday")},
            {value: 'Wednesday', label: t("working_days.days.wednesday")},
            {value: 'Thursday', label: t("working_days.days.thursday")},
            {value: 'Friday', label: t("working_days.days.friday")},
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-calendar-xmark",
        hint: t("working_days.hints.remove_days"),
        visibility: {
            update: false
        },
        conditional: {
            dependsOn: 'repeat_times',
            value: '*'
        }
    },
    {
        label: t("working_days.inputs.limit"),
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
        icon: ""
    },
    {
        label: t("working_days.inputs.start_date"),
        input_name: 'start_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    },
    {
        label: t("working_days.inputs.end_date"),
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: ''
    }
];
