<script setup>
import { ref, computed, onMounted } from "vue";
import TaskManagement from "./../lib/TaskManagement.js";
import Loading from "./../components/Loading.vue";
import { getItems } from "./../assets/fetch.js";
import Button from "@/components/ButtonModal.vue";
import StatusModal from "@/components/StatusModal.vue";
import SortAsc from "./../assets/icons/SortAsc.vue";
import SortDesc from "./../assets/icons/SortDesc.vue";
import SortDisable from "./../assets/icons/SortDisable.vue";

const newItem = ref("");
const items = ref([]);
const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const isLoading = ref(true);
const sort = ref("");
const sortOrder = ref("default");
// const sortImage = computed(() => {
//   switch (sortOrder.value) {
//     case "ascending":
//       return { src: "/images/sort-asc.png" };
//     case "descending":
//       return { src: "/images/sort-desc.png" };
//     default:
//       return { src: "/images/sort-disable.png" };
//   }
// });

const sortImage = computed(() => {
  switch (sortOrder.value) {
    case "ascending":
      return 2;
    case "descending":
      return 3;
    default:
      return 1;
  }
});

const loadTasks = async () => {
  if (sort.value === "" && items.value.length === 0)
    return datas.value.setTasks((await getItems(`${uri}/v2/tasks`)).items);
  datas.value.setTasks(
    (
      await getItems(
        `${uri}/v2/tasks?sortBy=statusStatusName&sortDirection=${
          sort.value
        }&filterStatuses=${items.value.join(",")}`
      )
    ).items
  );
};

onMounted(async function () {
  await loadTasks();
  isLoading.value = false;
});

const toggleSortOrder = () => {
  if (sortOrder.value === "default") {
    sortOrder.value = "ascending";
    sort.value = "ASC";
  } else if (sortOrder.value === "ascending") {
    sortOrder.value = "descending";
    sort.value = "DES";
  } else {
    sortOrder.value = "default";
    sort.value = "";
  }
  loadTasks();
};

const removeItem = async (index) => {
  items.value.splice(index, 1);
  loadTasks();
};

const clearAll = async () => {
  items.value = [];
  loadTasks();
};
const addItem = async () => {
  if (newItem.value.trim() !== "") {
    items.value.push(newItem.value.trim());
    newItem.value = "";
  }
  loadTasks();
};
const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <Loading :is-loading="isLoading" />

  <div
    class="w-full flex-col flex gap-2"
    :class="$route.fullPath.split('/').length > 2 ? ' blur-sm' : ''"
  >
    <div class="w-full flex items-center justify-around">
      <div class="container">
        <div class="flex items-center">
          <input
            class="itbkk-status-filter border p-2 rounded-md mr-2 w-1/3 text-gray-900"
            type="text"
            v-model="newItem"
            @keyup.enter="addItem"
            placeholder="Filter by status(es)"
          />
          <Button class="itbkk-filter-clear"message="Clear All" @click="clearAll" bgcolor="#ef4444" />
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="itbkk-filter-item itbkk-filter-item-clear p-3 rounded-md relative flex items-center bg-white text-gray-900 cursor-pointer hover:bg-slate-300"
            @click="removeItem(index)"
          >
            <span class="text-error absolute -top-1 right-1">x</span>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Button
          class="itbkk-manage-status"
          bgcolor="#666666"
          message="Manage Status"
          @click="$router.push({ name: 'Statuses' })"
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
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider"
          >
            No
          </th>
          <th
            scope="col"
            class="px-6 py-3 min-w-[852px] text-left text-sm font-bold text-gray-900 uppercase tracking-wider"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider"
          >
            Assignees
          </th>
          <th
            scope="col"
            class="flex flex-row px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider"
          >
            <div>Status</div>
            <div
              class="itbkk-status-sort m-auto ml-2 cursor-pointer flex items-center"
              @click="toggleSortOrder"
            >
              <SortDisable
                v-show="sortImage === 1"
                class="w-5 scale-[190%] h-5"
              />
              <SortDesc v-show="sortImage === 2" class="w-5 h-5" />
              <SortAsc v-show="sortImage === 3" class="w-5 h-5" />
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
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(task, index) in datas.getTasks()"
          :key="task.id"
          @click="$router.push({ name: 'TaskDetail', params: { id: task.id } })"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-gray-900">{{ index + 1 }}</div>
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
            <StatusModal
              class="text-slate-200"
              :status-color="task.statusColorHex"
              :text="task.status"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <router-view @message="handleMessage($event)" />
</template>

<style scoped></style>
