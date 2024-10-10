<script setup>
import Button from "@/components/Button.vue";
import { watchEffect, ref, onMounted } from "vue";
import router from "@/router";
import { getBoards } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from "../stores/useBoardStore.js";
import { getCollabBoard, leaveCollabBoard } from "../services/apiMakeCollabBoard";
import ShareBoard from "../components/ShareBoard.vue";
import RemoveCollabModal from "../components/RemoveCollabModal.vue"; // Add this import

const boardStore = useBoardStore();
const userStore = useUserStore();
const collabBoards = ref([]);
const showLeaveModal = ref(false); // Control modal visibility
const curCollab = ref(null); // Track the selected collaboration board to remove
const emits = defineEmits(["message", "loading"]); // Corrected event names
emits("loading", false)

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
  <div class="mt-[-5rem] flex justify-end">
    <button
      class="itbkk-button-create btn"
      @click="$router.push({ name: 'AddBoard' })"
    >
      + Create personal board
    </button>
  </div>

  <!-- Personal Boards Section -->
  <h1
    class="itbkk-personal-board text-white-800 mb-4 text-center text-2xl font-semibold"
  >
    Personal Boards
  </h1>
  <div v-if="boardStore.getBoards().length === 0" class="flex justify-center">
    <div
      class="flex h-16 w-64 items-center justify-center rounded-lg bg-gray-300 font-bold text-gray-600"
    >
      No boards available
    </div>
  </div>
  <table class="min-w-full border border-gray-300 bg-white">
    <thead>
      <tr class="bg-gray-200 text-gray-700">
        <th class="border-b px-4 py-2">No</th>
        <th class="border-b px-4 py-2">Name</th>
        <th class="border-b px-4 py-2">Visibility</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(board, index) in boardStore.getBoards()"
        :key="board.nanoIdBoard"
        @click="handleClick(board)"
        class="cursor-pointer hover:bg-gray-100"
      >
        <td class="itbkk-personal-item border-b px-4 py-2">{{ index + 1 }}</td>
        <td class="itbkk-personal-name border-b px-4 py-2">{{ board.name }}</td>
        <td class="itbkk-personal-visibility border-b px-4 py-2">
          {{ board.visibility }}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Collab Boards Section -->
  <div class="flex w-full flex-col gap-3 rounded-lg">
    <ShareBoard />
    <RemoveCollabModal
      v-if="showLeaveModal"
      :collab="curCollab"
      @message="handleMessage($event)"
    />
  </div>

  <RouterView @message="handleMessage($event)" />
</template>
