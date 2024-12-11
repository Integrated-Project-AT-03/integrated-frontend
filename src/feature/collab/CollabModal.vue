<script setup>
import Button from "../../ui/Button.vue";

import { useRoute } from "vue-router";
import { useCollabStore } from "../../stores/useCollabStore.js";

const props = defineProps({
  collab: {
    type: Object,
  },
  idModal: {
    type: String,
  },
  handleConfirm: {
    type: Function,
  },
  header: {
    type: String,
    default: "header",
  },
});

const emits = defineEmits(["message"]);
</script>

<template>
  <dialog :id="idModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[90%] lg:w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">{{ header }}</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        <slot> <p>add taxt here</p> </slot>
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <button
            class="itbkk-button-confirm btn btn-success"
            message="Confirm"
            @click="handleConfirm"
          >
            Confirm
          </button>
        </form>
        <form method="dialog">
          <button class="itbkk-button-cancel btn text-slate-200">Cancel</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
