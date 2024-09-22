import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getBoardsByUserOid(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchWithRefresh(`${uri}/v3/user/${oid}/boards`, options);
}

export async function createBoard(newBoard) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newBoard }),
  };

  return await fetchWithRefresh(`${uri}/v3/boards`, options);
}

export async function getBoardByUserNanoId(nanoId) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${nanoId}`, options);
}
