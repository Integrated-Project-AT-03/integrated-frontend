<script setup>
import ButtonModal from "@/components/Button.vue";
import { watchEffect } from "vue";
import router from "@/router";
import { getBoardsByUserOid } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
import { useBoardStore } from "../stores/useBoardStore.js";

const boardStore = useBoardStore();
const userStore = useUserStore();
const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};

// const loadBoards = async () => {
//   const res = await getBoardsByUserOid(userStore.getUser().oid);
//   boards.value = res.data;
//   boardStore.setBoards(res.data)
// };

watchEffect(async () => {
  if (userStore.getUser()?.oid) {
    const res = await getBoardsByUserOid(userStore.getUser()?.oid);
   
    boardStore.setBoards(res.data);
    if (res.httpStatus === 401) {
      return router.push({ name: "login" });
    }
    if (boardStore.getBoards().length === 1) {
      return router.push({
        name: "Task",
        params: { oid: boardStore.getBoards()[0].nanoIdBoard },
      });
    }
  }
});

const handleClick = (board) => {
  router.push({ name: "Task", params: { oid: board.nanoIdBoard } });
};
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="mt-[-5rem] flex justify-end">
      <ButtonModal
        message="+ Create personal board"
        class="itbkk-button-create"
        @click="$router.push({ name: 'AddBoard' })"
      />
    </div>
    <div
      class="mt-5 flex w-full justify-center"
      v-show="boardStore.getBoards().length === 0"
    >
      <div
        class="itbkk-title flex h-[7rem] w-[70vw] items-center justify-center rounded-xl bg-[#777777] font-bold"
      >
        No board
      </div>
    </div>
    <ul class="itbkk-button-add mt-4 flex h-auto flex-wrap gap-3">
      <li
        v-for="board in boardStore.getBoards()"
        :key="board.nanoIdBoard"
        @click="handleClick(board)"
      >
        <div
          class="flex h-auto w-auto items-center justify-center rounded-2xl border-2 border-[#888888] bg-[#777777] p-5 hover:cursor-pointer hover:bg-[#666666]"
        >
          {{ board.name }}
        </div>
      </li>
    </ul>
  </div>
  <RouterView @message="handleMessage($event)" />
</template>

<style scoped></style>
