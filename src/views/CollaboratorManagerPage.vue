<script setup>
import Button from "@/components/Button.vue";
import { useRoute, useRouter } from "vue-router";
import AddCollaboratorModal from "../components/AddCollaboratorModal.vue";
import RemoveCollabModal from "../components/RemoveCollabModal.vue";
import { getCollab } from "../services/apiCollab.js";
import { getBoardByNanoId } from "../services/apiBoard.js";
import { onMounted } from "vue";
import { useBoardStore } from "@/stores/useBoardStore";
import { useCollabStore } from "../stores/useCollabStore.js";
import { ref } from "vue";
import EmptyElementSelect from "../components/EmptyElementSelect.vue";
import ChangeAccessModal from "../components/ChangeAccessModal.vue";

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const collabStore = useCollabStore();
const curCollab = ref({ oid: "", name: "", access: "" });
const emits = defineEmits(["message, loading"]);
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
  emits("loading", false);
});

const handleMessage = (e) => {
  emits("message", e);
};

function onModalOpen(collab) {
  document.getElementById("removeCollabModal").showModal();
  curCollab.value = collab;
}

function onChangeAccessModalOpen(collab) {
  document.getElementById("changeAccessModal").showModal();
  curCollab.value = collab;
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex justify-end">
      <Button class="itbkk-collaborato-add" bgcolor="#666666" message="Add Collaborator" :access="['OWNER']"
        :action="() => (openAddModal = true)" />
    </div>
    <table class="block max-h-[500px] divide-y divide-gray-200 overflow-scroll">
      <tbody class="divide-y divide-gray-300 bg-slate-100">
        <tr class="bg-gray-200">
          <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100">
            No
          </th>
          <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100">
            Name
          </th>
          <th scope="col" class="w-full px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100">
            Email
          </th>
          <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100">
            Access
          </th>
          <th scope="col" class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100">
            Action
          </th>
        </tr>
        <tr v-for="(collab, index) in collabStore.getCollabs()" :key="collab.oid"
          class="itbkk-item itbkk-button-action hover:bg-slate-200">
          <td class="px-6 py-4">
            <div class="text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="itbkk-title text-sm text-gray-900">
              {{ collab.name }}
            </div>
          </td>
          <td class="w-full whitespace-nowrap px-6 py-4">
            <div class="itbkk-assignees w- text-sm text-gray-900">
              {{ collab.email }}
            </div>
          </td>
          <td class="whitespace-nowrap">
            <EmptyElementSelect @click="
              ['OWNER'].includes(boardStore.getCurrentBoard().access) &&
              onChangeAccessModalOpen({
                oid: collab.oid,
                name: collab.name,
                access: collab.accessRight,
              })
              " />

            <select :disabled="!['OWNER'].includes(boardStore.getCurrentBoard().access)
              " :value="collab.accessRight"
              class="itbkk-access-right select select-ghost w-full max-w-xs bg-[#444444]">
              <option value="READ">Read</option>
              <option value="WRITE">Write</option>
            </select>
          </td>
          <td class="whitespace-nowrap px-4 py-2">
            <Button :access="['OWNER']" class="itbkk-button-cancel" bgcolor="#444444" :action="() => onModalOpen({ oid: collab.oid, name: collab.name })
              " message="Remove" />
          </td>
        </tr>
        <tr></tr>
      </tbody>
      <div v-show="collabStore.getCollabs().length === 0" class="m-0 bg-white py-3 text-center font-bold text-gray-600">
        No Collaborator
      </div>
    </table>
  </div>
  <RemoveCollabModal :collab="curCollab" @message="handleMessage($event)" />
  <ChangeAccessModal :collab="curCollab" @message="handleMessage($event)" />
  <AddCollaboratorModal v-show="openAddModal" @closeModal="openAddModal = false" @message="handleMessage($event)" />
</template>

<style scoped></style>