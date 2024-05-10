<script setup>
import { onMounted, ref, watch } from "vue";
const selectStatus = ref();
import { getItems } from "../assets/fetch.js";
const uri = import.meta.env.VITE_SERVER_URI;
defineProps({
  selectedId: Number,
});
defineEmits(["close"]);
onMounted(async () => {
  selectStatus.value = await getItems(`${uri}/v2/statuses`);
  console.log(selectStatus.value);
});
</script>

<template>
  <div
    v-show="!isOpen"
    class="w-full top-0 h-full absolute flex justify-center items-center z-20"
  >
    <div class="w-[300px] p-10 flex flex-col gap-2 bg-slate-50 h-max">
      <select class="select select-ghost w-full max-w-xs">
        <option
          :disabled="selectedId === status.id"
          :selected="index === 0"
          v-for="(status, index) in selectStatus"
        >
          {{ status.name }}
        </option>
      </select>

      <button className="btn btn-primary">Click Me!</button>

      <button @click="$emit('close')" className="btn btn-primary">
        Close Me!
      </button>
    </div>
  </div>
</template>
