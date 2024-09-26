<script setup>
import Button from "../components/ButtonModal.vue";
import { defineProps, ref, computed } from "vue";
import { updateVisibility } from "../services/apiVisibility";
import { useRoute } from "vue-router";
import { useSettingStore } from "../stores/useSettingStore";

const props = defineProps({
  bool: {
    type: Boolean,
    required: true,
  },
});

const settingStore = useSettingStore();
const emits = defineEmits(["setBool"]);
const receiptBool = ref(false);
const route = useRoute();

const handleConfirm = async () => {
  const visibility =
    settingStore.getVisibility() === "PUBLIC" ? "PRIVATE" : "PUBLIC";

  const res = await updateVisibility({ visibility }, route.params.oid);
  settingStore.setVisibility(visibility);
  console.log(res);

  // if(isPublic){
  //     valueVisibility.value.visibility = "PRIVATE"
  //     const setVisibility = await updateVisibility(valueVisibility.value, route.params.oid)
  //     settingStore.setVisibility(setVisibility.data.visibility)
  //     console.log(setVisibility);
  // } else{
  //     valueVisibility.value.visibility = "PUBLIC"
  //     const setVisibility = await updateVisibility(valueVisibility.value, route.params.oid)
  //     settingStore.setVisibility(setVisibility.data.visibility)
  //     console.log(setVisibility);
  // }
  receiptBool.value = !receiptBool.value;
  emits("setBool", !receiptBool.value);
};
</script>

<template>
  <dialog id="visibilityModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[34rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">
        Board visibility changed!
      </div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        {{
          bool
            ? "In private, only board owner can access/control board. Do you want to change the visibility to Private"
            : "In public, any one can view the board, task list and task detail of tasks in the board, Do you want to change the visibility to Public?"
        }}
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success"
            message="Confirm"
            @click="handleConfirm"
          />
        </form>
        <form method="dialog">
          <Button class="itbkk-button-cancel text-slate-200" message="Cancel" />
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
