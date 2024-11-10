<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollabBoard, receiveInvite } from "@/services/apiCollab";

const route = useRoute();
const router = useRouter();
const NanoId = ref(route.params.NanoId);
const inviterName = ref("");
const boardName = ref("");
const accessRight = ref("");
const errorMessage = ref("");

async function acceptInvite() {
  errorMessage.value = "";
  try {
    const response = await receiveInvite(NanoId.value, "ACCEPT");
    if (response.httpStatus === 200) {
      router.push(`/board/${NanoId.value}/task`);
    } else {
      errorMessage.value = "Failed to accept invitation.";
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    errorMessage.value = "An error occurred while accepting the invitation.";
  }
}

async function declineInvite() {
  errorMessage.value = "";
  try {
    const response = await receiveInvite(NanoId.value, "DECLINE");
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

onMounted(async () => {
  try {
    const response = await getCollabBoard();
    if (response && response.httpStatus === 200 && response.data) {
      const invitation = response.data.find(
        (board) => board.boardNanoId === NanoId.value,
      );
      if (invitation) {
        inviterName.value = invitation.name;
        boardName.value = invitation.boardName;
        accessRight.value = invitation.accessRight;
      } else {
        errorMessage.value = "Invitation not found.";
      }
    } else {
      errorMessage.value = "Failed to load invitation details.";
    }
  } catch (error) {
    console.error("Error loading invitation details:", error);
    errorMessage.value = "An error occurred while loading invitation details.";
  }
});
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center">
    <div
      class="flex w-[28rem] flex-col items-center rounded-2xl bg-gray-900 p-10 text-white shadow-xl"
    >
      <h1
        class="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-2xl font-extrabold text-transparent"
      >
        Invitation to Collaboration
      </h1>

      <p class="mb-6 text-center text-lg leading-relaxed text-gray-300">
        <span class="font-semibold text-white">{{ inviterName }}</span> has
        invited you to collaborate with
        <span class="font-semibold text-white">{{ accessRight }}</span> access
        rights on the
        <span class="font-semibold text-white">{{ boardName }}</span> board.
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
</template>
