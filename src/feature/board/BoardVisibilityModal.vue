<script setup>
import Button from "@/ui/Button.vue";
import { updateVisibility } from "../../services/apiVisibility.js";
import { useRoute } from "vue-router";
import { useSettingStore } from "../../stores/useSettingStore.js";
import { useBoardStore } from "../../stores/useBoardStore.js";

const boardStore = useBoardStore();
const route = useRoute();

const handleConfirm = async () => {
  const curBoard = boardStore.getCurrentBoard();
  const visibility = curBoard.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
  await updateVisibility({ visibility }, route.params.oid);
  boardStore.setCurrentBoard({ ...curBoard, visibility });
};
</script>

<template>
  <dialog id="visibilityModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">
        Board visibility changed!
      </div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        {{
          boardStore.getCurrentBoard()?.visibility !== "PUBLIC"
            ? "Do you want to change board visibility to public?"
            : "Do you want to change board visibility to private?"
        }}
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success"
            message="Confirm"
            @click="handleConfirm"
          />
        </form>
        <form method="dialog">
          <Button class="itbkk-button-cancel text-slate-200" message="Cancel" />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
