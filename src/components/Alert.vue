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
    class="alert"
    :class="status === 'success' ? 'alert-success' : 'alert-error'"
  >
    <CorrectIcon v-show="status === 'success'" />
    <ErrorIcon v-show="status === 'error'" />
    <span class="tbkk-message"> {{ message }}</span>
  </div>
</template>
