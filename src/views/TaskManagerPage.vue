<script setup>
import { ref, computed, onMounted } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import Loading from "./../components/Loading.vue";
import { useRoute, useRouter } from "vue-router";
import { getItems } from "./../assets/fetch.js";
import Button from "@/components/ButtonModal.vue";
import StatusModal from "@/components/StatusModal.vue";


const newItem = ref('');
const items = ref([]);

const addItem = () => {
  if (newItem.value.trim() !== '') {
    items.value.push(newItem.value.trim());
    newItem.value = '';
  }
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};

const clearAll = () => {
  items.value = [];
};

const datas = ref(TaskManagement);
const dataAsc = ref([])

const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const isSorted = ref(false)
const bool = ref(false)


const sortOrder = ref('default');


const sortImage = computed(() => {
  console.log("Current sortOrder:", sortOrder.value);
  switch (sortOrder.value) {
    case 'ascending':
      return { src: '/images/from-a-to-z (1).png' };
    case 'descending':
      return { src: '/images/from-a-to-z (2).png' };
    default:
      return { src: '/images/from-a-to-z.png' };
  }
});


const toggleSortOrder = () => {
  if (sortOrder.value === 'default') {
    sortOrder.value = 'ascending';
  } else if (sortOrder.value === 'ascending') {
    sortOrder.value = 'descending';
  } else {
    sortOrder.value = 'default';
  }
  console.log("New sortOrder:", sortOrder.value);
};


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
  <div
    class="container mx-auto flex flex-col gap-3"
    :class="
      route.fullPath.split('/').length > 2 ||
      (route.name === 'Addstatus' && 'blur-sm')
    "
  >
    <div class="text-5xl font-extrabold ... w-full flex justify-center m-7">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      >
        <div class="text-5xl">IT-Bangmod Kradan Kanban</div>
      </span>
    </div>


    <div class="container mx-auto p-4">
      <div class="flex items-center">
        <input class="border p-2 rounded-md mr-2 w-1/3" type="text" v-model="newItem" @keyup.enter="addItem"
          placeholder="Add a new item" />
        <button class="btn btn-secondary" @click="clearAll">
          Clear All
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-4">
        <div v-for="(item, index) in items" :key="index"
          class="relative border p-2 rounded-md flex items-center bg-white">
          <span>{{ item }}</span>
          <button class="absolute top-0 right-0 text-red-500 p-1" @click="removeItem(index)">
            &times;
          </button>
        </div>
      </div>
    </div>

    <div class="w-full flex items-center justify-end">
      <div class="flex justify-end gap-4">
        <Button
          class="itbkk-manage-status"
          bgcolor="#666666"
          message="Manage Status"
          @click="router.push({ name: 'Statuses' })"
        />
        <Button
          class="itbkk-button-add"
          bgcolor="#06b6d4"
          message="Add task"
          @click="$router.push({ name: 'AddTask' })"
        />
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
            ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
            Assignees
          </th>
          <th scope="col"
            class="flex flex-row px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
            <div>
              Status
            </div>
            <div class="itbkk-status-sort m-auto ml-2 cursor-pointer flex items-center">
              <img :class="`w-5 ${sortImage}`" :src="sortImage.src" @click="toggleSortOrder" />
            </div>
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
            <div class="text-sm text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
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
            <StatusModal class="text-slate-200" :status-color="task.statusColorHex" :text="task.status" />

          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <router-view @message="handleMessage($event)" />
</template>

<style scoped></style>
