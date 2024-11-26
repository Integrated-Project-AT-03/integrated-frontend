<script setup>
import { onMounted, ref } from "vue";
import Alert from "@/ui/Alert.vue";
import Navbar from "@/ui/NavBar.vue";
import ChevronRight from "../assets/icons/ChevronRight.vue";
import { useBoardStore } from "../stores/useBoardStore.js";
import { getUserInfo } from "../services/apiAuth";
import Loading from "@/ui/Loading.vue";

const message = ref("");
const status = ref();
const messageModalOpenState = ref(false);

let timeout;
import { useUserStore } from "../stores/useUserStore.js";

const userStore = useUserStore();
const boardStore = useBoardStore();

onMounted(async () => {
  const res = await getUserInfo();
  userStore.setUser(res.data);
});

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

const isLoading = ref(true);

const handleLoading = (loadingStatus) => {
  isLoading.value = loadingStatus;
};
</script>

<template>
  <div
    @click="clickOutSideNav"
    class="flex max-h-max min-h-screen w-full flex-col items-center pb-6"
  >
    <Loading :is-loading="isLoading" />
    <Navbar @message="handleMessage($event)" />
    <div
      class="container relative mt-[8%] flex h-full w-full flex-auto flex-col gap-2"
    >
      <div
        v-show="$route.name !== 'Boards' && $route.name !== 'Collab' && $route.name !== 'AddBoard'"
        class="itbkk-board-name text-center flex justify-center text-3xl mt-24 md:mt-16 font-bold"
      >
        {{ boardStore.getCurrentBoard()?.name }}
      </div>

      <div
        v-show="$route.name == 'Collab'"
        class="itbkk-board-name flex justify-center text-3xl font-bold"
      >
        Collaborator Management
      </div>

      <div
        class="mt-6 flex md:flex-row items-center gap-4 "
        v-show="$route.name !== 'Boards' && $route.name !== 'AddBoard'"
      >
        <div class="flex items-center" >
          <div    class="flex items-center"  v-if="boardStore.getCurrentBoard().access !== 'GUEST'">
          <button
            :disabled="$route.name === 'Boards'"
            @click="$router.push({ name: 'Boards' })"
            class="itbkk-button-home btn btn-ghost btn-sm md:text-xl font-bold"
            :class="$route.name === 'Boards' && 'text-primary'"
          >
            Boards
          </button>
          <ChevronRight />
          </div>
          <button
            :disabled="$route.name === 'Task'"
            @click="$router.push({ name: 'Task' })"
            class="itbkk-button-home btn btn-ghost btn-sm md:text-xl font-bold disabled:text-primary"
          >
            Tasks
          </button>

          <button
            :disabled="$route.name === 'Status'"
            @click="$router.push({ name: 'Status' })"
            class="btn btn-ghost btn-sm md:text-xl font-bold disabled:text-primary"
          >
            Status
          </button>
          <button
            :disabled="$route.name === 'Collab'"
            @click="$router.push({ name: 'Collab' })"
            class="btn btn-ghost btn-sm md:text-xl font-bold disabled:text-primary"
          >
            Collaborator
          </button>
        </div>
      </div>
      <RouterView @message="handleMessage($event)" @loading="handleLoading" />
    </div>
    <transition v-show="messageModalOpenState" name="toast">
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
