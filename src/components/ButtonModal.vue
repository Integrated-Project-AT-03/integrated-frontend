<script setup>

import { defineProps } from 'vue';

const props = defineProps({
  bgcolor: {
    type: String
  },
  message: {
    type: String
  }
})

</script>

<template>

  <button class="btn border-0 text-slate-200 p-2 w-[8rem]" :style="{ backgroundColor: props.bgcolor }">
    {{ props.message }}
  </button>

</template>