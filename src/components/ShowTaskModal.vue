<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItemById, editItem, getItems } from "./../lib/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import Loading from "./Loading.vue";
import Trash from "../assets/icons/Trash.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import Button from "./ButtonModal.vue";

const emits = defineEmits(["message"]);
const route = useRoute();
const router = useRouter();
const isEditMode = ref();
const dataTask = ref({
  title: "",
  description: "",
  assignees: "",
  status: {},
});
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
const statuses = ref();

const validateInput = computed(() => {
  return {
    title: dataTask.value.title?.length > 100,
    description: dataTask.value.description?.length > 500,
    assignees: dataTask.value.assignees?.length > 30,
  };
});

const loadTask = async () => {
  isLoading.value = true;
  const response = await getItemById(`${uri}/v2/tasks`, route.params.id);
  isLoading.value = false;
  if (response.status === 404) {
    emits("message", {
      description: "The requested task does not exist",
      status: "error",
    });
    datas.value.deleteTask(route.params.id);
    return router.push({ name: "Task" });
  }

  dataTask.value = { ...response, status: response.status.id };
  compareTask.value = { ...response, status: response.status.id };
};
onMounted(async () => {
  await loadTask();
  statuses.value = await getItems(`${uri}/v2/statuses`);
});

const editTask = async () => {
  isLoading.value = true;
  const res = await editItem(
    `${uri}/v2/tasks`,
    route.params.id,
    dataTask.value
  );
  isLoading.value = false;
  if (res.httpStatus === 200) {
    datas.value.updateTask(route.params.id, res);
    emits("message", {
      description: "The task has been updated",
      status: "success",
    });
  } else if (res.status === 404) {
    emits("message", {
      description: "The task does not exist",
      status: "error",
    });
    datas.value.deleteTask(route.params.id);
  } else if (res.status === 500) {
    console.log(res);
    emits("message", {
      description: `${res.message}`,
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
</script>

<template>
  <div
    class="w-full h-screen absolute flex justify-center top-0 items-center z-10"
  >
    <RouterView @message="handleMessage($event)" />
    <div
      class="relative overflow-hidden w-[65rem] h-[50rem] bg-neutral drop-shadow-2xl rounded-2xl"
    >
      <Loading :is-loading="isLoading" />
      <div
        class="text-xl pr-5 flex gap-5 h-[5rem] justify-between items-center text-slate-200 mt-2 ml-6 font-bold"
      >
        <div class="flex flex-col gap-2">
          <div class="text-error text-sm">
            {{ validateInput.title ? "Max 100 characters" : "" }}
          </div>
          <input
            :disabled="!isEditMode"
            class="itbkk-title w-[50rem]"
            :class="
              isEditMode
                ? ' h-11 rounded-2xl p-2 bg-secondary border-base-100 w-[40rem]'
                : ' bg-neutral hover:border-neutral'
            "
            type="text"
            v-model.trim="dataTask.title"
          />
        </div>

        <div class="flex gap-4 items-center">
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
          <Trash
            onclick="deletetask.showModal()"
            class="text-error cursor-pointer"
          />
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-around m-4">
        <div class="flex flex-col gap-2 text-slate-200">
          <div class="flex gap-4">
            <div>Description</div>
            <div class="text-error text-sm">
              {{ validateInput.description ? "(Max 500 characters)" : "" }}
            </div>
          </div>
          <textarea
            :disabled="!isEditMode"
            v-model.trim="dataTask.description"
            :placeholder="dataTask.description ?? 'No Description Provided'"
            class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary placeholder:text-gray-400 placeholder:italic border-base-100"
          ></textarea>
        </div>
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2 text-slate-200">
            <div class="flex gap-4">
              <div>Assignees</div>
              <div class="text-error text-sm">
                {{ validateInput.assignees ? "(Max 30 characters" : "" }}
              </div>
            </div>
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
              v-model="dataTask.status"
              class="itbkk-status select w-full max-w-xs bg-base-100"
            >
              <option v-for="status in statuses?.items" :value="status.id">
                {{ status.name }}
              </option>
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
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end m-4 gap-3">
        <Button
          class="itbkk-button-confirm w-16 hover:bg-base-100 hover:border-base-100 drop-shadow-lg btn-success"
          v-show="isEditMode"
          @click="editTask()"
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
  <DeleteTaskModal @message="handleMessage" />
</template>

<style scoped></style>
../lib/fetch.js
