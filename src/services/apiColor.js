const uri = import.meta.env.VITE_SERVER_URI;

export async function getColors() {
  try {
    const res = await fetch(`${uri}/v2/colors`, {
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
