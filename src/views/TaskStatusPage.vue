<script setup>
import { onMounted, ref, computed } from "vue";

import TransferStatus from "../components/TransferStatus.vue";
import { getSettingByNanoIdBoard } from "../services/apiSetting";
import { getStatusesByNanoIdBoard } from "../services/apiStatus";
import { getTasksByNanoidBoard } from "../services/apiTask";
import Loading from "../components/Loading.vue";
import DeleteStatusModal from "./../components/DeleteStatusModal.vue";
import Button from "../components/Button.vue";
import StatusModal from "@/components/StatusModal.vue";
import { useSettingStore } from "./../stores/useSettingStore";
import { useRoute } from "vue-router";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
import { getBoardByUserNanoId } from "../services/apiBoard.js";
import { useBoardStore } from "../stores/useBoardStore.js";

import { useTaskStore } from "./../stores/useTaskStore";
const settingStore = useSettingStore();
const boardStore = useBoardStore();
const route = useRoute();
const emits = defineEmits(["message"]);
const statusStore = useTaskStatusStore();
const taskStore = useTaskStore();
const isLoading = ref(true);
const sourceStatus = ref({});
const showTranferStauts = ref(false);

const numTask = computed(() =>
  taskStore.getTasks().reduce((accu, cur) => {
    if (accu.has(cur.status)) accu.set(cur.status, accu.get(cur.status) + 1);
    else accu.set(cur.status, 1);
    return accu;
  }, new Map()),
);

onMounted(async function () {
  const settingLoad = (await getSettingByNanoIdBoard(route.params.oid)).data;
  settingStore.setLimitTask(settingLoad);
  const resTask = await getTasksByNanoidBoard(route.params.oid);
  taskStore.setTasks(resTask.data);
  const res = await getStatusesByNanoIdBoard(route.params.oid);
  isLoading.value = false;
  statusStore.setStatuses(res.data);
  const resBoard = await getBoardByUserNanoId(route.params.oid);
  boardStore.setCurrentBoard(resBoard.data);
});

const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <Loading class="w-screen" :is-loading="isLoading" />
  <div class="flex w-full flex-col gap-2">
    <!-- :class="$route.fullPath.split('/').length > 3 ? 'blur-sm' : ''" -->
    <div class="flex w-full items-center justify-between">
      <div class="flex flex-col gap-3">
        <div>
          The limit status :
          <span
            :class="
              settingStore.getLimitTask().enableLimitsTask
                ? 'text-success'
                : 'text-error'
            "
          >
            {{
              settingStore.getLimitTask().enableLimitsTask
                ? "enable"
                : "disable"
            }}
            state
          </span>
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

    <table class="block max-h-[500px] divide-y divide-gray-200 overflow-scroll">
      <tbody class="divide-y divide-gray-300 bg-slate-100">
        <tr class="bg-gray-200">
          <th
            scope="col"
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            No
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Name
          </th>
          <th
            scope="col"
            class="w-full px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Description
          </th>
          <th
            scope="col"
            class="w- px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Tasks
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Action
          </th>
        </tr>
        <tr
          class="itbkk-item itbkk-button-action hover:bg-slate-200"
          v-for="(
            { colorHex, name, description, id }, index
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
                !settingStore.getLimitTask().enableLimitsTask ||
                name === 'Done' ||
                name === 'No Status' ||
                numTask.get(name) ||
                0 < settingStore.getLimitTask().limitsTask * 0.7
                  ? 'text-black'
                  : numTask.get(name) ||
                      0 >= settingStore.getLimitTask().limitsTask
                    ? 'text-error'
                    : 'text-yellow-500'
              "
            >
              {{ numTask.get(name) || 0
              }}{{
                settingStore.getLimitTask().enableLimitsTask &&
                name !== "Done" &&
                name !== "No Status"
                  ? `/${settingStore.getLimitTask().limitsTask}`
                  : ""
              }}
            </div>
          </td>
          <td class="itbkk-status flex whitespace-nowrap py-4">
            <div
              v-if="id !== 1 && id !== 4"
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
