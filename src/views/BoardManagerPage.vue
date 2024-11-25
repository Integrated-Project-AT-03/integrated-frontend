<script setup>
import Button from "@/components/Button.vue";
import { watchEffect, ref, onMounted } from "vue";
import router from "@/router";
import { getBoards } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from "../stores/useBoardStore.js";
import { useTaskStore } from "../stores/useTaskStore";
import { useTaskStatusStore } from "../stores/useTaskStatusStore";
import { useCollabBoardStore } from "../stores/useCollabBoardStore";

import { getCollabBoard, leaveCollabBoard } from "../services/apiCollab";
import ShareBoard from "../components/ShareBoard.vue";
import { useSettingStore } from "@/stores/useSettingStore.js";

const boardStore = useBoardStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const taskStatusStore = useTaskStatusStore();
const collabBoardStore = useCollabBoardStore();
const settingBoard = useSettingStore()

const collabBoards = ref([]);
const emits = defineEmits(["message", "loading"]);
emits("loading", false);


const showCollabBoards = ref(false);

const toggleBoards = (isCollab) => {
  showCollabBoards.value = isCollab;
};

const handleMessage = (e) => {
  emits("message", e);
};

watchEffect(async () => {
  if (userStore.getUser()?.oid) {
    const res = await getBoards();
    boardStore.setBoards(res.data);
    if (res.httpStatus === 401) {
      return router.push({ name: "login" });
    }
  }
});

onMounted(async () => {
  emits("loading", true);
  taskStore.setTasks([]);
  taskStatusStore.setStatuses([]);
  collabBoardStore.setCollabsBoard([]);
  boardStore.setCurrentBoard({});


  try {
    const res = await getCollabBoard();
    collabBoards.value = res.data;
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
  emits("loading", false);
});

const handleClick = (board) => {
  router.push({ name: "Task", params: { oid: board.id } });
};
</script>

<template>
  <div class="p-4">
    <h1 class="itbkk-personal-board text-white-800 mb-4 text-center text-2xl font-semibold">
      Boards
    </h1>


    <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
      <div class="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
        <button class="itbkk-button-create btn w-full sm:w-auto text-center"
          :class="{ 'bg-gray-500': !showCollabBoards, 'bg-black-400': showCollabBoards }" @click="toggleBoards(false)">
          Personal Boards
        </button>
        <button class="itbkk-button-create btn w-full sm:w-auto text-center"
          :class="{ 'bg-gray-500': showCollabBoards, 'bg-black-400': !showCollabBoards }" @click="toggleBoards(true)">
          Collaboration Boards
        </button>
      </div>

      <div v-show="!showCollabBoards" class="flex justify-end w-full sm:w-auto">
        <button class="itbkk-button-create btn w-full sm:w-auto" @click="$router.push({ name: 'AddBoard' })">
          + Create personal board
        </button>
      </div>
    </div>


    <div v-if="!showCollabBoards" class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(board, index) in boardStore.getBoards()" :key="board.nanoIdBoard"
        class="transform cursor-pointer rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-4 text-gray-700 shadow-lg transition duration-300 hover:scale-105"
        @click="handleClick(board)">
        <div class="flex items-center justify-between">
          <span class="rounded px-2 py-1 text-xs font-semibold text-white"
            :class="board.visibility === 'PRIVATE' ? 'bg-purple-500' : 'bg-green-700'">
            {{ board.visibility }}
          </span>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold">{{ board.name }}</h3>
        </div>
        <div class="mt-2 text-right">
          <span class="text-sm text-gray-600 underline">View board</span>
        </div>
      </div>


      <div v-if="boardStore.getBoards().length === 0"
        class="flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-5 text-gray-700 shadow-lg transition duration-300"
        style="height: 150px">
        No personal boards available
      </div>
    </div>


    <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ShareBoard />
    </div>

    <RouterView @message="handleMessage($event)" />
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .itbkk-button-create {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>