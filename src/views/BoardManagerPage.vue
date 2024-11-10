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
import RemoveCollabModal from "../components/RemoveCollabModal.vue";

const boardStore = useBoardStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const taskStatusStore = useTaskStatusStore();
const collabBoardStore = useCollabBoardStore();

const collabBoards = ref([]);
const showLeaveModal = ref(false);
const curCollab = ref(null);
const emits = defineEmits(["message", "loading"]);
emits("loading", false);

// State for toggling between Personal and Collab Boards
const showCollabBoards = ref(false); // Start by showing Personal Boards

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

// Toggle function
const toggleBoards = () => {
  showCollabBoards.value = !showCollabBoards.value;
};

// Leave board function
const leaveBoard = async (boardId) => {
  try {
    const response = await leaveCollabBoard(boardId);
    if (response.httpStatus === 200) {
      collabBoards.value = collabBoards.value.filter(
        (board) => board.id !== boardId,
      );
      emits("message", "Successfully left the board.");
    } else {
      emits("message", "Failed to leave the board.");
    }
  } catch (error) {
    console.error("Error leaving board:", error);
    emits("message", "Error occurred while leaving the board.");
  }
};
</script>

<template>
  <div class="mb-3 flex items-center justify-between">
    <h1
      class="itbkk-personal-board text-white-800 mb-4 text-center text-2xl font-semibold"
    >
      Boards
    </h1>
    <div class="flex justify-end">
      <button
        class="itbkk-button-create btn"
        @click="$router.push({ name: 'AddBoard' })"
      >
        + Create personal board
      </button>
    </div>
  </div>

  <!-- Toggle Buttons for Personal and Collaboration Boards -->
  <div class="mb-4 flex items-center space-x-2">
    <button
      class="itbkk-button-create hover:bg-black-500 btn"
      :class="{
        'bg-gray-500': !showCollabBoards,
        'bg-black-400': showCollabBoards,
      }"
      @click="showCollabBoards = false"
    >
      Personal Boards
    </button>
    <button
      class="itbkk-button-create hover:bg-black-500 btn"
      :class="{
        'bg-gray-500': showCollabBoards,
        'bg-black-400': !showCollabBoards,
      }"
      @click="showCollabBoards = true"
    >
      Collaboration Boards
    </button>
  </div>

  <!-- Personal Boards Section -->
  <div
    v-if="!showCollabBoards"
    class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    <div
      v-for="(board, index) in boardStore.getBoards()"
      :key="board.nanoIdBoard"
      class="transform cursor-pointer rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-5 text-gray-700 shadow-lg transition duration-300 hover:scale-105"
      @click="handleClick(board)"
    >
      <div class="flex items-center justify-between">
        <span
          class="rounded px-2 py-1 text-xs font-semibold text-white"
          :class="
            board.visibility === 'PRIVATE' ? 'bg-purple-500' : 'bg-green-700'
          "
          >{{ board.visibility }}</span
        >
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold">{{ board.name }}</h3>
        <!-- <p class="text-sm">Created by: {{ userStore.getUser()?.name }}</p> -->
      </div>
      <div class="mt-2 text-right">
        <span class="text-sm text-gray-600 underline">View board</span>
      </div>
    </div>

    <div
      v-if="boardStore.getBoards().length === 0"
      class="flex transform cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-5 text-gray-700 shadow-lg transition duration-300 hover:scale-105"
      style="height: 150px"
    >
      No personal boards available
    </div>
  </div>

  <!-- Collaboration Boards Section -->
  <div v-else class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <ShareBoard />
    <RemoveCollabModal
      v-show="showLeaveModal"
      :collab="curCollab"
      @message="handleMessage($event)"
    />
  </div>

  <RouterView @message="handleMessage($event)" />
</template>
