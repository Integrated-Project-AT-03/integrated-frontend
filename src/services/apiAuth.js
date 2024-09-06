const uri = import.meta.env.VITE_SERVER_URI;

export async function login(user) {
  try {
    const res = await fetch(`${uri}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

