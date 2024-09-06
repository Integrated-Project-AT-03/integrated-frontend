const uri = import.meta.env.VITE_SERVER_URI;

export async function getSettingByNanoIdBoard(boardNanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${boardNanoId}/settings`);
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
        "content-type": "application/json",
      },
      body: JSON.stringify(editSetting),
    });
    const data = await res.json();
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
