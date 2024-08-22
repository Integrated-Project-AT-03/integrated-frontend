<script setup>
import { computed, ref } from 'vue';
import Button from '../components/ButtonModal.vue';
import { addItem } from '@/lib/fetch';
import { useRouter } from 'vue-router';

const router = useRouter()
const uri = import.meta.env.VITE_SERVER_URI;

const user = ref({userName: '' ,password: ''})
const errorMessage = ref()


async function onSubmit(item){
  errorMessage.value = ''

  if (!user.value.userName || !user.value.password) {
    errorMessage.value = 'Did not enter a username or password.';
    return;
  }

  const res = await addItem(`${uri}/authentications/login`, item)
  if (res.httpStatus === 200) {
    const parseJson = JSON.stringify(res.access_token)
    localStorage.setItem("token", parseJson)
    router.push("/app")
  } else {
    errorMessage.value = 'Username or Password is incorrect';
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <div class="w-[24rem] p-8  rounded-lg">

      <h2
        class="text-3xl font-bold bg-gradient-to-r from-[#CE50B7] via-[#BF53C5] to-[#EA499A] bg-clip-text text-transparent mb-2">
        Welcome back </h2>
      <p class="text-lg text-gray-400 mb-8">
        welcome to <span
          class="bg-gradient-to-r from-[#CE50B7] via-[#BF53C5] to-[#EA499A] bg-clip-text text-transparent">IT-BKK</span>
      </p>


      <div class="mb-4">
        <label for="email" class="block text-gray-400 mb-2">userName</label>
        <input type="email" id="email" placeholder="Enter your email" v-model="user.userName"
          class="itbkk-username w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#BF53C5]" 
          maxlength="50"/>
      </div>


      <div class="mb-4">
        <label for="password" class="block text-gray-400 mb-2">Password</label>
        <input type="password" id="password" placeholder="Password" v-model="user.password"
          class="itbkk-password w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#BF53C5]" 
          maxlength="14"/>
      </div>


      <div v-show="errorMessage" class="itbkk-message mb-4 text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div class="text-left mb-6">
        <a href="#" class="text-white-300 hover:underline">Forgot password?</a>
      </div>


      <button @click="onSubmit(user)"
        class="itbkk-button-signin btn w-full py-2 bg-gradient-to-r from-[#CE50B7] via-[#BF53C5] to-[#EA499A]  text-white font-semibold rounded-lg" 
        :disabled="user.userName.length === 0 || user.password.length ===0">
        Login
      </button>


      <div class="text-center mt-6 text-white-100">
        Don't have an account? <a href="#" class="text-white hover:underline">Sign up for free</a>
      </div>
    </div>
  </div>
</template>
