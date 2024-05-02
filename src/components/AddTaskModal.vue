<script setup>
import { useRouter } from 'vue-router';
import { addItem } from '../assets/fetch.js'
import TaskManagement from '@/lib/TaskManagement';
import { ref } from 'vue';

const datas = ref(TaskManagement)
const uri = import.meta.env.VITE_SERVER_URI
const router = useRouter();
const newData = ref({title:"", description:"", assignees:"", status:"NO_STATUS"})
async function addNewTask(newItem){
    const addTask = await addItem(`${uri}/v1/tasks`,newItem)
    datas.value.addTask(addTask)
    return addTask
}
</script>

<template>
  <div class="w-screen h-screen absolute flex justify-center items-center z-10">
    <div class="m-auto w-[65rem] h-[48rem] bg-neutral rounded-2xl">
        <div class="text-xl mt-4 ml-6">New Task</div>
        <div class="divider"></div>
        <div class="flex flex-col gap-3">
            <div class="ml-12">Title</div>
            <div class="flex justify-center">
                <textarea v-model="newData.title" class="itbkk-title w-[60rem] h-11 rounded-2xl p-2 bg-secondary border-base-100"></textarea>
            </div>
            <div class="flex justify-around">
                <div class="flex flex-col gap-3">
                    <div>Description</div>
                    <textarea v-model="newData.description"class="itbkk-description w-[35rem] h-[30rem] rounded-2xl border p-4 bg-secondary border-base-100"></textarea>
                </div>
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-3">
                        <div>Assignees</div>
                        <textarea v-model="newData.assignees" class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"></textarea>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div>Status</div>
                        <select v-model="newData.status" class="itbkk-status select w-full max-w-xs bg-base-100">
                            <option value="NO_STATUS">No status</option>
                            <option value="DOING">Doing</option>
                            <option value="DONE">Done</option>
                            <option value="TO_DO">To do</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-3 mr-4">
            <button
            @click="addNewTask(newData) && router.push({name: 'Task'})"
            class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
            >
            Add
            </button>

            <button @click="router.push({ path: `/task` })" class="itbkk-button-cancle btn">
            Close
            </button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

</style>