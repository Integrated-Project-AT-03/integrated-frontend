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
  <div v-show="messageModalOpenState" class="fixed bottom-2 right-2 grid place-items-center z-50">
    <Alert :status="status" :message="message"/>
  </div>
  <router-view @message="handleShowMessage($event)"/>
  <Homeview />
</template>

<style scoped></style>
