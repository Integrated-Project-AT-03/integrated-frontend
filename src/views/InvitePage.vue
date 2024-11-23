<script setup>
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { receiveInvite, getInvite } from "@/services/apiCollab";
import { useUserStore } from "@/stores/useUserStore";

const {
  params: { nanoId },
} = useRoute();
const router = useRouter();
const requestCollab = reactive({
  inviterName: "",
  accessRight: "",
  boardName: "",
});

const errorMessage = ref("");
const emits = defineEmits(["message, loading"]);
const userStore = useUserStore();
async function acceptInvite() {
  errorMessage.value = "";
  try {
    const response = await receiveInvite(nanoId, "ACCEPT");
    if (response.httpStatus === 200) {
      router.push(`/board/${nanoId}/task`);
    } else {
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    errorMessage.value = "An error occurred while accepting the invitation.";
  }
}

async function declineInvite() {
  errorMessage.value = "";
  try {
    const response = await receiveInvite(nanoId, "DECLINE");
    if (response.httpStatus === 200) {
      router.push(`/board`);
    } else {
      errorMessage.value = "Failed to decline invitation.";
    }
  } catch (error) {
    console.error("Error declining invitation:", error);
    errorMessage.value = "An error occurred while declining the invitation.";
  }
}

watch(async () => {
  console.log(userStore.getUser().oid);
  const { httpStatus, data } = await getInvite(userStore.getUser().oid, nanoId);
  console.log(data);
  requestCollab.inviterName = data.name;
  requestCollab.boardName = data.boardName;
  requestCollab.accessRight = data.accessRight;
  console.log(httpStatus);
  console.log(data);
  
  if (httpStatus === 404) router.push({ name: "NotFoundInvitePage" });
  emits("loading", false);
}, userStore.getUser());
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-0 z-[10000] flex h-screen w-screen items-center justify-center backdrop-blur-sm"
    >
      <div
        class="flex w-[28rem] flex-col items-center rounded-2xl bg-gray-900 p-10 text-white shadow-xl"
      >
        <h1
          class="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-2xl font-extrabold text-transparent"
        >
          Invitation to Collaboration
        </h1>

        <p class="mb-6 text-center text-lg leading-relaxed text-gray-300">
          <span class="font-semibold text-white">{{
            requestCollab.inviterName
          }}</span>
          has invited you to collaborate with
          <span class="font-semibold text-white">{{
            requestCollab.accessRight
          }}</span>
          access rights on the
          <span class="font-semibold text-white">{{
            requestCollab.boardName
          }}</span>
          board.
        </p>

        <div v-if="errorMessage" class="mb-6 text-center text-red-500">
          {{ errorMessage }}
        </div>

        <div class="flex gap-4">
          <button
            @click="acceptInvite"
            class="transform rounded-lg bg-green-500 px-6 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600"
          >
            Accept Invitation
          </button>
          <button
            @click="declineInvite"
            class="transform rounded-lg bg-red-500 px-6 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
