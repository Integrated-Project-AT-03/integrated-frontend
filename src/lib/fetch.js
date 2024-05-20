async function getItems(url) {
  try {
    const res = await fetch(url);
    const items = await res.json();

    return { items: [...items], httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
async function getItemById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`);
    const item = await res.json();
    console.log(item);
    return { ...item, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function deleteItemById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    const item = await res.json();
    console.log(item);
    return { ...item, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function patchItemById(url, id, value, status) {
  try {
    const res = await fetch(`${url}/${id}/${value}/${status}`, {
      method: "PUT",
    });
    const item = await res.json();
    console.log(item);
    return { ...item, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...newItem,
      }),
    });
    const item = await res.json();
    console.log(item);
    return { ...item, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function editItem(url, id, editItem) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...editItem,
      }),
    });
    const editedItem = await res.json();
    return { ...editedItem, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function changeTasksStatus(url, deletedId, changeId) {
  try {
    const res = await fetch(`${url}/${deletedId}/${changeId}`, {
      method: "DELETE",
    });
    const body = await res.json();
    return { body, httpStatus: res.status };
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
export {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  changeTasksStatus,
  patchItemById,
};
