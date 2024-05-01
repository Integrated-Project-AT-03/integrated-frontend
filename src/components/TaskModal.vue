<script setup>
import { onMounted, ref, watch, } from 'vue';
import { editItem } from "../assets/fetch.js";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  dataModal: {
    type: Object,
  }
});
const uri = import.meta.env.VITE_SERVER_URI;


const formModal = ref(props.dataModal)
watch(() => props.dataModal,()=>
  formModal.value = props.dataModal
)
async function editTask(id){
  try {
    const edit = await editItem(`${uri}/v1/tasks`,id,formModal)
    router.push({ path: `/task` })
    if(edit.status === 404){
      console.log('Error404');
    }
  } catch (error) {
  }
} 

const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formattDate = (date) =>

  new Date(date).toLocaleString("en-GB", localZone).replace(",", "");
</script>


<template>



  <dialog
    id="showDetail"
    class="w-[65rem] m-auto h-[47rem] bg-neutral rounded-2xl"
  >

    <div class="itbkk-title text-xl text-slate-200 mt-5 ml-6 font-bold">
      <input class="bg-neutral hover:border-neutral" type="text" :value=" formModal?.title" />
    </div>
    <div class="divider"></div>
    <div class="flex justify-around m-4">
      <div class="flex flex-col gap-2 text-slate-200">
        <div>Description</div>
        <textarea
          class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary border-base-100"
          :class="
            formModal?.description !== ''
              ? ' text-slate-200'
              : 'text-gray-400 italic'
          "
          >{{
            formModal?.description !== ""
              ? formModal.description
              : "No Description Provided"
          }}</textarea
        >
      </div>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Assignees</div>
          <textarea
            class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-4 bg-secondary border-base-100"
            :class="
              formModal?.assignees !== ''
                ? ' text-slate-200'
                : 'text-gray-400 italic'
            "
            >{{
              formModal?.assignees !== "" ? formModal.assignees : "Unassigned"
            }}</textarea
          >
        </div>
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Status</div>
          <select class="itbkk-status select w-full max-w-xs bg-base-100">
            <option selected >
              No status
            </option>
            <option :selected="formModal?.status === 'doing'">Doing</option>
            <option :selected="formModal?.status === 'done'">Done</option>
            <option :selected="formModal?.status === 'to_do'">To do</option>
          </select>
        </div>
        <div class="flex flex-col h-3/4 gap-3 text-slate-200">
          <div class="flex gap-2">
            TimeZone:
            <div class="itbkk-timezone">
              {{ localZone }}
            </div>
          </div>
          <div class="flex gap-2">
            Created On:
            <div class="itbkk-created-on">
              {{ formattDate(formModal?.createdOn) }}
            </div>
          </div>
          <div class="flex gap-2">
            Updated On:
            <div class="itbkk-updated-on">
              {{ formattDate(formModal?.updatedOn) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex justify-end m-4 gap-3">
      <button @click="editTask(dataModal.id)"
        class="btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
      >
        Ok
      </button>
      <form method="dialog itbkk-button">
        <button @click="$router.push({ path: `/task` })" class="btn">
          Close
        </button>
      </form>
    </div>
  </dialog>
</template>

<style scoped></style>
