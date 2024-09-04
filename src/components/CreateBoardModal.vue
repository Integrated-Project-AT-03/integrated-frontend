<script setup>
import Button from './ButtonModal.vue';
</script>
 
<template>
<div class="flex absolute flex-col rounded-lg p-6 bg-base-100 h-auto w-[27rem]">
      <div class="text-2xl font-bold text-slate-300">New Board</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300 flex flex-col gap-2">
        <div class="">
            Name
        </div>
        <div>
            <input type="text" placeholder="Type here" class="input input-bordered w-full h-11" />
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Save"
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel btn-error text-slate-200"
            message="Cancel"
            @click="$router.push({name: 'Boards'})"
          />
        </form>
      </div>
    </div>
</template>
 
<style scoped>

</style>