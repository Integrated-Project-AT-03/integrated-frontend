<script setup>
import Button from "./Button.vue";
import { deleteCollab } from "../services/apiCollab.js";
import { useRoute } from "vue-router";
import { useCollabStore } from "../stores/useCollabStore";

const props = defineProps({
  collab: {
    type: Object,
  },
});

const emits = defineEmits(["message"]);
const collabStore = useCollabStore();
const route = useRoute();

const handleConfirm = async () => {
  //It have bug for delete.
  try {
    const res = await deleteCollab(props.collab?.oid, route.params.oid);
    if (res.httpStatus === 200) {
      collabStore.deleteCollab(props.collab.oid);
      emits("message", {
        description: `The collaborator has been successfully deleted.`,
        status: "success",
      });
    }
  } catch (error) {
    console.log(error);
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
};
</script>

<template>
  <dialog id="removeCollabModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">Remove Collaborator</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to remove "{{ collab?.name }}" from the board
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
          <button class="itbkk-button-cancel btn btn-error text-slate-200">
            Cancel
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
