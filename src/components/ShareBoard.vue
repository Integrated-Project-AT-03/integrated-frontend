<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollabBoard } from "../services/apiMakeCollabBoard";
import { useCollabBoardStore } from "../stores/useCollabBoardStore";
import Button from "./Button.vue";
import RemoveCollabBoardModal from "./RemoveCollabBoardModal.vue";

const collabBoardStore = useCollabBoardStore();

const collabBoards = ref([]);

const curCollab = ref({ oid: "", name: "" });

onMounted(async () => {
  // const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  // boardStore.setCurrentBoard(curBoard);
  try {
    const res = await getCollabBoard();
    collabBoards.value = res.data; // Store fetched collaboration boards
    collabBoardStore.setCollabsBoard(res.data);
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
});

function onModalOpen(collab) {
  document.getElementById("removeCollabBoardModal").showModal();
  curCollab.value = collab;
}
</script>

<template>
  <div class="mt-3 flex flex-col gap-6 rounded-lg">


    <!-- No Collaboration Boards Message -->
    <div v-if="collabBoardStore.getCollabsBoard().length === 0" 
         class="p-5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 shadow-lg 
                cursor-pointer transform transition duration-300 hover:scale-105 flex items-center justify-center"
         style="height: 150px;">
      No collaboration boards available
    </div>

    <!-- Collaboration Boards List -->
    <div v-for="(board, index) in collabBoardStore.getCollabsBoard()" :key="board.oid"
         class="flex flex-col justify-between p-6 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-lg 
                transition-transform transform hover:scale-105 w-90 h-70">
      <div class="flex-grow">
        <!-- Flex container for PUBLIC badge and board name -->
        <div class="flex items-center justify-between mb-3">
          <span class="bg-gray-300 text-xs font-semibold rounded px-2 py-1 text-gray-700">PUBLIC</span>
          <h3 class="text-lg font-bold ml-2 text-gray-800">{{ board.boardName }}</h3>
        </div>
        <p class="text-sm text-gray-600">Owner: {{ board.name }}</p>
        <p class="text-sm text-gray-600">Access Right: {{ board.accessRight || "N/A" }}</p>
      </div>

      <!-- Actions Section -->
      <div class="mt-4 flex justify-between items-center">
        <span class="text-sm underline cursor-pointer text-blue-600 hover:text-blue-800"
              @click="$router.push({ name: 'Task', params: { oid: board.boardNanoId } })">
          View board
        </span>
        <button
          class="bg-red-500 text-white rounded px-3 py-1 border-none cursor-pointer transition-colors duration-200 hover:bg-red-600"
          @click="(e) => {
            e.stopPropagation();
            onModalOpen({
              oid: board.oid,
              name: board.boardName,
              nanoId: board.boardNanoId,
            });
          }">
          Leave
        </button>
      </div>
    </div>

    <!-- Remove Collaboration Board Modal -->
    <RemoveCollabBoardModal :collab="curCollab" />
  </div>
</template>