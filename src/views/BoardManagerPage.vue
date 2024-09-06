<script setup>
import ButtonModal from '@/components/ButtonModal.vue';
import { onMounted, ref } from 'vue';
import {getItems} from '../lib/fetch'
import {useUserStore} from '../stores/useUserStore.js'
const uri = import.meta.env.VITE_SERVER_URI;
const userStore = useUserStore()
const boards = ref()

const loadBoards = async () => {
    const res = await getItems(`${uri}/v3/user/${userStore.getUser().oid}/boards`)
    boards.value = res.items
}
onMounted(async () => {
    await loadBoards()
})
</script>
 
<template>
    <div class="w-full h-screen flex flex-col gap-3">
        <ButtonModal message="+ Create personal board" @click="$router.push({name: 'AddBoard'})" />
        <ul>
            <li v-for="(board, index) in boards" :key="board.nanoIdBoard">
                <div class="flex w-[12rem] h-[3rem] items-center p-3 rounded-xl bg-[#777777]">
                    {{ board.name }}
                </div>
            </li>
        </ul>
    </div>
    <RouterView />
</template>
 
<style scoped>

</style>
