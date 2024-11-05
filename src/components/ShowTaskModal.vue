<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Trash from "../assets/icons/Trash.vue";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import { editTaskById, getTaskById } from "./../services/apiTask";
import {uploadFiles} from '../services/apiFileAttachment'

import { useBoardStore } from "./../stores/useBoardStore";
import { useSettingStore } from "./../stores/useSettingStore";
import { useTaskStore } from "./../stores/useTaskStore";
import Button from "./Button.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import Loading from "./Loading.vue";
const boardStore = useBoardStore();
const settingStore = useSettingStore();
const taskStore = useTaskStore();
defineProps({ indexValue: Number });
const emits = defineEmits(["message"]);
const route = useRoute();
const router = useRouter();
const isEditMode = ref();
const dataTask = ref({
  title: "",
  description: "",
  assignees: "",
  status: {},
  boardNanoId: route.params.oid,
});

watch(
  () => route.params.mode,
  () => (isEditMode.value = route.params?.mode === "edit"),
  { immediate: true },
);
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isLoading = ref(true);
const compareTask = ref();
const statuses = ref();

const handleEdit = () => {
  router.push({
    name: `${!isEditMode.value ? "TaskEdit" : "TaskDetail"}`,
    [`${!isEditMode.value ? "params" : "_"}`]: { mode: "edit" },
  });
  if (isEditMode.value) loadTask();
};

const validateInput = computed(() => {
  return {
    title: dataTask.value.title?.length > 100,
    description: dataTask.value.description?.length > 500,
    assignees: dataTask.value.assignees?.length > 30,
  };
});

const loadTask = async () => {
  const response = await getTaskById(route.params.id, route.params.oid);
  if (response.httpStatus === 404) {
    emits("message", {
      description: "The requested task does not exist",
      status: "error",
    });
    taskStore.deleteTask(route.params.id);
    return router.push({ name: "Task" });
  }
  dataTask.value = { ...response.data, status: response.data.status.id };
  compareTask.value = { ...response.data, status: response.data.status.id };
  console.log(dataTask.value);
};

onMounted(async () => {
  await loadTask();
  statuses.value = (await getStatusesByNanoIdBoard(route.params.oid)).data;
  isLoading.value = false;
});

const handleEditTask = async () => {
  isLoading.value = true;
  const res = await editTaskById(
    route.params.id,
    dataTask.value,
    route.params.oid,
  );
  isLoading.value = false;
  if (res.httpStatus === 200) {
    taskStore.updateTask(route.params.id, res.data);
    emits("message", {
      description: "The task has been updated",
      status: "success",
    });
  } else if (res.status === 404) {
    emits("message", {
      description: "The task does not exist",
      status: "error",
    });
    taskStore.deleteTask(route.params.id);
  } else if (res.status === 400) {
    return emits("message", {
      description: `On over limit, provide an appropriate message. The status ${
        statuses.value.items.find(({ id }) => +id === +dataTask.value.status)
          .name
      }  will have too many tasks.  Please make progress and update status of existing tasks first.`,
      status: "error",
    });
  } else {
    emits("message", {
      description: `something went wrong, please try again`,
      status: "error",
    });
  }
  router.push({ name: "Task" });
};

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");
const handleMessage = (e) => {
  emits("message", e);
};

const selectedFile = ref([])
const errorMessage = ref('')

 // Handle file selection
 const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const maxFileSizeMB = 20;
      const maxTotalSizeMB = 20;
      const maxFileCount = 10;

      // Check each file's size
      for (const file of files) {
        if (file.size / (1024 * 1024) > maxFileSizeMB) {
          errorMessage.value = `In each file must not be ${maxFileSizeMB} MB`;
          return;
        }
      }

      // Check total file count after adding new files
      if (selectedFile.value.length + files.length > maxFileCount) {
        errorMessage.value = `You can not choose files more than ${maxFileCount} ไฟล์ได้`;
        return;
      }

      // Calculate the total size of all selected files after adding new files
      const totalSize = selectedFile.value.reduce((acc, file) => acc + file.size, 0) +
                        files.reduce((acc, file) => acc + file.size, 0);

      if (totalSize / (1024 * 1024) > maxTotalSizeMB) {
        errorMessage.value = `Total files size must not be ${maxTotalSizeMB} MB`;
        return;
      }

      // Clear any previous error and add files to selectedFile if all checks pass
      errorMessage.value = '';
      selectedFile.value = [...selectedFile.value, ...files];
  };




//submit files attachment
const submitFile = async () => {
  if (!selectedFile.value) {
    console.log('No file selected');
    return;
  }

  // Create FormData to send as the file payload
  const formData = new FormData();

  // Append each file individually to the FormData
  selectedFile.value.forEach(file => {
    formData.append('files', file);
  });

  try {
    const res = await uploadFiles(route.params.oid, route.params.id, formData)// Provide
    console.log(res);
    if(res.httpStatus === 200){
      console.log('File upload seccessful');
      selectedFile.value = ''

    }
  } catch (error) {
    console.error('File upload failed:', error);
  }
};
</script>
<template>
  <Teleport to="body">
    <div
      class="fixed top-0 z-[1000] flex h-screen w-full items-center justify-center backdrop-blur-sm transition-all duration-500"
    >
      <RouterView @message="handleMessage($event)" />
      <div
        class="relative h-auto w-[65rem] rounded-2xl bg-neutral drop-shadow-2xl"
      >
        <Loading :is-loading="isLoading" />
        <div
          class="ml-6 mt-2 flex items-center justify-between pr-5 pt-2 text-xl font-bold text-slate-200"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="text-sm text-error">
              {{ validateInput.title ? "Max 100 characters" : "" }}
            </div>
            <input
              :disabled="!isEditMode"
              class="itbkk-title w-[50rem]"
              :class="
                isEditMode
                  ? 'h-11 w-[40rem] rounded-2xl border-base-100 bg-secondary p-2'
                  : 'bg-neutral hover:border-neutral'
              "
              type="text"
              v-model.trim="dataTask.title"
            />
          </div>

          <div class="flex items-center gap-4">
            <Button
              class="tooltip"
              :bgcolor="!isEditMode ? '#A020F0' : '#ef4444'"
              :message="route.params.mode !== 'edit' ? 'Edit mode' : 'Reset'"
              :action="() => handleEdit()"
              :access="['WRITER']"
            />

            <div
              data-tip="You need to be board owner or has write access to perform this action."
              :class="
                !['WRITER', 'OWNER'].includes(
                  boardStore.getCurrentBoard()?.access,
                ) && 'tooltip'
              "
            >
              <button
                :disabled="
                  !['WRITER', 'OWNER'].includes(
                    boardStore.getCurrentBoard()?.access,
                  )
                "
                onclick="deletetask.showModal()"
                class="btn btn-ghost btn-xs h-max w-max p-2 text-error"
              >
                <Trash />
              </button>
            </div>
          </div>
        </div>
        <div class="divider m-1"></div>
        <div class="m-4 flex justify-around">
          <div class="flex flex-col gap-2 text-slate-200">
            <div class="flex gap-4">
              <div>Description</div>
              <div class="text-sm text-error">
                {{ validateInput.description ? "(Max 500 characters)" : "" }}
              </div>
            </div>
            <textarea
              :disabled="!isEditMode"
              v-model.trim="dataTask.description"
              :placeholder="dataTask.description ?? 'No Description Provided'"
              class="itbkk-description h-[16em] w-[35rem] rounded-2xl border border-base-100 bg-secondary p-4 placeholder:italic placeholder:text-gray-400"
            ></textarea>
            <div v-show="isEditMode" class="flex mt-3 gap-3 items-center">
                <input type="file" class="file-input file-input-bordered h-10 w-full max-w-xs" @change="handleFileChange" multiple />
                <Button message="Upload" @click="submitFile" />
            </div>
              <!-- {{ selectedFile?.name }} -->
              <div v-for="(file, index) in selectedFile" :key="index">
                <div>{{ file.name }} ({{ (file.size / (1024 * 1024)).toFixed(2) }} MB)</div>
              </div>
              <div class="text-red-400">{{  errorMessage }}</div>

              <div v-for="taskAttachment in dataTask?.tasksAttachment">
                {{ `${taskAttachment.name}.${taskAttachment.type}` }}
              </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2 text-slate-200">
              <div class="flex gap-4">
                <div>Assignees</div>
                <div class="text-sm text-error">
                  {{ validateInput.assignees ? "(Max 30 characters" : "" }}
                </div>
              </div>
              <input
                :disabled="!isEditMode"
                :placeholder="dataTask.assignees ?? 'Unassigned'"
                v-model.trim="dataTask.assignees"
                class="itbkk-assignees input w-[20rem] rounded-2xl border border-base-100 bg-secondary p-4 placeholder:italic placeholder:text-gray-400"
              />
            </div>

            <div class="flex flex-col gap-2 text-slate-200">
              <div>Status</div>
              <select
                :disabled="!isEditMode"
                v-model="dataTask.status"
                class="itbkk-status select w-full max-w-xs bg-base-100"
              >
                <option v-for="status in statuses" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
              <div class="mt-2">
                The limit status :
                <span
                  :class="
                    settingStore.getLimitTask().enableLimitsTask
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{
                    settingStore.getLimitTask().enableLimitsTask
                      ? "enable"
                      : "disable"
                  }}
                  state
                </span>
              </div>
            </div>
            <div
              class="flex flex-col justify-between mt-3 gap-3 pb-3 text-xs text-slate-200"
            >
              <div class="flex gap-2">
                TimeZone:
                <div class="itbkk-timezone">
                  {{ localZone }}
                </div>
              </div>
              <div class="flex gap-2">
                Created On:
                <div class="itbkk-created-on">
                  {{ formattDate(dataTask.createdOn) }}
                </div>
              </div>
              <div class="flex gap-2">
                Updated On:
                <div class="itbkk-updated-on">
                  {{ formattDate(dataTask.updatedOn) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="m-4 flex justify-end gap-3">
          <Button
            class="itbkk-button-confirm btn-success w-16 drop-shadow-lg hover:border-base-100 hover:bg-base-100"
            v-show="isEditMode"
            @click="handleEditTask()"
            :disabled="
              dataTask.title === '' ||
              validateInput.assignees ||
              validateInput.description ||
              validateInput.title ||
              ((dataTask.assignees ?? '') === (compareTask?.assignees ?? '') &&
                (dataTask.description ?? '') ===
                  (compareTask?.description ?? '') &&
                dataTask?.status === compareTask?.status &&
                (dataTask.title ?? '') === (compareTask?.title ?? ''))
            "
            message="Save"
            bgcolor=""
          />
            <Button
              class="itbkk-button-cancel"
              message="Close"
              @click="router.push({ name: 'Task' })"
            />
        </div>
      </div>
    </div>
    <DeleteTaskModal :index-value="indexValue" @message="handleMessage" />
  </Teleport>
</template>

<style scoped></style>
../lib/fetch.js
