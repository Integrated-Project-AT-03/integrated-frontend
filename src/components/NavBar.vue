<script setup>
import TaskIcon from "./../assets/icons/TaskIcon.vue";
import Arrow from "./../assets/icons/Arrow.vue";
import BoardSetting from "./BoardSetting.vue";
import { useUserStore } from "./../stores/useUserStore";
import { logout as logoutApi, logoutMicrosoft } from "./../services/apiAuth";
import { onMounted, onUnmounted, ref } from "vue";
import router from "@/router";
import { useBoardStore } from "@/stores/useBoardStore.js";

const selectBarEle = ref();
const showSelectBar = ref(false);
const currentMenu = ref("Menu");
const userStore = useUserStore();
const emits = defineEmits(["message"]);
const boardStore = useBoardStore();
const handleMessage = (e) => {
  emits("message", e);
};

function clickOutSideMenu(e) {
  if (selectBarEle.value && !selectBarEle.value.contains(e.target)) {
    showSelectBar.value = false;
  }
}

function handleMenu(e) {
  showSelectBar.value = true;
  e.stopPropagation();
}

const logout = async () => {
  if (userStore.getUser().platform === "MICROSOFT") {
    document.location.href = await logoutMicrosoft();
  } else {
    await logoutApi();
    router.push({ name: "login" });
  }
};

onMounted(() => {
  document.body.addEventListener("click", clickOutSideMenu);
});

onUnmounted(() => {
  removeEventListener("click", clickOutSideMenu);
});
</script>

<template>
  <nav
    @click="clickOutSideMenu"
    class="fixed z-[99] flex h-[55px] w-full items-center justify-between rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-5 text-white"
  >
    <ul class="flex items-center gap-2">
      <TaskIcon />
      <li class="font-bold">IT-Bangmod Karban Kanban</li>
    </ul>
    <ul class="item-center flex gap-2">
      <li class="flex items-center gap-3">
        <div
          class="flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-slate-600 drop-shadow-2xl"
        >
          <p>
            {{
              userStore
                ?.getUser()
                ?.name.split(" ")
                .map((word) => word[0])
                .join("") || "GT"
            }}
          </p>
        </div>
        <p class="itbkk-fullname text-sm">
          Welcome | {{ userStore?.getUser()?.name || "GUEST" }}
        </p>
      </li>
      <button
        @click="handleMenu"
        class="btn btn-ghost flex cursor-pointer items-center justify-center p-0"
      >
        <i class="pi pi-ellipsis-v text-[1rem]" />
      </button>
    </ul>
    <div
      ref="selectBarEle"
      v-show="showSelectBar"
      class="absolute right-0 top-[100%] z-10 flex h-max min-w-[400px] max-w-[15%] flex-col gap-3 rounded-b-[10px] bg-[#444444] p-5 transition-all duration-300"
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
            <i class="pi pi-times text-[1rem]" />
          </button>
        </div>
        <hr class="border-[1px] border-[#333333]" />
      </div>

      <ul v-show="currentMenu === 'Menu'">
        <button
          :disabled="boardStore.getCurrentBoard().access !== 'OWNER'"
          v-if="$route.name !== 'Boards'"
          @click="currentMenu = 'Setting Board'"
          class="btn btn-ghost flex w-full justify-between"
        >
          <p>Setting Board</p>
          <i class="pi pi-sliders-v text-[1rem]" />
        </button>
        <button
          @click="logout"
          class="btn btn-ghost flex w-full justify-between"
        >
          <p class="itbkk-sign-out">Login Out</p>
          <img
            v-if="userStore.getUser().platform === 'MICROSOFT'"
            src="/images/microsoft-logo.png"
            alt="logo-microsoft"
            width="20"
            height="20"
          />
          <i v-else class="pi pi-sign-in text-[1rem] text-error" />
        </button>
      </ul>

      <div v-show="currentMenu === 'Setting Board'">
        <BoardSetting @message="handleMessage($event)" />
      </div>
    </div>
  </nav>
</template>
