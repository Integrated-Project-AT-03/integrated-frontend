<script setup>
import { computed, onMounted, ref, useId, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Trash from "../assets/icons/Trash.vue";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import { editTaskById, getTaskById } from "./../services/apiTask";
import {uploadFiles, downloadFile} from '../services/apiFileAttachment.js'

import { useBoardStore } from "./../stores/useBoardStore";
import { useSettingStore } from "./../stores/useSettingStore";
import { useTaskStore } from "./../stores/useTaskStore";
import Button from "./Button.vue";
import CloudUpload from './CloudUpload.vue'
import DeleteTaskModal from "./DeleteTaskModal.vue";
import Loading from "./Loading.vue";
import { onUnmounted } from "vue";
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
  if (isEditMode.value){
    loadTask();
  } else{
    selectedFile.value = []
  }
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


console.log('--------------------------------------------');

const selectedFile = ref([]);
const errorMessage = ref('');
const fileInputId = useId()

const maxFileSizeMB = 20;
const maxTotalSizeMB = 20;
const maxFileCount = 10;
const MAX_FILE_SIZE = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
const MAX_TOTAL_SIZE = maxTotalSizeMB * 1024 * 1024; // Convert MB to bytes

// Handle files added via input
const handleFileInputChange = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
}

// Handle files added via drag-and-drop
const handleDrop = (e) => {
  e.preventDefault(); // Prevent the default drop action
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
}

// Process and validate files
const processFiles = (files) => {
  errorMessage.value = '';
  // Check total file count
  if (selectedFile.value.length + files.length > maxFileCount) {
    errorMessage.value = `You can only upload a maximum of ${maxFileCount} files.`;
    return;
  }

  // Calculate the current total size of selected files
  let currentTotalSize = selectedFile.value.reduce((total, file) => total + file.size, 0);

  const validFiles = [];
  for (const file of files) {
      // Check individual file size
      if (!file || !file.size) continue;

      if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = `File ${file.name} exceeds the maximum size of ${maxFileSizeMB} MB.`;
        continue;
      }

      // Check combined total file size
      if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
        errorMessage.value = `Total file size cannot exceed ${maxTotalSizeMB} MB.`;
        break;
      }

      // Determine thumbnail based on file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let preview = null;
      let icon = '';

      if (file.type.startsWith('image/')) {
        // Generate a thumbnail for image files
        preview = URL.createObjectURL(file);
      } else if (fileExtension === 'pdf') {
        icon = '📄'; // PDF icon
      } else if (['doc', 'docx'].includes(fileExtension)) {
        icon = '📝'; // Word icon
      } else if (['xls', 'xlsx'].includes(fileExtension)) {
        icon = '📊'; // Excel icon
      } else if (['ppt', 'pptx'].includes(fileExtension)) {
        icon = '📈'; // PowerPoint icon
      } else {
        icon = '📁'; // Generic file icon
      }

      // Add file with preview or icon to validFiles
      validFiles.push({ file, preview, icon, name: file.name });
      currentTotalSize += file.size;
    }

  selectedFile.value = [...selectedFile.value, ...validFiles];
};

// Cleanup preview URLs when component is unmounted to release memory
onUnmounted(() => {
  selectedFile.value.forEach(({ preview }) => {
    if (preview) URL.revokeObjectURL(preview);
  });
});

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
    formData.append('files', file.file);
  });

  try {
    const res = await uploadFiles(route.params.oid, route.params.id, formData)// Provide
    console.log(res);
    if(res.httpStatus === 200){
      console.log('File upload seccessful');
      selectedFile.value = []
    }
    if(res.httpStatus === 400){
      errorMessage.value = `You can't upload more than 10 files`
      selectedFile.value = []
    }
  } catch (error) {
    console.error('File upload failed:', error);
  }
};

const dowloadFile = async (fileId) => {
  try {
    const res = await downloadFile(route.params.oid, route.params.id, fileId)
    const fileUrl = res.data.message.url;

  // Create a temporary <a> element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';  // Optional: specify a filename if you want, e.g., 'file.pdf'

    document.body.appendChild(link);

    // Programmatically click the link to trigger download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  } catch (error) {
    console.error('File download failed:', error);
  }
  
}



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
              class="itbkk-description h-[16em] w-[35rem] rounded-2xl border border-base-100 bg-stone-600 p-4 placeholder:italic placeholder:text-gray-400"
            ></textarea>
              
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

        <div class="w-auto h-auto flex justify-center">
            <div v-show="!isEditMode && dataTask?.tasksAttachment?.length != 0" 
            class="bg-stone-600 w-[59rem] h-auto p-4 rounded-3xl overflow-x-auto">
              <div class="flex gap-3">
                <div v-show="!isEditMode" v-for="taskAttachment in dataTask?.tasksAttachment">
                  <div class="cursor-pointer bg-stone-500 hover:bg-stone-700 hover:opacity-80 p-3 h-[10rem] w-[8rem] rounded-lg hover:text-blue-500 underline"
                  @click="dowloadFile(taskAttachment.id)">{{ `${taskAttachment.name}.${taskAttachment.type}` }}</div>
                </div>
              </div>
            </div>

            <!-- <div v-show="!isEditMode && dataTask?.tasksAttachment?.length != 0" class="bg-stone-600 w-[59rem] h-auto flex flex-wrap gap-3 p-4 rounded-3xl">
              <div v-show="!isEditMode" v-for="taskAttachment in dataTask?.tasksAttachment">
                <div class="cursor-pointer bg-stone-500 hover:bg-stone-700 hover:opacity-80 p-3 rounded-lg hover:text-blue-500 underline w-fit" 
                @click="dowloadFile(taskAttachment.id)">{{ `${taskAttachment.name}.${taskAttachment.type} `}}</div>
              </div>
            </div> -->


          <div v-show="!isEditMode && dataTask?.tasksAttachment?.length === 0" class="bg-stone-600 w-[59rem] h-[10rem] flex gap-3 justify-center items-center rounded-3xl">
            <div>No files</div>
          </div>

          <div v-show="isEditMode" class="flex mt-3 gap-3 items-center">
          <div
            v-show="isEditMode"
            class="overflow-x-auto border-2 border-dashed w-[59rem] h-[20rem] p-2 flex gap-3 justify-center items-center rounded-3xl"
            ref="uploadArea"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div v-show="selectedFile.length === 0" class="w-[18rem] p-3 flex flex-col items-center justify-center gap-2">
              <CloudUpload />
              <label :for="fileInputId">
                <span class="underline cursor-pointer text-stone-300 hover:text-blue-400" ref="uploadText">Click to upload </span>or drag and drop
              </label>
              <div>Maximum file size 20 MB.</div>
              <input :id="fileInputId" type="file" @change="handleFileInputChange" multiple class="hidden">
            </div>
            
            <!-- Display thumbnails based on file type -->
            <div class="mt-4 flex flex-nowrap gap-3 overflow-x-auto">
              <div v-for="file in selectedFile" :key="file.name" class="w-40 h-45 rounded-2xl border p-2 flex-shrink-0">
                <div class="flex flex-col gap-2">
                  <div class="flex justify-end w-full h-full cursor-pointer">X</div>
                  <img v-if="file.preview" :src="file.preview" alt="File thumbnail" class="w-36 h-40 object-cover rounded">
                  <span v-else class="text-sm flex items-center justify-center w-36 h-40">{{ file.icon }}</span>
                  <div class="text-xs">{{ file.file?.name }} ({{ (file.file?.size / (1024 * 1024)).toFixed(2) }} MB)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>


        <div class="m-4 flex justify-end items-center gap-3">
          <div class="text-red-400">{{ errorMessage }}</div>
          <Button message="Upload" @click="submitFile" />
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
