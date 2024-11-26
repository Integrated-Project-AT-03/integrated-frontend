<script setup>
import { ref } from "vue";
import { createBoard } from "@/services/apiBoard.js";
import { useUserStore } from "@/stores/useUserStore.js";
import router from "@/router/index.js";
import { useBoardStore } from "../../stores/useBoardStore.js";

const boardStore = useBoardStore();
const userStore = useUserStore();
const newBoard = ref({
  name: userStore.getUser().name + " " + "personal board",
});
const errorMessage = ref();
const emits = defineEmits(["message"]);

async function onSubmit() {
  if (!newBoard.value.name) {
    errorMessage.value = "Please enter a board name.";
    return;
  }
  const res = await createBoard(newBoard.value);
  if (res.httpStatus === 401) {
    localStorage.removeItem("token");
    return router.push({ name: "login" });
  }
  if (res.httpStatus === 201) {
    boardStore.addBoard(res.data);

    emits("message", {
      description: `The board has been successfully added.`,
      status: "success",
    });
  }
  return router.push({ name: "Boards" });
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-[90%] sm:max-w-[27rem] flex flex-col rounded-md bg-neutral p-6"
      >
        <div class="text-2xl font-bold text-slate-300">New Board</div>
        <div class="divider"></div>
        <div class="flex flex-col gap-2 text-slate-300">
          <div>Name</div>
          <div>
            <input
              v-model="newBoard.name"
              maxlength="120"
              type="text"
              placeholder="Your board name"
              class="input input-bordered h-11 w-full bg-secondary text-white placeholder-slate-400"
            />
          </div>
          <div class="text-error">
            {{ errorMessage }}
          </div>
        </div>
        <div class="divider"></div>
        <div class="mt-4 flex justify-end gap-3">
          <form method="dialog">
            <button
              class="itbkk-button-ok btn btn-success text-slate-200 hover:bg-green-600"
              @click="onSubmit"
              :disabled="newBoard.name.length === 0"
            >
              Confirm
            </button>
          </form>
          <form method="dialog">
            <button
              class="itbkk-button-cancel btn text-slate-200"
              @click="$router.push({ name: 'Boards' })"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

@media (max-width: 640px) {
  input {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
  button {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 1024px) {
  input {
    font-size: 1rem;
    padding: 0.75rem;
  }
  button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
}
</style>
