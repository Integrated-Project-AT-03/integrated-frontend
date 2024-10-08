import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getCollabBoard(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(`${uri}/v3/boards/${oid}/collabs`, options);
}

export async function addCollabBoard(newCollab, oid) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...newCollab }),
  };
  return await fetchWithRefresh(`${uri}/v3/boards/${oid}/collabs`, options);
}

export async function deleteCollabBoard(oid, boardNanoId) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/collabs/${oid}`,
    options,
  );
}
