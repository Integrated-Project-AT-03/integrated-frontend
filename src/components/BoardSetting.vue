<script setup>
import { computed, ref, watch } from "vue";
import { getStatusesByNanoIdBoard } from "./../services/apiStatus";
import {
  editSettingByNanoIdBoard,
  getSettingByNanoIdBoard,
} from "./../services/apiSetting";
import { useRoute } from "vue-router";
import Button from "./Button.vue";
import { useSettingStore } from "./../stores/useSettingStore";
import { useBoardStore } from "@/stores/useBoardStore.js";
const settingStore = useSettingStore();
const boardStore = useBoardStore()
const route = useRoute();
const setting = ref({});
let isInitialSetting = true;
const noAccess = computed(() => (boardStore.getCurrentBoard().access !== 'OWNER' && boardStore.getCurrentBoard().access !== 'WRITER'))
watch(
  () => {
    setting.value = { ...settingStore.getLimitTask() };
  },
  () => settingStore.getLimitTask(),
  { deep: true },
);

const compareSetting = ref({ ...setting.value });
const statusesOverLimts = ref([]);
watch(
  () => setting.value.enableLimitsTask,
  () => {
   if(isInitialSetting) isInitialSetting = false;
   else saveSetting();
  },
);


const validation = computed(() => {
  return {
    limitTasks:
      setting.value.limitsTask < 1 ||
      setting.value.limitsTask > 30 ||
      typeof setting.value.limitsTask !== "number",
  };
});
const emits = defineEmits(["message"]);
const saveSetting = async () => {
  if (setting.value.limitsTask < 1) {
    setting.value.limitsTask = 1;
  }
  if (setting.value.limitsTask > 30) {
    setting.value.limitsTask = 30;
  }
  console.log(setting.value.enableLimitsTask);
  const res = await editSettingByNanoIdBoard(route.params.oid, {
    enableLimitsTask: setting.value.enableLimitsTask,
    limitsTask: setting.value.limitsTask,
  });
  console.log(res.data,setting.value.enableLimitsTask);

  if (res.httpStatus === 200) {
    settingStore.setLimitTask(res.data);
    compareSetting.value = { ...setting.value };
    if (setting.value.enableLimitsTask) {
      const statuses = (await getStatusesByNanoIdBoard(route.params.oid)).data;
      statusesOverLimts.value = statuses.filter(
        ({ numOfTask, name }) =>
          numOfTask > setting.value.limitsTask &&
          name !== "Done" &&
          name !== "No Status",
      );
      if (statusesOverLimts.value.length !== 0)
        document.getElementById("over-limit-modal").showModal();
      emits("message", {
        description: `The Kanban board now limits ${setting.value.limitsTask} tasks in each status`,
        status: "success",
      });
    } else
      emits("message", {
        description: `The Kanban board has disabled the task limit in each status`,
        status: "success",
      });
  } else if (res.httpStatus === 400) {
    emits("message", {
      description: `${res.errors[0].field} ${res.errors[0].message}`,
      status: "error",
    });
    setting.value = { ...compareSetting.value };
  } else {
    emits("message", {
      description: `something went wrong, please try again`,
      status: "error",
    });
    setting.value = { ...compareSetting.value };
  }
};
</script>

<template>
  <dialog id="over-limit-modal" class="modal">
    <div class="modal-box flex flex-col gap-3">
      <h3 class="text-lg font-bold text-warning">Warning!</h3>
      <div class="flex flex-col gap-1">
        <p>These statuses that have reached the task limit.</p>
        <p v-for="{ name, numOfTask } in statusesOverLimts" class="">
          {{ name }} : <span class="text-error">[{{ numOfTask }}]</span>
        </p>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button @click="statusesOverLimts = []" class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>

  <div
    class="itbkk-modal-setting flex h-auto w-full flex-col gap-4 rounded-lg bg-base-100 p-5 lg:w-fit"
  >
    <div class="flex flex-col text-slate-300">
      <div>
        User can limit the number of task in a status by setting the Maximum
      </div>
      <div>tasks in each status (except "No status" and "Done" statuses).</div>
    </div>
    <div class="flex gap-4">
      <input
        type="checkbox"
        :disabled="noAccess"
        class="itbkk-limit-task toggle"
        v-model="setting.enableLimitsTask"
      />
      <div>Limit tasks in this status</div>
    </div>
    <div class="flex items-center gap-4">
      <div>Maximum tasks</div>
      <div class="flex flex-col gap-1">
        <input
          @blur="saveSetting"
          :disabled="!setting.enableLimitsTask || noAccess"
          v-model.number="setting.limitsTask"
          type="text"
          maxlength="2"
          class="itbkk-max-task input input-md input-bordered w-full max-w-xs"
        />
        <p class="text-xs text-error" v-show="validation.limitTasks">
          the value must between 1 to 30
        </p>
      </div>
    </div>

    <div class="mt-4 flex justify-end gap-3">
      <form method="dialog"></form>
      <form method="dialog"></form>
    </div>
  </div>
</template>

<style scoped></style>
