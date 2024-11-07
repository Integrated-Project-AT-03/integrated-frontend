<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import AddCollaboratorModal from "../components/AddCollaboratorModal.vue";
import RemoveCollabModal from "../components/RemoveCollabModal.vue";
import ChangeAccessModal from "../components/ChangeAccessModal.vue";
import { getCollab } from "../services/apiCollab.js";
import { getBoardByNanoId } from "../services/apiBoard.js";
import { useBoardStore } from "@/stores/useBoardStore";
import { useCollabStore } from "../stores/useCollabStore.js";

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const collabStore = useCollabStore();
const curCollab = ref({ oid: "", name: "", access: "" });
const openAddModal = ref(false);

onMounted(async () => {
  const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  boardStore.setCurrentBoard(curBoard);
  const res = await getCollab(route.params.oid);

  if (res.httpStatus === 403) {
    return router.push({ name: "NotAllowPage" });
  } else if (res.httpStatus === 404) {
    return router.push({ name: "NotFoundPage" });
  }
  collabStore.setCollabs(res.data);
});

const handleMessage = (message) => {
  console.log(message);
};

function onModalOpen(collab) {
  curCollab.value = collab;
  document.getElementById("removeCollabModal").showModal();
}

function goToInvitePage() {
  const boardNanoId = route.params.oid;
  router.push(`/board/${boardNanoId}/collab/invitations`);
}
</script>


<template>
  <div class="collab-management">
    <h1>Collaboration Management</h1>
    <div class="flex justify-end mb-4">
      <!-- ปุ่มเพิ่ม Collaborator -->
      <Button
        class="itbkk-collaborato-add"
        bgcolor="#666666"
        message="Add Collaborator"
        :access="['OWNER']"
        :action="() => (openAddModal.value = true)"
      />
    </div>

    <!-- ตารางแสดงรายชื่อ Collaborators -->
    <table class="collab-table max-h-[500px] divide-y divide-gray-200 overflow-scroll w-full">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-6 py-3 text-center text-sm font-bold uppercase">No</th>
          <th class="px-6 py-3 text-center text-sm font-bold uppercase">Name</th>
          <th class="px-6 py-3 text-center text-sm font-bold uppercase">Email</th>
          <th class="px-6 py-3 text-center text-sm font-bold uppercase">Access</th>
          <th class="px-6 py-3 text-center text-sm font-bold uppercase">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(collab, index) in collabStore.getCollabs()"
          :key="collab.oid"
          class="hover:bg-slate-200"
        >
          <td class="px-6 py-4">{{ index + 1 }}</td>
          <td class="px-6 py-4">{{ collab.name }}</td>
          <td class="px-6 py-4">{{ collab.email }}</td>
          <td class="px-6 py-4">
            <select
              :disabled="!['OWNER'].includes(boardStore.getCurrentBoard().access)"
              v-model="collab.accessRight"
              @change="collabStore.updateCollab(collab.oid, collab.accessRight)"
              class="select w-full bg-gray-100"
            >
              <option value="READ">Read</option>
              <option value="WRITE">Write</option>
            </select>
          </td>
          <td class="px-4 py-2">
            <Button
              :access="['OWNER']"
              class="button-cancel"
              bgcolor="#444444"
              :action="() => onModalOpen(collab)"
              message="Remove"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="collabStore.getCollabs().length === 0"
      class="bg-white py-3 text-center font-bold text-gray-600"
    >
      No Collaborator
    </div>

    <!-- ปุ่มไปยัง Invite Page -->
    <button class="mt-4 bg-blue-500 text-white p-2 rounded" @click="goToInvitePage">
      Go to Invite Page
    </button>

    <!-- Modals -->
    <RemoveCollabModal :collab="curCollab" @message="handleMessage" />
    <ChangeAccessModal :collab="curCollab" @message="handleMessage" />
    <AddCollaboratorModal v-show="openAddModal" @closeModal="() => (openAddModal.value = false)" @message="handleMessage" />
  </div>
</template>

