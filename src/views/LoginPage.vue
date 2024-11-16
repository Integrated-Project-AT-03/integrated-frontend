<script setup>
import { computed, onMounted, ref } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import Logo from "../components/Logo.vue";
import { useUserStore } from "../stores/useUserStore";
import {myMSALObj } from "../utils/msalConfig.js";
import { login } from "@/services/apiAuth.js";

const router = useRouter();
const userStore = useUserStore();
const user = ref({ userName: "itbkk.olarn", password: "ip23/OLA" });
const errorMessage = ref();
const userName = ref()
//
// async function loginMSAL() {
//   try {
//     // Ensure handleRedirectPromise resolves any pending interactions
//     const redirectResponse = await myMSALObj.handleRedirectPromise();
//
//     if (redirectResponse) {
//       console.log("Redirect Login Successful:", redirectResponse);
//     }
//
//     if (!myMSALObj) {
//       throw new Error("MSAL configuration is missing. Please check your credentials.");
//     }
//
//     // Check if user is already logged in
//     const accounts = myMSALObj.getAllAccounts();
//     if (accounts.length > 0) {
//       console.log("User already logged in:", accounts[0]);
//
//       // Set user authentication state in your store or application state
//       userStore.setIsAuthenticated(true);
//       userStore.setUser(accounts[0]); // Example for setting user in your store
//       return;
//     }
//
//     // Proceed with login if no interaction is in progress
//     console.log("No active session found. Redirecting to login...");
//     await myMSALObj.loginRedirect({
//       scopes: ["user.read", "openid", "profile"], // Add necessary scopes
//     });
//   } catch (err) {
//     if (err.errorCode === "interaction_in_progress") {
//       console.warn("Interaction is already in progress. Please wait.");
//     } else if (err.errorCode === "user_cancelled") {
//       console.warn("User cancelled the login process.");
//     } else {
//       console.error("Login Failed:", err);
//     }
//   }
// }
//
//
// async function logoutMSAL() {
//   if (!myMSALObj) {
//     throw new Error("Missing credentials");
//   }
//   await myMSALObj.logoutRedirect()
//   console.log('Logout Success');
// }
//
//  const handleRedirect = async () => {
//   try {
//     await myMSALObj.handleRedirectPromise()
//     userStore.setUser(myMSALObj.getAllAccounts()[0]);
//     console.log(myMSALObj.getAllAccounts());
//   }catch (err){
//     console.log('Redirect Error:', err)
//   }
// }




// async function initialze(){
//   try{
//     await myMSALObj.initialize();
//   }catch (error) {
//     console.log('initialization error', error);
//   }
// }

// onMounted(async () => {
//   await initialze()
//   await handleRedirect()
// })

async function onSubmit() {
  errorMessage.value = "";

  if (!user.value.userName || !user.value.password) {
    errorMessage.value = "Did not enter a username or password.";
    return;
  }

  const res = await login(user.value);
  if (res.httpStatus === 200) {
    userStore.setUser(res.data);
    router.push({ name: "Boards" });
  } else {
    errorMessage.value = "Username or Password is incorrect";
  }
}

// async function loginMicrosoft(){
//   const res = await loginMSAL();
// }

// async function logout(){
//   await logoutMSAL()
// }
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center">
    <div class="flex overflow-hidden rounded-2xl bg-[#3F3D3C] shadow-xl">
      <div
        class="flex h-[40rem] w-[35rem] items-center justify-center overflow-hidden rounded-2xl bg-[#3F3D3C]"
      >
        <div class="h-[37rem] w-[32rem] rounded-2xl bg-[#333333]">
          <div class="flex flex-col p-10">
            <div class="text-3xl font-bold">Plan Track Achieve</div>
            <div class="ml-6 text-2xl font-bold">-One Task at a Time.</div>
          </div>
          <div class="mr-3 flex justify-end">
            <Logo />
          </div>
        </div>
      </div>
      <div
        class="flex h-[40rem] w-[35rem] items-center justify-center bg-[#2E2E2E]"
      >
        <div class="flex flex-col gap-2">
          <div
            class="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-3xl font-bold text-transparent"
          >
            Welcome back
          </div>
          <div class="flex gap-2">
            <div class="text-[#888888]">welcome to</div>
            <div
              class="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
            >
              IT-BKK
            </div>
          </div>
          <div class="mt-4 text-[#888888]">Email</div>
          <input
            type="text"
            placeholder="Enter your email"
            class="itbkk-username input input-bordered w-full max-w-xs bg-[#333333] placeholder-[#777777]"
            v-model="user.userName"
            maxlength="50"
          />
          <div class="text-[#888888]">Password</div>
          <input
            type="password"
            placeholder="Password"
            class="itbkk-password input input-bordered w-full max-w-xs bg-[#333333] placeholder-[#777777]"
            v-model="user.password"
            maxlength="14"
          />
          <div
            v-show="errorMessage"
            class="itbkk-message mb-4 text-sm text-red-500"
          >
            {{ errorMessage }}
          </div>
          <div class="mt-2 text-[#888888]">Forgot password?</div>
          <button
            @click="onSubmit"
            class="itbkk-button-signin btn w-full rounded-lg bg-gradient-to-r from-[#CE50B7] via-[#BF53C5] to-[#EA499A] py-2 font-semibold text-white"
            :disabled="user.userName.length === 0 || user.password.length === 0"
          >
            Login
          </button>
          <button class="btn bg-[#252525]" >
            <img src="/images/microsoft-logo.png" alt="logo-microsoft" width="20" height="20">
            Login with microsoft
          </button>
          <button class="btn btn-primary" >logout</button>
          <div class="flex gap-2">
            <div class="text-[#888888]">Don't have an account?</div>
            <div class="text-[#E2E2E2] hover:underline">Sign up for free</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
