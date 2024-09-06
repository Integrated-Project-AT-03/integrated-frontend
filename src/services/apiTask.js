const uri = import.meta.env.VITE_SERVER_URI;

export async function getTasksByNanoidBoard(boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/tasks`);
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getTaskById(id) {
  try {
    const res = await fetch(`${uri}/v3/tasks/${id}`);
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function addTask( newTask,boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/tasks`, {
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
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function deleteTaskById(id) {
  try {
    const res = await fetch(`${uri}/v3/tasks/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function editTaskById(id, editItem, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/tasks/${id}`, {
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
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
