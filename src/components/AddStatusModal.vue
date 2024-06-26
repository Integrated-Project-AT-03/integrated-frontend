<script setup>
import { useRouter } from "vue-router";
import { addItem } from "../lib/fetch.js";
import StatusManager from "@/lib/StatusManagement.js";
import { computed, ref } from "vue";
import colorStore from "./../lib/ColorsStore";
import Loading from "./Loading.vue";
import Button from "./ButtonModal.vue";

const emits = defineEmits(["message"]);
const datas = ref(StatusManager);
const uri = import.meta.env.VITE_SERVER_URI;
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
  const res = await addItem(`${uri}/v2/statuses`, newData.value);
  isLoading.value = false;

  if (res.httpStatus === 201) {
    datas.value.addStatus(res);
    emits("message", {
      description: `The status has been added.`,
      status: "success",
    });
    router.push({ name: "Status" });
  } else if (res.status === 400) {
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
  <div
    class="w-screen h-screen absolute top-0 flex justify-center items-center z-10"
  >
    <div
      class="relative overflow-hidden w-[65rem] h-[49rem] bg-neutral drop-shadow-2xl rounded-2xl"
    >
      <br />
      <div class="text-xl mt-4 ml-6">Add Status</div>
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
              class="itbkk-title w-[60rem] h-[3rem] rounded-2xl p-2 bg-secondary border-base-100"
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
              class="itbkk-title w-[60rem] h-[18rem] rounded-2xl p-2 bg-secondary border-base-100"
              placeholder="Please Write Description"
            ></textarea>
          </div>

          <div class="itbkk-status-color ml-12">Color</div>

          <div class="flex justify-center">
            <div
              class="color-picker-container flex flex-wrap gap-6 items-center"
            >
              <div
                v-for="color in colorStore.getColors()"
                :key="color.id"
                class="color-picker-item cursor-pointer relative flex justify-center items-center"
                @click="() => (newData.colorId = color.id)"
              >
                <div
                  :style="{ backgroundColor: color.hex }"
                  :class="
                    newData.colorId === color.id &&
                    'border-[4px] border-purple-500'
                  "
                  class="color-box w-8 h-8 rounded-full border border-gray-300"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex justify-end mt-8 mr-4 gap-3">
          <Button
            class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
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
        <Loading :is-loading="isLoading" />
      </div>
    </div>
  </div>
</template>
../lib/fetch.js @/lib/StatusManagement.js
