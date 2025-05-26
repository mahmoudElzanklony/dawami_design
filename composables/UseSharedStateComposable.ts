import {ref} from 'vue';
import getValueByPath from '~/composables/getValueByPathComposable';
// Type for field mappings
type FieldMapping = {
    [inputName: string]: string | ((sourceObj: Record<string, any>) => any);
};

// the field mapping object is used in case the returned value name is different than the input or nested and its value can either be a function or a string with the path
export function useSharedStateComposable(current_item: any, fieldMappings?: FieldMapping) {
    const dialogSwitch = ref(false);
    const search_inputs = ref('')
    let currentItem = ref<Record<string, any>>({});

    // Dynamically populate currentItem based on current_item
    for (let item of current_item) {
        let input_name = item?.input_name;
        if (input_name) {
            currentItem.value[input_name] = item?.multiple ? [] : null; // Set each key to null
        }
    }

    const page = ref(1);
    const limit = ref(10);
    const tab = ref(null);

    function update_current_item(obj: Record<string, any>) {
        if (fieldMappings) {
            for (let key in fieldMappings) {
                if (key in currentItem.value) {
                    const mapping = fieldMappings[key];

                    if (typeof mapping === 'function') {
                        currentItem.value[key] = mapping(obj);
                    } else if (typeof mapping === 'string') {
                        currentItem.value[key] = getValueByPath(obj, mapping);
                    }
                }
            }
        }
        for (let key in obj) {
            if (!fieldMappings || !(key in fieldMappings)) {
                currentItem.value[key] = obj[key];
            }
        }

        dialogSwitch.value = true;
    }

    function resetCurrentItem(item_obj: Record<string, any>) {
        if (Object.keys(currentItem.value)?.length > 0) {
            for (let key of Object.keys(currentItem.value)) {
                currentItem.value[key] = null
            }
        }
    }

    return {
        dialogSwitch,
        currentItem,
        update_current_item,
        page,
        tab,
        resetCurrentItem,
        limit
    };
}
