<script setup>
import { onMounted, ref } from "vue";
import TaskStatusManagement from "@/lib/TaskStatusManagement";
import Button from "./ButtonModal.vue";
const datas = ref(TaskStatusManagement);
const selectStatus = ref();
import { getItems, changeTasksStatus } from "../lib/fetch.js";
const uri = import.meta.env.VITE_SERVER_URI;
const props = defineProps({
  selectedStatus: Object,
});
const newIdStatus = ref(null);
const emits = defineEmits(["close", "message", "update:modelValue"]);
onMounted(async () => {
  emits("update:modelValue", true);
  selectStatus.value = (await getItems(`${uri}/v2/statuses`)).items;
  emits("update:modelValue", false);
});
const submit = async () => {
  emits("update:modelValue", true);
  const res = await changeTasksStatus(
    `${uri}/v2/statuses`,
    props.selectedStatus.id,
    newIdStatus.value.id
  );
  emits("update:modelValue", false);
  if (res.httpStatus === 200) {
    emits("message", {
      description: `${res.body} task(s) have been transferred and the status has been deleted.`,
      status: "success",
    });
    datas.value.deleteStatus(props.selectedStatus.id);
    emits("close");
  } else if (res.httpStatus === 500 || res.httpStatus === 404) {
    emits("message", {
      description: `${res.body.message}`,
      status: "error",
    });
  } else if (res.httpStatus === 404) {
    emits("message", {
      description: `${res.body.message}`,
      status: "error",
    });
    datas.value.deleteStatus(props.selectedStatus.id);
  } else if (res.httpStatus === 400) {
    console.log(selectStatus.value);
    emits("message", {
      description: `Cannot transfer to ${newIdStatus.value.name} status since it will exceed the limit.  Please choose another status to transfer to.`,
      status: "error",
    });
  } else {
    emits("message", {
      description: `something went wrong, please try again`,
      status: "error",
    });
  }
};
</script>

<template>
  <div
    class="w-full top-0 h-full absolute flex justify-center items-center z-20"
  >
    <div
      class="relative overflow-hprops.selectedIdden w-max h-max py-4 px-10 bg-neutral drop-shadow-2xl rounded-2xl"
    >
      <div class="text-xl font-semibold">Transfer a Status</div>
      <div class="divider"></div>
      <div class="flex flex-col">
        <div class="itbkk-message">
          There is some task associated with the
          {{ selectedStatus.name }} status.
        </div>
        <div class="flex items-center gap-3">
          <div class="itbkk-status">Transfer to</div>
          <select
            v-model="newIdStatus"
            class="itbkk-status select w-48 max-w-xs bg-base-100"
          >
            <option
              :disabled="selectedStatus.id === status.id"
              v-for="status in selectStatus"
              :key="status.id"
              :value="status"
            >
              {{ status.name }}
            </option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="flex justify-end">
          <Button
            class="itbkk-button-cancel w-16 hover:bg-base-100 hover:border-base-100 mr-3"
            message="Cancel"
            @click="$emit('close')"
          />
          <Button
            class="itbkk-button-comfirm btn-success w-16 hover:bg-base-100 hover:border-base-100 ml-1"
            message="Transfer and Delete"
            :disabled="!newIdStatus"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
