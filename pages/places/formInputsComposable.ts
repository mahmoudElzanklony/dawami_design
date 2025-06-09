import type {ConditionalField, DependencyField, FieldType, FormField} from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('places.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon: "",
        searchable: true,
        FormExists: true
    },

    {
        label: t('places.organization'),
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
        label: t('places.type'),
        input_name: "type",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'polygon', label: t('places.types.polygon')},
            {value: 'gps', label: t('places.types.gps')},
            {value: 'maps', label: t('places.types.maps')},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: "",
    },
    
    {
        label: t('places.map_location'),
        input_name: "location",
        required: true,
        type: "map",
        FormExists: true,
        icon: "",
        conditional: {
            dependsOn: 'type',
            value: 'maps'
        },
    },
    
    {
        label: t('places.gps_location'),
        input_name: "location",
        required: true,
        type: "geolocation",
        FormExists: true,
        icon: "",
        conditional: {
            dependsOn: 'type',
            value: 'gps'
        },
        submit_as_array: true,
    },
    
    {
        label: t('places.polygon_area'),
        input_name: "location",
        required: true,
        type: "polygon-map",
        FormExists: true,
        icon: "",
        conditional: {
            dependsOn: 'type',
            value: 'polygon'
        },
    },
    
    {
        label: t('places.area_in_meters'),
        input_name: "area_in_meters",
        required: false,
        type: "number",
        icon: "fa-duotone fa-solid fa-ruler",
        searchable: false,
        FormExists: true,
        conditional: {
            dependsOn: 'type',
            value: 'gps'
        },
    },
    {
        label: t('places.area_in_meters'),
        input_name: "area_in_meters",
        required: false,
        type: "number",
        icon: "fa-duotone fa-solid fa-ruler",
        searchable: false,
        FormExists: true,
        conditional: {
            dependsOn: 'type',
            value: 'maps'
        },
    },
    {
        label: t('places.attendance_action'),
        input_name: "attendance_action",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'check_in', label: t('places.attendance_actions.check_in')},
            {value: 'check_in_check_out', label: t('places.attendance_actions.check_in_check_out')},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-clipboard-check",
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
        icon: "fa-duotone fa-solid fa-list-ol",
    },
];
