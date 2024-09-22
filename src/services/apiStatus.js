import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;

export async function getStatusesByNanoIdBoard(boardNanoId) {
  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/statuses`,
    options,
  );
}

export async function getStatusById(id, boardNanoId) {
  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/statuses/${id}`,
    options,
  );
}

export async function addStatus(newTask, boardNanoId) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/statuses`,
    options,
  );
}

export async function deleteStatusById(id, boardNanoId) {
  const options = {
    method: "DELETE",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/statuses/${id}`,
    options,
  );
}

export async function editStatusById(id, editItem, boardNanoId) {
  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editItem),
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/statuses/${id}`,
    options,
  );
}

export async function transferTasksToNewStatus(
  deletedId,
  changeId,
  nanoIdBoard,
) {
  const options = {
    method: "DELETE",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoIdBoard}/statuses/${deletedId}/${changeId}`,
    options,
  );
}
