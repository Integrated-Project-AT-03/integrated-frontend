<script setup>
import ButtonModal from "@/components/ButtonModal.vue";
import { onMounted, ref } from "vue";
import { getBoardsByUserOid } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from '../stores/useBoardStore.js';

const boardStore = useBoardStore()
const userStore = useUserStore();
const boards = ref();

const loadBoards = async () => {
  const res = await getBoardsByUserOid(userStore.getUser().oid);
  boards.value = res.data;
  boardStore.setBoards(res.data)
};
onMounted(async () => {
  await loadBoards();
});
</script>

<template>
  <div class="flex h-screen w-full flex-col gap-3">
    <div class="flex justify-end mt-6">
        <ButtonModal
          message="+ Create personal board"
          @click="$router.push({ name: 'AddBoard' })"
        />
    </div>
        <ul class="flex flex-wrap gap-2 mt-3">
          <li
            v-for="board in boardStore.getBoards()"
            :key="board.nanoIdBoard"
            @click="
              $router.push({ name: 'Task', params: { oid: board.nanoIdBoard } })
            "
          >
            <div class="flex justify-center items-center h-[4rem] w-[10rem] rounded-xl hover:cursor-pointer hover:bg-[#666666] bg-[#777777] p-3">
              {{ board.name }}
            </div>
          </li>
        </ul>
  </div>
  <RouterView />
</template>

<style scoped></style>
