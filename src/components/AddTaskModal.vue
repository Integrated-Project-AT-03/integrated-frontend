<script setup>
import { useRouter } from "vue-router";
import { addItem, getItems } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { onMounted, ref } from "vue";
import Button from "./ButtonModal.vue";

const statuses = ref();
const emits = defineEmits(["message"]);

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const newData = ref({
  title: "",
  description: "",
  assignees: "",
  status: 1,
});

onMounted(async () => {
  statuses.value = await getItems(`${uri}/v2/statuses`);
});

async function addNewTask(newItem) {
  const newTask = await addItem(`${uri}/v2/tasks`, newItem);

  if (newTask.httpStatus === 201) {
    emits("message", {
      description: `The task has been successfully added`,
      status: "success",
    });
    datas.value.addTask(newTask);
  } else {
    emits("message", {
      description: `${res.message}`,
      status: "error",
    });
  }
  return router.push({ name: "Task" });
}
</script>

<template>
  <div
    class="w-screen top-0 h-screen absolute flex justify-center items-center z-10"
  >
    <div class="m-auto w-[65rem] h-[48rem] bg-neutral rounded-2xl">
      <div class="text-xl mt-4 ml-6">New Task</div>
      <div class="divider"></div>
      <div class="flex flex-col gap-3">
        <div class="ml-12">Title</div>
        <div class="flex justify-center">
          <input
            maxlength="100"
            v-model.trim="newData.title"
            class="itbkk-title w-[60rem] h-11 rounded-2xl p-2 bg-secondary border-base-100"
          />
        </div>
        <div class="flex justify-around">
          <div class="flex flex-col gap-3">
            <div>Description</div>
            <textarea
              maxlength="500"
              v-model.trim="newData.description"
              class="itbkk-description w-[35rem] h-[30rem] rounded-2xl border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-3">
              <div>Assignees</div>
              <textarea
                maxlength="30"
                v-model.trim="newData.assignees"
                class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"
              ></textarea>
            </div>
            <div class="flex flex-col gap-3">
              <div>Status</div>
              <select
                v-model="newData.status"
                class="itbkk-status select w-full max-w-xs bg-base-100"
              >
                <option v-for="status in statuses?.items" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3 mr-4">
        <Button
          class="itbkk-button-confirm btn-success"
          message="Save"
          @click="addNewTask(newData)"
          :disabled="newData.title === ''"
        />
        <Button
          class="itbkk-button-cancle"
          message="Cancel"
          @click="router.push({ name: 'Task' })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
