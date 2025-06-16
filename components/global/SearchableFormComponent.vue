<template>
  <v-col cols="12">
    <client-only>
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="2" xl="2" v-for="(i,key) in filteredInputs" :key="key" class="pa-2">
          <v-text-field v-if="!(i['type'] == 'select' || i['type'] == 'file') && i?.searchable"
                        :label="i['label']"
                        :name="i['input_name']"
                        :prepend-inner-icon="i['icon']"
                        :required="i['required']"
                        :type="i['type']"
                        variant="outlined"
                        density="compact"
                        v-model="search_inputs[i['input_name']]"
                        persistent-placeholder

          >
          </v-text-field>
          <v-select v-else-if="i['type'] == 'select' && i?.searchable"
                    :items="i['input_name'] !== 'limit'
                    ? [ { [i['item_value']]: '', [i['item_title']]: t('global.all') }, ...i['options'] ]
                    : i['options']"
                    :name="i['search_name'] ?? i['input_name']"
                    :item-value="i['item_value']"
                    :item-title="i['item_title']"
                    :label="i['label']"
                    :loading="i['loading']"
                    :required="i['required']"
                    density="compact"
                    variant="outlined"
                    persistent-placeholder
                    v-model="search_inputs[i['search_name'] ?? i['input_name']]"
                    :disabled="isDisabled(i)"
          ></v-select>
        </v-col>
      </v-row>
    </client-only>
  </v-col>
</template>
<script setup lang="ts">
import {reactive, watch, watchEffect, computed} from "vue";
import {useI18n} from '#imports'

const {t} = useI18n()
let props = defineProps(["inputs", "page", "continue_url_search", "store_name"]);
let search_inputs = reactive({});
const isInitialLoad = ref(true);
const loadingStates = reactive<Record<string, boolean>>({});

for (let input of props.inputs) {
  if (input?.searchable) {
    search_inputs[input.input_name] = "";
  }
}

onMounted(()=>{     // INQUIRY: why was this added ? it does an extra request on every page load
  console.log('from searchable')
  props.store_name.get_all_data((props.continue_url_search ?? ''));
})

const dependencyValues = computed(() => {
  const values: Record<string, any> = {};
  for (const input of props.inputs) {
    if (input?.dependency?.updateUrl) {
      values[input.dependency.field] = search_inputs[input.dependency.field];
    }
  }
  return values;
});

watch(
    dependencyValues,
    async (newDeps, oldDeps) => {
      const changedDeps = Object.keys(newDeps).filter(key => newDeps[key] !== oldDeps?.[key]);

      if (changedDeps.length > 0) {
        const promises = props.inputs.map(async (input) => {
          if (input?.dependency?.updateUrl && changedDeps.includes(input.dependency.field)) {
            loadingStates[input.input_name] = true;
            try {
              await handleInputsApi([input], search_inputs);
            } finally {
              loadingStates[input.input_name] = false;
            }
          }
        });

        await Promise.all(promises);
      }
    },
    {deep: true}
);

// filter fields that will be rendered so that it does not take space even if not visible
const filteredInputs = computed(() => {
  return props.inputs.filter(input => {
    const isSearchable = input?.searchable;
    const type = input?.type || "";
    return isSearchable && (type === "select" || (type !== "select" && type !== "file"));
  });
});

function executeSearch() {
  const queryString = Object.entries(search_inputs)
      .filter(([key, value]) => value !== null && value !== undefined && value.toString().trim() !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

  if (!isInitialLoad.value) {
    props.store_name.get_all_data((props.continue_url_search ?? '') + '?' + queryString);
  }
  isInitialLoad.value = false;
}

watchEffect(() => {
  search_inputs.page = props.page;
  +executeSearch();
});

function isDisabled(input) {
  const hasEmptyDependency = input.dependency?.disabledWhenEmpty &&
      (!search_inputs[input.dependency.field] ||
          search_inputs[input.dependency.field] === '');

  return hasEmptyDependency || loadingStates[input.input_name];
}

</script>

<style scoped>

</style>