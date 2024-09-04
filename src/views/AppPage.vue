<script setup>
import { onMounted, ref } from "vue";
import Alert from "./../components/Alert.vue";
import { getItemById } from "./../lib/fetch.js";
import { parseJwt } from "./../utils/helper";
import Navbar from "../components/NavBar.vue";
import { useSettingStore } from "./../stores/useSettingStore";
const uri = import.meta.env.VITE_SERVER_URI;
const message = ref("");
const status = ref();
const messageModalOpenState = ref(false);
const setting = ref();
const path = window.location.pathname;
const payloadJwt = ref({});
const settingStore = useSettingStore();
let timeout;

onMounted(async () => {
  const settingLoad = await getItemById(`${uri}/v2/settings`, "limit_of_tasks");
  settingStore.setLimitTask(settingLoad);

  const token = localStorage.getItem("token");
  payloadJwt.value = await parseJwt(token);
});
console.log(settingStore);
const handleMessage = async (e) => {
  if (messageModalOpenState.value) {
    clearTimeout(timeout);
    messageModalOpenState.value = false;
    setTimeout(() => {
      messageModalOpenState.value = true;
      message.value = e.description;
      status.value = e.status;
      setTimeout(() => {
        messageModalOpenState.value = false;
      }, 5000);
    }, 1000);
  } else {
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
  <div class="flex h-screen w-full flex-col items-center p-2">
      <Navbar @message="handleMessage($event)" />
    <div
      class="container relative flex h-full w-full flex-auto items-center justify-center gap-3"
    >
      <RouterView :setting="setting" @message="handleMessage($event)" />
    </div>
    <!-- <BoardSetting
      @loadSetting="(state) => (setting = state)"
      @message="handleMessage($event)"
    /> -->
    <transition
      v-show="messageModalOpenState"
      class="fixed bottom-2 right-2 z-50 grid w-fit place-items-center"
      name="toast"
    >
      <Alert :status="status" :message="message" />
    </transition>
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
