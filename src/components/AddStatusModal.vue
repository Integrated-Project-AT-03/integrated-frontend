<script setup>
import { useRouter } from "vue-router";
import { addItem } from "../assets/fetch.js";
import TaskManagement from "@/lib/TaskManagement";
import { ref } from "vue";

const selectedColor = ref(null);

function selectColor(colorValue) {
  selectedColor.value = colorValue;
}

function isSelected(colorValue) {
  return selectedColor.value === colorValue;
}

const emits = defineEmits(["message"]);

const datas = ref(TaskManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const router = useRouter();
const newData = ref({ 
  title: "",
  description: "",
  assignees: "",
  status: "NO_STATUS",
});

const colors = [
  { value: "white", color: "#FFFFFF" }, 
  { value: "RED", color: "#A52A2A" },
  { value: "GREEN", color: "#FF4136" },
  { value: "BLUE", color: "#FF851B" },
  { value: "YELLOW", color: "#FFDC00" },
  { value: "ORANGE", color: "#FFD700" },
  { value: "PURPLE", color: "#2ECC40" },
  { value: "PINK", color: "#01FF70" },
  { value: "CYAN", color: "#0074D9" },
  { value: "MAGENTA", color: "#39CCCC" },
  { value: "LIME", color: "#7FDBFF" },
  { value: "TEAL", color: "#B10DC9" },
  { value: "BROWN", color: "#FF00FF" },
  { value: "SILVER", color: "#FF6CAC" },
  { value: "GOLD", color: "#AAAAAA" },
  { value: "GRAY", color: "#000000" },
]; 

async function addNewTask(newItem) {
  const newTask = await addItem(`${uri}/v1/tasks`, newItem);
  if (newTask.status === 500) {
    emits("message", {
      description: "Something went wrong",
      status: "error",
    });
  } else {
    datas.value.addTask(newTask);
    emits("message", {
      description: `The task has been successfully added`,
      status: "success",
    });
  }
  return router.push({ name: "Task" });
}

</script>

<template>
  <div class="w-screen h-screen absolute top-0 flex justify-center items-center z-10">
    <div class="relative overflow-hidden w-[65rem] h-[49rem] bg-neutral drop-shadow-2xl rounded-2xl">
      <br>
      <div class="text-xl mt-4 ml-6">Add Status</div>
      <div class="itbkk-modal-status">
        <div class="divider"></div>

        <div class="flex flex-col gap-3">
          <div class="itbkk-status-name ml-12">Name</div>
          <div class="flex justify-center">
            <input
              v-model.trim="newData.title"
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
                @click="selectColor(color.value)"
                :class="{ 'border-green-500': isSelected(color.value), 'bg-transparent': !isSelected(color.value) }"
              >
                <div :style="{ backgroundColor: color.color }" class="color-box w-8 h-8 rounded-full border border-gray-300 mt-2 relative">
                  <div
                    v-if="isSelected(color.value)"
                    class="absolute top-0 left-0 right-0 bottom-0 border-green-900 border-2 rounded-full"
                  ></div>
                </div>
                <span class="ml-2">{{ color.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>
        <div class="flex justify-end mt-4 mr-4 gap-3">
          <button
            @click="addNewTask(newData)"
            class="itbkk-button-comfirm btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
            :disabled="newData.title === ''"
          >
            Save
          </button>
          <button
            @click="router.push({ name: 'Statuses'})"
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