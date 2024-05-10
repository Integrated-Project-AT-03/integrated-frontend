<script setup>
import { useRouter } from "vue-router";
import { addItem } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";

const emits = defineEmits(["message"]);

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const newData = ref({
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
});
async function addNewTask(newItem) {
  const newTask = await addItem(`${uri}/v1/tasks`, newItem);
  if (newTask.status === 500) {
    emits("message", {
      description: "Something went wrong",
      status: "error",
    });
  } else {
    datas.value.addTask(newTask);
    emits("message", {
      description: `The task has been successfully added`,
      status: "success",
    });
  }
  return router.push({ name: "Task" });
}
</script>

<template>
  < <div class="w-screen h-screen absolute flex justify-center items-center z-10">
    <div class="relative overflow-hidden w-[65rem] h-[49rem] bg-neutral drop-shadow-2xl rounded-2xl">
      <br>
      <div class="text-xl mt-4 ml-6">Add Status</div>
      <div class="itbkk-modal-status">

        <div class="divider"></div>
      <div class="flex flex-col gap-3">
        <div class="itbkk-status-name ml-12">Name</div>
        <div class="flex justify-center">
          <input
            v-model.trim="newData.title"
            class="itbkk-title w-[60rem] h-[3rem] rounded-2xl p-2 bg-secondary border-base-100"
          />
        </div>

        <div class="flex flex-col gap-3">
        <div class="itbkk-status-description ml-12">Description</div>
        <div class="flex justify-center">
          <textarea
            v-model.trim="newData.title"
            class="itbkk-title w-[60rem] h-[25rem] rounded-2xl p-2 bg-secondary border-base-100"
        ></textarea>
        </div>
        </div>
<!-- 
        <div class="flex justify-around">
          <div class="flex flex-col gap-3">
            <div class="itbkk-status-description">Description</div>
            <textarea
              v-model.trim="newData.description"
              class="itbkk-description w-[35rem] h-[30rem] rounded-2xl border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>

      </div> -->
     
          <!-- <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-3">
              <div>Assignees</div>
              <textarea
                v-model.trim="newData.assignees"
                class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"
              ></textarea>
            </div>
            <div class="flex flex-col gap-3">
              <div>Status</div>
              <select
                v-model.trim="newData.status"
                class="itbkk-status select w-full max-w-xs bg-base-100"
              >
                <option value="NO_STATUS">No status</option>
                <option value="DOING">Doing</option>
                <option value="DONE">Done</option>
                <option value="TO_DO">To do</option>
              </select>
            </div>
          </div> -->
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex flex-col "></div>
      <div class="flex justify-end gap-3 mr-4">
        <button
          @click="addNewTask(newData)"
          class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
          :disabled="newData.title === ''"
        >
          Save
        </button>

        <button
          @click="router.push({ path: `/task` })"
          class="itbkk-button-cancle btn"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
