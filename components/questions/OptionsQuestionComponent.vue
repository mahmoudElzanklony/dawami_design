<template>
  <div>
    <div v-if="options?.length > 0">
      <v-row class="align-center" v-for="(i,key) in options" :key="key">
        <v-col cols="1" class="flex-column align-center justify-center control" >
          <div v-if="i?.hasOwnProperty('id')">
            <input type="hidden" :name="'options['+key+'][id]'" :value="i['id']">
          </div>

          <span class="cursor-pointer delete-icon"><i class="fa-duotone fa-solid fa-trash red" @click="removeOption(key)"></i></span>
          <input type="checkbox" :name="'options['+key+'][is_correct]'" :value="1" :checked="i['is_correct'] == 1">

        </v-col>
        <v-col cols="11">
          <v-text-field
              :name="'options['+key+'][option]'"
               v-model="i['option']"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row class="align-center">
        <v-col cols="1" class="flex-column align-center justify-center">
          <input type="hidden" name="options[][id]">
          <span class="cursor-pointer delete-icon"><i class="fa-duotone fa-solid fa-trash red"></i></span>
          <input type="checkbox" name="options[][is_correct]">
        </v-col>
        <v-col cols="11">
          <v-text-field
              :name="'options[][option]'"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </div>
    <v-btn
        class="text-none font-weight-regular bg-primary-color white"
        prepend-icon="mdi-plus"
        :text="$t('questions.options.add_more')"
        @click="addOption"
    ></v-btn>
  </div>
</template>

<script setup lang="ts">
  import {reactive , ref} from "vue";
  import { deleteItemComposable } from "~/composables/DeleteItemComposable";
  import {useQuestionStore} from "~/stores/QuestionsStore";
  const store = useQuestionStore()

  const { $swal } = useNuxtApp();

  let props = defineProps(['info'])
  let options = ref(props?.info?.options)

  function addOption(){
    options.value.push({option:'',is_correct:false})
  }
  async function removeOption(key){

    if(options.value[key].hasOwnProperty('id') && !isNaN(options.value[key]?.id)){
      let process = await deleteItemComposable(store,'delete-option/'+options.value[key]['id'])
      if (process) {
        options.value.splice(key,1)
      }
    }else {
      options.value.splice(key, 1)
    }


  }
</script>


<style scoped>
input[type="checkbox"],.delete-icon{
  width:20px;
  height: 20px;
  display: inline-block;
  font-size: 20px;
}
.control{
  position: relative;
  top:-7px
}
</style>