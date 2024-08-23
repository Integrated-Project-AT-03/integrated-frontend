<script setup>
import { onMounted, ref } from "vue";

import ChevronRight from "../assets/icons/ChevronRight.vue";
import TransferStatus from "../components/TransferStatus.vue";
import { getItems } from "../lib/fetch.js";
import Loading from "../components/Loading.vue";
import DeleteStatusModal from "./../components/DeleteStatusModal.vue";
import Button from "../components/ButtonModal.vue";
import StatusModal from "@/components/StatusModal.vue";
const emits = defineEmits(["message"]);
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
const statusStore = useTaskStatusStore();
const uri = import.meta.env.VITE_SERVER_URI;
const isLoading = ref(true);
const sourceStatus = ref({});
const showTranferStauts = ref(false);
defineProps({
  setting: Object,
});

onMounted(async function () {
  const data = await getItems(`${uri}/v2/statuses`);
  isLoading.value = false;
  statusStore.setStatuses(data.items);
});

const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <Loading class="w-screen" :is-loading="isLoading" />
  <div
    class="flex w-full flex-col gap-2"
    :class="$route.fullPath.split('/').length > 3 ? 'blur-sm' : ''"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          @click="$router.push({ name: 'Task' })"
          class="itbkk-button-home cursor-pointer text-xl font-bold"
        >
          Home
        </div>
        <ChevronRight />
        <div
          @click="$router.push({ name: 'Status' })"
          class="cursor-pointer text-xl font-bold text-primary"
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
    <div>
      The limit status :
      <span :class="setting?.enable ? 'text-success' : 'text-error'">
        {{ setting?.enable ? "enable" : "disable" }} state
      </span>
    </div>
    <table class="h-[10px] min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            No
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Description
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Num Of Task
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300 bg-slate-100">
        <tr v-show="statusStore.getStatuses().length === 0">
          <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-900">
            No task
          </td>
        </tr>
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(
            { colorHex, name, description, numOfTask, id }, index
          ) in statusStore.getStatuses()"
          :key="id"
        >
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="itbkk-title whitespace-nowrap px-6 py-4">
            <StatusModal
              class="text-slate-200"
              :status-color="colorHex"
              :text="name"
            />
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div
              class="itbkk-description text-sm text-gray-900"
              :class="description ?? 'italic text-gray-400'"
            >
              {{
                !description
                  ? "No description is provided."
                  : description.length > 100
                    ? description.slice(0, 100) + "..."
                    : description
              }}
            </div>
          </td>
          <td class="itbkk-title whitespace-nowrap px-6 py-4">
            <div
              class="text-center text-sm"
              :class="
                !setting.enable ||
                name === 'Done' ||
                name === 'No Status' ||
                numOfTask < setting.value * 0.7
                  ? 'text-black'
                  : numOfTask >= setting.value
                    ? 'text-error'
                    : 'text-yellow-500'
              "
            >
              {{ numOfTask
              }}{{
                setting.enable && name !== "Done" && name !== "No Status"
                  ? `/${setting.value}`
                  : ""
              }}
            </div>
          </td>
          <td class="itbkk-status flex whitespace-nowrap py-4">
            <div
              v-if="name !== 'No Status' && name !== 'Done'"
              class="flex items-center justify-center gap-2"
            >
              <Button
                class="itbkk-button-edit"
                bgcolor="#A020F0"
                message="Edit"
                @click="
                  $router.push({
                    name: 'EditStatus',
                    params: { id: id },
                  })
                "
              />
              <Button
                class="itbkk-button-delete"
                bgcolor="#ef4444"
                message="Delete"
                @click="() => (sourceStatus = { name, id, index })"
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
    :source-status="sourceStatus"
  />

  <DeleteStatusModal
    v-model="isLoading"
    @conflict="() => (showTranferStauts = true)"
    @message="handleMessage"
    :source-status="sourceStatus"
  />
  <RouterView @message="handleMessage" />
</template>

<style scoped></style>
../lib/Colors.js ../lib/fetch.js ../lib/StatusManagement.js
