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
import RemoveCollabModal from "../components/RemoveCollabModal.vue"; // Add this import

const boardStore = useBoardStore();
const userStore = useUserStore();
const collabBoards = ref([]);
const showLeaveModal = ref(false); // Control modal visibility
const curCollab = ref(null); // Track the selected collaboration board to remove
const emits = defineEmits(["message", "loading"]); // Corrected event names
emits("loading", false);

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
</script>

<template>
  <!-- Personal Boards Section -->
  <div class="mb-3 flex items-center justify-between">
    <div class="flex justify-end opacity-0">
      <div class="itbkk-button-create btn cursor-default">
        + Create personal board
      </div>
    </div>

    <h1
      class="itbkk-personal-board text-white-800 mb-4text-center text-2xl font-semibold"
    >
      Personal Boards
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

  <div>
    <table
      class="m-0 min-w-full border border-gray-300 bg-white p-0 text-black"
    >
      <thead>
        <tr class="bg-gray-200 text-gray-700">
          <th class="border-b px-4 py-2 text-start">No</th>
          <th class="border-b px-4 py-2 text-start">Name</th>
          <th class="border-b px-4 py-2 text-start">Visibility</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(board, index) in boardStore.getBoards()"
          :key="board.nanoIdBoard"
          @click="handleClick(board)"
          class="cursor-pointer hover:bg-gray-100"
        >
          <td class="itbkk-personal-item border-b px-4 py-2">
            {{ index + 1 }}
          </td>
          <td class="itbkk-personal-name border-b px-4 py-2">
            {{ board.name }}
          </td>
          <td class="itbkk-personal-visibility border-b px-4 py-2">
            {{ board.visibility }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-show="boardStore.getBoards().length === 0"
      class="m-0 bg-white py-3 text-center font-bold text-gray-600"
    >
      No boards available
    </div>
  </div>

  <!-- Collab Boards Section -->
  <div class="flex w-full flex-col rounded-lg">
    <ShareBoard />
    <RemoveCollabModal
      v-if="showLeaveModal"
      :collab="curCollab"
      @message="handleMessage($event)"
    />
  </div>

  <RouterView @message="handleMessage($event)" />
</template>
