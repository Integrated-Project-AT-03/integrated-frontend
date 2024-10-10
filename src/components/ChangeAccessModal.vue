<script setup>
import { useRoute } from 'vue-router';
import Button from './Button.vue';
import {updateAccessCollab} from '../services/apiCollab'
import {useCollabStore} from '../stores/useCollabStore'
import { ref } from 'vue';

const collabStore = useCollabStore()
const route = useRoute();
const accessForsend = ref({accessRight: ""})
const emits = defineEmits(["message"]);

const props = defineProps({
  collab: {
    type: Object,
  },
});

const handleConfirm = async () => {
    try {
      if(props.collab.access === 'READ'){
      accessForsend.value.accessRight = 'WRITE'
    } else {
      accessForsend.value.accessRight = 'READ'
    }
    const res = await updateAccessCollab(route.params.oid, props.collab.oid, accessForsend.value)
    if(res.httpStatus === 201){
      collabStore.updateCollab(props.collab.oid, res.data.accessRight)
      emits("message", {
      description: `The collaborator has been successfully updated.`,
      status: "success",
    });
    }
    } catch (error) {
      console.log(error);
      emits("message", {
      description: `${error}`,
      status: "error",
    });
    }
}

</script>
 
<template>
      <dialog id="changeAccessModal" class="modal">
    <div
      class="itbkk-modal-alert flex h-auto w-[35rem] flex-col rounded-lg bg-neutral p-6"
    >
      <div class="text-2xl font-bold text-slate-300">
        Change Access Right
      </div>
      <div class="divider"></div>
      <div class="itbkk-message text-slate-300">
        Do you want to change access right of "{{ collab?.name }}" to "{{ collab.access === 'READ' ? "WRITE" : 'READ' }}"
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
 
<style scoped>

</style>