<script setup>
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import AddCollaboratorModal from "../components/AddCollaboratorModal.vue";
import RemoveCollabModal from '../components/RemoveCollabModal.vue'
const router = useRouter();
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <AddCollaboratorModal />
    <div class="flex justify-end">
      <Button
        class="itbkk-collaborato-add"
        bgcolor="#666666"
        message="Add Collaborator"
        onclick="addcollaborator.showModal()"
      />
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
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Name
          </th>
          <th
            scope="col"
            class="w-full px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Email
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Access
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-base-100"
          >
            Action
          </th>
        </tr>
        <tr class="itbkk-item itbkk-button-action hover:bg-slate-200">
          <td class="px-6 py-4">
            <div class="text-gray-900">{{ 1 }}</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="itbkk-title text-sm text-gray-900">name</div>
          </td>
          <td class="w-full whitespace-nowrap px-6 py-4">
            <div class="itbkk-assignees w- text-sm text-gray-900">email</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">Acess right</td>
          <td class="whitespace-nowrap px-6 py-4">
            <Button class="itbkk-button-cancel text-slate-200" onclick="removeCollabModal.showModal()" message="Remove" />
          </td>
        </tr>
        <tr></tr>
      </tbody>
    </table>
  </div>
  <RemoveCollabModal />
</template>

<style scoped></style>
