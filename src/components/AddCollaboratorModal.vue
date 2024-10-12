<script setup>
import { ref } from "vue";
import Button from "./Button.vue";
import { addCollab } from "../services/apiCollab.js";
import { useRoute } from "vue-router";
import { useCollabStore } from "../stores/useCollabStore.js";

const collabStore = useCollabStore();
const emits = defineEmits(["message"]);
const route = useRoute();
const collabForm = ref({
  email: "",
  accessRight: "READ",
});

const handleSubmit = async (e) => {
  try {
    const res = await addCollab(collabForm.value, route.params.oid);
    if (res.httpStatus === 201) {
      collabStore.addCollab(res.data);
      collabForm.value.email = "";
      collabForm.value.accessRight = "READ";
      emits("message", {
        description: "The collaborator has been successfully added.",
        status: "success",
      });
    } else if (res.httpStatus === 404) {
      document.getElementById("addcollaborator").showModal();
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
    console.log(error);
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
};
</script>

<template>
  <teleport to="body">
    <div id="addcollaborator" class="itbkk-modal-alert fixed z-[1000]">
      <div
        class="bg cola fixed inset-0 h-screen w-screen opacity-35 blur-lg"
      ></div>
      <div class="flex h-auto w-fit flex-col rounded-lg bg-base-100 p-6">
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
              class="itbkk-collaborator-email input input-bordered w-[25rem]"
            />
          </div>
          <div class="flex flex-col gap-2">
            Access Right
            <select
              v-model="collabForm.accessRight"
              class="itbkk-access-right select select-ghost w-full max-w-xs bg-base-100"
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
              :action="handleSubmit"
            />
          </form>
          <!-- :disabled="!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collabForm.email)" -->

          <form method="dialog">
            <Button
              class="itbkk-button-cancel text-slate-200"
              message="Cancel"
            />
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
