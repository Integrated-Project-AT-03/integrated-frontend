<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItemById } from "./../assets/fetch.js";
import Loading from "./Loading.vue";
const route = useRoute();
const router = useRouter();
const dataModal = ref({});
const uri = import.meta.env.VITE_SERVER_URI;
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isLoading = ref(true);
onMounted(async () => {
  const showTask = await getItemById(`${uri}/v1/tasks`, route.params.id);
  isLoading.value = false;
  if (showTask.status === 404) return router.push({ name: "Task" });
  dataModal.value = showTask;
  console.log("hee");
});

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
          :value="dataModal?.title"
        />
      </div>
      <div class="divider"></div>
      <div class="flex justify-around m-4">
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Description</div>
          <textarea
            class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary border-base-100"
            :class="
              dataModal?.description !== ''
                ? ' text-slate-200'
                : 'text-gray-400 italic'
            "
            >{{
              dataModal?.description !== ""
                ? dataModal.description
                : "No Description Provided"
            }}</textarea
          >
        </div>
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Assignees</div>
            <textarea
              class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"
              :class="
                dataModal?.assignees !== ''
                  ? ' text-slate-200'
                  : 'text-gray-400 italic'
              "
              >{{
                dataModal?.assignees !== null
                  ? dataModal.assignees
                  : "Unassigned"
              }}</textarea
            >
          </div>
          <div class="flex flex-col gap-2 text-slate-200">
            <div>Status</div>
            <select class="itbkk-status select w-full max-w-xs bg-base-100">
              <option selected>No status</option>
              <option :selected="dataModal?.status === 'doing'">Doing</option>
              <option :selected="dataModal?.status === 'done'">Done</option>
              <option :selected="dataModal?.status === 'to_do'">To do</option>
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
                {{ formattDate(dataModal?.createdOn) }}
              </div>
            </div>
            <div class="flex gap-2">
              Updated On:
              <div class="itbkk-updated-on">
                {{ formattDate(dataModal?.updatedOn) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end m-4 gap-3">
        <button
          @click="editTask(dataModal.id)"
          class="btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
        >
          Ok
        </button>

        <button @click="$router.push({ path: `/task` })" class="btn">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
