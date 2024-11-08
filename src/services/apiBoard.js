import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getBoards() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  return await fetchWithRefresh(`${uri}/v3/boards`, options);
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

export async function getBoardByNanoId(nanoId) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  return await fetchWithRefresh(`${uri}/v3/boards/${nanoId}`, options);
}
