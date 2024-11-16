import { PublicClientApplication } from "@azure/msal-browser";
import { reactive } from "vue";

export const msalConfig = {
  auth: {
    clientId: "ebf2a4b2-85bd-4a51-8fc0-d09bb22b979b",
    authority:
      "https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a",
    redirectUri: 'http://localhost:4173/login',
    postLogoutUrl: 'http://localhost:4173/login'
  },
  cache:{
    cacheLocation: "localStorage",
    storeAuthStateInCookie:true
  }
};

const graphScopes = ["user.read","openid","profile"];

export const state = reactive({
  isAuthenticated: false,
  user: null,
})

export const myMSALObj = new PublicClientApplication(msalConfig);


// Initialize MSAL instance
// async function initializeMsal() {
//   await msalInstance.initialize();
// }

// async function login() {
//   try {
//     // Check if there are existing accounts (i.e., the user is already signed in)
//     const accounts = msalInstance.getAllAccounts();
//     if (accounts.length > 0) {
//       // User is already signed in; set the active account
//       msalInstance.setActiveAccount(accounts[0]);
//       console.log("User is already signed in:", accounts[0].username);
//       return accounts[0];
//     }
//
//     // If not signed in, prompt for login
//     const loginResponse = await msalInstance.loginPopup({
//       scopes: graphScopes,
//     });
//
//     // Set the active account after login
//     msalInstance.setActiveAccount(loginResponse.account);
//     console.log("Login successful:", loginResponse.account.username);
//     return loginResponse.account;
//   } catch (error) {
//     console.error("Login error:", error);
//   }
// }
//
// async function getAccessToken() {
//   try {
//     const response = await msalInstance.acquireTokenSilent({
//       scopes: graphScopes,
//     });
//     console.log("Token acquired:", response.accessToken);
//     return response.accessToken;
//   } catch (error) {
//     if (error instanceof InteractionRequiredAuthError) {
//       // If silent acquisition fails, prompt the user to log in again
//       const response = await msalInstance.acquireTokenPopup({
//         scopes: graphScopes,
//       });
//       console.log("Token acquired after interaction:", response.accessToken);
//       return response.accessToken;
//     } else {
//       console.error("Token acquisition error:", error);
//     }
//   }
// }
//
// function logOff() {
//   msalInstance.setActiveAccount(null); // Clear the active account
//   msalInstance.logoutRedirect(); // Redirect to the logout page
// }
//
// async function logoffPopup() {
//   try {
//     await msalInstance.logoutPopup();
//     console.log("User logged out via popup");
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// }
//
// async function getAccount() {
//   try {
//     const account = await msalInstance.getAccount();
//     return account;
//   } catch (error) {
//     console.error(error);
//   }
// }
//
// export { login, getAccessToken, logOff, logoffPopup, getAccount };
