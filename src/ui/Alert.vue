<script setup>
import CorrectIcon from "./../assets/icons/CorrectIcon.vue";
import ErrorIcon from "./../assets/icons/ErrorIcon.vue";
const props = defineProps({
  status: {
    validator(value, props) {
      return ["success", "error"].includes(value);
    },
    default: "success",
  },
  message: String,
});
</script>
<template>
  <div
    :role="status"
    class="alert flex fixed bottom-2 right-2 z-[10000]  w-fit"
    :class="status === 'success' ? 'alert-success' : 'alert-error'"
  >
    <CorrectIcon v-show="status === 'success'" />
    <ErrorIcon v-show="status === 'error'" />
    <span class="tbkk-message text-xs lg:text-sm">{{ message }}</span>
  </div>
</template>
