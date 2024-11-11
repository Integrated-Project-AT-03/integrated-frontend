<script setup>
import Button from "@/components/Button.vue";
import { useRoute, useRouter } from "vue-router";
import AddCollaboratorModal from "../components/AddCollaboratorModal.vue";
import CollabModal from "../components/CollabModal.vue";
import { getCollab } from "../services/apiCollab.js";
import { getBoardByNanoId } from "../services/apiBoard.js";
import { onMounted } from "vue";
import { useBoardStore } from "@/stores/useBoardStore";
import { useCollabStore } from "../stores/useCollabStore.js";
import { useUserStore } from "../stores/useUserStore.js";
import { ref } from "vue";
// import EmptyElementSelect from "../components/EmptyElementSelect.vue";
import ChangeAccessModal from "../components/ChangeAccessModal.vue";
import SelectCollabRole from "@/components/SelectCollabRole.vue";
import ChangeInviteAccessModal from "@/components/ChangeInviteAccessModal.vue";
import { deleteCollab, cancleInvite } from "../services/apiCollab.js";
import {
  updateAccessCollab,
  updateAccessInviteCollab,
} from "../services/apiCollab";
const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const collabStore = useCollabStore();
const curCollab = ref({ oid: "", name: "", access: "" });
const emits = defineEmits(["message, loading"]);
const openAddModal = ref(false);
const UserStore = useUserStore();
onMounted(async () => {
  const curBoard = (await getBoardByNanoId(route.params.oid)).data;
  boardStore.setCurrentBoard(curBoard);
  const res = await getCollab(route.params.oid);

  if (res.httpStatus === 403) {
    return router.push({ name: "NotAllowPage" });
  } else if (res.httpStatus === 404) {
    return router.push({ name: "NotFoundPage" });
  }
  collabStore.setCollabs(res.data);
  emits("loading", false);
});

const handleMessage = (e) => {
  emits("message", e);
};

function onModalOpen(idModal, collab) {
  document.getElementById(idModal).showModal();
  curCollab.value = collab;
}

// function onChangeAccessModalOpen(collab) {
//   document.getElementById("changeAccessModal").showModal();
//   curCollab.value = collab;
// }

// function onChangeInviteAccessModalOpen(collab) {
//   document.getElementById("changeInviteAccessModal").showModal();
// }

async function removeCollab() {
  try {
    const res = await deleteCollab(curCollab.value.oid, route.params.oid);
    if (res.httpStatus === 200) {
      collabStore.deleteCollab(curCollab.value.oid);
      emits("message", {
        description: `The collaborator has been successfully deleted.`,
        status: "success",
      });
    }
  } catch (error) {
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
}

async function leaveBoard() {
  try {
    const res = await deleteCollab(curCollab.value.oid, route.params.oid);
    if (res.httpStatus === 200) {
      collabStore.deleteCollab(curCollab.value.oid);
      emits("message", {
        description: `You have left the board now.`,
        status: "success",
      });

      router.push({ name: "Boards" });
    }
  } catch (error) {
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
}

async function changeAccessCollab() {
  try {
    const res = await updateAccessCollab(
      route.params.oid,
      curCollab.value.oid,
      curCollab.value.accessRight,
    );
    console.log(res);
    if (res.httpStatus === 200) {
      collabStore.updateCollab(curCollab.value.oid, res.data.accessRight);
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

async function changeAccessInviteCollab() {
  try {
    const res = await updateAccessInviteCollab(
      route.params.oid,
      curCollab.value.oid,
      curCollab.value.accessRight,
    );
    console.log(res);
    if (res.httpStatus === 200) {
      collabStore.updateCollab(curCollab.value.oid, res.data.accessRight);
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

async function cancelInviteCollab() {
  try {
    const res = await cancleInvite(curCollab.value.oid, route.params.oid);
    if (res.httpStatus === 200) {
      collabStore.deleteCollab(curCollab.value.oid);
      emits("message", {
        description: `The collaborator has been successfully canceled.`,
        status: "success",
      });
    }
  } catch (error) {
    emits("message", {
      description: `${error}`,
      status: "error",
    });
  }
}

function revert() {
  collabStore.updateCollab(
    curCollab.value.oid,
    curCollab.value.accessRight === "WRITE" ? "READ" : "WRITE",
  );
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex justify-end">
      <Button
        class="itbkk-collaborato-add"
        bgcolor="#666666"
        message="Add Collaborator"
        :access="['OWNER']"
        :action="() => (openAddModal = true)"
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
            class="px-6 py-3 text-start text-sm font-bold uppercase tracking-wider text-base-100"
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
        <tr
          v-for="(collab, index) in collabStore.getCollabs()"
          :key="collab.oid"
          class="itbkk-item itbkk-button-action"
        >
          <td class="px-6 py-4">
            <div class="text-gray-900">{{ index + 1 }}</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="itbkk-title text-sm text-gray-900">
              {{ collab.name }}
              {{ collab.status === "PENDING" ? "(Pending Invite)" : "" }}
            </div>
          </td>
          <td class="w-full whitespace-nowrap px-6 py-4">
            <div class="itbkk-assignees w- text-sm text-gray-900">
              {{ collab.email }}
            </div>
          </td>
          <td class="whitespace-nowrap">
            <SelectCollabRole
              v-if="collab.status === 'ACTIVE'"
              @openConfirmModal="onModalOpen('changeAccessModal', collab)"
              :collab="collab"
            />
            <SelectCollabRole
              v-else
              @openConfirmModal="
                onModalOpen('changeAccessInviteCollab', collab)
              "
              :collab="collab"
            />
          </td>
          <td
            class="flex items-center justify-center whitespace-nowrap px-4 py-2"
          >
            <Button
              v-if="
                collab.status === 'ACTIVE' &&
                collab.oid === UserStore.getUser().oid
              "
              class="itbkk-button-cancel"
              bgcolor="#444444"
              :action="
                () =>
                  onModalOpen('LeaveCollabModal', {
                    oid: collab.oid,
                    name: collab.name,
                  })
              "
              message="Leave"
            />
            <Button
              v-else-if="collab.status === 'ACTIVE'"
              :access="['OWNER']"
              class="itbkk-button-cancel"
              bgcolor="#444444"
              :action="
                () =>
                  onModalOpen('removeCollabModal', {
                    oid: collab.oid,
                    name: collab.name,
                  })
              "
              message="Remove"
            />

            <Button
              v-else
              :access="['OWNER']"
              class="itbkk-button-cancel"
              bgcolor="red"
              :action="
                () =>
                  onModalOpen('cancelInviteModal', {
                    oid: collab.oid,
                    name: collab.name,
                  })
              "
              message="Cancel"
            />
          </td>
        </tr>
        <tr></tr>
      </tbody>
      <div
        v-show="collabStore.getCollabs().length === 0"
        class="m-0 bg-white py-3 text-center font-bold text-gray-600"
      >
        No Collaborator
      </div>
    </table>
  </div>
  <CollabModal
    header="Leave Board"
    id="LeaveCollabModal"
    :handleConfirm="leaveBoard"
    @message="handleMessage($event)"
  >
    Do you want to leave {{ boardStore.getCurrentBoard().name }} board?
  </CollabModal>

  <CollabModal
    header="Remove Collaborator"
    id="removeCollabModal"
    :handleConfirm="removeCollab"
    @message="handleMessage($event)"
  >
    Do you want to remove "{{ curCollab?.name }}" from the board
  </CollabModal>

  <CollabModal
    header="Cancal Invite Collaborator"
    id="cancelInviteModal"
    :handleConfirm="cancelInviteCollab"
    @message="handleMessage($event)"
  >
    Do you want to cancel invite "{{ curCollab?.name }}" from the board
  </CollabModal>

  <ChangeAccessModal
    header="Change Access Right"
    idModal="changeAccessModal"
    @revert="revert"
    @message="handleMessage($event)"
    :handleConfirm="changeAccessCollab"
  >
    Do you want to change access right of "{{ curCollab?.name }}" to "{{
      curCollab.accessRight
    }}"
  </ChangeAccessModal>

  <ChangeAccessModal
    header="Change Invite Access Right"
    idModal="changeAccessInviteCollab"
    @revert="revert"
    @message="handleMessage($event)"
    :handleConfirm="changeAccessInviteCollab"
  >
    Do you want to change access right of "{{ curCollab?.name }}" to "{{
      curCollab.accessRight
    }}"
  </ChangeAccessModal>

  <!-- <ChangeInviteAccessModal
    @revert="revert"
    :collab="curCollab"
    @message="handleMessage($event)"
  /> -->
  <AddCollaboratorModal
    v-show="openAddModal"
    @closeModal="openAddModal = false"
    @message="handleMessage($event)"
  />
</template>

<style scoped></style>
