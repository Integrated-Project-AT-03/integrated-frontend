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

export async function loginMicrosoft() {
  document.location.href = `${uri}/auth/misl/login`
}

export async function logoutMicrosoft() {
    document.location.href = `${uri}/auth/misl/logout`
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
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const result = await fetchWithRefresh(`${uri}/validate-token`, options);
  return { data: Boolean(result.data), httpStatus: result.httpStatus };
}

export async function getUserInfo() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const result = await fetchWithRefresh(`${uri}/user-info`, options);
  return { data: result.data, httpStatus: result.httpStatus };
}

export async function refreshToken() {
  try {
    const res = await fetch(`${uri}/token`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error}`);
  }
}

export async function fetchWithRefresh(url, options) {
  try {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      const refreshResponse = await refreshToken();

      if (refreshResponse.httpStatus === 200) {
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      }
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: res };
    }

    if (!res.ok) {
      console.error(
        `Error: ${res.status} - ${data.message || "Failed to process request"}`,
      );
    }
    return { data, httpStatus: res.status };
  } catch (error) {
    console.error(`error: ${error.message}`);
    return { error: error.message };
  }

}
