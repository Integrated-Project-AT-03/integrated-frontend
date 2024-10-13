<script setup>
import { useBoardStore } from "@/stores/useBoardStore";
const boardStore = useBoardStore();
const { collab } = defineProps(["collab"]);
const emits = defineEmits(["openConfirmModal"]);
</script>

<template>
  <select
    :disabled="!['OWNER'].includes(boardStore.getCurrentBoard().access)"
    v-model="collab.accessRight"
    @change="
      ({ target }) =>
        $emit('openConfirmModal', {
          oid: collab.oid,
          name: collab.name,
          accessRight: target.value,
        })
    "
    class="itbkk-access-right select select-ghost w-full max-w-xs bg-[#444444]"
  >
    <option value="READ">Read</option>
    <option value="WRITE">Write</option>
  </select>
</template>
