<script setup>
import { defineProps, computed } from "vue";
import { useBoardStore } from "./../stores/useBoardStore";
const BoardStore = useBoardStore();

const props = defineProps({
  bgcolor: {
    type: String,
  },
  message: {
    type: String,
  },
  access: {
    type: String,
    default: "GUEST",
  },
  action: {
    type: Function,
    default: () => {},
  },
});
const access = computed(
  // สำหรับคำนวณ access role ใน current boards เป็น owner ก็ผ่านหมด แต่ถ้าเป็น Reader, Writer ก็สามารถใช้งานได้

  () =>
    BoardStore.getCurrentBoard()?.access === "OWNER" ||
    BoardStore.getCurrentBoard()?.access === props.access ||
    (props.access === "READER" &&
      BoardStore.getCurrentBoard()?.access === "WRITER"),
);
</script>

<template>
  <div
    :class="[!access && 'tooltip cursor-not-allowed']"
    data-tip="You need to be board owner to perform this action."
  >
    <button
      @click="() => action()"
      :disabled="!access"
      class="dis btn min-w-max border-0 p-2 px-2 text-slate-200"
      :style="{ backgroundColor: props.bgcolor }"
    >
      {{ props.message }}
    </button>
  </div>
</template>
