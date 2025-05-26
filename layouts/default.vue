<template>
  <v-app>
    <navbar-component/>
    <v-main>
      <div class="content pa-6">
        <NuxtPage/>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

import NavbarComponent from "~/components/global/NavbarComponent.vue";
</script>


<style scoped>

</style>