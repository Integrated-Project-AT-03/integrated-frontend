import { fetchWithRefresh } from "./apiAuth";

const uri = import.meta.env.VITE_SERVER_URI;
export async function getCollabBoard(oid) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await fetchWithRefresh(`${uri}/v3/${oid}/collabs`, options);
}
