<script setup>
import { ref } from "vue";
import Homeview from "./views/Homeview.vue";
import Alert from "./components/Alert.vue";

const message = ref('')
const status = ref(undefined)
const messageModalOpenState = ref(false)

const handleShowMessage = (e) => {
  message.value = e.description
  status.value = e.status
  messageModalOpenState.value = true

  setTimeout(() => { 
    messageModalOpenState.value = false 
  }, 5000)}

</script>

<template>
  <transition v-show="messageModalOpenState" class="fixed bottom-2 right-2 grid place-items-center z-50 w-fit" name="toast">
    <Alert :status="status" :message="message"/>
  </transition>
  <router-view @message="handleShowMessage($event)"/>
  <Homeview />
</template>

<style scoped>
  @keyframes wobble {
    0% { transform: translateX(100px); opacity: 0 }
    50% { transform: translateY(0px); opacity: 1 }
    60% { transform: translateX(8px); opacity: 1 }
    70% { transform: translateX(-8px); opacity: 1 }
    80% { transform: translateX(4px); opacity: 1 }
    90% { transform: translateX(-4px); opacity: 1 }
    100% { transform: translateX(0px); opacity: 1 }
  }

  @keyframes goBack {
    0% { transform: translateY(0px); opacity: 1 }
    100% { transform: translateX(100px); opacity: 0 }
  }
  .toast-enter-active{
    animation: wobble 0.8s ease;
  }
  .toast-leave-active{
    animation: goBack 0.5s ease;
  }
</style>
