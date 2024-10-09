import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getCollabBoard() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(`${uri}/v3/collabs`, options);
}

export async function leaveCollabBoard(oid, nanoId) {
    const uri = import.meta.env.VITE_SERVER_URI;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
  
    return await fetchWithRefresh(`${uri}/v3/boards/${nanoId}/collabs/${oid}`, options);
  }
  