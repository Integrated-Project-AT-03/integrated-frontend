<script setup>
import { useRouter } from "vue-router";
import { addItem } from "../assets/fetch.js";
import TaskStatusManagement from "@/lib/TaskStatusManagement.js";
import { ref } from "vue";




// function isSelected(colorValue) {
//    selectedColor.value === colorValue;

// }

const emits = defineEmits(["message"]);

const datas = ref(TaskStatusManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const newData = ref({ 
  hex: "C_F8719D",
  name: "",
  description: "",
});

// function selectColor(colorValue) {
//   selectedColor.value = colorValue;
//   newData.value.hex = colorValue
// }

const colors = [
  { value: "white", color: "C_F8719D" }, 
  { value: "RED", color: "C_F8719D" },
  { value: "GREEN", color: "C_F8719D" },
  { value: "BLUE", color: "C_F8719D" },
  { value: "YELLOW", color: "C_F8719D" },
  { value: "ORANGE", color: "C_F8719D" },
  { value: "PURPLE", color: "C_F8719D" },
  { value: "PINK", color: "C_F8719D" },
  { value: "CYAN", color: "C_F8719D" },
  { value: "MAGENTA", color: "C_F8719D" },
  { value: "LIME", color: "C_F8719D" },
  { value: "TEAL", color: "C_F8719D" },
  { value: "BROWN", color: "C_F8719D" },
  { value: "SILVER", color: "C_F8719D" },
  { value: "GOLD", color: "C_F8719D" },
  { value: "GRAY", color: "C_F8719D" },
]; 

async function addNewStatus() {
console.log(newData.value);
  const res = await addItem(`${uri}/v2/statuses`, newData.value);
  if (res.status === 500) {
    emits("message", {
      description: "Something went wrong",
      status: "error",
    });
  } else {
    datas.value.addStatus(res);
    emits("message", {
      description: `The status has been successfully added`,
      status: "success",
    });
  }
  router.push({ name: "Statuses" });
}


</script>

<template>
  <div class="w-screen h-screen absolute flex justify-center items-center z-10">
    <div class="relative overflow-hidden w-[65rem] h-[49rem] bg-neutral drop-shadow-2xl rounded-2xl">
      <br>
      <div class="text-xl mt-4 ml-6">Add Status</div>
      <div class="itbkk-modal-status">
        <div class="divider"></div>

        <div class="flex flex-col gap-3">
          <div class="itbkk-status-name ml-12">Name</div>
          <div class="flex justify-center">
            <input
              v-model.trim="newData.name"
              class="itbkk-title w-[60rem] h-[3rem] rounded-2xl p-2 bg-secondary border-base-100 "
              placeholder="Please Write Name"
            />
          </div>

          <div class="itbkk-status-description ml-12">Description</div>
          <div class="flex justify-center">
            <textarea
              v-model.trim="newData.description"
              class="itbkk-title w-[60rem] h-[20rem] rounded-2xl p-2 bg-secondary border-base-100 "
              placeholder="Please Write Description"
            ></textarea>
          </div>

          <div class="itbkk-status-color ml-12">Color</div>
        
          <div class="flex justify-center">
            <div class="color-picker-container flex flex-wrap gap-2 items-center">
              <div
                v-for="color in colors"
                :key="color.value"
                class="color-picker-item flex items-center cursor-pointer relative"
                @click="() => newData.hex = color.color "
              >
                <div :style="{ backgroundColor: color.color }" class="color-box w-8 h-8 rounded-full border border-gray-300 mt-2 relative">
                  <!-- <div
                    v-if="isSelected(color.value)"
                    class="absolute top-0 left-0 right-0 bottom-0 border-green-900 border-2 rounded-full"
                  ></div> -->
                </div>
                <span class="ml-2">{{ color.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>
        <div class="flex justify-end mt-4 mr-4 gap-3">
          <button
            @click="addNewStatus(newData)"
            class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
          >
            Save
          </button>
          <button
            @click="router.push({ name: 'statuses' })"
            class="itbkk-button-cancle btn"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
