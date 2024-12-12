<script setup>
import { defineProps, computed } from "vue";
import { useBoardStore } from "./../stores/useBoardStore";
const boardStore = useBoardStore();

const props = defineProps({
  bgcolor: {
    type: String,
  },
  message: {
    type: String,
  },
  access: {
    type: Array,
    default: ["GUEST", "READER", "WRITER"],
  },
  action: {
    type: Function,
    default: () => {},
  },
  disabled: {
    default: false,
  },
});
const access = computed(
  () =>
    boardStore.getCurrentBoard()?.access === "OWNER" ||
    props.access.includes(boardStore.getCurrentBoard().access),
);
</script>

<template>
  <div
    :class="[!access && 'tooltip cursor-not-allowed']"
    :data-tip="
      props.access.includes('WRITER')
        ? 'You need to be board owner or has write access to perform this action.'
        : 'You need to be board owner to perform this action.'
    "
  >
    <button
      @click="() => action()"
      :disabled="!access || disabled"
      class="dis btn-sm lg:btn-md btn w-full lg:w-max border-0 md:py-1 md:px-4 text-slate-200"
      :style="{ backgroundColor: props.bgcolor }"
    >
      <div class="md:text-sm">{{ props.message }}</div>
    </button>
  </div>
</template>
