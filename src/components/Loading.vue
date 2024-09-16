<script setup>
defineProps({ isLoading: { type: Boolean, require: true } });
</script>
<template>
  <div
    v-show="isLoading"
    class="absolute top-0 flex h-full w-full items-center justify-center bg-gray-950 opacity-60"
  >
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>
