<script setup>
import { onMounted, ref } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import { useRoute, useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";
import ChevronRight from '../assets/icons/ChevronRight.vue' 

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const router = useRouter();
</script>
 
<template>
  <div
    class="container mx-auto flex flex-col gap-3"
    :class="route.fullPath.split('/').length > 2 && 'blur-sm'"
  >
    <div class="text-5xl font-extrabold ... w-full flex justify-center m-7">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      >
        <div class="text-5xl">IT-Bangmod Kradan Kanban</div>
      </span>
    </div>
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div @click="router.push({ name: 'Task'})" class="itbkk-button-home text-xl font-bold cursor-pointer">Home</div>
        <ChevronRight />
        <div @click="router.push({ name : 'Statuses'})" class="text-xl font-bold cursor-pointer text-primary">Task Status</div>
      </div>
      <div class="flex justify-end gap-4">
        <button
          class="itbkk-button-add btn btn-secondary text-slate-300"
        >
          Add Status
        </button>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Description
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody class="bg-slate-100 divide-y divide-gray-300">
        <tr v-show="datas.getTasks().length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-900">
            No task
          </td>
        </tr>
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(task, index) in datas.getTasks()"
          :key="task.id"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ task.id }}</div>
          </td>
          <td class="itbkk-title px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ task.title }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div
              class="text-sm text-gray-900 itbkk-assignees"
              :class="task?.assignees ?? 'italic'"
            >
              {{ task?.assignees ?? "Unassigned" }}
            </div>
          </td>
          <td class="itbkk-status px-6 py-4 whitespace-nowrap">
            <div
              class="flex justify-center w-20 p-2 rounded-xl text-slate-200"
              :class="
                task.status === 'No Status'
                  ? 'text-sm bg-red-400'
                  : task.status === 'To Do'
                  ? 'text-sm bg-yellow-500'
                  : task.status === 'Doing'
                  ? 'text-sm bg-blue-500'
                  : task.status === 'Done'
                  ? 'text-sm bg-success'
                  : 'text-gray-300'
              "
            >
              {{ task.status }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
 
<style scoped>

</style>