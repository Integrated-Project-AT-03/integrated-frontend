<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function back() {
  router.push({ name: "Boards" });
}
</script>

<template>
  <div
    class="bg-grey fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center"
  >
    <div class="space-y-10 text-center">
      <div class="space-y-4">
        <div class="text-7xl font-extrabold text-gray-200 drop-shadow-xl">
          404
        </div>
        <div class="text-2xl font-semibold text-gray-400">
          Invitation Not Found
        </div>
      </div>

      <div class="text-white-500">
        Sorry, we couldn't find your active invitation to this board.
      </div>

      <button
        @click="back"
        class="h-[55px] w-[200px] transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
      >
        Back to Board
      </button>
    </div>
  </div>
</template>

<style scoped>
.drop-shadow-xl {
  text-shadow: 2px 5px 8px rgba(0, 0, 0, 0.5);
}
</style>
