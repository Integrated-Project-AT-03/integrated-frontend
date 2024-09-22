import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;

export async function getSettingByNanoIdBoard(boardNanoId) {
  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${boardNanoId}/settings`, options);
}

export async function editSettingByNanoIdBoard(boardNanoId, editSetting) {
  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editSetting),
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${boardNanoId}/settings`, options);
}
