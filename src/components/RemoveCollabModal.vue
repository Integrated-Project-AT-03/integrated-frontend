<script setup>
import Button from './Button.vue'
import {deleteCollabBoard} from '../services/apiCollabBoard.js'
import { useRoute } from 'vue-router';
import {useCollabStore} from '../stores/useCollabStore'

const props = defineProps({
  collab: {
    type: Object,
  },
});

const collabStore = useCollabStore()

const route = useRoute();

const handleConfirm = async () => {
    await deleteCollabBoard(props.collab.oid, route.params.oid)
    // collabStore.deleteCollab(route.params.oid)
}
</script>
 
<template>
      <dialog id="removeCollabModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">
        Remove Collaborator
      </div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        <!-- {{
          boardStore.getCurrentBoard()?.visibility !== "PUBLIC"
            ? "Do you want to change board visibility to public?"
            : "Do you want to change board visibility to private?"
        }} -->
        Do you want to remove "{{ collab?.name }}" from the board
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
 
<style scoped>

</style>