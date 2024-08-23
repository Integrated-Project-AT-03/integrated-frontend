<script setup>
import TaskIcon from "./../assets/icons/TaskIcon.vue";
import KebabIcon from "./../assets/icons/KebabIcon.vue";
import exmpleAccount from "/images/exmpleAcciont.png";
import KababIcon from "./../assets/icons/KebabIcon.vue";
import { parseJwt } from "./../utils/helper";
import { onMounted, ref } from "vue";

const payloadJwt = ref();
const showSelectBar = ref(false);
onMounted(() => {
  const token = localStorage.getItem("token");
  payloadJwt.value = parseJwt(token);
});
</script>

<template>
  <nav
    class="relative z-[100] flex h-[50px] w-full items-center justify-between rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-5 text-white"
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
        @click="showSelectBar = !showSelectBar"
        class="btn btn-ghost flex items-center justify-center p-0"
      >
        <KababIcon />
      </button>
    </ul>
    <div
      v-show="showSelectBar"
      class="absolute right-0 top-12 z-10 flex h-[80vh] w-[400px] flex-col rounded-b-[10px] bg-[#444444] p-5"
    >
      <div class="space-y-2 text-center text-lg">
        <div class="flex justify-between">
          icon
          <p>Setting</p>
          icon
        </div>
        <hr class="border-[1px] border-[#333333]" />
      </div>
    </div>
  </nav>
</template>
