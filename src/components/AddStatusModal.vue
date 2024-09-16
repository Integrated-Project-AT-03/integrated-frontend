<script setup>
import { useRouter, useRoute } from "vue-router";
import { addStatus } from "../services/apiStatus";
import { computed, ref } from "vue";
import colorStore from "./../stores/ColorsStore";
import Loading from "./Loading.vue";
import Button from "./ButtonModal.vue";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
const statusStore = useTaskStatusStore();
const emits = defineEmits(["message"]);
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const newData = ref({
  colorId: 1,
  name: "",
  description: "",
});

const validateInput = computed(() => {
  return {
    name: newData.value.name.length > 50,
    description: newData.value.description.length > 200,
  };
});

async function addNewStatus() {
  isLoading.value = true;
  const res = await addStatus(newData.value, route.params.oid);
  isLoading.value = false;

  if (res.httpStatus === 201) {
    statusStore.addStatus(res.data);
    emits("message", {
      description: `The status has been added.`,
      status: "success",
    });
    router.push({ name: "Status" });
  } else if (res.httpStatus === 400) {
    emits("message", {
      description: "Status name must be uniques, please choose another name.",
      status: "error",
    });
  } else {
    emits("message", {
      description: "Somthing went wrong, Please try again",
      status: "error",
    });
    router.push({ name: "Status" });
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="backdrop-blur-sm z-[1000] transition-all duration-500 fixed top-0 flex h-screen w-screen items-center justify-center"
    >
      <div
        class="relative h-[30rem] w-[65rem] overflow-hidden rounded-2xl bg-neutral drop-shadow-2xl"
      >
        <br />
        <div class="ml-6 text-xl">Add Status</div>
        <div class="itbkk-modal-status">
          <div class="divider"></div>

          <div class="flex flex-col gap-3">
            <div class="flex gap-4">
              <div class="itbkk-status-name ml-12">Name</div>
              <div class="text-error">
                {{ validateInput.name ? "(Max 50 characters)" : "" }}
              </div>
            </div>
            <div class="flex justify-center">
              <input
                v-model="newData.name"
                class="itbkk-title h-[3rem] w-[60rem] rounded-2xl border-base-100 bg-secondary p-2"
                placeholder="Please Write Name"
              />
            </div>

            <div class="flex gap-4">
              <div class="itbkk-status-description ml-12">Description</div>
              <div class="text-error">
                {{ validateInput.description ? "(Max 200 characters)" : "" }}
              </div>
            </div>
            <div class="flex justify-center">
              <textarea
                v-model="newData.description"
                class="itbkk-title h-[6rem] w-[60rem] rounded-2xl border-base-100 bg-secondary p-2"
                placeholder="Please Write Description"
              ></textarea>
            </div>

            <div class="itbkk-status-color ml-10">Color</div>
            <div class="flex w-full items-center justify-between px-10">
              <div
                class="color-picker-container flex flex-wrap items-center gap-6"
              >
                <div
                  v-for="color in colorStore.getColors()"
                  :key="color.id"
                  class="color-picker-item relative flex cursor-pointer items-center justify-center"
                  @click="() => (newData.colorId = color.id)"
                >
                  <div
                    :style="{ backgroundColor: color.hex }"
                    :class="
                      newData.colorId === color.id &&
                      'border-[4px] border-purple-500'
                    "
                    class="color-box h-8 w-8 rounded-full border border-gray-300"
                  ></div>
                </div>
              </div>
              <div class="flex justify-end gap-3">
                <Button
                  class="itbkk-button-comfirm btn btn-success w-16 hover:border-base-100 hover:bg-base-100"
                  message="Save"
                  :disabled="
                    newData.name === '' ||
                    validateInput.description ||
                    validateInput.name
                  "
                  @click="addNewStatus"
                />
                <Button
                  class="itbkk-button-cancle"
                  message="Cancel"
                  @click="router.push({ name: 'Status' })"
                />
              </div>
            </div>
          </div>

          <Loading :is-loading="isLoading" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
../lib/fetch.js @/lib/StatusManagement.js
