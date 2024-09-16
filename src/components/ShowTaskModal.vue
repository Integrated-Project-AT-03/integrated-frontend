<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import { getTaskById, editTaskById } from "./../services/apiTask";
import Loading from "./Loading.vue";
import Trash from "../assets/icons/Trash.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import Button from "./ButtonModal.vue";
import { useTaskStore } from "./../stores/useTaskStore";
import { useSettingStore } from "./../stores/useSettingStore";

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

const validateInput = computed(() => {
  return {
    title: dataTask.value.title?.length > 100,
    description: dataTask.value.description?.length > 500,
    assignees: dataTask.value.assignees?.length > 30,
  };
});

const loadTask = async () => {
  const response = await getTaskById(route.params.id);
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
    taskStore.updateTask(route.params.id, res);
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
</script>
onmou
<template>
  <Teleport to="body">
    <div
      class="fixed top-0 z-[1000] flex h-screen w-full items-center justify-center backdrop-blur-sm transition-all duration-500"
    >
      <RouterView @message="handleMessage($event)" />
      <div
        class="relative h-[30rem] w-[65rem] overflow-hidden rounded-2xl bg-neutral drop-shadow-2xl"
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
              class="itbkk-button-edit w-30 btn border-0 hover:border-base-100 hover:bg-base-100"
              :class="!isEditMode ? 'bg-edit' : 'btn-error text-white'"
            >
              {{ route.params.mode !== "edit" ? "Edit mode" : "Reset" }}
            </button>
            <Trash
              onclick="deletetask.showModal()"
              class="cursor-pointer text-error"
            />
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
              <div>
                The limit status :
                <span
                  :class="
                    settingStore.getLimitTask().enable
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{
                    settingStore.getLimitTask().enable ? "enable" : "disable"
                  }}
                  state
                </span>
              </div>
            </div>
            <div
              class="flex flex-auto flex-col justify-between gap-3 pb-3 text-xs text-slate-200"
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
