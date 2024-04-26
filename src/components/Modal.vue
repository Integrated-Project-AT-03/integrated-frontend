<script setup>
defineProps({
  dataModal: {
    type: Object,
  },
});
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formattDate = (date) => new Date(date).toLocaleString("en-GB", localZone);
</script>

<template>
  <dialog
    id="my_modal_1"
    class="w-[65rem] m-auto h-[47rem] bg-neutral rounded-2xl"
  >
    <div class="itbkk-title text-xl text-slate-200 mt-5 ml-6 font-bold">
      {{ dataModal?.title }}
    </div>
    <div class="divider"></div>
    <div class="flex justify-around m-4">
      <div class="flex flex-col gap-2 text-slate-200">
        <div>Description</div>
        <textarea
          class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-4 bg-secondary border-base-100"
          :class="
            dataModal?.description !== ''
              ? ' text-slate-200'
              : 'text-gray-400 italic'
          "
          >{{
            dataModal?.description !== ""
              ? dataModal.description
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
              dataModal?.assignees !== ''
                ? ' text-slate-200'
                : 'text-gray-400 italic'
            "
            >{{
              dataModal?.assignees !== "" ? dataModal.assignees : "Unassigned"
            }}</textarea
          >
        </div>
        <div class="flex flex-col gap-2 text-slate-200">
          <div>Status</div>
          <select class="itbkk-status select w-full max-w-xs bg-base-100">
            <option :selected="dataModal?.status === 'no_status'">
              No status
            </option>
            <option :selected="dataModal?.status === 'doing'">Doing</option>
            <option :selected="dataModal?.status === 'done'">Done</option>
            <option :selected="dataModal?.status === 'to_do'">To do</option>
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
              {{ formattDate(dataModal?.createdOn) }}
            </div>
          </div>
          <div class="flex gap-2">
            Updated On:
            <div class="itbkk-updated-on">
              {{ formattDate(dataModal?.updatedOn) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex justify-end m-4 gap-3">
      <button
        class="btn btn-success w-16 hover:bg-base-100 hover:border-base-100"
      >
        Ok
      </button>
      <form method="dialog itbkk-button">
        <button class="btn">Close</button>
      </form>
    </div>
  </dialog>
</template>

<style scoped></style>
