<template>
<div class="text-xl mt-4 ml-6 font-semibold">Transfer a Status</div>
<div class="divider"></div>
<div class="flex flex-col gap-3">
  <div class="itbkk-message ml-12">There is some task associated with the Doing status.</div>
  <div class="flex items-center gap-3">
    <div class="itbkk-status ml-12">Transfer to</div>
    <select v-model.trim="newStatus" class="itbkk-status select w-48 max-w-xs bg-base-100">
      <option value="No Status">No Status</option>
      <option value="To Do">To Do</option>
      <option value="Doing">Doing</option>
      <option value="Done">Done</option>
    </select>
  </div>
  <div class="divider"></div>
  <div class="flex justify-end mt-4 mr-4 gap-3">
    <button @click="transferStatus" class="itbkk-button-cancel btn btn-danger w-16 hover:bg-base-100 hover:border-base-100 mr-3">Cancel</button>
    <button @click="transferStatus" class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100 ml-1">Transfer</button>
  </div>
</div>
</template>


<script setup>

</script>
<template>
  <div>

  </div>
 
</template>
