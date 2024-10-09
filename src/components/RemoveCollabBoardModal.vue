<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteCollabBoard as deleteCollabBoardAPI } from "../services/apiCollabBoard";
import Button from "./Button.vue";
import { useCollabStore } from "./../stores/useCollabStore";

const taskStore = useCollabStore();
const router = useRouter();
const route = useRoute();
const emits = defineEmits(["message"]);
//const taskSelected = taskStore.findTask(route.params.id, route.params.oid);



defineProps({ indexValue: Number });

async function handleDeleteCollabBoard() {
  const { id, oid } = route.params;


  const res = await deleteCollabBoardAPI(oid, id);

  if (res.httpStatus === 200) {
    taskStore.deleteTask(id); // Use task store to delete task locally
    emits("message", {
      description: "The task has been deleted.",
      status: "success",
    });
    router.push({ name: "Task" }); // Redirect to Task page
  } else if (res.httpStatus === 404) {
    emits("message", {
      description: "The task does not exist.",
      status: "error",
    });
    taskStore.deleteTask(id); // Remove task from local store
    router.push({ name: "Task" });
  } else {
    emits("message", {
      description: "Something went wrong.",
      status: "error",
    });
  }
}

const handleConfirm = async () => {
  await deleteCollabBoard(props.collab.oid, route.params.oid)
  emits("deleteBoard", props.oid)
}
</script>

<template>
  <!-- Leave Collab Modal -->
  <dialog id="collabBoardRemoveModal" class="modal">
    <div class="flex h-auto w-fit flex-col rounded-lg bg-base-100 p-6">
      <div class="text-2xl font-bold text-slate-300">Leave Board</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to leave this <span class="font-semibold">{{ boardName }}</span> board?
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">

          <Button class="itbkk-button-confirm btn-success text-slate-200" message="Confirm" @click="handleConfirm">
            Confirm
          </Button>
        </form>
        <form method="dialog">
          <Button class="itbkk-button-cancel btn-error text-slate-200" message="Cancel">Cancel</Button>
        </form>
      </div>
    </div>
  </dialog>
</template>
