const uri = import.meta.env.VITE_SERVER_URI;

export async function getStatusesByNanoIdBoard(boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getStatusById(id, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function addStatus(newTask, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function deleteStatusById(id, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function editStatusById(id, editItem, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItem),
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function transferTasksToNewStatus(
  deletedId,
  changeId,
  nanoIdBoard,
) {
  try {
    const res = await fetch(
      `${uri}/v3/boards/${nanoIdBoard}/statuses/${deletedId}/${changeId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
