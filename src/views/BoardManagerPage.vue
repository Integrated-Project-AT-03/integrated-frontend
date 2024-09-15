<script setup>
import ButtonModal from "@/components/ButtonModal.vue";
import { onMounted, ref } from "vue";
import { getBoardsByUserOid } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from '../stores/useBoardStore.js';

const boardStore = useBoardStore()
const userStore = useUserStore();
const boards = ref();
const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};

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
  <div class="flex w-full flex-col gap-3">
    <div class="flex justify-end mt-[-10rem]">
        <ButtonModal
          message="+ Create personal board"
          @click="$router.push({ name: 'AddBoard' })"
        />
    </div>
        <ul class="flex flex-wrap gap-3 mt-3">
          <li
            v-for="board in boardStore.getBoards()"
            :key="board.nanoIdBoard"
            @click="
              $router.push({ name: 'Task', params: { oid: board.nanoIdBoard } })
            "
          >
            <div class="flex justify-center items-center h-[4rem] w-[12rem] border-2 border-[#888888] rounded-2xl hover:cursor-pointer hover:bg-[#666666] bg-[#777777] p-3">
              {{ board.name }}
            </div>
          </li>
        </ul>
  </div>
  <RouterView @message="handleMessage($event)" />
</template>

<style scoped></style>
