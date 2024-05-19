<script setup>
import { onMounted, ref } from "vue";
import TaskStatusManagement from "../lib/TaskStatusManagement.js";
import ChevronRight from "../assets/icons/ChevronRight.vue";
import TransferStatus from "../components/TransferStatus.vue";
import { getItems } from "../assets/fetch.js";
import Loading from "../components/Loading.vue";
import DeleteStatusModal from "./../components/DeleteStatusModal.vue";
import Button from "../components/ButtonModal.vue";
import StatusModal from "@/components/StatusModal.vue";

const emits = defineEmits(["message"]);
const datas = ref(TaskStatusManagement);
const uri = import.meta.env.VITE_SERVER_URI;
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
    class="w-full flex-col flex gap-2"
    :class="$route.fullPath.split('/').length > 2 ? ' blur-sm' : ''"
  >
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          @click="$router.push({ name: 'Task' })"
          class="itbkk-button-home text-xl font-bold cursor-pointer"
        >
          Home
        </div>
        <ChevronRight />
        <div
          @click="$router.push({ name: 'Statuses' })"
          class="text-xl font-bold cursor-pointer text-primary"
        >
          Task Status
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Button
          class="itbkk-button-add"
          bgcolor="#06b6d4"
          message="Add Status"
          @click="$router.push({ name: 'AddStatus' })"
        />
      </div>
    </div>
    <table class="min-w-full divide-y h-[10px] divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider"
          >
            No
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
            <StatusModal
              class="text-slate-200"
              :status-color="status.colorHex"
              :text="status.name"
            />
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
              v-if="status.id !== 1 && status.id !== 4"
              class="flex justify-center items-center gap-2"
            >
              <Button
                class="itbkk-button-edit"
                bgcolor="#A020F0"
                message="Edit"
                @click="
                  $router.push({ name: 'EditStatus', params: { id: status.id } })
                "
              />
              <Button
                class="itbkk-button-delete"
                bgcolor="#ef4444"
                message="Delete"
                @click="() => (selectedStatus = { ...status, index })"
                onclick="deleteModal.showModal()"
              />
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
