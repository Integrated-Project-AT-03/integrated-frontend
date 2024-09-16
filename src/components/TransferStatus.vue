<script setup>
import { onMounted, ref } from "vue";
import Button from "./ButtonModal.vue";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
import { useTaskStore } from "./../stores/useTaskStore";
import { useRoute } from "vue-router";
import {
  transferTasksToNewStatus,
  getStatusesByNanoIdBoard,
} from "../services/apiStatus";

const taskStore = useTaskStore();
const statusStore = useTaskStatusStore();
const route = useRoute();
const selectStatus = ref();
const props = defineProps({
  sourceStatus: Object,
});
const destinationStatus = ref(null);
const emits = defineEmits(["close", "message", "update:modelValue"]);


onMounted(async () => {
  emits("update:modelValue", true);
  selectStatus.value = (await getStatusesByNanoIdBoard(route.params.oid)).data;
  emits("update:modelValue", false);
});
const submit = async () => {
  emits("update:modelValue", true);
  const res = await transferTasksToNewStatus(
    props.sourceStatus.id,
    destinationStatus.value.id,
    route.params.oid,
  );
  emits("update:modelValue", false);
  if (res.httpStatus === 200) {
    emits("message", {
      description: `${res.data} task(s) have been transferred and the status has been deleted.`,
      status: "success",
    });
    const oldStatusName = statusStore.findStatus(props.sourceStatus.id).name;
    const newStatusName = statusStore.findStatus(
      destinationStatus.value.id,
    ).name;
    statusStore.deleteStatus(props.sourceStatus.id);
    taskStore.changeIdStatusOfTask(oldStatusName, newStatusName);
    emits("close");
  } else if (res.httpStatus === 500 || res.httpStatus === 404) {
    emits("message", {
      description: `${res.data.message}`,
      status: "error",
    });
  } else if (res.httpStatus === 404) {
    emits("message", {
      description: `${res.data.message}`,
      status: "error",
    });
    statusStore.deleteStatus(props.sourceStatus.id);
  } else if (res.httpStatus === 400) {
    emits("message", {
      description: `Cannot transfer to ${destinationStatus.value.name} status since it will exceed the limit.  Please choose another status to transfer to.`,
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
  <Teleport to="body">
    <div
      class="absolute top-0 z-20 flex h-full w-full items-center justify-center"
    >
      <div
        class="overflow-hprops.selectedIdden relative h-max w-max rounded-2xl bg-neutral px-10 py-4 drop-shadow-2xl"
      >
        <div class="text-xl font-semibold">Transfer a Status</div>
        <div class="divider"></div>
        <div class="flex flex-col">
          <div class="itbkk-message">
            There is some task associated with the
            {{ sourceStatus.name }} status.
          </div>
          <div class="flex items-center gap-3">
            <div class="itbkk-status">Transfer to</div>
            <select
              v-model="destinationStatus"
              class="itbkk-status select w-48 max-w-xs bg-base-100"
            >
              <option
                :disabled="sourceStatus.id === status.id"
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
              class="itbkk-button-cancel mr-3 w-16 hover:border-base-100 hover:bg-base-100"
              message="Cancel"
              @click="$emit('close')"
            />
            <Button
              class="itbkk-button-comfirm btn-success ml-1 w-16 hover:border-base-100 hover:bg-base-100"
              message="Transfer and Delete"
              :disabled="!destinationStatus"
              @click="submit"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
@/lib/StatusManagement.js
