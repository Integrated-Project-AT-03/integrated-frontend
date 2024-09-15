const uri = import.meta.env.VITE_SERVER_URI;

export async function getTasksByNanoidBoard(
  boardNanoId,
  sort = "asc",
  filterStatuses = [],
) {
  try {
    // http://localhost:8080/v3/boards/1111111111/tasks?filterStatuses=no_status&sortDirection=asc&sortBy=status.name
    let params = "?";
    if (sort) params += `sortDirection=${sort}&sortBy=status.name&`;
    if (filterStatuses.length) {
      const formatFilter = filterStatuses
        .map((status) => status.replace(" ", "_"))
        .join(",");
      params += `filterStatuses=${formatFilter}&`;
    }
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/tasks${params}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
      },
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getTaskById(id) {
  try {
    const res = await fetch(`${uri}/v3/tasks/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
      },
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function addTask(newTask, boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
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
      method: "DELETE",headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
      },
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
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
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
