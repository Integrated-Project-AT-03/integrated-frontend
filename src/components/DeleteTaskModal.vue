<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteItemById } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";
const emits = defineEmits(["message"]);
const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
const titleTask = datas.value.findTask(route.params.id)?.title;
async function deleteTask(id) {
  const deleteTask = await deleteItemById(`${uri}/v1/tasks`, route.params.id);
  if (deleteTask === 200) {
    datas.value.deleteTask(id);
    emits("message", {
      description: "The task has been deleted",
      status: "success",
    });
  } else {
    emits("message", {
      description: `The task does not exist"  `,
      status: "error",
    });
  }
  return router.push({ name: "Task" });
}
</script>

<template>
  <div class="w-full h-full absolute flex justify-center items-center z-20">
    <div class="flex flex-col rounded-lg p-6 bg-base-100 h-auto w-fit">
      <div class="text-2xl font-bold text-slate-300">Delete a Task</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to delete the task number {{ 0 }} - {{ titleTask }}?
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <button
          class="itbkk-button-cancel btn btn-error text-slate-200"
          @click="router.push({ name: 'TaskDetail' })"
        >
          Cancel
        </button>
        <button
          class="itbkk-button-confirm btn btn-success text-slate-200"
          @click="deleteTask(route.params.id)"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
