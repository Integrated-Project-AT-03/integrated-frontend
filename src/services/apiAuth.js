const uri = import.meta.env.VITE_SERVER_URI;

export async function login(user) {
  try {
    const res = await fetch(`${uri}/login`, {
      method: "POST",
      credentials: "include",
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

export async function logout() {
  try {
    const res = await fetch(`${uri}/clear-cookie`, {
      credentials: "include",
    });

    return { data: res, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function validateToken() {
  try {
    const res = await fetch(`${uri}/validate-token`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data: Boolean(data), httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function getUserInfo() {
  try {
    const res = await fetch(`${uri}/user-info`, {
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}
