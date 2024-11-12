import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "72bdafa1-de1c-48ae-960b-3581fef27028",
    authority:
      "https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a",
    redirectUri: "http://localhost:4173",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
const loginScopes = ["User.Read"];

// Initialize MSAL instance
async function initializeMsal() {
  await msalInstance.initialize();
}

initializeMsal(); // Call this once to initialize

async function login() {
  try {
    // Check if there are existing accounts (i.e., the user is already signed in)
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      // User is already signed in; set the active account
      msalInstance.setActiveAccount(accounts[0]);
      console.log("User is already signed in:", accounts[0].username);
      return accounts[0];
    }

    // If not signed in, prompt for login
    const loginResponse = await msalInstance.loginPopup({
      scopes: loginScopes,
    });

    // Set the active account after login
    msalInstance.setActiveAccount(loginResponse.account);
    console.log("Login successful:", loginResponse.account.username);
    return loginResponse.account;
  } catch (error) {
    console.error("Login error:", error);
  }
}

async function getAccessToken() {
  try {
    const response = await msalInstance.acquireTokenSilent({
      scopes: loginScopes,
    });
    console.log("Token acquired:", response.accessToken);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // If silent acquisition fails, prompt the user to log in again
      const response = await msalInstance.acquireTokenPopup({
        scopes: loginScopes,
      });
      console.log("Token acquired after interaction:", response.accessToken);
      return response.accessToken;
    } else {
      console.error("Token acquisition error:", error);
    }
  }
}

function logOff() {
  msalInstance.setActiveAccount(null); // Clear the active account
  msalInstance.logoutRedirect(); // Redirect to the logout page
}

async function logoffPopup() {
  try {
    await msalInstance.logoutPopup();
    console.log("User logged out via popup");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

async function getAccount() {
  try {
    const account = await msalInstance.getAccount();
    return account;
  } catch (error) {
    console.error(error);
  }
}

export { login, getAccessToken, logOff, logoffPopup, getAccount };
