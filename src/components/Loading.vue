<script setup>
defineProps({ isLoading: { type: Boolean, require: true } });
</script>
<template>
  <div
    v-show="isLoading"
    class="h-full bg-gray-950 opacity-60 w-full flex justify-center items-center absolute"
  >
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>
