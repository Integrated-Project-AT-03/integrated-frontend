<script setup>
import { useBoardStore } from "@/stores/useBoardStore.js";
const boardStore = useBoardStore();
const { collab } = defineProps(["collab"]);
const emits = defineEmits(["openConfirmModal"]);
</script>

<template>
  <div
    data-tip="You need to be board owner to perform this action."
    :class="
      !['OWNER'].includes(boardStore.getCurrentBoard().access) &&
      'tooltip tooltip-left'
    "
  >
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
      class="itbkk-access-right select select-sm lg:select-md select-ghost w-full max-w-xs bg-[#444444]"
    >
      <option value="READ">Read</option>
      <option value="WRITE">Write</option>
    </select>
  </div>
</template>
