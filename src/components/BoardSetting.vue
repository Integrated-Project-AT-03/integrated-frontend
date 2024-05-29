<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { patchItemById, getItemById, getItems } from "./../lib/fetch";
import Button from "./ButtonModal.vue";
import SettingMangement from "@/lib/SettingMangement";
const uri = import.meta.env.VITE_SERVER_URI;
const setting = ref(SettingMangement.getSettingLimitTask());
const compareSetting = ref();
compareSetting.value = { ...setting.value };
const statusesOverLimts = ref([]);
watch(
  () => setting.value.enable,
  () => {
    if (!setting.value.enable) setting.value.value = compareSetting.value.value;
  }
);
const validation = computed(() => {
  return {
    limitTasks:
      setting.value.value < 10 ||
      setting.value.value > 30 ||
      typeof setting.value.value !== "number",
  };
});
const emits = defineEmits(["message", "loadSetting"]);
const saveSetting = async () => {
  const res = await patchItemById(
    `${uri}/v2/settings`,
    "limit_of_tasks",
    setting.value.value,
    setting.value.enable ? "enable" : "disable"
  );

  if (res.httpStatus === 200) {
    if (setting.value.enable) {
      const statuses = await getItems(`${uri}/v2/statuses`);
      statusesOverLimts.value = statuses.items.filter(
        ({ numOfTask, name }) =>
          numOfTask > setting.value.value &&
          name !== "Done" &&
          name !== "No Status"
      );

      if (statusesOverLimts.value.length !== 0)
        document.getElementById("over-limit-modal").showModal();
      emits("message", {
        description: `The Kanban board now limits ${setting.value.value} tasks in each status`,
        status: "success",
      });
    } else
      emits("message", {
        description: `The Kanban board has disabled the task limit in each status`,
        status: "success",
      });
    // SettingMangement.setLimitTask()
    emits("loadSetting", setting.value);
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
      <h3 class="font-bold text-warning text-lg">Warning!</h3>
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

  <dialog id="status_setting" class="modal">
    <div
      class="itbkk-modal-setting flex flex-col rounded-lg p-5 bg-base-100 h-auto w-fit gap-4"
    >
      <div class="text-2xl font-bold text-slate-300">Board Setting</div>
      <div class="divider"></div>
      <div class="flex flex-col text-slate-300">
        <div>
          User can limit the number of task in a status by setting the Maximum
        </div>
        <div>
          tasks in each status (except "No status" and "Done" statuses).
        </div>
      </div>
      <div class="flex gap-4">
        <input
          type="checkbox"
          class="itbkk-limit-task toggle"
          v-model="setting.enable"
        />
        <div>Limit tasks in this status</div>
      </div>
      <div class="flex gap-4 items-center">
        <div>Maximum tasks</div>
        <div class="flex flex-col gap-1">
          <input
            :disabled="!setting.enable"
            v-model.number="setting.value"
            type="text"
            maxlength="2"
            class="itbkk-max-task input input-bordered input-md w-[15rem] max-w-xs"
          />
          <p class="text-error text-xs" v-show="validation.limitTasks">
            the value must between 10 to 30
          </p>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-end mt-4 gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Confirm"
            @click="saveSetting"
            :disabled="
              validation.limitTasks ||
              (compareSetting.value === setting.value &&
                compareSetting.enable === setting.enable)
            "
          />
        </form>
        <form method="dialog">
          <Button
            class="itbkk-button-cancel btn-error text-slate-200"
            message="Cancel"
            @click="() => (setting = { ...compareSetting })"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
../lib/fetch
