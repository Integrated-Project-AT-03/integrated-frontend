<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteItemById } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";
import Button from "./ButtonModal.vue";

const emits = defineEmits(["message"]);
const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
const taskSeleted = datas.value.findTask(route.params.id);
async function deleteTask(id) {
  const res = await deleteItemById(`${uri}/v2/tasks`, route.params.id);
  if (res.httpStatus === 200) {
    datas.value.deleteTask(id);
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
    datas.value.deleteTask(route.params.id);
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
    <div class="flex flex-col rounded-lg p-6 bg-base-100 h-auto w-fit">
      <div class="text-2xl font-bold text-slate-300">Delete a Task</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to delete the task number {{ taskSeleted?.id }} -
        {{ taskSeleted?.title }}?
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <Button class="itbkk-button-confirm btn-success text-slate-200" message="Confirm" @click="deleteTask(route.params.id)"/>
        </form>
        <form method="dialog">
          <Button class="itbkk-button-cancel btn-error text-slate-200" message="Cancel"/>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
