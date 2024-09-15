<script setup>
import { ref } from 'vue';
import Button from './ButtonModal.vue';
import { createBoard } from '@/services/apiBoard.js'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router';
import { useBoardStore } from '../stores/useBoardStore.js';

const boardStore = useBoardStore()
const userStore = useUserStore()
const newBoard = ref({name: userStore.getUser().name, ownerOid: userStore.getUser().oid})
const errorMessage = ref();
const emits = defineEmits(["message"]);

async function onSubmit(){
    if(!newBoard.value.name){
        errorMessage.value = 'Did not enter a empty.'
        return
    }
    const res = await createBoard(newBoard.value)
    if(res.httpStatus === 201){
        boardStore.addBoard(res)
        console.log(boardStore.getBoards());
        emits("message", {
            description: `The board has been successfully added.`,
            status: "success",
        });
    }
    console.log(res.httpStatus);
    return router.push({name: 'Board'})
}
</script>
 
<template>
<div class="flex absolute flex-col rounded-lg p-6 bg-base-100 border-2 border-[#666666] w-[27rem]">
      <div class="text-2xl font-bold text-slate-300">New Board</div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300 flex flex-col gap-2">
        <div class="">
            Name
        </div>
        <div>
            <input v-model="newBoard.name" maxlength="120"type="text" placeholder="Your board name" class="input input-bordered w-full h-11" />
        </div>
        <div class="text-error">
            {{ errorMessage }}
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Save"
            @click="onSubmit"
            :disabled="newBoard.name.length === 0"
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel text-slate-200"
            message="Cancel"
            @click="$router.push({name: 'Board'})"
          />
        </form>
      </div>
    </div>
</template>
 
<style scoped>

</style>