<script setup>
import Button from '../components/ButtonModal.vue'
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  bool: {
    type: Boolean,
    required: true,
  },
});

</script>
 
<template>
    <dialog id="visibilityModal" class="modal">
        <div class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6">
            <div class="text-2xl font-bold text-slate-300">Bord visibility changed!</div>
            <div class="divider"></div>
            <div class="itbkk-message text-slate-300">
                {{ message }}
            </div>
            <div class="divider"></div>
            <div class="mt-4 flex justify-end gap-3">
                <form method="dialog">
                <Button
                    class="itbkk-button-confirm btn-success"
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