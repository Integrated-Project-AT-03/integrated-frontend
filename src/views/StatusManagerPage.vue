<script setup>
import { onMounted, ref, computed, defineEmits } from "vue";

import TransferStatus from "@/feature/status/TransferStatus.vue";
import { getSettingByNanoIdBoard } from "../services/apiSetting";
import { getStatusesByNanoIdBoard } from "../services/apiStatus";
import { getTasksByNanoidBoard } from "../services/apiTask";
import DeleteStatusModal from "@/feature/status/DeleteStatusModal.vue";
import Button from "@/ui/Button.vue";
import StatusModal from "@/feature/status/StatusModal.vue";
import { useSettingStore } from "./../stores/useSettingStore";
import { useRoute, useRouter } from "vue-router";
import { useTaskStatusStore } from "./../stores/useTaskStatusStore";
import { getBoardByNanoId } from "../services/apiBoard.js";
import { useBoardStore } from "../stores/useBoardStore.js";
import { useTaskStore } from "./../stores/useTaskStore";
const router = useRouter();
const settingStore = useSettingStore();
const boardStore = useBoardStore();
const route = useRoute();
const emits = defineEmits(["message, loading"]);
const statusStore = useTaskStatusStore();
const taskStore = useTaskStore();
const sourceStatus = ref({});
const showTranferStauts = ref(false);
const access = computed(() =>
  ["WRITER", "OWNER"].includes(boardStore.getCurrentBoard()?.access),
);



const numTask = computed(() =>
  taskStore.getTasks().reduce((accu, cur) => {
    if (accu.has(cur.status)) accu.set(cur.status, accu.get(cur.status) + 1);
    else accu.set(cur.status, 1);
    return accu;
  }, new Map()),
);


const statusColorTasks = (name,numTasks) => {
  if(!settingStore.getLimitTask().enableLimitsTask || name === 'Done' ||
    name === 'No Status' ) return 'text-black'

  if(numTasks >= settingStore.getLimitTask().limitsTask) return "text-error"

  if(numTasks > settingStore.getLimitTask().limitsTask *0.7) return "text-yellow-500"

  return "text-black"
}

onMounted(async function () {
  emits("loading", true);
  const res = await getStatusesByNanoIdBoard(route.params.oid);
  if (res.httpStatus === 403) {
    return router.push({ name: "NotAllowPage" });
  } else if (res.httpStatus === 404) {
    return router.push({ name: "NotFoundPage" });
  }
  const resBoard = await getBoardByNanoId(route.params.oid);
  const settingLoad = (await getSettingByNanoIdBoard(route.params.oid)).data;
  const resTask = await getTasksByNanoidBoard(route.params.oid);
  emits("loading", false);
  statusStore.setStatuses(res.data);
  settingStore.setLimitTask(settingLoad);
  taskStore.setTasks(resTask.data);
  boardStore.setCurrentBoard(resBoard.data);
});

const handleMessage = (e) => {
  emits("message", e);
};
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div class="flex px-2 lg:px-0 w-full items-center justify-between">
      <div class="flex flex-col gap-3">
        <div>
          The limit status : {{" "}}
          <span
            class="font-bold"
            :class="
              settingStore.getLimitTask().enableLimitsTask
                ? 'text-success'
                : 'text-error'
            "
          >

            {{
              settingStore.getLimitTask().enableLimitsTask
                ? "Enable"
                : "Disable"
            }}

          </span>
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Button
          :access="['OWNER', 'WRITER']"
          class="itbkk-button-add tooltip-left"
          message="+ Add Status"
          bgcolor="var(--fallback-su,oklch(var(--su)/var(--tw-bg-opacity)))"
          :action="() => $router.push({ name: 'AddStatus' })"
        />
      </div>
    </div>

    <table class=" px-2 lg:px-0 block max-h-[500px] divide-y divide-gray-200 w-[98%] lg:w-full overflow-scroll ">
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
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
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
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
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
        :class="statusColorTasks(name,numTask.get(name))"



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
                :access="['WRITER']"
                class="itbkk-button-edit tooltip-left"
                bgcolor="#A020F0"
                message="Edit"
                :action="
                  () =>
                    $router.push({
                      name: 'EditStatus',
                      params: { id: id },
                    })
                "
              />
              <div
                :class="!access && 'tooltip tooltip-left'"
                data-tip="You need to be board owner or has write access to perform this action."
              >
                <button
                  :disabled="!access"
                  class="itbkk-button-delete btn btn-sm lg:btn-md btn-error tooltip-left p-1 text-white disabled:bg-error"
                  @click="() => (sourceStatus = { name, id, index })"
                  onclick="deleteModal.showModal()"
                >
                  Delete
                </button>
              </div>
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
