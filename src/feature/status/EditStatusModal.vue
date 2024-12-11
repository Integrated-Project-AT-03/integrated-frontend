<script setup>
import { useRoute, useRouter } from "vue-router";
import { getStatusById, editStatusById } from "../../services/apiStatus.js";
import { computed, onMounted, ref } from "vue";
import Loading from "@/ui/Loading.vue";
import colorStore from "../../stores/ColorsStore.js";
import Button from "../../ui/Button.vue";
import { useTaskStatusStore } from "../../stores/useTaskStatusStore.js";
const statusStore = useTaskStatusStore();
const emits = defineEmits(["message"]);

let compareStatus;
const data = ref({});

const validateInput = computed(() => {
  return {
    name: data.value.name?.length > 50,
    description: data.value.description?.length > 200,
  };
});
const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const formattDate = (date) =>
  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");

onMounted(async function () {
  const res = await getStatusById(route.params.id, route.params.oid);
  if (res.status === 404) {
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
    statusStore.deleteStatus(route.params.id);
    router.push({ name: "Status" });
  } else if (res.data.id === 1 || res.data.id === 4) {
    emits("message", {
      description: `The ${res.data.name} is not allow to editing`,
      status: "error",
    });
    router.push({ name: "Status" });
  }
  data.value = res.data;
  compareStatus = { ...res.data };
  isLoading.value = false;
});

async function updateStatus() {
  isLoading.value = true;
  const res = await editStatusById(
    route.params.id,
    data.value,
    route.params.oid,
  );
  isLoading.value = false;

  if (res.httpStatus === 200) {
    statusStore.updateStatus(route.params.id, res.data);
    emits("message", {
      description: "The status has been updated.",
      status: "success",
    });
    router.push({ name: "Status" });
  } else if (res.httpStatus === 404) {
    emits("message", {
      description: `An error has occurred, the status does not exist.`,
      status: "error",
    });
    router.push({ name: "Status" });
    statusStore.deleteStatus(route.params.id);
  } else if (res.httpStatus === 422) {
    emits("message", {
      description: `${res.message}`,
      status: "error",
    });
    router.push({ name: "Status" });
  } else if (res.httpStatus === 400) {
    emits("message", {
      description: `Status name must be uniques, please choose another name.`,
      status: "error",
    });
  } else {
    emits("message", {
      description: `something went wrong, please try again`,
      status: "error",
    });
    router.push({ name: "Status" });
  }
}
</script>

<template>
  <div
    class="fixed right-0 top-0 z-[1000] flex h-screen w-full items-center justify-center backdrop-blur-sm transition-all duration-500"
  >
    <Loading :is-loading="isLoading" />
    <div class="h-[90%] w-[90%] overflow-y-scroll pb-5 lg:pb-0 md:h-[35rem] md:w-[50rem] lg:h-[30rem] lg:w-[65rem] lg:overflow-hidden rounded-2xl bg-neutral">
      <div class="ml-6 mt-4 text-xl">Edit Status</div>
      <div class="divider"></div>
      <div class="itbkk-modal-status flex flex-col items-center gap-4">
        <div class="flex flex-col gap-2 w-[20rem] md:w-[47rem] lg:w-fit">
          <div class="flex gap-4">
            <div>Name</div>
            <div class="text-error">
              {{ validateInput?.name ? "(Max 50 characters)" : "" }}
            </div>
          </div>
          <input
            class="itbkk-status-name h-11 lg:w-[60rem] rounded-2xl border-base-100 bg-secondary p-3"
            v-model="data.name"
          />
        </div>
        <div class="flex flex-col gap-2 w-[20rem] md:w-[47rem] lg:w-fit">
          <div class="flex gap-4">
            <div>Description</div>
            <div class="text-error">
              {{ validateInput?.description ? "(Max 200 characters)" : "" }}
            </div>
          </div>
          <textarea
            class="itbkk-status-description h-[6rem] lg:w-[60rem] rounded-2xl border border-base-100 bg-secondary p-4"
            v-model="data.description"
            placeholder="No description is provided."
          ></textarea>
        </div>
      </div>
      <div class="ml-10 mr-10 mt-6 flex flex-col md:flex-row justify-between">
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
      <div class="flex w-full items-center justify-between px-10">
        <div class="color-picker-container mb-3 lg:mb-0 flex flex-wrap items-center gap-6">
          <div>Color Tag :</div>
          <div
            v-for="color in colorStore.getColors()"
            :key="color.id"
            class="color-picker-item relative flex cursor-pointer items-center justify-center"
            @click="() => (data.colorId = color.id)"
          >
            <div
              :style="{ backgroundColor: color.hex }"
              :class="
                data.colorId === color.id && 'border-[4px] border-purple-500'
              "
              class="color-box relative h-8 w-8 rounded-full border border-gray-300"
            ></div>
          </div>
        </div>
        <div class="hidden lg:flex justify-end gap-3">
          <Button
            class="btn-success"
            message="Save"
            @click="updateStatus()"
            :disabled="
              data.name === '' ||
              validateInput.description ||
              validateInput.name ||
              ((data.name ?? '') === (compareStatus?.name ?? '') &&
                (data.description ?? '') ===
                  (compareStatus?.description ?? '') &&
                (data.colorId ?? '') === (compareStatus?.colorId ?? ''))
            "
          />
          <Button message="Cancel" @click="router.push({ name: 'Status' })" />
        </div>
      </div>
        <div class="flex justify-end gap-3 lg:hidden m-2 md:mr-2">
          <Button
            class="btn-success"
            message="Save"
            @click="updateStatus()"
            :disabled="
              data.name === '' ||
              validateInput.description ||
              validateInput.name ||
              ((data.name ?? '') === (compareStatus?.name ?? '') &&
                (data.description ?? '') ===
                  (compareStatus?.description ?? '') &&
                (data.colorId ?? '') === (compareStatus?.colorId ?? ''))
            "
          />
          <Button message="Cancel" @click="router.push({ name: 'Status' })" />
        </div>
    </div>
  </div>
</template>

<style scoped></style>
../lib/fetch.js ../lib/StatusManagement.js
