const uri = import.meta.env.VITE_SERVER_URI;

export async function getBoardsByUserOid(oid) {
  try {
    const res = await fetch(`${uri}/v3/user/${oid}/boards`);
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
