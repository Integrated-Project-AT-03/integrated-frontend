<script setup>
import { ref } from "vue";
import Button from "./Button.vue";
import { createBoard } from "@/services/apiBoard.js";
import { useUserStore } from "@/stores/useUserStore";
import router from "@/router";
import { useBoardStore } from "../stores/useBoardStore.js";

const boardStore = useBoardStore();
const userStore = useUserStore();
const newBoard = ref({
  name: userStore.getUser().name + " " + "personal board",
});
const errorMessage = ref();
const emits = defineEmits(["message"]);

async function onSubmit() {
  if (!newBoard.value.name) {
    errorMessage.value = "Did not enter a empty.";
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
      class="itbkk-modal-new fixed right-0 top-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-500"
    >
      <div class="flex h-max w-[27rem] flex-col rounded-md bg-neutral p-6">
        <div class="text-2xl font-bold text-slate-300">New Board</div>
        <div class="divider"></div>
        <div class="itbkk-message flex flex-col gap-2 text-slate-300">
          <div class="">Name</div>
          <div>
            <input
              v-model="newBoard.name"
              maxlength="120"
              type="text"
              placeholder="Your board name"
              class="itbkk-board-name input input-bordered h-11 w-full bg-secondary"
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
              class="itbkk-button-ok btn btn-success text-slate-200"
              message="Save"
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

<style scoped></style>
