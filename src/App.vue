<script setup>
import Homeview from "./views/Homeview.vue";
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="page-opacity">
      <component :is="Component" />
    </transition>
  </router-view>
  <Homeview />
</template>

<style scoped></style>
