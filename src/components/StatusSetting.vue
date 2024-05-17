<script setup>

</script>
 
<template>
  <dialog id="status_setting" class="modal">
    <div class="itbkk-modal-setting flex flex-col rounded-lg p-5 bg-base-100 h-auto w-fit gap-4">
      <div class="text-2xl font-bold text-slate-300">Status Setting</div>
      <div class="divider"></div>
      <div class="flex flex-col text-slate-300">
        <div>User can limit the number of task in a status by setting the Maximum</div>
        <div>tasks in each status (exxcept "No status" and "Done" statuses).</div>
      </div>
      <div class="flex gap-4">
        <input type="checkbox" class="itbkk-limit-task toggle" checked />
        <div>Limit tasks in this status</div>
      </div>
      <div class="flex gap-4 items-center">
        <div>Maximum tasks</div>
        <input type="text" class="itbkk-max-task input input-bordered input-md w-[15rem] max-w-xs" />
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <button
            class="itbkk-button-confirm btn btn-success text-slate-200"
          >
            Save
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
 
<style scoped>

</style>