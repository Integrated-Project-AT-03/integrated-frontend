<script setup>
import { deleteCollab } from "@/services/apiCollab.js";
import { useRoute } from "vue-router";
import { useCollabBoardStore } from "../../stores/useCollabBoardStore.js";

const props = defineProps({
  collab: {
    type: Object,
  },
});
const route = useRoute();
const collabBoardStore = useCollabBoardStore();
const emits = defineEmits(["message"]);
const handleDeleteCollab = async () => {
  try {
    const res = await deleteCollab(props.collab.oid, props.collab.nanoId);
    if (res.httpStatus === 200) {
      collabBoardStore.deleteCollabBoard(props.collab.nanoId);
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

// const handleConfirm = () => {
//   handleDeleteCollab(props.boardName, route.params.oid, collabStore, emits);
// };
</script>

<template>
  <dialog id="removeCollabBoardModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">Leave Board</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to leave "{{ collab.name }}" board?
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <button
            class="itbkk-button-confirm btn btn-success"
            message="Confirm"
            @click="handleDeleteCollab"
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
