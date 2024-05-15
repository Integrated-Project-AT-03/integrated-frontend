<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,
  statusColor: String,
});
</script>

<template>
  <div v-if="text"
    class="status flex justify-center text-sm w-20 p-2 rounded-xl"
    :style="{ backgroundColor: statusColor }"
  >
  
    {{
      text.length > 10
        ? text.slice(0, 7) + "..."
        : text
    }}
  </div>
</template>
