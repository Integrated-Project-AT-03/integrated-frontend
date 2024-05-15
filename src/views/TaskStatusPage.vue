<script setup>
import { onMounted, ref } from "vue";
import TaskStatusManagement from "../lib/TaskStatusManagement.js";
import { useRoute, useRouter } from "vue-router";
import ChevronRight from "../assets/icons/ChevronRight.vue";
import TransferStatus from "../components/TransferStatus.vue";
import { getItems } from "../assets/fetch.js";
import Loading from "../components/Loading.vue";
import DeleteStatusModal from "./../components/DeleteStatusModal.vue";
import Button from "../components/ButtonModal.vue"

const emits = defineEmits(["message"]);
const datas = ref(TaskStatusManagement);
const uri = import.meta.env.VITE_SERVER_URI;
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const selectedStatus = ref({});
const showTranferStauts = ref(false);

onMounted(async function () {
  const data = await getItems(`${uri}/v2/statuses`);
  isLoading.value = false;
  datas.value.setStatuses(data.items);
});

const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <Loading :is-loading="isLoading" />
  <div
    class="container mx-auto flex flex-col gap-3"
    :class="route.fullPath.split('/').length > 2 && 'blur-sm'"
  >
    <div class="text-5xl font-extrabold ... w-full flex justify-center m-7">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
      >
        <div class="text-5xl">IT-Bangmod Kradan Kanban</div>
      </span>
    </div>
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          @click="router.push({ name: 'Task' })"
          class="itbkk-button-home text-xl font-bold cursor-pointer"
        >
          Home
        </div>
        <ChevronRight />
        <div
          @click="router.push({ name: 'Statuses' })"
          class="text-xl font-bold cursor-pointer text-primary"
        >
          Task Status
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Button class="itbkk-button-add" bgcolor="#06b6d4" message="Add Status" @click="router.push({ name: 'AddStatus' })"/>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Description
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody class="bg-slate-100 divide-y divide-gray-300">
        <tr v-show="datas.getStatuses().length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-900">
            No task
          </td>
        </tr>
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(status, index) in datas.getStatuses()"
          :key="status.id"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="itbkk-title px-6 py-4 whitespace-nowrap">
            <div
              class="text-sm text-gray-900 w-[5rem] flex justify-center p-2 rounded-xl text-slate-200"
              :style="`background-color: ${status.colorHex}`"
            >
              {{
                status.name.length > 10
                  ? status.name.slice(0, 7) + "..."
                  : status.name
              }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div
              class="text-sm text-gray-900 itbkk-assignees"
              :class="status?.description ?? 'italic text-gray-400'"
            >
              {{ status?.description ?? "No description is provided." }}
            </div>
          </td>
          <td class="itbkk-status flex py-4 whitespace-nowrap">
            <div
              v-if="status.id !== 1"
              class="flex justify-center items-center gap-2"
            >
              <Button class="itbkk-button-edit" bgcolor="#A020F0" message="Edit" @click="router.push({ name: 'EditStatus', params: { id: status.id } })"/>
              <Button class="itbkk-button-delete" bgcolor="#ef4444" message="Delete" @click="() => (selectedStatus = { ...status, index })" onclick="deleteModal.showModal()"/>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <TransferStatus
    v-model="isLoading"
    @message="handleMessage"
    @close="() => (showTranferStauts = false)"
    v-if="showTranferStauts"
    :selected-status="selectedStatus"
  />

  <DeleteStatusModal
    v-model="isLoading"
    @conflict="() => (showTranferStauts = true)"
    @message="handleMessage"
    :status="selectedStatus"
  />
  <RouterView @message="handleMessage" />
</template>

<style scoped></style>
../lib/Colors.js
