<script setup>
import Button from "@/components/Button.vue";
import { watchEffect } from "vue";
import router from "@/router";
import { getBoards } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from "../stores/useBoardStore.js";
import { onMounted } from "vue";
import { ref } from "vue";
import { getCollabBoard } from "../services/apiMakeCollabBoard";
import { leaveCollabBoard } from "../services/apiMakeCollabBoard";
import colorsStore from "@/stores/ColorsStore";
import CollabBoardModal from "../components/ShareBoard.vue"


const boardStore = useBoardStore();
const userStore = useUserStore();
const collabBoards = ref([]);
const boardName = ref(""); // For displaying the board name in the modal
const showLeaveModal = ref(false); // Control modal visibility
const boardToLeave = ref(null); // Track which board is being left
const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};

// const loadBoards = async () => {
//   const res = await getBoards(userStore.getUser().oid);
//   boards.value = res.data;
//   boardStore.setBoards(res.data)
// };

watchEffect(async () => {
  if (userStore.getUser()?.oid) {
    const res = await getBoards();
    boardStore.setBoards(res.data);
    if (res.httpStatus === 401) {
      return router.push({ name: "login" });
    }
    // if (boardStore.getBoards().length === 1) {
    //   return router.push({
    //     name: "Task",
    //     params: { oid: boardStore.getBoards()[0].nanoIdBoard },
    //   });
    // }
  }
});



onMounted(async () => {
  try {
    const res = await getCollabBoard();
    console.log(res);

    collabBoards.value = res.data; // Assuming you are using ref for reactive data
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
});


const handleClick = (board) => {
  router.push({ name: "Task", params: { oid: board.id } });
};

// Define the leaveBoard function
// const leaveBoard = async () => {
//   try {
//     const res = await leaveCollabBoard(boardToLeave.value);
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
// const confirmLeaveModal = () => {
//   showLeaveModal.value = true
// };

// // Function to close the modal
// const closeModal = () => {
//   showLeaveModal.value = false;
// };

</script>



<template>

  <div class="mt-[-5rem] flex justify-end">
    <button class="itbkk-button-create btn" @click="$router.push({ name: 'AddBoard' })">
      + Create personal board
    </button>
  </div>

  <!-- Personal Boards Section -->
  <h1 class="itbkk-personal-board text-2xl font-semibold text-white-800 mb-4 text-center">Personal Boards</h1>
  <div v-if="boardStore.getBoards().length === 0" class="flex justify-center">
    <div class="flex items-center justify-center h-16 w-64 rounded-lg bg-gray-300 text-gray-600 font-bold">
      No boards available
    </div>
  </div>
  <table class="min-w-full bg-white border border-gray-300">
    <thead>
      <tr class="bg-gray-200 text-gray-700">
        <th class="py-2 px-4 border-b">No</th>
        <th class="py-2 px-4 border-b">Name</th>
        <th class="py-2 px-4 border-b">Visibility</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(board, index) in boardStore.getBoards()" :key="board.nanoIdBoard" @click="handleClick(board)"
        class="hover:bg-gray-100 cursor-pointer">
        <td class="itbkk-personal-item py-2 px-4 border-b">{{ index + 1 }}</td>
        <td class="itbkk-personal-name py-2 px-4 border-b">{{ board.name }}</td>
        <td class="itbkk-personal-visibility py-2 px-4 border-b">{{ board.visibility }}</td>
      </tr>
    </tbody>
  </table>


  <!-- Collab Boards Section -->
  <div class="flex flex-col w-full gap-3 rounded-lg">
    <CollabBoardModal />
  </div>


  <RouterView @message="handleMessage($event)" />

</template>