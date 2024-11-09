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
  
  // อิคทำเพิ่ม สำหรับยอมรับหรือปฎิเสธคำเชิญ
export async function receiveInvite(boardNanoId, action) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      boardNanoId: boardNanoId,
      receiveInvite: action, // ค่านี้จะเป็น "ACCEPT" หรือ "DECLINE"
    }),
  };

  return await fetchWithRefresh(`${uri}/v3/collabs/receive-invite`, options);
}
