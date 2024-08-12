<script setup>
import { useRouter } from 'vue-router';
import { addItem, getItems, getItemById } from '../lib/fetch.js';
import { computed, onMounted, ref } from 'vue';
import Button from './ButtonModal.vue';
import { useTaskStore } from './../stores/useTaskStore';
const taskStore = useTaskStore();
const statuses = ref();
const emits = defineEmits(['message']);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const setting = ref();
const taskForm = ref({
  title: '',
  description: '',
  assignees: '',
  status: {},
});

const validateInput = computed(() => {
  return {
    title: taskForm.value.title.length > 100,
    description: taskForm.value.description.length > 500,
    assignees: taskForm.value.assignees.length > 30,
  };
});

onMounted(async () => {
  statuses.value = await getItems(`${uri}/v2/statuses`);
  taskForm.value.status = statuses.value.items[0];
  setting.value = await getItemById(`${uri}/v2/settings`, 'limit_of_tasks');
});

async function addNewTask(newItem) {
  const res = await addItem(`${uri}/v2/tasks`, {
    ...newItem,
    status: newItem.status.id,
  });

  if (res.httpStatus === 201) {
    emits('message', {
      description: `The task has been successfully added.`,
      status: 'success',
    });
    taskStore.addTask(res);
  } else if (res.status === 400) {
    emits('message', {
      description: `The status ${newItem.status.name}  will have too many tasks.  Please make progress and update status of existing tasks first.`,
      status: 'error',
    });
  } else {
    emits('message', {
      description: `Someting went wrong.`,
      status: 'error',
    });
  }
  return router.push({ name: 'Task' });
}
</script>

<template>
  <div
    class="w-full top-0 h-screen absolute flex justify-center items-center z-10"
  >
    <div class="m-auto w-[65rem] h-[48rem] bg-neutral rounded-2xl">
      <div class="flex mt-4 px-5 items-center justify-between">
        <div class="text-xl">New Task</div>
      </div>
      <div class="divider"></div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-4">
          <div class="ml-9">Title</div>
          <div class="text-error">
            {{ validateInput.title ? '(Max 100 characters)' : '' }}
          </div>
        </div>
        <div class="flex justify-center">
          <input
            v-model="taskForm.title"
            class="itbkk-title w-[60rem] h-11 rounded-2xl p-2 bg-secondary border-base-100"
          />
        </div>
        <div class="flex justify-around">
          <div class="flex flex-col gap-3">
            <div class="flex gap-4">
              <div>Description</div>
              <div class="text-error">
                {{ validateInput.description ? '(Max 500 characters)' : '' }}
              </div>
            </div>
            <textarea
              v-model="taskForm.description"
              class="itbkk-description w-[35rem] h-[28rem] rounded-2xl border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-3">
              <div class="flex gap-4">
                <div>Assignees</div>
                <div class="text-error">
                  {{ validateInput.assignees ? '(Max 30 characters)' : '' }}
                </div>
              </div>
              <textarea
                v-model="taskForm.assignees"
                class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"
              ></textarea>
            </div>
            <div class="flex flex-col gap-3">
              <div>Status</div>
              <select
                v-model="taskForm.status"
                class="itbkk-status select w-full max-w-xs bg-base-100"
              >
                <option v-for="status in statuses?.items" :value="status">
                  {{ status.name }}
                </option>
              </select>
              <div>
                The limit status :
                <span :class="setting?.enable ? 'text-success' : 'text-error'">
                  {{ setting?.enable ? 'enable' : 'disable' }} state
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3 mr-4">
        <Button
          class="itbkk-button-confirm btn-success"
          message="Save"
          @click="addNewTask(taskForm)"
          :disabled="
            taskForm.title === '' ||
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
../lib/fetch.js
