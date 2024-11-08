<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollabBoard } from "../services/apiMakeCollabBoard";
import { useCollabBoardStore } from "../stores/useCollabBoardStore";
import Button from "./Button.vue";
import RemoveCollabBoardModal from "./RemoveCollabBoardModal.vue";

const collabBoardStore = useCollabBoardStore();
console.log(collabBoardStore.getCollabsBoard());
const collabBoards = ref([]);

const curCollab = ref({ oid: "", name: "" });

const emits = defineEmits(["message"]);

function handleMessage(e) {
  emits("message", e);
}

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
    <div
      v-if="collabBoardStore.getCollabsBoard().length === 0"
      class="flex transform cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-5 text-gray-500 shadow-lg transition duration-300 hover:scale-105"
      style="height: 150px"
    >
      No collaboration boards available
    </div>

    <!-- Collaboration Boards List -->
    <div
      v-for="(board, index) in collabBoardStore.getCollabsBoard()"
      :key="board.oid"
      class="w-90 h-70 flex transform flex-col justify-between rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 text-gray-700 shadow-lg transition-transform hover:scale-105"
    >
      <div class="flex-grow">
        <!-- Flex container for PUBLIC badge and board name -->
        <div class="mb-3 flex items-center justify-between">
          <span
            class="rounded px-2 py-1 text-xs font-semibold text-white"
            :class="
              board.visibility === 'PRIVATE' ? 'bg-purple-500' : 'bg-green-700'
            "
            >{{ board.visibility }}</span
          >
          <h3 class="ml-2 text-lg font-bold text-gray-800">
            {{ board.boardName }}
          </h3>
        </div>
        <p class="text-sm text-gray-600">Owner: {{ board.name }}</p>
        <p class="text-sm text-gray-600">
          Access Right: {{ board.accessRight || "N/A" }}
        </p>
      </div>

      <!-- Actions Section -->
      <div class="mt-4 flex items-center justify-between">
        <span
          class="cursor-pointer text-sm text-blue-600 underline hover:text-blue-800"
          @click="
            $router.push({ name: 'Task', params: { oid: board.boardNanoId } })
          "
        >
          View board
        </span>
        <button
          class="cursor-pointer rounded border-none bg-red-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-red-600"
          @click="
            (e) => {
              e.stopPropagation();
              onModalOpen({
                oid: board.oid,
                name: board.boardName,
                nanoId: board.boardNanoId,
              });
            }
          "
        >
          Leave
        </button>
      </div>
    </div>

    <!-- Remove Collaboration Board Modal -->
    <RemoveCollabBoardModal :collab="curCollab" />
  </div>
</template>
