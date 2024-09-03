<script setup>
import { computed, ref } from "vue";
import Button from "../components/ButtonModal.vue";
import { addItem } from "@/lib/fetch";
import { useRouter } from "vue-router";
import Logo from "../components/Logo.vue"

const router = useRouter();
const uri = import.meta.env.VITE_SERVER_URI;

const user = ref({ userName: "", password: "" });
const errorMessage = ref();

async function onSubmit(item) {
  errorMessage.value = "";

  if (!user.value.userName || !user.value.password) {
    errorMessage.value = "Did not enter a username or password.";
    return;
  }

  const res = await addItem(`${uri}/login`, item);
  if (res.httpStatus === 200) {
    const parseJson = JSON.stringify(res.access_token);
    localStorage.setItem("token", parseJson);
    router.push("/app");
  } else {
    errorMessage.value = "Username or Password is incorrect";
  }
}
</script>

<template>
    <div class="w-full h-screen flex justify-center items-center">
      <div class="flex shadow-xl overflow-hidden bg-[#3F3D3C] rounded-2xl">
        <div class="w-[35rem] h-[40rem] overflow-hidden rounded-2xl bg-[#3F3D3C] flex justify-center items-center">
          <div class="w-[32rem] h-[37rem] bg-[#333333] rounded-2xl ">
            <div class="flex flex-col p-10">
              <div class="font-bold text-3xl">Plan Track Achieve</div>
              <div class="font-bold text-2xl ml-6">
                -One Task at a Time.
              </div>
            </div>
            <div class="flex justify-end mr-3">
              <Logo />
            </div>
          </div>
        </div>
        <div class="w-[35rem] h-[40rem] bg-[#2E2E2E] flex justify-center items-center">
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Welcome back
            </div>
            <div class="flex gap-2">
              <div class="text-[#888888]">welcome to</div>
              <div class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
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
              @click="onSubmit(user)"
              class="itbkk-button-signin btn w-full rounded-lg bg-gradient-to-r from-[#CE50B7] via-[#BF53C5] to-[#EA499A] py-2 font-semibold text-white"
              :disabled="user.userName.length === 0 || user.password.length === 0"
            >
              Login
            </button>
            <div class="flex gap-2">
              <div class="text-[#888888]">Don't have an account?</div>
              <div class="text-[#E2E2E2] hover:underline">
                Sign up for free
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
