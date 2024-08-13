<script setup>
import { onMounted, ref } from "vue";
import Alert from "./components/Alert.vue";
import BoardSetting from "./components/BoardSetting.vue";
import Setting from "./assets/icons/Setting.vue";
import { getItemById } from "./lib/fetch.js";

const uri = import.meta.env.VITE_SERVER_URI;
const message = ref("");
const status = ref();
const messageModalOpenState = ref(false);
const setting = ref();
const path = window.location.pathname;
let timeout;

onMounted(async () => {
  const settingLoad = await getItemById(`${uri}/v2/settings`, "limit_of_tasks");
  setting.value = settingLoad;
});
const handleMessage = async (e) => {
  if (messageModalOpenState.value) {
  clearTimeout(timeout)
    messageModalOpenState.value = false;
     setTimeout(() => {
  messageModalOpenState.value = true;
  message.value = e.description;
  status.value = e.status;
  setTimeout(() => {
    messageModalOpenState.value = false;
  }, 5000);
}, 1000);
  }else{
    messageModalOpenState.value = true;
    message.value = e.description;
    status.value = e.status;
   timeout = setTimeout(() => {
      messageModalOpenState.value = false;
    }, 5000);
  }
};
</script>

<template>
  <div
    class="container h-screen w-full relative mx-auto flex items-center flex-col gap-3"
  >
    <div v-show="path !== '/login'" class="w-full flex justify-end mt-6">
      <Setting
        class="cursor-pointer itbkk-status-setting"
        onclick="status_setting.showModal()"
      />
    </div>
    <div v-show="path !== '/login'" class="text-5xl font-extrabold w-full flex justify-center m-7">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      >
        <div class="text-5xl">IT-Bangmod Kradan Kanban</div>
      </span>
    </div>

    <transition
      v-show="messageModalOpenState"
      class="fixed bottom-2 right-2 grid place-items-center z-50 w-fit"
      name="toast"
    >
      <Alert :status="status" :message="message" />
    </transition>
    <RouterView :setting="setting" @message="handleMessage($event)" />
    <BoardSetting
      @loadSetting="(state) => (setting = state)"
      @message="handleMessage($event)"
    />
  </div>
</template>

<style scoped>
@keyframes wobble {
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  50% {
    transform: translateY(0px);
    opacity: 1;
  }
  60% {
    transform: translateX(8px);
    opacity: 1;
  }
  70% {
    transform: translateX(-8px);
    opacity: 1;
  }
  80% {
    transform: translateX(4px);
    opacity: 1;
  }
  90% {
    transform: translateX(-4px);
    opacity: 1;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

@keyframes goBack {
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateX(100px);
    opacity: 0;
  }
}
.toast-enter-active {
  animation: wobble 0.8s ease;
}
.toast-leave-active {
  animation: goBack 0.5s ease;
}
</style>
