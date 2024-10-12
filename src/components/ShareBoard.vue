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
  <div>
    <div class="mt-3 flex w-full flex-col gap-2 rounded-lg">
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
              <th class="border-b px-4 py-2 text-center">Owner</th>
              <th class="border-b px-4 py-2 text-center">Access Right</th>
              <th class="border-b px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(board, index) in collabBoardStore.getCollabsBoard()"
              :key="board.oid"
              class="cursor-pointer hover:bg-gray-100"
              @click="
                $router.push({
                  name: 'Task',
                  params: { oid: board.boardNanoId },
                })
              "
            >
              <td class="border-b px-4 py-2">{{ index + 1 }}</td>
              <td class="border-b px-4 py-2">{{ board.boardName }}</td>
              <td class="border-b px-4 py-2 text-center">
                {{ board.name }}
              </td>
              <td class="border-b px-4 py-2 text-center">
                {{ board.accessRight || "N/A" }}
              </td>
              <td class="flex justify-center border-b px-4 py-2">
                <button
                  class="itbkk-button-cancel btn text-slate-200"
                  access="guests"
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
