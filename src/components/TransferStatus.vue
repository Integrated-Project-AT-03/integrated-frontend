<script setup>
import { onMounted, ref } from "vue";
const selectStatus = ref();
import { getItems, changeTasksStatus } from "../assets/fetch.js";
const uri = import.meta.env.VITE_SERVER_URI;
const props = defineProps({
  selectedId: Number,
});
const newIdStatus = ref(1);
defineEmits(["close", "message"]);
onMounted(async () => {
  selectStatus.value = await getItems(`${uri}/v2/statuses`);
});
const submit = async () => {
  const res = await changeTasksStatus(
    `${uri}/v2/tasks/status`,
    props.selectedId,
    newIdStatus.value
  );

  if (res === 404) {
  }
};
</script>

<template>
  <div
    class="w-full top-0 h-full absolute flex justify-center items-center z-20"
  >
    <div
      class="relative overflow-hidden w-max h-max py-3 px-10 bg-neutral drop-shadow-2xl rounded-2xl"
    >
      <div class="text-xl mt-4 ml-6 font-semibold">Transfer a Status</div>
      <div class="divider"></div>
      <div class="flex flex-col gap-3">
        <div class="itbkk-message ml-12">
          There is some task associated with the Doing status.
        </div>
        <div class="flex items-center gap-3">
          <div class="itbkk-status ml-12">Transfer to</div>
          <select
            v-model="newIdStatus"
            class="itbkk-status select w-48 max-w-xs bg-base-100"
          >
            <option
              :disabled="selectedId === status.id"
              v-for="status in selectStatus"
              :key="status.id"
              :value="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="flex justify-end mt-4 mr-4 gap-3">
          <button
            @click="$emit('close')"
            class="itbkk-button-cancel btn btn-danger w-16 hover:bg-base-100 hover:border-base-100 mr-3"
          >
            Cancel
          </button>
          <button
            :disabled="selectStatus === selectedId"
            @click="[submit(), $emit('close')]"
            class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100 ml-1"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
