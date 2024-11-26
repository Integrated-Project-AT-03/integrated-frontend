<script setup>
import TaskIcon from "./../assets/icons/TaskIcon.vue";
import Arrow from "./../assets/icons/Arrow.vue";
import BoardSetting from "../feature/board/BoardSetting.vue";
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
    currentMenu.value = 'Menu'
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
  <div class="fixed h-screen top-0 w-screen pointer-events-none  z-[98] drop-shadow-lg backdrop-blur-sm duration-100 transition-opacity "  :class="showSelectBar ? 'opacity-100' : 'opacity-0'">

  </div>
  <nav
    @click="clickOutSideMenu"
    class="fixed z-[99] flex justify-between h-[60px] w-full sm:justify-center items-center md:flex-row md:h-[60px] md:items-center md:justify-between rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-5 text-white"
  >
    <ul class="flex items-center gap-2 ">
      <TaskIcon />
      <li class="font-bold hidden sm:block">IT-Bangmod Karban Kanban</li>
      <li class="font-bold  sm:hidden">IT-BKK</li>
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
                ?.name?.split(" ")
                .map((word) => word[0])
                .join("") || "GT"
            }}
          </p>
        </div>
        <p class="itbkk-fullname text-sm">
         <span class="hidden sm:inline-block">Welcome | </span>  {{ userStore?.getUser()?.name || "GUEST" }}
        </p>
      </li>
      <button
        v-if="!userStore?.getUser()?.oid"
        @click="() =>$router.push({name:'login'})"
        class="btn btn-sm my-auto text-white btn-success flex w-[70px] justify-center item-center"
      >
        <p class="itbkk-sign-out">Login</p>
      </button>
      <button
        @click="handleMenu"
        class="btn btn-ghost flex cursor-pointer items-center justify-center p-0"
      >
        <i class="pi pi-ellipsis-v text-[1rem]" />
      </button>

    </ul>
    <div
      ref="selectBarEle"

      class="absolute  right-0 top-[100%] z-10 flex h-screen w-[100%] md:min-w-[400px]  md:max-w-[15%] flex-col gap-3 rounded-b-[10px] bg-[#444444] p-5 transition-all duration-100"
      :class="showSelectBar ?  'translate-x-[0%]' : 'translate-x-[100%]'"
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
          v-if="$route.name !== 'Boards'"
          @click="currentMenu = 'Setting Board'"
          class="btn btn-ghost flex w-full justify-between"
        >
          <p>Setting Board</p>
          <i class="pi pi-sliders-v text-[1rem]" />
        </button>
        <button   v-if="userStore?.getUser()?.oid"
          @click="logout"
          class="btn btn-ghost flex w-full justify-between"
        >
          <p class="itbkk-sign-out">Logout</p>
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
