<script setup>
import { useRouter, useRoute } from "vue-router";
import { getStatusesByNanoIdBoard } from "../services/apiStatus";
import { addTask } from "../services/apiTask";
import { computed, onMounted, ref } from "vue";
import Button from "./Button.vue";
import { useTaskStore } from "./../stores/useTaskStore";
import { useSettingStore } from "./../stores/useSettingStore";
const settingStore = useSettingStore();
const taskStore = useTaskStore();
const statuses = ref();
const emits = defineEmits(["message"]);
const router = useRouter();
const route = useRoute();
const taskForm = ref({
  title: "",
  description: "",
  assignees: "",
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
  statuses.value = (await getStatusesByNanoIdBoard(route.params.oid)).data;
  taskForm.value.status = statuses.value[0];
});

async function addNewTask(newItem) {
  const res = await addTask(
    {
      ...newItem,
      status: newItem.status.id,
    },
    route.params.oid,
  );

  if (res.httpStatus === 201) {
    emits("message", {
      description: `The task has been successfully added.`,
      status: "success",
    });
    taskStore.addTask(res.data);
  } else if (res.status === 400) {
    emits("message", {
      description: `The status ${newItem.status.name}  will have too many tasks.  Please make progress and update status of existing tasks first.`,
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

const selectedFile = ref(null)

//choose file
const handleFileChange = (e) => {
  const files = e.target.files
  if(files && files[0]){
    selectedFile.value = files[0]
    console.log(selectedFile.value);
  }
}

//submit files attachment
const submitFile = async () => {
  if (!selectedFile.value) {
    console.log('No file selected');
    return;
  }

  // Create FormData to send as the file payload
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  // Replace with your API endpoint or handling logic
  // try {
  //   const response = await fetch('YOUR_API_ENDPOINT', {
  //     method: 'POST',
  //     body: formData,
  //   });
  //   const data = await response.json();
  //   console.log('File upload successful:', data);
  // } catch (error) {
  //   console.error('File upload failed:', error);
  // }
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-0 z-[1000] flex h-screen w-full items-center justify-center backdrop-blur-sm transition-all duration-500"
    >
      <div
        class="relative h-[34rem] w-[65rem] overflow-hidden rounded-2xl bg-neutral drop-shadow-2xl"
      >
        <div class="mt-4 flex items-center justify-between px-5">
          <div class="text-xl font-bold">New Task</div>
        </div>
        <div class="divider m-1"></div>
        <div class="flex flex-col gap-3">
          <div class="flex gap-4">
            <div class="ml-9">Title</div>
            <div class="text-error">
              {{ validateInput.title ? "(Max 100 characters)" : "" }}
            </div>
          </div>
          <div class="flex justify-center">
            <input
              v-model="taskForm.title"
              class="itbkk-title h-11 w-[60rem] rounded-2xl border-base-100 bg-secondary p-2"
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
                v-model="taskForm.description"
                class="itbkk-description h-[16em] w-[35rem] rounded-2xl border border-base-100 bg-secondary p-4 placeholder:italic placeholder:text-gray-400"
              ></textarea>
              <div class="flex gap-3">
                <input type="file" class="file-input file-input-bordered h-10 w-full max-w-xs" @change="handleFileChange"/>
                <button @click="submitFile">Upload</button>
              </div>
              {{ selectedFile?.name }}
            </div>
            <div class="flex flex-col justify-between gap-3">
              <div class="flex flex-col gap-3">
                <div class="flex gap-4">
                  <div>Assignees</div>
                  <div class="text-error">
                    {{ validateInput.assignees ? "(Max 30 characters)" : "" }}
                  </div>
                </div>
                <input
                  v-model="taskForm.assignees"
                  class="itbkk-assignees input w-[20rem] rounded-2xl border border-base-100 bg-secondary p-4 placeholder:italic placeholder:text-gray-400"
                />
              </div>
              <div class="flex flex-col gap-3">
                <div>Status</div>
                <select
                  v-model="taskForm.status"
                  class="itbkk-status select w-full max-w-xs bg-base-100"
                >
                  <option v-for="status in statuses" :value="status">
                    {{ status.name }}
                  </option>
                </select>
                <div>
                  The limit status :
                  <span
                    :class="
                      settingStore.getLimitTask()?.enableLimitsTask
                        ? 'text-success'
                        : 'text-error'
                    "
                  >
                    {{
                      settingStore.getLimitTask()?.enableLimitsTask
                        ? "enable"
                        : "disable"
                    }}
                    state
                  </span>
                </div>
              </div>
              
              <div class="mr-4 flex justify-end gap-3">
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
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
../lib/fetch.js
