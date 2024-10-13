import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getCollab(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(`${uri}/v3/boards/${oid}/collabs`, options);
}

export async function addCollab(newCollab, oid) {
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

export async function deleteCollab(oid, boardNanoId) {
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

export async function updateAccessCollab(boardNanoId, oid, access) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ accessRight: access }),
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/collabs/${oid}`,
    options,
  );
}
