import type { FormField } from "@/types/formField";
import { usePackagesStore } from "~/stores/PackagesStore";

export const getFormInputs = (t: (key: string) => string): FormField[] => [
    {
        label: t('organizations.name'),
        input_name: "name",
        required: true,
        type: "text",
        icon:"",
        searchable:true,
        FormExists:true,
    },
    {
        label: t('organizations.package'),
        input_name: "package_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: "",
        store_name: usePackagesStore,
        continue_url_request: '?limit=9999999999',
        searchable: false,
        FormExists: true
    },
    {
        label: t('organizations.description'),
        input_name: "info",
        required: false,
        type: "textarea",
        icon:"",
        searchable:false,
        FormExists:true,
    },
    {
        label: t('organizations.image'),
        input_name: "image",
        required: false,
        type: "file",
        icon:"fa-duotone fa-solid fa-image",
        accept:['image/png','image/jpg'],
        FormExists:true
    },
    {
        label: t('global.row_count'),
        input_name: "limit",
        required: false,
        type: "select",
        options_getting_data: 'fixed',
        options:[
            {value: '10', label: '10'},
            {value: '20', label: '20'},
            {value: '30', label: '30'},
            {value: '40', label: '40'},
            {value: '50', label: '50'},
        ],
        item_title: "label",
        item_value: "value",
        icon:"",
        searchable:true,
        FormExists:false,
    },
    {
        label: t('global.start_date'),
        input_name: 'start_date',
        required: false,
        type: 'date',
        searchable:true,
        FormExists:false,
        icon:''
    },
    {
        label: t('global.end_date'),
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable:true,
        FormExists:false,
        icon:''
    }
];