<script setup>
import {
  downloadFile as downloadFileAPI,
  showImage,
} from "../../services/apiFileAttachment.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Xmark from "@/assets/icons/Xmark.vue";

const imageSrc = ref();
const route = useRoute();
const typeImg = ["jpg", "png", "jpge"];
const { attachment, isEditMode } = defineProps(["attachment", "isEditMode"]);
onMounted(async () => {
  if (!typeImg.includes(attachment.type)) return;
  imageSrc.value = await showImage(
    route.params.oid,
    route.params.id,
    attachment.id,
  );
});

let iconFile = "";
if (attachment.type === "pdf") iconFile = "📄";
else if (["doc", "docx"].includes(attachment.type)) iconFile = "📝";
else if (["xls", "xlsx"].includes(attachment.type)) iconFile = "📊";
else if (["ppt", "pptx"].includes(attachment.type)) iconFile = "📈";
else iconFile = "📁";

const dowloadFile = async (fileId, event) => {
  if (event.target?.classList.contains('delete-btn')) {
    return;
  }
    try {
      const res = await downloadFileAPI(
        route.params.oid,
        route.params.id,
        fileId,
      );
      const fileUrl = res.data.message.url;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("File download failed:", error);
    }
};


const emit = defineEmits(['delete-file'])

const tempDelete = (id) => {
  emit('delete-file', id)
}

</script>
<template>
  <div
    class="flex h-[10rem] w-full lg:w-[8rem] cursor-pointer flex-col justify-between rounded-lg bg-stone-500 p-3 hover:bg-stone-700 hover:text-blue-500 hover:opacity-80"
    @click="dowloadFile(attachment.id, $event)"
  >
    <div class="flex justify-end">
      <button v-show="isEditMode" class="delete-btn" @click.stop="tempDelete(attachment.id)"><Xmark /></button>
    </div>
    <img
      v-show="typeImg.includes(attachment.type)"
      class="h-[80%] w-[100%] object-cover"
      :src="imageSrc"
      :key="attachment.name"
    />
    <p
      v-if="!typeImg.includes(attachment.type)"
      class="flex h-[80%] w-[100%] items-center justify-center text-6xl"
    >
      {{ iconFile }}
    </p>

    <p class="w-[100%] overflow-hidden text-nowrap text-xs underline">
      {{ `${attachment.name}.${attachment.type}` }}
    </p>
  </div>
</template>
