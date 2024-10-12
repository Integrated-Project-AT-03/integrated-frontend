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
  // ถ้าไม่มีการใส่ access แปลว่าทุกคนมีสิทธิ์กดปุ่มนี้
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
    props.access.includes(boardStore.getCurrentBoard()?.access),
);
</script>

<template>
  <div
    :class="[!access && 'tooltip cursor-not-allowed']"
    data-tip="You need to be board owner to perform this action."
  >
    <button
      @click="() => action()"
      :disabled="!access || disabled"
      class="dis btn min-w-max border-0 p-2 px-2 text-slate-200"
      :style="{ backgroundColor: props.bgcolor }"
    >
      {{ props.message }}
    </button>
  </div>
</template>
