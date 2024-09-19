const uri = import.meta.env.VITE_SERVER_URI;
export async function getBoardsByUserOid(oid) {
  try {
    const res = await fetch(`${uri}/v3/user/${oid}/boards`, {
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

export async function createBoard(newBoard) {
  try {
    const res = await fetch(`${uri}/v3/boards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
