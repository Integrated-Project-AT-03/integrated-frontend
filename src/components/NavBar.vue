<script setup>
import TaskIcon from "./../assets/icons/TaskIcon.vue";
import Xmark from "./../assets/icons/Xmark.vue";
import Arrow from "./../assets/icons/Arrow.vue";
import exmpleAccount from "/images/exmpleAcciont.png";
import KababIcon from "./../assets/icons/KebabIcon.vue";
import SettingIcon from "./../assets/icons/SettingIcon.vue";
import BoardSetting from "./BoardSetting.vue";
import { parseJwt } from "./../utils/helper";
import { onMounted, watch, ref } from "vue";
const payloadJwt = ref();
const showSelectBar = ref(false);
const currentMenu = ref("Menu");
const emits = defineEmits(["message"]);
const handleMessage = (e) => {
  emits("message", e);
};

onMounted(() => {
  const token = localStorage.getItem("token");
  payloadJwt.value = parseJwt(token);
});
</script>

<template>
  <nav
    class="relative z-[100] flex h-[80px] w-full items-center justify-between rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-5 text-white"
  >
    <ul class="flex items-center gap-2">
      <TaskIcon />
      <li class="font-bold">IT-Bangmod Karban Kanban</li>
    </ul>
    <ul class="item-center flex gap-2">
      <li class="flex items-center gap-3">
        <div
          class="flex h-[38px] w-[38px] items-center overflow-hidden rounded-full bg-slate-600 drop-shadow-2xl"
        >
          <img class="mt-5 scale-125" :src="exmpleAccount" />
        </div>
        <p class="text-sm">Welcome | {{ payloadJwt?.name }}</p>
      </li>
      <button
        @click="
          () => {
            showSelectBar = !showSelectBar;
            currentMenu = 'Menu';
          }
        "
        class="flex items-center justify-center p-0"
      >
        <KababIcon />
      </button>
    </ul>
    <div
      v-show="showSelectBar"
      class="absolute right-0 top-12 z-10 flex h-max min-w-[400px] max-w-[15%] flex-col gap-3 rounded-b-[10px] bg-[#444444] p-5 transition-all duration-300"
    >
      <div class="space-y-2 text-center text-lg">
        <div class="flex items-center justify-between">
          <button
            @click="currentMenu = 'Menu'"
            v-show="currentMenu !== 'Menu'"
            class="btn btn-ghost"
          >
            <Arrow />
          </button>
          <p>
            {{ currentMenu }}
          </p>
          <button @click="showSelectBar = false" class="btn btn-ghost">
            <Xmark />
          </button>
        </div>
        <hr class="border-[1px] border-[#333333]" />
      </div>

      <ul v-show="currentMenu === 'Menu'">
        <button
          @click="currentMenu = 'Setting Board'"
          class="btn btn-ghost flex w-full justify-between"
        >
          <p>Setting Board</p>
          <SettingIcon />
        </button>
      </ul>

      <div v-show="currentMenu === 'Setting Board'">
        <BoardSetting @message="handleMessage($event)" />
      </div>
    </div>
  </nav>
</template>
