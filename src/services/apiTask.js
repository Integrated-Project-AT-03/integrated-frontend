import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;

export async function getTasksByNanoidBoard(
  boardNanoId,
  sort = "asc",
  filterStatuses = [],
) {
  let params = "?";
  if (sort) params += `sortDirection=${sort}&sortBy=status.name&`;
  if (filterStatuses.length) {
    const formatFilter = filterStatuses
      .map((status) => status.replace(" ", "_"))
      .join(",");
    params += `filterStatuses=${formatFilter}&`;
  }

  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/tasks${params}`,
    options,
  );
}

export async function getTaskById(id, boardNanoId) {
  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/tasks/${id}`,
    options,
  );
}

export async function addTask(newTask, boardNanoId) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/tasks`,
    options,
  );
}

export async function deleteTaskById(id, boardNanoId) {
  const options = {
    method: "DELETE",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/tasks/${id}`,
    options,
  );
}

export async function editTaskById(id, editItem, boardNanoId) {
  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editItem),
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/tasks/${id}`,
    options,
  );
}
