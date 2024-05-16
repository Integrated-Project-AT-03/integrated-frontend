<script setup>
import { onMounted, ref } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import Loading from "./../components/Loading.vue";
import { useRoute, useRouter } from "vue-router";
import { getItems } from "./../assets/fetch.js";
import Button from "@/components/ButtonModal.vue";
import StatusModal from "@/components/StatusModal.vue";

const datas = ref(TaskManagement);
const dataAsc = ref([])

const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const isSorted = ref(false)
const bool = ref(false)

onMounted(async function () {
  const data = await getItems(`${uri}/v2/tasks`);
  isLoading.value = false;
  datas.value.setTasks(data.items);
});

async function sortTask(){
  const sort = bool.value ? 'ASC' : 'DES'
  console.log(sort);
  const res = await getItems(`${uri}/v2/tasks?sortBy=status&sortDirection=${sort}&filterStatuses=Goko,done,Add`)
  isLoading.value = false;
  dataAsc.value = res.items
  isSorted.value = true
  bool.value = !bool.value
}

const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <Loading :is-loading="isLoading" />
  <div class="container mx-auto flex flex-col gap-3" :class="route.fullPath.split('/').length > 2 ||
    (route.name === 'Addstatus' && 'blur-sm')
    ">
    <div class="text-5xl font-extrabold ... w-full flex justify-center m-7">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        <div class="text-5xl">IT-Bangmod Kradan Kanban</div>
      </span>
    </div>
    <div class="w-full flex items-center justify-end">
      <div class="flex justify-end gap-4">
        <Button class="itbkk-manage-status" bgcolor="#666666" message="Manage Status" @click="router.push({ name: 'Statuses' })" />
        <Button class="itbkk-button-add" bgcolor="#06b6d4" message="Add task" @click="$router.push({ name: 'AddTask' })"/>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
            ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
            Assignees
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
            Status
            <button class="bg-black text-slate-200 rounded-xl p-2 hover:bg-slate-700"
            @click="sortTask()">
              clickme
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="bg-slate-100 divide-y divide-gray-300">
        <tr v-show="datas.getTasks().length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-900">
            No task
          </td>
        </tr>
        <tr class="itbkk-item itbkk-button-action hover:bg-slate-200" v-for="(task, index) in isSorted ? dataAsc : datas.getTasks()"
          :key="task.id" @click="$router.push({ name: 'TaskDetail', params: { id: task.id } })">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ index.id }}</div>
          </td>
          <td class="itbkk-title px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ task.title }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 itbkk-assignees" :class="task?.assignees ?? 'italic'">
              {{ task?.assignees ?? "Unassigned" }}
            </div>

          </td>
          <td class="itbkk-status px-6 py-4 whitespace-nowrap">
            <StatusModal class="text-slate-200" :status-color="task.statusColorHex" :text="task.status" />

          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <router-view @message="handleMessage($event)" />
</template>
