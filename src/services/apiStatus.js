const uri = import.meta.env.VITE_SERVER_URI;

export async function getStatusesByNanoIdBoard(boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/statuses`);
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getStatusById(id) {
  try {
    const res = await fetch(`${uri}/v3/statuses/${id}`);
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function addStatus(newTask, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/statuses`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...newTask,
        boardNanoId,
      }),
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function deleteStatusById(id, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/statuses/${id}/board/${boardNanoId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function editStatusById(id, editItem, boardNanoId) {
  console.log(editItem);
  try {
    const res = await fetch(`${uri}/v3/statuses/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...editItem,
        boardNanoId,
      }),
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
      `${uri}/v3/statuses/${deletedId}/${changeId}/board/${nanoIdBoard}`,
      {
        method: "DELETE",
      },
    );
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
