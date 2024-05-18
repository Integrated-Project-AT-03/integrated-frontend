<script setup>
import { computed, onMounted, ref } from "vue";
import { patchItemById, getItemById } from "./../assets/fetch";
const uri = import.meta.env.VITE_SERVER_URI;
const setting = ref({});
const loadSetting = async () => {
  setting.value = await getItemById(`${uri}/v2/settings`, "limit_of_tasks");
};
onMounted(async () => loadSetting());
const validation = computed(() => {
  return {
    limitTasks:
      setting.value.value < 10 ||
      setting.value.value > 30 ||
      typeof setting.value.value !== "number",
  };
});
const emits = defineEmits(["message"]);
const saveSetting = async () => {
  const res = await patchItemById(
    `${uri}/v2/settings`,
    "limit_of_tasks",
    setting.value.value,
    setting.value.enable ? "enable" : "disable"
  );
  if (res.httpStatus === 200) {
    emits("message", {
      description: `Set the setting is done`,
      status: "success",
    });
  } else if (res.httpStatus === 400) {
    emits("message", {
      description: `${res.errors[0].field} ${res.errors[0].message}`,
      status: "error",
    });
    loadSetting();
  } else {
    emits("message", {
      description: `something went wrong`,
      status: "error",
    });
  }
};
</script>

<template>
  <dialog id="status_setting" class="modal">
    <div
      class="itbkk-modal-setting flex flex-col rounded-lg p-5 bg-base-100 h-auto w-fit gap-4"
    >
      <div class="text-2xl font-bold text-slate-300">Status Setting</div>
      <div class="divider"></div>
      <div class="flex flex-col text-slate-300">
        <div>
          User can limit the number of task in a status by setting the Maximum
        </div>
        <div>
          tasks in each status (exxcept "No status" and "Done" statuses).
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
          <button
            @click="saveSetting"
            class="itbkk-button-confirm btn btn-success text-slate-200"
            :disabled="validation.limitTasks"
          >
            Save
          </button>
        </form>
        <form method="dialog">
          <button
            class="itbkk-button-cancel btn btn-error text-slate-200"
            @click="loadSetting"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
