<script setup>
import { defineProps } from "vue";

const props = defineProps({
  bgcolor: {
    type: String,
  },
  message: {
    type: String,
  },
});
</script>

<template>
  <button
    class="btn min-w-max border-0 p-2 px-2 text-slate-200"
    :style="{ backgroundColor: props.bgcolor }"
  >
    {{ props.message }}
  </button>
</template>
