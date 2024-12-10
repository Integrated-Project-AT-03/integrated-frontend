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
  console.log(dataTask.value);
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
      description: `On over limit, provide an appropriate message. The status ${statuses.value.items.find(({ id }) => +id === +dataTask.value.status)
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
        class="relative h-auto w-[90%] max-w-[60rem] rounded-2xl bg-neutral drop-shadow-2xl p-5"
      >
        <Loading :is-loading="isLoading" />
        <!-- Title and Action Buttons -->
        <div
          class="flex flex-wrap items-center justify-between gap-4 text-xl font-bold text-slate-200"
        >
          <input
            :disabled="!isEditMode"
            class="itbkk-title w-full md:w-auto rounded-lg border border-base-100 p-2 bg-secondary flex-1"
            type="text"
            v-model.trim="dataTask.title"
            placeholder="Enter task title"
          />
          <div class="flex gap-4">
            <Button
              :bgcolor="!isEditMode ? '#A020F0' : '#ef4444'"
              :message="route.params.mode !== 'edit' ? 'Edit mode' : 'Reset'"
              :action="() => handleEdit()"
              :access="['WRITER']"
            />
            <button
              :disabled="
                !['WRITER', 'OWNER'].includes(
                  boardStore.getCurrentBoard()?.access,
                )
              "
              class="btn btn-ghost btn-xs h-max w-max p-2 text-error"
            >
              <Trash />
            </button>
          </div>
        </div>

        <div class="divider my-4"></div>

        <!-- Form Content -->
        <div class="flex flex-wrap gap-4">
          <!-- Left Column -->
          <div class="flex-1">
            <label class="block text-slate-200">
              <span>Description</span>
              <textarea
                :disabled="!isEditMode"
                v-model.trim="dataTask.description"
                class="itbkk-description h-[12em] w-full rounded-lg border p-4 bg-stone-600 placeholder:text-gray-400"
                placeholder="Task description"
              ></textarea>
            </label>
          </div>

          <!-- Right Column -->
          <div class="flex-1 space-y-4">
            <!-- Assignees -->
            <label class="block text-slate-200">
              <span>Assignees</span>
              <input
                :disabled="!isEditMode"
                v-model.trim="dataTask.assignees"
                class="itbkk-assignees w-full rounded-lg border p-2 bg-secondary placeholder:text-gray-400"
                placeholder="Assign to a user"
              />
            </label>

            <!-- Status -->
            <label class="block text-slate-200">
              <span>Status</span>
              <select
                :disabled="!isEditMode"
                v-model="dataTask.status"
                class="itbkk-status w-full rounded-lg border p-2 bg-base-100"
              >
                <option v-for="status in statuses" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </label>

            <!-- Metadata -->
            <div class="text-xs text-slate-200 space-y-1">
              <div>TimeZone: {{ localZone }}</div>
              <div>Created On: {{ formattDate(dataTask.createdOn) }}</div>
              <div>Updated On: {{ formattDate(dataTask.updatedOn) }}</div>
            </div>
          </div>
        </div>

        <div class="divider my-4"></div>

        <!-- File Upload and View Mode -->
        <div class="flex flex-col gap-2 w-full">
          <!-- View Mode -->
          <div
            v-if="!isEditMode"
            class="h-[12rem] w-full rounded-3xl bg-stone-600 relative border-dashed border-2 border-gray-500 flex items-center justify-center"
          >
            <div v-if="dataTask?.tasksAttachment?.length === 0" class="text-gray-400 font-bold">
              No files
            </div>
            <div
              v-else
              class="flex w-full overflow-x-auto gap-3 p-2"
            >
              <!-- Display Attached Files -->
              <BoxAttachment
                v-for="taskAttachment in dataTask?.tasksAttachment"
                :key="taskAttachment.id"
                :attachment="taskAttachment"
                :isEditMode="false"
              />
            </div>
          </div>

          <!-- Edit Mode -->
          <div
            v-else
            class="h-[12rem] w-full rounded-3xl bg-stone-600 relative border-dashed border-2 border-gray-500"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <!-- Upload Button -->
            <label
              for="inputFile"
              v-show="selectedFile.length + tempTaskAttachment.length > 0"
              class="absolute top-2 right-2 cursor-pointer text-stone-300 hover:text-blue-400"
            >
              <Upload />
              <input
                id="inputFile"
                type="file"
                multiple
                @change="handleFileInputChange"
                class="hidden"
                :disabled="selectedFile.length + tempTaskAttachment.length >= 10"
              />
            </label>

            <!-- Click to Upload -->
            <div
              v-if="selectedFile.length + tempTaskAttachment.length === 0"
              class="flex flex-col items-center justify-center h-full"
            >
              <CloudUpload />
              <label
                for="inputFile"
                class="cursor-pointer text-stone-300 underline hover:text-blue-400"
              >
                Click to upload
              </label>
              <div>Maximum file size 20 MB.</div>
              <input
                id="inputFile"
                type="file"
                multiple
                @change="handleFileInputChange"
                class="hidden"
                :disabled="selectedFile.length + tempTaskAttachment.length >= 10"
              />
            </div>

            <!-- Uploaded Files -->
            <div
              v-else
              class="flex w-full overflow-x-auto gap-3 p-2"
            >
              <!-- Temp Attachments -->
              <BoxAttachment
                v-for="taskAttachment in tempTaskAttachment"
                :key="taskAttachment.id"
                :attachment="taskAttachment"
                @delete-file="handleDeleteFile"
                :isEditMode="true"
              />

              <!-- Selected Files -->
              <div
                v-for="file in selectedFile"
                :key="file.name"
                class="h-[8rem] w-[7rem] flex-shrink-0 rounded-2xl bg-stone-500 p-2"
              >
                <div class="relative">
                  <button
                    class="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                    @click="tempDelete(file.name)"
                  >
                    <Xmark />
                  </button>
                  <img
                    v-if="file.preview"
                    :src="file.preview"
                    class="h-[70%] w-full object-cover rounded-lg"
                    alt="File preview"
                  />
                  <p
                    v-else
                    class="flex h-[70%] w-full items-center justify-center text-6xl"
                  >
                    {{ file.icon }}
                  </p>
                </div>
                <p class="truncate text-xs text-center mt-1">
                  {{ file.file?.name }} ({{ (file.file?.size / (1024 * 1024)).toFixed(2) }} MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="m-4 flex items-center justify-between gap-3">
          <div class="ml-12 text-error">{{ errorMessage }}</div>
          <div class="flex flex-row gap-3">
            <button
              class="itbkk-button-confirm btn btn-success w-16 drop-shadow-lg hover:border-base-100 hover:bg-base-100"
              v-show="isEditMode"
              @click="handleSave"
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
