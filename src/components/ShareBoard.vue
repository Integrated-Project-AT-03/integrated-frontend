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

const collabBoardStore =  useCollabBoardStore()
const router = useRouter();
const collabBoards = ref([]);
const boardName = ref(""); // For displaying the board name in the modal
const showLeaveModal = ref(false); // Control modal visibility
const boardToLeave = ref(null); // Track which board is being left


const curCollab = ref({ oid: "", name: "" });
const route = useRoute();
const curOid = ref()

onMounted(async () => {
  // const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  // boardStore.setCurrentBoard(curBoard);
  try {
    const res = await getCollabBoard();
    collabBoards.value = res.data; // Store fetched collaboration boards
    collabBoardStore.setCollabsBoard(res.data)
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
});

function onModalOpen(collab) {
  document.getElementById("removeCollabBoardModal").showModal();
  curCollab.value = collab;
}

// // Define the leaveBoard function
// const leaveBoard = async () => {
//   try {
//     const res = await leaveCollabBoard(boardToLeave.value); // Call the API to leave the board
//     if (res.status === 200) {
//       // Remove the board from the list after successfully leaving
//       collabBoards.value = collabBoards.value.filter(board => board.oid !== boardToLeave.value);
//       alert('Successfully left the board.');
//     } else {
//       alert('Failed to leave the board.');
//     }
//   } catch (error) {
//     console.error("Error while leaving the board:", error);
//     alert('Error occurred while leaving the board.');
//   } finally {
//     closeModal(); // Close the modal after leaving
//   }
// };

// // Function to open the modal
// const confirmLeave = (board) => {
//   boardToLeave.value = board.oid; // Set the board to leave
//   boardName.value = board.name; // Set the board name
//   showLeaveModal.value = true; // Show the modal
// };

// // Function to close the modal
// const closeModal = () => {
//   showLeaveModal.value = false;
// };
</script>

<template>
  <div>
    <!-- Collab Boards Section -->
    <div class="flex w-full flex-col gap-3 rounded-lg">
      <h1
        class="itbkk-collab-board text-white-800 mb-5 text-center text-2xl font-semibold"
      >
        Collab Boards
      </h1>
      <table class="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="border-b px-4 py-2">No</th>
            <th class="border-b px-4 py-2">Name</th>
            <th class="border-b px-4 py-2">Owner</th>
            <th class="border-b px-4 py-2">Access Right</th>
            <th class="border-b px-4 py-2">Action</th>
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
            <td class="border-b px-4 py-2">{{ board.accessRight || "N/A" }}</td>
            <td class="border-b px-4 py-2">
              <!-- Trigger modal -->
              <button
                class="itbkk-button-cancel btn text-slate-200"
                access="guests"
                @click="() => onModalOpen({ oid: board.oid, name: board.name, nanoId: board.boardNanoId })"
              >
                leave
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <RemoveCollabBoardModal :collab="curCollab" />
  </div>
</template>
