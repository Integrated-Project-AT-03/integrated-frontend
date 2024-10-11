<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getCollabBoard,
  leaveCollabBoard,
} from "../services/apiMakeCollabBoard";
import { useCollabBoardStore } from "../stores/useCollabBoardStore";
import RemoveCollabModal from "./RemoveCollabModal.vue";
import Button from "./Button.vue";
import RemoveCollabBoardModal from "./RemoveCollabBoardModal.vue";

const collabBoardStore = useCollabBoardStore();
const router = useRouter();
const collabBoards = ref([]);
const boardName = ref(""); // For displaying the board name in the modal
const showLeaveModal = ref(false); // Control modal visibility
const boardToLeave = ref(null); // Track which board is being left

const curCollab = ref({ oid: "", name: "" });
const route = useRoute();
const curOid = ref();

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
  <div>
    <div class="flex w-full flex-col gap-3 rounded-lg">
      <h1
        class="itbkk-collab-board text-white-800 mb-5 text-center text-2xl font-semibold"
      >
        Collab Boards
      </h1>
      <div class="flex flex-col">
        <table class="min-w-full border border-gray-300 bg-white text-black">
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="border-b px-4 py-2 text-start">No</th>
              <th class="border-b px-4 py-2 text-start">Name</th>
              <th class="border-b px-4 py-2 text-start">Owner</th>
              <th class="border-b px-4 py-2 text-start">Access Right</th>
              <th class="border-b px-4 py-2 text-start">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(board, index) in collabBoardStore.getCollabsBoard()"
              :key="board.oid"
              class="cursor-pointer hover:bg-gray-100"
            >
              <td class="border-b px-4 py-2">{{ index + 1 }}</td>
              <td class="border-b px-4 py-2">{{ board.boardName }}</td>
              <td class="border-b px-4 py-2">
                {{ board.name }}
              </td>
              <td class="border-b px-4 py-2">
                {{ board.accessRight || "N/A" }}
              </td>
              <td class="border-b px-4 py-2">
                <button
                  class="itbkk-button-cancel btn text-slate-200"
                  access="guests"
                  @click="
                    () =>
                      onModalOpen({
                        oid: board.oid,
                        name: board.name,
                        nanoId: board.boardNanoId,
                      })
                  "
                >
                  leave
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="collabBoardStore.getCollabsBoard().length === 0"
          class="m-0 bg-white py-3 text-center font-bold text-gray-600"
        >
          No collab boards available
        </div>
      </div>
    </div>
    <RemoveCollabBoardModal :collab="curCollab" />
  </div>
</template>
