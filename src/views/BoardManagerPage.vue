<script setup>
import ButtonModal from "@/components/ButtonModal.vue";
import { onMounted, ref } from "vue";
import { getBoardsByUserOid } from "../services/apiBoard";
import { useUserStore } from "../stores/useUserStore.js";
const userStore = useUserStore();
const boards = ref();

const loadBoards = async () => {
  const res = await getBoardsByUserOid(userStore.getUser().oid);
  boards.value = res.data;
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
    <ul class="flex gap-3 mt-3">
      <li
        v-for="board in boards"
        :key="boards.nanoIdBoard"
        @click="
          $router.push({ name: 'Task', params: { oid: board.nanoIdBoard } })
        "
      >
        <div class="flex justify-center items-center h-[4rem] w-[10rem] rounded-xl hover:cursor-pointer bg-[#777777] p-3">
          {{ board.name }}
        </div>
      </li>
    </ul>
  </div>
  <RouterView />
</template>

<style scoped></style>
