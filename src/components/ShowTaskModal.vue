<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItemById, editItem } from "./../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import Loading from "./Loading.vue";
import Alert from "./Alert.vue";

const emits = defineEmits(["message"]);
const route = useRoute();
const router = useRouter();
const dataTask = ref({
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
});
const isEditMode = ref();
watch(
  () => route.params.mode,
  () => (isEditMode.value = route.params?.mode === "edit"),
  { immediate: true }
);

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isLoading = ref(true);
const compareTask = ref();
const loadTask = async () => {
  isLoading.value = true;
  const response = await getItemById(`${uri}/v1/tasks`, route.params.id);
  isLoading.value = false;
  if (response.status === 404) {
    emits("message", {
      description: "The requested task does not exist",
      status: "error",
    });
    return router.push({ name: "Task" });
  }
  dataTask.value = response;
  compareTask.value = { ...dataTask.value };
};
onMounted(async () => await loadTask());

const editTask = async () => {
  isLoading.value = true;
  const response = await editItem(
    `${uri}/v1/tasks`,
    route.params.id,
    dataTask.value
  );
  isLoading.value = false;
  if (response.status === 404) {
    emits("message", {
      description: "The task does not exist",
      status: "error",
    });
  } else if (response.status === 500) {
    emits("message", {
      description: "Some input is invalid",
      status: "error",
    });
  } else {
    datas.value.updateTask(route.params.id, response);
    emits("message", {
      description: "The task has been updated",
      status: "success",
    });
  }
  router.push({ name: "Task" });
};

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");

const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <div class="w-screen h-screen absolute flex justify-center top-0 items-center z-10">
    <RouterView @message="handleMessage($event)" />
    <div
      class="relative overflow-hidden w-[65rem] h-[49rem] bg-neutral drop-shadow-2xl rounded-2xl"
    >
      <Loading :is-loading="isLoading" />
      <div
        class="text-xl pr-5 flex gap-5 justify-between text-slate-200 mt-5 ml-6 font-bold"
      >
        <input
          :disabled="!isEditMode"
          class="itbkk-title w-[60rem]"
          :class="
            isEditMode
              ? ' h-11 rounded-2xl p-2 bg-secondary border-base-100'
              : ' bg-neutral hover:border-neutral'
          "
          type="text"
          v-model.trim="dataTask.title"
        />

        <button
          @click="
            [
              $router.push({
                name: `${!isEditMode ? 'TaskEdit' : 'TaskDetail'}`,
                [`${!isEditMode ? 'params' : '_'}`]: { mode: 'edit' },
              }),
              isEditMode && loadTask(),
            ]
          "
          class="btn itbkk-button-edit w-30 hover:bg-base-100 border-0 hover:border-base-100"
          :class="!isEditMode ? 'bg-edit' : 'btn-error text-white'"
        >
          {{ route.params.mode !== "edit" ? "Edit mode" : "Reset" }}
        </button>
      </div>
      <div class="divider"></div>
      <div class="flex justify-around m-4">
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Description</div>
          <textarea
            :disabled="!isEditMode"
            v-model.trim="dataTask.description"
            :placeholder="dataTask.description ?? 'No Description Provided'"
            class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary placeholder:text-gray-400 placeholder:italic border-base-100"
          ></textarea>
        </div>
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Assignees</div>
            <textarea
              :disabled="!isEditMode"
              :placeholder="dataTask.assignees ?? 'Unassigned'"
              v-model.trim="dataTask.assignees"
              class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl placeholder:text-gray-400 placeholder:italic border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Status</div>
            <select
              :disabled="!isEditMode"
              v-model.trim="dataTask.status"
              class="itbkk-status select w-full max-w-xs bg-base-100"
            >
              <option value="NO_STATUS">No status</option>
              <option value="DOING">Doing</option>
              <option value="DONE">Done</option>
              <option value="TO_DO">To do</option>
            </select>
          </div>
          <div
            class="flex flex-col justify-between h-3/4 gap-3 pb-3 text-slate-200"
          >
            <div>
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
            <button
              class="btn btn-error w-full text-white hover:bg-base-100 hover:border-base-100"
              @click="router.push({ name: 'Delete' })"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end m-4 gap-3">
        <button
          v-show="isEditMode"
          @click="editTask()"
          class="itbkk-button-confirm btn drop-shadow-lg btn-success w-16 hover:bg-base-100 hover:border-base-100"
          :disabled="
            dataTask.title === '' ||
            ((dataTask.assignees ?? '') === (compareTask?.assignees ?? '') &&
              (dataTask.description ?? '') ===
                (compareTask?.description ?? '') &&
              (dataTask.status ?? '') === (compareTask?.status ?? '') &&
              (dataTask.title ?? '') === (compareTask?.title ?? ''))
          "
        >
          Save
        </button>
        <button
          @click="$router.push({ path: `/task` })"
          class="itbkk-button-cancel btn"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
