import { myMSALObj } from "@/utils/msalConfig.js";
import { useUserStore } from "@/stores/useUserStore.js";

const uri = import.meta.env.VITE_SERVER_URI;


// export async function loginMSAL() {
//   try {
//   if(!myMSALObj){
//     throw new Error("Missing credentials");
//   }
//   await myMSALObj.loginRedirect()
//   userStore.setIsAuthenticated(true);
//   const loginResponse = await myMSALObj.loginRedirect()
//     userStore.setIsAuthenticated(true);
//     console.log('Login Success:', loginResponse);
// }catch(err) {
//   console.log('Login Failed:', err);}
// }
//
// export async function logoutMSAL() {
//   if (!myMSALObj) {
//     throw new Error("Missing credentials");
//   }
//   await myMSALObj.loginRedirect()
//   console.log('Logout Success');
// }

// export const handleRedirect = async () => {
//   try {
//     await myMSALObj.handleRedirectPromise()
//     userStore.setIsAuthenticated(myMSALObj.getAllAccounts().length > 0);
//     userStore.setUser(myMSALObj.getAllAccounts()[0]);
//
//   }catch (err){
//     console.log('Redirect Error:', err)
//   }
// }



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

    if (res.status === 401) {
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
