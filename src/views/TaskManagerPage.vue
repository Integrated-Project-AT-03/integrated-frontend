<script setup>
import { computed, onMounted, ref } from "vue";

import Button from "@/components/Button.vue";
import StatusModal from "@/components/StatusModal.vue";
import { useRoute, useRouter } from "vue-router";
import BoardVisibilityModal from "../components/BoardVisibilityModal.vue";
import EmptyElement from "../components/EmptyElement.vue";
import { getBoardByNanoId } from "../services/apiBoard.js";
import { getTasksByNanoidBoard } from "../services/apiTask";
import { useUserStore } from "../stores/useUserStore";
import SortAsc from "./../assets/icons/SortAsc.vue";
import SortDesc from "./../assets/icons/SortDesc.vue";
import SortDisable from "./../assets/icons/SortDisable.vue";
import { getSettingByNanoIdBoard } from "./../services/apiSetting";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import { useBoardStore } from "./../stores/useBoardStore.js";
import { useSettingStore } from "./../stores/useSettingStore";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
import { useTaskStore } from "./../stores/useTaskStore";

const settingStore = useSettingStore();
const userStore = useUserStore();
const taskStore = useTaskStore();
const statusStore = useTaskStatusStore();
const boardStore = useBoardStore();
const selectIndex = ref(5);
const newItem = ref("");
const items = ref([]);
const uri = import.meta.env.VITE_SERVER_URI;
const sort = ref("");
const sortOrder = ref("default");
const openSearch = ref(false);
const router = useRouter();
const route = useRoute();
// const isToggle = ref(false);
const isPublic = computed(
  () => boardStore.getCurrentBoard()?.visibility === "PUBLIC",
);
const showOwnerButton = ref();

// const handleBool = (e) => {
//   isPublic = e;
// };

let timeoutBlur = null;
defineProps({
  setting: Object,
});
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
  const res = await getTasksByNanoidBoard(
    route.params.oid,
    sort.value,
    items.value,
  );
  taskStore.setTasks(res.data);
};

const emits = defineEmits(["message, loading"]);

onMounted(async function () {
  const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  boardStore.setCurrentBoard(curBoard);
  const settingLoad = (await getSettingByNanoIdBoard(route.params.oid)).data;
  settingStore.setLimitTask(settingLoad);
  await loadTasks();
  const res = await getStatusesByNanoIdBoard(route.params.oid);

  if (res.httpStatus === 401) {
    return router.push({ name: "login" });
  }
  if (res.httpStatus === 403) {
    return router.push({ name: "NotAllowPage" });
  }
  if (res.httpStatus === 404) {
    return router.push({ name: "NotFound" });
  }
  statusStore.setStatuses(res.data);
  emits("loading", false);

  showOwnerButton.value = boardStore.getCurrentBoard()?.access === "OWNER";
});

const handleMessage = (e) => {
  emits("message", e);
};

const searchStatus = computed(() =>
  statusStore
    .getStatusesByName(newItem.value)
    .filter((status) => !items.value.includes(status.name))
    .slice(0, 9),
);

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
  openSearch.value = false;
};

const addItem = async () => {
  if (newItem.value.trim() !== "") {
    items.value.push(newItem.value.trim());
    newItem.value = "";
  }
  loadTasks();
};

const handleBlur = () => {
  timeoutBlur = setTimeout(() => (openSearch.value = false), 200);
};
const handleSelect = async (name) => {
  clearTimeout(timeoutBlur);
  newItem.value = name;
  addItem();
};

const openTask = (index, id) => {
  router.push({ name: "TaskDetail", params: { id } }),
    (selectIndex.value = index);
};
</script>

<template>
  <div class="itbkk-modal-task flex w-full flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="container">
        <div class="flex items-center gap-2">
          <label class="relative flex flex-col gap-2">
            <input
              class="itbkk-status-filter w-[300px] rounded-md border p-2 text-gray-900"
              type="text"
              v-model="newItem"
              @keyup.enter="addItem"
              placeholder="Filter by status(es)"
              @focus="openSearch = true"
              @blur="handleBlur"
            />
            <div
              v-show="openSearch"
              class="gap absolute top-8 z-[10] flex h-max w-full flex-col overflow-hidden rounded-md bg-white pt-3"
            >
              <button
                v-for="status in searchStatus"
                :key="status.id"
                class="itbkk-status-choice h-[30px] px-3 text-start text-black hover:bg-slate-300"
                @click="handleSelect(status.name)"
              >
                {{
                  status.name.length > 25
                    ? status.name.slice(0, 22) + "..."
                    : status.name
                }}
              </button>
            </div>
          </label>
          <Button
            class="itbkk-filter-clear"
            message="Clear All"
            @click="clearAll"
            bgcolor="#ef4444"
          />
        </div>
      </div>
      <div class="flex items-center justify-end gap-4">
        <div class="flex cursor-pointer gap-3">
          <EmptyElement
            onclick="visibilityModal.showModal()"
            v-show="showOwnerButton"
          />
          <div
            :class="!showOwnerButton && 'tooltip'"
            data-tip="You need to be board owner to perform this action."
          >
            <input
              type="checkbox"
              class="itbkk-board-visibility toggle"
              :checked="isPublic"
              :disabled="!showOwnerButton"
            />
          </div>
          <div>{{ isPublic ? "Public" : "Private" }}</div>
        </div>

        <Button
          class="itbkk-manage-collaborator"
          bgcolor="#666666"
          message="Manage collaborator"
          :action="() => $router.push({ name: 'Collab' })"
        />

        <Button
          class="itbkk-manage-status"
          bgcolor="#666666"
          message="Manage Status"
          :action="() => $router.push({ name: 'Status' })"
        />

        <Button
          :access="['WRITER']"
          class="itbkk-button-add tooltip-left"
          bgcolor="#06b6d4"
          message="Add task"
          :action="() => $router.push({ name: 'AddTask' })"
        />
      </div>
    </div>
    <table class="m-0 block divide-gray-200 overflow-hidden rounded-sm p-0">
      <tbody
        class="block max-h-[500px] w-full divide-y divide-gray-300 overflow-y-scroll bg-slate-100"
      >
        <tr class="sticky z-0 justify-between bg-gray-200">
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            No
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            Assingness
          </th>
          <th
            scope="col"
            class="flex flex-row px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900"
          >
            <div>Status</div>
            <div
              class="itbkk-status-sort m-auto ml-2 flex cursor-pointer items-center"
              @click="toggleSortOrder"
            >
              <SortDisable
                v-show="sortImage === 1"
                class="h-5 w-5 scale-[190%]"
              />
              <SortAsc v-show="sortImage === 2" class="h-5 w-5" />
              <SortDesc v-show="sortImage === 3" class="h-5 w-5" />
            </div>
          </th>
        </tr>
        <tr v-show="taskStore.getTasks().length === 0">
          <td
            colspan="4"
            class="m-0 w-screen bg-white py-3 text-center font-bold text-gray-600"
          >
            No Task
          </td>
        </tr>
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(task, index) in taskStore.getTasks()"
          :key="task.id"
          @click="openTask(index + 1, task.id)"
        >
          <td class="px-6 py-4">
            <div class="text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="w-full whitespace-nowrap px-6 py-4">
            <div class="itbkk-title text-sm text-gray-900">
              {{ task.title }}
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div
              class="itbkk-assignees w- text-sm text-gray-900"
              :class="task?.assignees ?? 'italic'"
            >
              {{ task?.assignees ?? "Unassigned" }}
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <StatusModal
              class="itbkk-status text-slate-200"
              :status-color="task.statusColorHex"
              :text="task.status"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="itbkk-filter-item itbkk-filter-item-clear relative z-10 flex cursor-pointer items-center rounded-md bg-white p-3 text-gray-900 hover:bg-slate-300"
        @click="removeItem(index)"
      >
        <span class="absolute -top-1 right-1 text-error">x</span>
        <span>{{ item }}</span>
      </div>
    </div>
    <BoardVisibilityModal />
  </div>

  <router-view :index-value="selectIndex" @message="handleMessage($event)" />
</template>

<style scoped></style>
../lib/fetch.js ../lib/StatusManagement.js
