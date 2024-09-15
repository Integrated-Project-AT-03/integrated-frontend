const uri = import.meta.env.VITE_SERVER_URI;

export async function getSettingByNanoIdBoard(boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/settings`, {
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

export async function editSettingByNanoIdBoard(boardNanoId, editSetting) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/settings`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, 
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(editSetting),
    });
    const data = await res.json();
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
