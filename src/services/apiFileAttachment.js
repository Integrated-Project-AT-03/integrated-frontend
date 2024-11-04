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
