import type {ConditionalField, DependencyField, FieldType, FormField} from "@/types/formField";
import {useOrganizationsStore} from "~/stores/OrganizationsStore";

export const formInputsComposable: FormField[] = [
    {
        label: "الاسم",
        input_name: "name",
        required: true,
        type: "text",
        icon: "fa-duotone fa-solid fa-circle-info",
        searchable: true,
        FormExists: true
    },

    {
        label: "الجامعة",
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
        label: "نوع الموقع",
        input_name: "type",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'gps', label: 'موقع GPS'},
            {value: 'maps', label: 'موقع على الخريطة'},
            {value: 'polygon', label: 'منطقة جغرافية'},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-location-dot",
    },
    
    {
        label: "الموقع على الخريطة",
        input_name: "location",
        required: true,
        type: "map",
        FormExists: true,
        icon: "fa-duotone fa-solid fa-map-location-dot",
        conditional: {
            dependsOn: 'type',
            value: 'maps'
        },
    },
    
    {
        label: "موقع GPS",
        input_name: "location",
        required: true,
        type: "geolocation",
        FormExists: true,
        icon: "fa-duotone fa-solid fa-location-crosshairs",
        conditional: {
            dependsOn: 'type',
            value: 'gps'
        },
        submit_as_array: true,
    },
    
    {
        label: "رسم المنطقة الجغرافية",
        input_name: "location",
        required: true,
        type: "polygon-map",
        FormExists: true,
        icon: "fa-duotone fa-solid fa-draw-polygon",
        conditional: {
            dependsOn: 'type',
            value: 'polygon'
        },
    },
    
    {
        label: "المساحة (بالمتر المربع)",
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
        label: "المساحة (بالمتر المربع)",
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
        label: "نوع التسجيل",
        input_name: "attendance_action",
        required: true,
        type: "select",
        options_getting_data: "fixed",
        options: [
            {value: 'check_in', label: 'تسجيل دخول'},
            {value: 'check_in_check_out', label: 'تسجيل دخول وخروج'},
        ],
        item_title: "label",
        item_value: "value",
        searchable: true,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-clipboard-check",
    },

    {
        label: "عدد الصفوف",
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
