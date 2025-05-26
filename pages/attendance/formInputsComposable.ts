import type {FormField} from "@/types/formField";
import {useWorkingDaysStore} from "~/stores/WorkingDaysStore";
import {useUsersStore} from "~/stores/UsersStore";

export const formInputsComposable: FormField[] = [
    {
        label: "يوم العمل",
        input_name: "working_day_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "name",
        item_value: "id",
        icon: "fa-duotone fa-solid fa-calendar-day",
        store_name: useWorkingDaysStore,
        continue_url_request: '?limit=9999999999',
        searchable: true,
        FormExists: true
    },
    {
        label: "المستخدم",
        input_name: "user_id",
        required: true,
        type: "select",
        options: [],
        options_getting_data: "api",
        item_title: "username",
        item_value: "id",
        icon: "fa-duotone fa-solid fa-user",
        store_name: useUsersStore,
        continue_url_request: '?limit=9999999999',
        searchable: true,
        FormExists: true
    },
    {
        label: "نوع التسجيل",
        input_name: "type",
        required: true,
        type: "radio",
        inline: true,
        options: [
            {value: 'auto', label: 'تلقائي'},
            {value: 'manual', label: 'يدوي'}
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-gear",
        visibility:{
            create:true,
            update:false,
        }
    },
    {
        label: "الموقع الجغرافي",
        input_name: "location",
        required: true,
        type: "geolocation",  // Changed from "text" to "geolocation"
        icon: "fa-duotone fa-solid fa-location-dot",
        searchable: false,
        FormExists: true,
        conditional: {
            dependsOn: 'type',
            value: 'auto'
        },
        placeholder: "سيتم تحديد موقعك الحالي تلقائيًا",
        visibility:{
            create:true,
            update:false,
        }
    },
    {
        label: "حالة الحضور",
        input_name: "status",
        required: true,
        type: "radio",
        inline: true,
        options: [
            {value: 'attend', label: 'حاضر'},
            {value: 'absent', label: 'غائب'}
        ],
        item_title: "label",
        item_value: "value",
        searchable: false,
        FormExists: true,
        icon: "fa-duotone fa-solid fa-clipboard-check"
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
        icon: "fa-duotone fa-solid fa-list-ol"
    },
    {
        label: 'تاريخ البداية',
        input_name: 'start_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: 'fa-duotone fa-solid fa-calendar'
    },
    {
        label: 'تاريخ النهاية',
        input_name: 'end_date',
        required: false,
        type: 'date',
        searchable: true,
        FormExists: false,
        icon: 'fa-duotone fa-solid fa-calendar'
    }
];

