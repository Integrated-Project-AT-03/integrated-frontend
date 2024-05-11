<script setup>
import { useRoute, useRouter } from "vue-router";
import { getItemById, editItem } from "../assets/fetch.js";
import { onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import TaskStatusManagement from "./../lib/TaskStatusManagement";

const emits = defineEmits(["message"]);
const management = ref(TaskStatusManagement);
const data = ref({});
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");

onMounted(async function () {
  const res = await getItemById(`${uri}/v2/statuses`, route.params.id);
  data.value = res;
  isLoading.value = false;
});

async function updateStatus() {
  const res = await editItem(`${uri}/v2/statuses`, route.params.id, data.value);
  if (res.status === 404) {
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
  } else {
    management.value.updateStatus(route.params.id, data.value);
    emits("message", {
      description: "The status has been updated",
      status: "success",
    });
  }
  return router.push({ name: "Statuses" });
}
</script>

<template>
  <div
    class="w-screen top-0 h-screen absolute flex justify-center items-center z-10"
  >
    <Loading :is-loading="isLoading" />
    <div class="m-auto w-[65rem] h-[44rem] bg-neutral rounded-2xl">
      <div class="text-xl mt-4 ml-6">Edit Status</div>
      <div class="divider"></div>
      <div class="itbkk-modal-status flex flex-col gap-4 items-center">
        <div class="flex flex-col gap-2">
          <div>Name</div>
          <input
            class="itbkk-status-name w-[60rem] h-11 rounded-2xl p-3 bg-secondary border-base-100"
            v-model="data.name"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div>Description</div>
          <textarea
            class="itbkk-status-description w-[60rem] h-[20rem] rounded-2xl border p-4 bg-secondary border-base-100"
            v-model="data.description"
          ></textarea>
        </div>
      </div>
      <div class="flex justify-between ml-10 mr-10 mt-6">
        <div class="flex gap-3">
          <div>TimeZone:</div>
          {{ localZone }}
        </div>
        <div class="flex gap-3">
          <div>Created On:</div>
          <div class="itbkk-created-on">
            <div>{{ formattDate(data.createdOn) }}</div>
          </div>
        </div>
        <div class="flex gap-3">
          <div>Updated On:</div>
          <div class="itbkk-updated-on">
            <div>{{ formattDate(data.updatedOn) }}</div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex gap-3 justify-end mr-5">
        <button @click="updateStatus()" class="btn btn-success">Save</button>
        <button @click="router.push({ name: 'Statuses' })" class="btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
@/lib/Colors.js
