<script setup>
import { useRouter } from "vue-router";
import { addItem, getItems } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { computed, onMounted, ref } from "vue";
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

const validateInput = computed(() => {
  return {
    title: newData.value.title.length > 100,
    description: newData.value.description.length > 500,
    assignees: newData.value.assignees.length > 30,
  };
});

onMounted(async () => {
  statuses.value = await getItems(`${uri}/v2/statuses`);
});

async function addNewTask(newItem) {
  const res = await addItem(`${uri}/v2/tasks`, newItem);

  if (res.httpStatus === 201) {
    emits("message", {
      description: `The task has been successfully added.`,
      status: "success",
    });
    datas.value.addTask(res);
  } else if (res.status === 400 || res.status === 500) {
    emits("message", {
      description: `${res.message}`,
      status: "error",
    });
  } else {
    emits("message", {
      description: `Someting went wrong.`,
      status: "error",
    });
  }
  return router.push({ name: "Task" });
}
</script>

<template>
  <div
    class="w-full top-0 h-screen absolute flex justify-center items-center z-10"
  >
    <div class="m-auto w-[65rem] h-[48rem] bg-neutral rounded-2xl">
      <div class="text-xl mt-4 ml-6">New Task</div>
      <div class="divider"></div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-4">
          <div class="ml-9">Title</div>
          <div class="text-error">
            {{ validateInput.title ? "(Max 100 characters)" : "" }}
          </div>
        </div>
        <div class="flex justify-center">
          <input
            v-model.trim="newData.title"
            class="itbkk-title w-[60rem] h-11 rounded-2xl p-2 bg-secondary border-base-100"
          />
        </div>
        <div class="flex justify-around">
          <div class="flex flex-col gap-3">
            <div class="flex gap-4">
              <div>Description</div>
              <div class="text-error">
                {{ validateInput.description ? "(Max 500 characters)" : "" }}
              </div>
            </div>
            <textarea
              v-model.trim="newData.description"
              class="itbkk-description w-[35rem] h-[28rem] rounded-2xl border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-3">
              <div class="flex gap-4">
                <div>Assignees</div>
                <div class="text-error">
                  {{ validateInput.assignees ? "(Max 30 characters)" : "" }}
                </div>
              </div>
              <textarea
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
          :disabled="
            newData.title === '' ||
            validateInput.assignees ||
            validateInput.description ||
            validateInput.title
          "
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
