const uri = import.meta.env.VITE_SERVER_URI;
export async function getBoardsByUserOid(oid) {
  try {
    const res = await fetch(`${uri}/v3/user/${oid}/boards`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function createBoard(newBoard) {
  try {
    const res = await fetch(`${uri}/v3/boards`, {
      method: "POST",
      credentials: "include",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newBoard }),
    });
    console.log(res);
    const data = await res.json();
    return { ...data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getBoardByUserNanoId(nanoId) {
  try {
    const res = await fetch(`${uri}/v3/boards/${nanoId}`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
