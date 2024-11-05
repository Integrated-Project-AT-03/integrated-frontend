<script setup>
import Button from "@/components/Button.vue";
import { watchEffect, ref, onMounted } from "vue";
import router from "@/router";
import { getBoards } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from "../stores/useBoardStore.js";
import {
  getCollabBoard,
  leaveCollabBoard,
} from "../services/apiMakeCollabBoard";
import ShareBoard from "../components/ShareBoard.vue";
import RemoveCollabModal from "../components/RemoveCollabModal.vue";

const boardStore = useBoardStore();
const userStore = useUserStore();
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
  try {
    const res = await getCollabBoard();
    collabBoards.value = res.data;
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
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
      collabBoards.value = collabBoards.value.filter(board => board.id !== boardId);
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
    <h1 class="itbkk-personal-board text-white-800 mb-4 text-center text-2xl font-semibold">
      Boards
    </h1>
    <div class="flex justify-end">
      <button class="itbkk-button-create btn" @click="$router.push({ name: 'AddBoard' })">
        + Create personal board
      </button>
    </div>
  </div>

  <!-- Toggle Buttons for Personal and Collaboration Boards -->
  <div class="flex items-center mb-4 space-x-2">
    <button
      class="itbkk-button-create btn"
      :class="{ 'bg-black-400': !showCollabBoards, 'bg-gray-500': showCollabBoards }"
      @click="showCollabBoards = false">
      Personal Boards
    </button>
    <button
      class="itbkk-button-create btn"
      :class="{ 'bg-black-400': showCollabBoards, 'bg-gray-500': !showCollabBoards }"
      @click="showCollabBoards = true">
      Collaboration Boards
    </button>
  </div>

  <!-- Personal Boards Section -->
<div v-if="!showCollabBoards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <div v-for="(board, index) in boardStore.getBoards()" :key="board.nanoIdBoard"
       class="p-5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-lg 
              cursor-pointer transform transition duration-300 hover:scale-105"
       @click="handleClick(board)">
    <div class="flex items-center justify-between">
      <span class="bg-gray-300 text-xs font-semibold rounded px-2 py-1 text-gray-800">PUBLIC</span>
    </div>
    <div class="mt-4">
      <h3 class="text-lg font-semibold">{{ board.name }}</h3>
      <p class="text-sm">Created by: {{ userStore.getUser()?.name }}</p>
    </div>
    <div class="mt-2 text-right">
      <span class="text-sm underline text-gray-600">View board</span>
    </div>
  </div>

  <div v-if="boardStore.getBoards().length === 0"
       class="p-5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-lg 
              cursor-pointer transform transition duration-300 hover:scale-105 flex items-center justify-center"
       style="height: 150px;">
    No personal boards available
  </div>
</div>

  <!-- Collaboration Boards Section -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <ShareBoard />
    <RemoveCollabModal v-if="showLeaveModal" :collab="curCollab" @message="handleMessage($event)" />
  </div>

  <RouterView @message="handleMessage($event)" />
</template>