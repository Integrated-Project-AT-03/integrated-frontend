<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteItemById } from "../assets/fetch.js";
import TaskStatusManagement from "@/lib/TaskStatusManagement";
import { ref } from "vue";

const props = defineProps({
  status: {
    type: Object,
  },
});
const emits = defineEmits(["message", "conflict"]);
const router = useRouter();
const datas = ref(TaskStatusManagement);
const uri = import.meta.env.VITE_SERVER_URI;

async function deleteStatus(id) {
  const deleteStatusRes = await deleteItemById(`${uri}/v2/statuses`, id);
  if (deleteStatusRes === 200) {
    datas.value.deleteStatus(id);
    emits("message", {
      description: "The task has been deleted",
      status: "success",
    });
  } else if (deleteStatusRes === 500) {
    emits("conflict");
  } else if (deleteStatusRes === 404) {
    emits("message", {
      description: `The task does not exist"  `,
      status: "error",
    });
  }
  return router.push({ name: "Statuses" });
}
</script>

<template>
  <dialog id="deleteModal" class="modal">
    <div class="flex flex-col rounded-lg p-6 bg-neutral h-auto w-fit">
      <div class="text-2xl font-bold text-slate-300">Delete a Status</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to delete the {{ status.name }} status
        {{ status.index + 1 }}
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <button
            class="itbkk-button-confirm btn btn-success text-slate-200"
            @click="deleteStatus(status.id)"
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
@/lib/Colors.js
