import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getVisibilityByOid(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${oid}`, options);
}

export async function updateVisibility(newVisibility, oid) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newVisibility }),
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${oid}`, options);
}
