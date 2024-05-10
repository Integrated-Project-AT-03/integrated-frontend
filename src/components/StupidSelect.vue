<script setup>
import { onMounted, ref, watch } from "vue";
const selectStatus = ref();
import { getItems, changeTasksStatus } from "../assets/fetch.js";
const uri = import.meta.env.VITE_SERVER_URI;
const props = defineProps({
  selectedId: Number,
});
const newIdStatus = ref(1);
defineEmits(["close"]);
onMounted(async () => {
  selectStatus.value = await getItems(`${uri}/v2/statuses`);
});
const submit = async () => {
  console.log(newIdStatus.value);
  const updatedTasks = await changeTasksStatus(
    `${uri}/v2/tasks/status`,
    props.selectedId,
    newIdStatus.value
  );

  console.log(updatedTasks);
};
</script>

<template>
  <div
    v-show="!isOpen"
    class="w-full top-0 h-full absolute flex justify-center items-center z-20"
  >
    <div class="w-[300px] p-10 flex flex-col gap-2 bg-slate-50 h-max">
      <select v-model="newIdStatus" class="select select-ghost w-full max-w-xs">
        <option
          :disabled="selectedId === status.id"
          v-for="status in selectStatus"
          :key="status.id"
          :value="status.id"
        >
          {{ status.name }}
        </option>
      </select>

      <button @click="[submit(), $emit('close')]" className="btn btn-primary">
        Click Me!
      </button>

      <button @click="$emit('close')" className="btn btn-primary">
        Close Me!
      </button>
    </div>
  </div>
</template>
