const uri = import.meta.env.VITE_SERVER_URI;

export async function getColors() {
  try {
    const res = await fetch(`${uri}/v2/colors`);
    const data = await res.json();

    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
