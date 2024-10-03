<script setup>
import Button from '@/components/Button.vue';
import { useRouter } from 'vue-router';
import AddCollaboratorModal from '../components/AddCollaboratorModal.vue'
const router = useRouter();
</script>
 
<template>
<div class="flex flex-col w-full gap-3">
    <AddCollaboratorModal />
    <div class="flex justify-end">
        <Button
              class="itbkk-collaborato-add"
              bgcolor="#666666"
              message="Add collaborator"
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
        <tr>

        </tr>
      </tbody>
    </table>
</div>
</template>
 
<style scoped>

</style>