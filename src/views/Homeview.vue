<script setup>
import { onMounted, ref, watch } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import Modal from "@/components/Modal.vue";
import { useRoute, useRouter } from "vue-router";
const datas = ref(TaskManagement);
import { getItems, getItemById } from "./../assets/fetch.js";
const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const router = useRouter();
const dataModal = ref({});
onMounted(async function () {
  const data = await getItems(`${uri}/v1/tasks`);
  datas.value.setTasks(data);
});
async function loadTask(id) {
  const showTask = await getItemById(`${uri}/v1/tasks`, id);
  if (showTask.status === 404) return router.push({ name: "Task" });
  dataModal.value = showTask;
  document.getElementById("my_modal_1").showModal();
}
watch(
  () => route.params.id,
  () => {
    if (route.params.id) loadTask(route.params.id);
  }
);
</script>

<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center m-7">
      <div class="text-4xl">IT-Bangmod Kradan Kanban</div>
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
          class="itbkk-item hover:bg-slate-200"
          v-for="(data, index) in datas.getTasks()"
          :key="index"
          @click="
            $router.push({ name: 'TaskDetail', params: { id: data.idTask } })
          "
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ data.idTask }}</div>
          </td>
          <td class="itbkk-title px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ data.title }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div
              class="text-sm text-gray-900 itbkk-assignees"
              :class="data?.assignees === '' && 'italic'"
            >
              {{ data?.assignees !== "" ? data.assignees : "Unassigned" }}
            </div>
          </td>
          <td class="itbkk-status px-6 py-4 whitespace-nowrap">
            <div
              :class="
                data.status === 'No Status'
                  ? 'text-sm text-red-400'
                  : data.status === 'To Do'
                  ? 'text-sm text-yellow-500'
                  : data.status === 'Doing'
                  ? 'text-sm text-blue-500'
                  : data.status === 'Done'
                  ? 'text-sm text-success'
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
  <Modal :dataModal="dataModal" />
</template>

<style scoped></style>
