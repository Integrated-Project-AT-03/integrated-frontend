<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Trash from "../assets/icons/Trash.vue";
import Upload from "../assets/icons/Upload.vue";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import { editTaskById, getTaskById } from "./../services/apiTask";
import { deleteFile, uploadFiles } from "../services/apiFileAttachment.js";
import { useBoardStore } from "./../stores/useBoardStore";
import { useSettingStore } from "./../stores/useSettingStore";
import { useTaskStore } from "./../stores/useTaskStore";
import Button from "./Button.vue";
import CloudUpload from "./CloudUpload.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import BoxAttachment from "./BoxAttachment.vue";
import Loading from "./Loading.vue";
import { onUnmounted } from "vue";
import Xmark from "@/assets/icons/Xmark.vue";
const boardStore = useBoardStore();
const settingStore = useSettingStore();
const taskStore = useTaskStore();
defineProps({ indexValue: Number });
const emits = defineEmits(["message"]);
const route = useRoute();
const router = useRouter();
const isEditMode = ref();
// const imageSrc = ref();
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
  if (isEditMode.value) {
    loadTask();
  } else {
    selectedFile.value = [];
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
};

onMounted(async () => {
  await loadTask();
  tempTaskAttachment.value = dataTask.value.tasksAttachment;
  statuses.value = (await getStatusesByNanoIdBoard(route.params.oid)).data;
  isLoading.value = false;
});

const handleEditTask = async () => {
  isLoading.value = true;

  if (
    (dataTask.value.title === "" &&
      dataTask.value.description === "" &&
      dataTask.value.description === "",
    dataTask.value.assignees === "" &&
      Object.values(dataTask.value.status).length === 0 &&
      dataTask.value.boardNanoId === route.params.oid)
  ) {
    return;
  }

  const res = await editTaskById(
    route.params.id,
    dataTask.value,
    route.params.oid,
  );
  isLoading.value = false;
  return res;
};

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");
const handleMessage = (e) => {
  emits("message", e);
};

const selectedFile = ref([]);
const errorMessage = ref("");

const maxFileSizeMB = 20;
const maxTotalSizeMB = 20;
const maxFileCount = 10;
const MAX_FILE_SIZE = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
// const MAX_TOTAL_SIZE = maxTotalSizeMB * 1024 * 1024; // Convert MB to bytes

// Handle files added via input
const handleFileInputChange = (e) => {
  const files = Array.from(e.target.files);
  processFiles(files);
};

// Handle files added via drag-and-drop
const handleDrop = (e) => {
  e.preventDefault(); // Prevent the default drop action
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
};

// Process and validate files
const processFiles = (files) => {
  errorMessage.value = "";
  // Check total file count
  if (selectedFile.value.length + files.length > maxFileCount) {
    errorMessage.value = `You can only upload a maximum of ${maxFileCount} files.`;
    return;
  }

  // Calculate the current total size of selected files
  let currentTotalSize = selectedFile.value.reduce(
    (total, file) => total + file.size,
    0,
  );

  const validFiles = [];
  for (const file of files) {
    // Check individual file size
    if (!file || !file.size) continue;

    if (file.size > MAX_FILE_SIZE) {
      errorMessage.value = `Each file cannot be larger than ${maxFileSizeMB} MB. The following files are not added: ${file.name}`;
      continue;
    }

    const hasTaskInTemp = tempTaskAttachment.value.find((temp) => {
      const tempFileName = `${temp.name}${temp.type ? `.${temp.type}` : ""}`;
      return tempFileName === file.name;
    });

    const hasTaskInSelect = selectedFile.value.find((seletFile) => {
      return seletFile.name === file.name;
    });

    if (hasTaskInSelect || hasTaskInTemp) {
      errorMessage.value =
        "File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file.";
      break;
    }

    // ไม่จำเป็นต้องเช็คค่ารวม
    // // Check combined total file size
    // if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
    //   errorMessage.value = `Total file size cannot exceed ${maxTotalSizeMB} MB.`;
    //   break;
    // }

    // Determine thumbnail based on file type
    const fileExtension = file.name.split(".").pop().toLowerCase();
    let preview = null;
    let icon = "";

    if (file.type.startsWith("image/")) {
      // Generate a thumbnail for image files
      preview = URL.createObjectURL(file);
    } else if (fileExtension === "pdf") {
      icon = "📄"; // PDF icon
    } else if (["doc", "docx"].includes(fileExtension)) {
      icon = "📝"; // Word icon
    } else if (["xls", "xlsx"].includes(fileExtension)) {
      icon = "📊"; // Excel icon
    } else if (["ppt", "pptx"].includes(fileExtension)) {
      icon = "📈"; // PowerPoint icon
    } else {
      icon = "📁"; // Generic file icon
    }

    // Add file with preview or icon to validFiles
    validFiles.push({ file, preview, icon, name: file.name });
    currentTotalSize += file.size;
  }

  selectedFile.value = [...selectedFile.value, ...validFiles];
};

const tempTaskAttachment = ref([]);

const filesId = [];

const tempDelete = (name) => {
  selectedFile.value = selectedFile.value.filter((file) => file.name != name);
};

const handleDeleteFile = (id) => {
  filesId.push(id);
  console.log(filesId);
  tempTaskAttachment.value = tempTaskAttachment.value.filter(
    (file) => file.id != id,
  );
};

const deleteFileById = async () => {
  const res = await deleteFile(route.params.oid, route.params.id, filesId);
  emits("message", {
    description: "The file delete successful",
    status: "success",
  });
  return res;
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
    console.log("No file selected");
    return;
  }

  // Create FormData to send as the file payload
  const formData = new FormData();

  // Append each file individually to the FormData
  selectedFile.value.forEach((file) => {
    formData.append("files", file.file);
  });

  const res = await uploadFiles(route.params.oid, route.params.id, formData); // Provide
  if (res.httpStatus === 200) {
    selectedFile.value = [];
  }
  if (res.httpStatus === 400) {
    errorMessage.value = `You can't upload more than 10 files`;
    selectedFile.value = [];
  }

  return res;
};

const handleSave = async () => {
  isLoading.value = true;
  if (filesId.length != 0) {
    const resDeleteFile = await deleteFileById();
    console.log(resDeleteFile);
    if (resDeleteFile.httpStatus != 200) {
      emits("message", {
        description: `Some delete file is wrong, please try again`,
        status: "error",
      });
      isLoading.value = false;
      return;
    }
  }
  if (selectedFile.value.length != 0) {
    const resAddFile = await submitFile();
    console.log(resAddFile);
    if (resAddFile.httpStatus != 200) {
      emits("message", {
        description: `Some add file is wrong, please try again`,
        status: "error",
      });
      isLoading.value = false;
      return;
    }
  }

  const resEditTask = await handleEditTask();
  isLoading.value = false;

  if (resEditTask.httpStatus === 200) {
    taskStore.updateTask(route.params.id, resEditTask.data);
    emits("message", {
      description: "The task has been updated",
      status: "success",
    });
  } else if (resEditTask.status === 404) {
    emits("message", {
      description: "The task does not exist",
      status: "error",
    });
    taskStore.deleteTask(route.params.id);
  } else if (resEditTask.status === 400) {
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
              class="mt-3 flex flex-col justify-between gap-3 pb-3 text-xs text-slate-200"
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

        <div class="flex h-auto w-auto justify-center">
          <div
            v-show="!isEditMode && dataTask?.tasksAttachment?.length != 0"
            class="h-auto w-[59rem] overflow-x-auto rounded-3xl bg-stone-600 p-4"
          >
            <div class="flex gap-3">
              <div
                v-show="!isEditMode"
                v-for="taskAttachment in dataTask?.tasksAttachment"
              >
                <BoxAttachment
                  :attachment="taskAttachment"
                  :isEditMode="isEditMode"
                />
              </div>
            </div>
          </div>

          <div
            v-show="!isEditMode && dataTask?.tasksAttachment?.length == 0"
            class="flex h-[10rem] w-[59rem] items-center justify-center gap-3 rounded-3xl bg-stone-600 font-bold"
          >
            <div>No files</div>
          </div>

          <!-- <div>อัปโหลดแล้ว ละกำลังจะลบออก</div> -->
          <div
            v-show="isEditMode"
            class="h-[12rem] w-[59rem] overflow-x-auto overflow-y-hidden rounded-3xl border-2 border-dashed bg-stone-600 p-4"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="flex gap-3">
              <div
                v-show="isEditMode"
                v-for="taskAttachment in tempTaskAttachment"
              >
                <BoxAttachment
                  :attachment="taskAttachment"
                  @delete-file="handleDeleteFile"
                  :isEditMode="isEditMode"
                />
              </div>
              <div
                v-for="file in selectedFile"
                :key="file.name"
                class="h-45 w-[8rem] rounded-2xl"
              >
                <div
                  class="flex h-[10rem] w-[8rem] cursor-pointer flex-col justify-between rounded-lg bg-stone-500 p-3"
                >
                  <div class="z-50 flex justify-end">
                    <button class="delete-btn" @click="tempDelete(file.name)">
                      <Xmark />
                    </button>
                  </div>
                  <img
                    class="h-[80%] w-[100%] object-cover"
                    v-show="file.preview"
                    :src="file.preview"
                    alt="File thumbnail"
                  />
                  <p
                    v-show="!file.preview"
                    class="flex h-[80%] w-[100%] items-center justify-center text-6xl"
                  >
                    {{ file.icon }}
                  </p>

                  <p
                    class="w-[100%] overflow-hidden text-nowrap text-xs underline"
                  >
                    {{ file.file?.name }} ({{
                      (file.file?.size / (1024 * 1024)).toFixed(2)
                    }}
                    MB)
                  </p>
                </div>
              </div>
              <div
                v-show="
                  isEditMode &&
                  (selectedFile.length != 0 || tempTaskAttachment?.length != 0)
                "
              >
                <label for="inputFile">
                  <span
                    :class="
                      selectedFile.length + tempTaskAttachment.length >= 10 &&
                      'opacity-10'
                    "
                    class="absolute right-20 hover:cursor-pointer hover:text-blue-400"
                    ><Upload
                  /></span>
                </label>
              </div>
              <div
                v-show="
                  isEditMode &&
                  tempTaskAttachment?.length == 0 &&
                  selectedFile.length == 0
                "
                class="flex w-full flex-col items-center justify-center gap-2 p-3"
              >
                <div class="z-50 p-2">
                  <CloudUpload />
                </div>
                <label for="inputFile">
                  <span
                    class="cursor-pointer text-stone-300 underline hover:text-blue-400"
                    ref="uploadText"
                    >Click to upload </span
                  >or drag and drop
                </label>
                <div>Maximum file size 20 MB.</div>
                <input
                  id="inputFile"
                  :disabled="
                    selectedFile.length + tempTaskAttachment.length >= 10
                  "
                  type="file"
                  @change="handleFileInputChange"
                  multiple
                  class="hidden"
                />
              </div>
            </div>
          </div>
          <p class="opacity-0">
            {{ selectedFile.length + tempTaskAttachment.length }}
          </p>
        </div>

        <div class="m-4 flex items-center justify-between gap-3">
          <!-- <Button message="Upload" @click="submitFile" /> -->
          <div class="ml-12 text-error">{{ errorMessage }}</div>
          <div class="flex flex-row gap-3">
            <!-- <Button v-show="isEditMode" message="delete file test" @click="() => deleteFileById()"/> -->
            <button
              class="itbkk-button-confirm btn btn-success w-16 drop-shadow-lg hover:border-base-100 hover:bg-base-100"
              v-show="isEditMode"
              @click="
                () => {
                  // handleEditTask(), submitFile();
                  handleSave();
                }
              "
              :disabled="
                dataTask.title === '' ||
                validateInput.assignees ||
                validateInput.description ||
                validateInput.title ||
                ((dataTask.assignees ?? '') ===
                  (compareTask?.assignees ?? '') &&
                  (dataTask.description ?? '') ===
                    (compareTask?.description ?? '') &&
                  dataTask?.status === compareTask?.status &&
                  (dataTask.title ?? '') === (compareTask?.title ?? '') &&
                  selectedFile.length == 0 &&
                  filesId.length == 0)
              "
            >
              Save
            </button>
            <Button
              class="itbkk-button-cancel"
              message="Close"
              @click="router.push({ name: 'Task' })"
            />
          </div>
        </div>
      </div>
    </div>
    <DeleteTaskModal :index-value="indexValue" @message="handleMessage" />
  </Teleport>
</template>

<style scoped></style>
../lib/fetch.js
