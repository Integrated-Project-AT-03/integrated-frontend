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
  () =>
    BoardStore.getCurrentBoard()?.access === "OWNER" ||
    BoardStore.getCurrentBoard()?.access === props.access,
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
