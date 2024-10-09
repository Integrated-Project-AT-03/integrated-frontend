<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollabBoard, leaveCollabBoard } from "../services/apiMakeCollabBoard";
import { useCollabStore } from "../stores/useCollabStore";
import RemoveCollabModal from "./RemoveCollabModal.vue";
import Button from "./Button.vue";


const collabStore = useCollabStore();
const router = useRouter();
const collabBoards = ref([]);
const boardName = ref(""); // For displaying the board name in the modal
const showLeaveModal = ref(false); // Control modal visibility
const boardToLeave = ref(null); // Track which board is being left

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  boardName: {
    type: String,
    required: true
  }
});

const curCollab = ref({ oid: '', name: '' })
const route = useRoute()

onMounted(async () => {
  // const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  // boardStore.setCurrentBoard(curBoard);
  const res = await getCollabBoard(route.params.oid)
  collabStore.setCollabs(res.data)

  try {
    const res = await getCollabBoard();
    collabBoards.value = res.data; // Store fetched collaboration boards
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
})

function onModalOpen(collab) {
  document.getElementById('removeCollabModal').showModal()
  curCollab.value = collab
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
    <div class="flex flex-col w-full gap-3 rounded-lg">
      <h1 class="itbkk-collab-board text-2xl font-semibold text-white-800 mb-5 text-center">Collab Boards</h1>
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="py-2 px-4 border-b">No</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Owner</th>
            <th class="py-2 px-4 border-b">Access Right</th>
            <th class="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(board, index) in collabBoards" :key="board.oid" class="hover:bg-gray-100 cursor-pointer">
            <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
            <td class="py-2 px-4 border-b">{{ board.name }}</td>
            <td class="py-2 px-4 border-b">{{ board.owner?.name || 'Unknown Owner' }}</td>
            <td class="py-2 px-4 border-b">{{ board.accessRight || 'N/A' }}</td>
            <td class="py-2 px-4 border-b">
              <!-- Trigger modal -->
              <button class="itbkk-button-cancel btn text-slate-200" access="guests"
                @click="() => onModalOpen({ oid: board.oid, name: board.name })">leave</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <RemoveCollabModal :message="`Do you want to leave this ${curCollab.name} board?`" :collab="curCollab" />


  </div>
</template>
