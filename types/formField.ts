export type FieldType = "text" | "number" | "date" | "select" | "file" | "options" | "radio" | 'textarea' | 'phone' | 'datetime-local' | 'geolocation' | 'check-period-amount'|'map'|"polygon-map"; // options for input type select

export interface ConditionalField {
    dependsOn: string;
    value: any;
}

export interface DependencyField {
    field: string;  // field name
    disabledWhenEmpty?: boolean;
    updateUrl?: boolean; // update the continue url with the value
    updateValue?: boolean;  // Trigger value update seperated by comma ( used in bills )
    valuePath?: string;     // Path to the value in the dependent field's options

}

export interface FieldVisibility {
    create?: boolean;
    update?: boolean;
}

export interface BaseField {
    label: string;
    input_name: string;
    required: boolean;
    icon: string | null
    type: FieldType;
    searchable?: boolean
    FormExists?: boolean
    visibility?: FieldVisibility
    conditional?: ConditionalField;
    dependency?: DependencyField;
    serverName?: string;
    errors?:any[];
    readonly? :boolean,
    hint? : string,
    search_name?: string,
}

export interface SelectField extends BaseField {
    options: any[];
    options_getting_data: "fixed" | "api";
    item_title: string;
    item_value: string;
    multiple?: boolean;
    store_name?: any;
    continue_url_request?: string;
    disable_option_in_update_if_option_equal_current?: boolean;

}

export interface RadioField extends BaseField {
    options: any[];
    item_title: string;
    item_value: string;
    inline?: boolean;
}

export interface FileField extends BaseField {
    accept?: string[];
    multiple?: boolean;
}

export interface GeoLocationField extends BaseField {
    submit_as_array : boolean;
}

export type FormField = BaseField | SelectField | FileField | RadioField | GeoLocationField;

