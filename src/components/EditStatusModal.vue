<script setup>
import { useRoute, useRouter } from "vue-router";
import { getItemById, editItem } from "../assets/fetch.js";
import { computed, onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import TaskStatusManagement from "./../lib/TaskStatusManagement";
import colorStore from "../lib/ColorsStore.js";
import Button from "./ButtonModal.vue";

const emits = defineEmits(["message"]);
const management = ref(TaskStatusManagement);
let compareStatus;
const data = ref({});

const validateInput = computed(() => {
  return {
    name: data.value.name?.length > 50,
    description: data.value.description?.length > 200,
  };
});
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");

onMounted(async function () {
  const res = await getItemById(`${uri}/v2/statuses`, route.params.id);
  if (res.status === 404) {
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
    management.value.deleteStatus(route.params.id);
    router.push({ name: "Statuses" });
  } else if (res.id === 1 || res.id === 4) {
    emits("message", {
      description: `The ${res.name} is not allow to editing`,
      status: "error",
    });
    router.push({ name: "Statuses" });
  }
  data.value = res;
  compareStatus = { ...res };
  isLoading.value = false;
});

async function updateStatus() {
  isLoading.value = true;
  const res = await editItem(`${uri}/v2/statuses`, route.params.id, data.value);
  isLoading.value = false;

  if (res.httpStatus === 200) {
    management.value.updateStatus(route.params.id, res);
    emits("message", {
      description: "The status has been updated.",
      status: "success",
    });
  } else if (res.status === 404) {
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
    management.value.deleteStatus(route.params.id);
  } else if (res.status === 422) {
    emits("message", {
      description: `${res.message}`,
      status: "error",
    });
  } else if (res.status === 500) {
    emits("message", {
      description: `The name of status must be unique.`,
      status: "error",
    });
  }
  router.push({ name: "Statuses" });
}
</script>

<template>
  <div
    class="w-screen top-0 h-screen absolute flex justify-center items-center z-10"
  >
    <Loading :is-loading="isLoading" />
    <div class="m-auto w-[65rem] h-[48rem] bg-neutral rounded-2xl">
      <div class="text-xl mt-4 ml-6">Edit Status</div>
      <div class="divider"></div>
      <div class="itbkk-modal-status flex flex-col gap-4 items-center">
        <div class="flex flex-col gap-2">
          <div class="flex gap-4">
            <div>Name</div>
            <div class="text-error">
              {{ validateInput?.name ? "(Max 50 characters)" : "" }}
            </div>
          </div>
          <input
            class="itbkk-status-name w-[60rem] h-11 rounded-2xl p-3 bg-secondary border-base-100"
            v-model="data.name"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-4">
            <div>Description</div>
            <div class="text-error">
              {{ validateInput?.description ? "(Max 200 characters)" : "" }}
            </div>
          </div>
          <textarea
            class="itbkk-status-description w-[60rem] h-[19rem] rounded-2xl border p-4 bg-secondary border-base-100"
            v-model="data.description"
            placeholder="No description is provided."
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
      <div class="flex w-fit ml-10 px-10">
        <div class="color-picker-container flex flex-wrap gap-6 items-center">
          <div>Color Tag :</div>
          <div
            v-for="color in colorStore.getColors()"
            :key="color.id"
            class="color-picker-item flex items-center justify-center cursor-pointer relative"
            @click="() => (data.colorId = color.id)"
          >
            <div
              :style="{ backgroundColor: color.hex }"
              :class="
                data.colorId === color.id && 'border-[4px] border-purple-500'
              "
              class="color-box w-8 h-8 rounded-full border border-gray-300 relative"
            ></div>
          </div>
        </div>
      </div>
      <div class="flex gap-3 justify-end mr-5 mt-5">
        <Button class="btn-success" message="Save" @click="updateStatus()" :disabled="
            data.name === '' ||
            validateInput.description ||
            validateInput.name ||
            ((data.name ?? '') === (compareStatus?.name ?? '') &&
              (data.description ?? '') === (compareStatus?.description ?? '') &&
              (data.colorId ?? '') === (compareStatus?.colorId ?? ''))
          "/>
          <Button message="Cancel" @click="router.push({ name: 'Statuses' })"/>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
