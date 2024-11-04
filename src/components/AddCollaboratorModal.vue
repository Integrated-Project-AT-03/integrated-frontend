<script setup>
import { ref } from "vue";
import Button from "./Button.vue";
import { addCollab } from "../services/apiCollab.js";
import { useRoute } from "vue-router";
import { useCollabStore } from "../stores/useCollabStore.js";

const collabStore = useCollabStore();
const emits = defineEmits(["message", "closeModal"]);
const route = useRoute();
const collabForm = ref({
  email: "",
  accessRight: "READ",
});

const handleSubmit = async (e) => {
  try {
    const res = await addCollab(collabForm.value, route.params.oid);
    if (res.httpStatus === 200) {
      collabStore.addCollab(res.data); //save line code
      collabForm.value = { email: "", accessRight: "READ" };
      emits("message", {
        description: "The collaborator has been successfully added.",
        status: "success",
      });

      emits("closeModal");
    } else if (res.httpStatus === 404) {
      emits("message", {
        description: "The user does not exists.",
        status: "error",
      });
    } else if (res.httpStatus === 409) {
      emits("message", {
        description: res.data.message,
        status: "error",
      });
    }
  } catch (error) {
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
};
</script>

<template>
  <!-- <teleport to="body"> -->

  <div
    class="itbkk-modal-alert fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center"
  >
    <div class="absolute inset-0 z-[998] h-full w-full backdrop-blur-sm"></div>
    <div class="z-[1000] flex h-auto w-fit flex-col rounded-2xl bg-neutral p-6">
      <div class="text-2xl font-bold text-slate-300">Add Collaborator</div>
      <div class="divider"></div>
      <div class="flex gap-3">
        <div class="flex flex-col gap-2">
          Collaborator e-mail
          <input
            type="text"
            maxlength="50"
            v-model.trim="collabForm.email"
            placeholder="Type here"
            class="itbkk-collaborator-email input input-bordered w-[25rem] bg-neutral"
          />
        </div>
        <div class="flex flex-col gap-2">
          Access Right
          <select
            v-model="collabForm.accessRight"
            class="itbkk-access-right select select-ghost w-full max-w-xs bg-neutral"
          >
            <option value="READ">Read</option>
            <option value="WRITE">Write</option>
          </select>
        </div>
      </div>
      <div class="divider"></div>
      <div class="mt-4 flex justify-end gap-3">
        <form method="dialog">
          <Button
            class="itbkk-button-confirm btn-success text-slate-200"
            message="Add"
            :disabled="
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                collabForm.email,
              )
            "
            :action="handleSubmit"
          />
        </form>
        <Button
          :action="
            () => {
              collabForm = { email: '', accessRight: 'READ' };
              $emit('closeModal');
            }
          "
          class="itbkk-button-cancel text-slate-200"
          message="Cancel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
