<template>
  <div class="share-board">
    <h1>Share Board</h1>
    <p>Manage and invite collaborators to this board.</p>

    <!-- ลิงก์ไปยังหน้า Invite Page -->
    <button class="ml-2 bg-blue-500 text-white p-2 rounded" @click="goToInvitePage">
      accept
    </button>

    <button class="bg-blue-500 text-white p-2 rounded" @click="goToInvitePage">
      decline
    </button>

    <!-- รายละเอียดการเชิญและจัดการ Collaborators -->
    <div class="collaborator-list mt-4">
      <h2>Collaborators</h2>
      <ul>
        <li v-for="(collab, index) in collabStore.getCollabs()" :key="collab.oid" class="p-2">
          {{ index + 1 }}. {{ collab.name }} - {{ collab.email }} - {{ collab.accessRight }}
        </li>
      </ul>
      <div v-if="collabStore.getCollabs().length === 0" class="text-gray-600 mt-4">
        No collaborators added yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useCollabStore } from "@/stores/useCollabStore";
import { getCollab } from "../services/apiCollab.js";

const route = useRoute();
const router = useRouter();
const collabStore = useCollabStore();

onMounted(async () => {
  const res = await getCollab(route.params.oid);
  collabStore.setCollabs(res.data);
});

function goToInvitePage() {
  const boardNanoId = route.params.oid;
  router.push(`/board/${boardNanoId}/collab/invitations`);
}
</script>

<style scoped>
.share-board {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.collaborator-list {
  margin-top: 20px;
  text-align: left;
}
</style>
