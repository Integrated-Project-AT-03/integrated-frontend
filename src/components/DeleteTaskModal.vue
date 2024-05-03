<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteItemById } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
async function deleteTask() {
  const deleteTask = await deleteItemById(`${uri}/v1/tasks`, route.params.id);
  datas.value.deleteTask(id);
  router.push({ name: "Task" });
  return deleteTask;
}
</script>

<template>
  <div class="w-full h-full absolute flex justify-center items-center z-20">
    <div
      class="flex flex-col border border-black rounded-lg p-4 bg-white h-auto w-fit"
    >
      <div class="text-2xl text-black font-bold border-b border-gray-300 pb-4">
        Delete a Task
      </div>
      <br />
      <div class="itbkk-message text-black border-gray-300 pb-4">
        Do you want to delete the task "Infrastructure"?
      </div>

      <div class="flex gap-2 justify-end mt-2">
        <button
          class="itbkk-button-confirm btn btn-success text-white w-20 hover:bg-base-100 hover:border-base-100"
          @click="deleteTask()"
        >
          Confirm
        </button>
        <button
          class="itbkk-button-confirm btn btn-error text-white w-20 hover:bg-base-100 hover:border-base-100"
          @click="router.push({ name: 'TaskDetail' })"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
