import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;

export async function uploadFiles(nanoId, id, formData) {
  const option = {
    method: "PUT",
    credentials: "include",
    body: formData,
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/tasks/${id}/attachment`,
    option,
  );
}

export async function downloadFile(nanoId, tasksId, fileId) {
  const option = {
    method: "GET",
    credentials: "include",
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/tasks/${tasksId}/attachment/${fileId}`,
    option,
  );
}

export async function deleteFile(nanoId, taskId, filesId) {
  const option = {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify({ filesId }),
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/tasks/${taskId}/attachment`,
    option,
  );
}

export async function showImage(nanoId, taskId, fileId) {
  const options = {
    credentials: "include",
    headers: {
      Accept: "image/png, image/jpeg, image/jpg", // กำหนดประเภทของไฟล์ที่ต้องการรับ เช่น ไฟล์รูปภาพ
    },
  };
  const result = await fetch(
    `${uri}/v3/boards/${nanoId}/tasks/${taskId}/attachment/${fileId}`,
    options,
  );

  console.log(result);

  const imageBlob = await result.blob();
  return URL.createObjectURL(imageBlob);
}
