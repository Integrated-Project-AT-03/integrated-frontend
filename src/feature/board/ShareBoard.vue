<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getCollabBoard } from "../../services/apiCollab.js";
import { useCollabBoardStore } from "../../stores/useCollabBoardStore.js";
import RemoveCollabBoardModal from "../collab/RemoveCollabBoardModal.vue";

const collabBoardStore = useCollabBoardStore();
const router = useRouter();
console.log(collabBoardStore.getCollabsBoard());

const curCollab = ref({ oid: "", name: "" });

const emits = defineEmits(["message"]);

function handleMessage(e) {
  emits("message", e);
}

function goToInvitePage(boardNanoId) {
  router.push(`/board/${boardNanoId}/collab/invitations`);
}

function onModalOpen(collab) {
  curCollab.value = collab;
  document.getElementById("removeCollabBoardModal").showModal();
}

onMounted(async () => {
  try {
    const res = await getCollabBoard();
    collabBoardStore.setCollabsBoard(res.data);
  } catch (error) {
    console.error("Failed to fetch collab boards", error);
  }
});
</script>

<template>
  <div class="mt-3 flex flex-col gap-6 rounded-lg">
    <div
      v-if="collabBoardStore.getCollabsBoard().length === 0"
      class="flex transform items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-5 text-gray-500 shadow-lg transition duration-300"
      style="height: 150px"
    >
      No collaboration boards available
    </div>

    <div
      v-for="(board, index) in collabBoardStore.getCollabsBoard()"
      :key="board.oid"
      class="w-90 h-70 flex transform flex-col justify-between rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 text-gray-700 shadow-lg transition-transform hover:scale-105"
    >
      <div class="flex-grow">
        <div class="mb-3 flex items-center justify-between">
          <span
            class="rounded px-2 py-1 text-xs font-semibold text-white"
            :class="
              board.visibility === 'PRIVATE' ? 'bg-purple-500' : 'bg-green-700'
            "
          >
            {{ board.visibility }}
          </span>
          <h3 class="ml-2 text-lg font-bold text-gray-800">
            {{ board.boardName }}
            {{ board.status === "PENDING" ? "(Pending Invite)" : "" }}
          </h3>
        </div>
        <p class="text-sm text-gray-600">Owner: {{ board.name }}</p>
        <p class="text-sm text-gray-600">
          Access Right: {{ board.accessRight || "N/A" }}
        </p>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <span v-if="board.status === 'ACTIVE'"
          class="cursor-pointer text-sm text-blue-600 underline hover:text-blue-800"
          @click="
            $router.push({ name: 'Task', params: { oid: board.boardNanoId } })
          "
        >
          View board
        </span>

        <div v-if="board.status === 'PENDING'" class="flex gap-2">
          <button
            @click="goToInvitePage(board.boardNanoId)"
            class="rounded bg-green-500 px-3 py-1 text-white"
          >
            Accept
          </button>
          <button
            @click="goToInvitePage(board.boardNanoId)"
            class="rounded bg-red-500 px-3 py-1 text-white"
          >
            Decline
          </button>
        </div>

        <button
          v-else
          class="cursor-pointer rounded border-none bg-red-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-red-600"
          @click="
            onModalOpen({
              oid: board.oid,
              name: board.boardName,
              nanoId: board.boardNanoId,
            })
          "
        >
          Leave
        </button>
      </div>
    </div>

    <RemoveCollabBoardModal :collab="curCollab" @message="handleMessage" />
  </div>
</template>
