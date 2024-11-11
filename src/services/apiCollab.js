import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getCollab(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(`${uri}/v3/boards/${oid}/collabs`, options);
}

export async function addCollab(newCollab, oid) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...newCollab }),
  };
  return await fetchWithRefresh(`${uri}/v3/boards/${oid}/collabs`, options);
}

export async function deleteCollab(oid, boardNanoId) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/collabs/${oid}`,
    options,
  );
}

export async function updateAccessCollab(boardNanoId, oid, access) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ accessRight: access }),
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/collabs/${oid}`,
    options,
  );
}

export async function updateAccessInviteCollab(boardNanoId, oid, access) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ accessRight: access }),
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${boardNanoId}/invite/${oid}`,
    options,
  );
}

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

  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/collabs/${oid}`,
    options,
  );
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

export async function cancleInvite(oid, nanoId) {
  const options = {
    method: "DELETE",
    credentials: "include",
  };

  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/invite/${oid}`,
    options,
  );
}

export async function getInvite(oid, nanoId) {
  const options = {
    credentials: "include",
  };
  return await fetchWithRefresh(
    `${uri}/v3/boards/${nanoId}/invite/${oid}`,
    options,
  );
}
