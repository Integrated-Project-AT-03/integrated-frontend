<script setup>
import { useRoute } from "vue-router";
import Button from "../../ui/Button.vue";
import { updateAccessCollab } from "../../services/apiCollab.js";
import { useCollabStore } from "../../stores/useCollabStore.js";
import { ref } from "vue";

const emits = defineEmits(["message", "revert"]);

const props = defineProps({
  idModal: {
    type: String,
  },
  handleConfirm: {
    type: Function,
  },
  header: {
    type: String,
  },
});
</script>

<template>
  <dialog :id="idModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[35rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">{{ header }}</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        <slot> add content </slot>
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
          <Button
            :action="() => $emit('revert')"
            class="itbkk-button-cancel text-slate-200"
            message="Cancel"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
