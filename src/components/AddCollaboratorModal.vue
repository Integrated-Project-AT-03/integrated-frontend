<script setup>
import Button from './Button.vue';
</script>
 
<template>
  <dialog id="addcollaborator" class="modal itbkk-modal-alert">
    <div class="flex h-auto w-fit flex-col rounded-lg bg-base-100 p-6">
      <div class="text-2xl font-bold text-slate-300">Add Collaborator</div>
      <div class="divider"></div>
      <div class="flex gap-3">
        <div class="flex flex-col gap-2">
            Collaborator e-mail
            <input type="text" placeholder="Type here" class="itbkk-collaborator-email input input-bordered w-[25rem]" />
        </div>
        <div class="flex flex-col gap-2">
            Access Right
            <select
                  class="itbkk-access-right select select-ghost w-full max-w-xs bg-base-100"
                >
                  <option>Read</option>
                  <option>Write</option>
                </select>
        </div>
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Confirm"
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel text-slate-200"
            message="Cancel"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>
 
<style scoped>

</style>