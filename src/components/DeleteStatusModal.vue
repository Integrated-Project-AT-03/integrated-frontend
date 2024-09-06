<script setup>
import { useRouter, useRoute } from "vue-router";
import { deleteStatusById } from "../services/apiStatus";
import Button from "./ButtonModal.vue";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
const statusStore = useTaskStatusStore();
const props = defineProps({
  sourceStatus: {
    type: Object,
  },
});
const emits = defineEmits(["message", "conflict", "update:modelValue"]);
const router = useRouter();
const route = useRoute();

async function deleteStatus(id) {
  emits("update:modelValue", true);
  const res = await deleteStatusById(id, route.params.oid);

  emits("update:modelValue", false);
  if (res.httpStatus === 200) {
    statusStore.deleteStatus(id);
    emits("message", {
      description: "The task has been deleted",
      status: "success",
    });
  } else if (res.httpStatus === 422) {
    emits("message", {
      description: `${res.message}`,
      status: "error",
    });
  } else if (res.httpStatus === 400) {
    emits("conflict");
  } else if (res.httpStatus === 404) {
    statusStore.deleteStatus(id);
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
  }

  return router.push({ name: "Status" });
}
</script>
<template>
  <dialog id="deleteModal" class="modal">
    <div class="flex h-auto w-fit flex-col rounded-lg bg-neutral p-6">
      <div class="text-2xl font-bold text-slate-300">Delete a Status</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to delete the {{ sourceStatus.name }} status
        {{ sourceStatus.index + 1 }}
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm"
            bgcolor="#16a34a"
            message="Confirm"
            @click="deleteStatus(sourceStatus.id)"
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel"
            bgcolor="#ef4444"
            message="Cancel"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
@/lib/StatusManagement.js
