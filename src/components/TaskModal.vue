<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItemById, editItem } from "./../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import Loading from "./Loading.vue";
const route = useRoute();
const router = useRouter();
const dataTask = ref({
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
});
const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isLoading = ref(true);
onMounted(async () => {
  const response = await getItemById(`${uri}/v1/tasks`, route.params.id);
  isLoading.value = false;
  if (response.status === 404) return router.push({ name: "Task" });
  dataTask.value = response;
});

const editTask = async () => {
  isLoading.value = true;
  const response = await editItem(
    `${uri}/v1/tasks`,
    route.params.id,
    dataTask.value
  );
  isLoading.value = false;
  if (response.status === 500) return router.push({ name: "Task" });
  datas.value.updateTask(route.params.id, response);
  router.push({ name: "Task" });
};

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");
</script>

<template>
  <div class="w-screen h-screen absolute flex justify-center items-center z-10">
    <div
      class="relative overflow-hidden m-auto w-[65rem] h-[47rem] bg-neutral rounded-2xl"
    >
      <Loading :is-loading="isLoading" />
      <div class="itbkk-title text-xl text-slate-200 mt-5 ml-6 font-bold">
        <input
          class="bg-neutral hover:border-neutral"
          type="text"
          v-model="dataTask.title"
        />
      </div>
      <div class="divider"></div>
      <div class="flex justify-around m-4">
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Description</div>
          <textarea
            v-model="dataTask.description"
            :placeholder="dataTask.description ?? 'No Description Provided'"
            class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary placeholder:text-gray-400 placeholder:italic border-base-100"
          ></textarea>
        </div>
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Assignees</div>
            <textarea
              :placeholder="dataTask.assignees ?? 'Unassigned'"
              v-model="dataTask.assignees"
              class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl placeholder:text-gray-400 placeholder:italic border p-4 bg-secondary border-base-100"
            ></textarea>
          </div>
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Status</div>
            <select
              v-model="dataTask.status"
              class="itbkk-status select w-full max-w-xs bg-base-100"
            >
              <option value="NO_STATUS">No status</option>
              <option value="DOING">Doing</option>
              <option value="DONE">Done</option>
              <option value="TO_DO">To do</option>
            </select>
          </div>
          <div class="flex flex-col h-3/4 gap-3 text-slate-200">
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
      <div class="divider"></div>
      <div class="flex justify-end m-4 gap-3">
        <button
          @click="editTask()"
          class="btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
        >
          SAVE
        </button>

        <button @click="$router.push({ path: `/task` })" class="btn">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
