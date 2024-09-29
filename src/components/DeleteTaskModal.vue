<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteTaskById } from "../services/apiTask";
import Button from "./Button.vue";
import { useTaskStore } from "./../stores/useTaskStore";
const taskStore = useTaskStore();
const router = useRouter();
const route = useRoute();
const emits = defineEmits(["message"]);
const taskSeleted = taskStore.findTask(route.params.id, route.params.oid);

defineProps({ indexValue: Number });
async function deleteTask(id) {
  const res = await deleteTaskById(route.params.id, route.params.oid);
  if (res.httpStatus === 200) {
    taskStore.deleteTask(id);
    emits("message", {
      description: "The task has been deleted.",
      status: "success",
    });
    return router.push({ name: "Task" });
  } else if (res.httpStatus === 404) {
    emits("message", {
      description: `The task does not exist."`,
      status: "error",
    });
    taskStore.deleteTask(route.params.id);
    return router.push({ name: "Task" });
  } else {
    emits("message", {
      description: `Something went wrong.`,
      status: "error",
    });
  }
}
</script>

<template>
  <dialog id="deletetask" class="modal">
    <div class="flex h-auto w-fit flex-col rounded-lg bg-base-100 p-6">
      <div class="text-2xl font-bold text-slate-300">Delete a Task</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to delete the task number {{ indexValue }} -
        {{ taskSeleted?.title }}?
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Confirm"
            @click="deleteTask(route.params.id)"
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel btn-error text-slate-200"
            message="Cancel"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
../lib/fetch.js
