<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteItemById } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
async function deleteTask(id){
    const deleteTask = await deleteItemById(`${uri}/v1/tasks`,id)
    datas.value.deleteTask(id)
    router.push({name: 'Task'})
    return deleteTask
}
</script>
 
<template>
    <div class=" w-full h-full absolute flex justify-center items-center z-20">
        <div class="flex flex-col  border border-black rounded-lg p-4 bg-white h-auto w-fit">
            <div class="text-2xl text-black font-bold border-b border-gray-300 pb-4">Delete a Task</div>
            <br>
            <div class="itbkk-message text-black border-b border-gray-300 pb-4">Do you want to delete the task "Infrastructure"?</div>
            <div class="flex justify-end mt-4">
                <button class="itbkk-button-cancel px-4 py-2 bg-red-500 text-white rounded-lg mr-2 border-b-2 border-gray-200 shadow-md" 
                @click="router.push({name: 'TaskDetail'})">Cancel</button>
                <button class="itbkk-button-confirm px-4 py-2 bg-green-500 text-white rounded-lg border-b-2 border-gray-200 shadow-md"
                @click="deleteTask(route.params.id)">Confirm</button>
            </div>
        </div>
    </div>
</template>
 
<style scoped>

</style>