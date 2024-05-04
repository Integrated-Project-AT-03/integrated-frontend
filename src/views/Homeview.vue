<script setup>
import { onMounted, ref } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import Loading from "./../components/Loading.vue";
import { useRoute } from "vue-router";
import { getItems } from "./../assets/fetch.js";
import Alert from "@/components/Alert.vue";
const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const isLoading = ref(true);

onMounted(async function () {
  const data = await getItems(`${uri}/v1/tasks`);
  isLoading.value = false;
  datas.value.setTasks(data);
});
</script>

<template>
  <Loading :is-loading="isLoading" />
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
    <div class="itbkk-button-add flex justify-end">
      <button
        @click="$router.push({ name: 'AddTask' })"
        class="btn itbkk-button-add btn-secondary text-slate-300"
      >
        + Add task
      </button>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            No.
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Assignees
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Status
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
          v-for="(data, index) in datas.getTasks()"
          :key="data.id"
          @click="$router.push({ name: 'TaskDetail', params: { id: data.id } })"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="itbkk-title px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ data.title }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div
              class="text-sm text-gray-900 itbkk-assignees"
              :class="data?.assignees ?? 'italic'"
            >
              {{ data?.assignees ?? "Unassigned" }}
            </div>
          </td>
          <td class="itbkk-status px-6 py-4 whitespace-nowrap">
            <div
              class="flex justify-center w-20 p-2 rounded-xl text-slate-200"
              :class="
                data.status === 'No Status'
                  ? 'text-sm bg-red-400'
                  : data.status === 'To Do'
                  ? 'text-sm bg-yellow-500'
                  : data.status === 'Doing'
                  ? 'text-sm bg-blue-500'
                  : data.status === 'Done'
                  ? 'text-sm bg-success'
                  : 'text-gray-300'
              "
            >
              {{ data.status }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
