<script setup>
import { computed, ref } from 'vue';
import Button from '../components/ButtonModal.vue';
import { addItem } from '@/lib/fetch';

const uri = import.meta.env.VITE_SERVER_URI;
const user = ref({
  userName: '',
  password: ''
});

const validateInput = computed(() => {
  return {
    username: user.value.userName.length > 50,
    password: user.value.password.length > 14
  };
});

async function login(data) {
  try {
    const res = await addItem(`${uri}/Endpoint`, data);
    return res;
  } catch (error) {
    return error;
  }
}

</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">

    <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-8">
      <div class="text-5xl font-bold">Welcome To ITBKK</div>
    </span>

    <div class="flex flex-col justify-center items-center w-[24rem] p-8 gap-7">
      <div class="text-2xl font-bold text-white-700">Login</div>
      <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-2">
          <label class="text-white-700 font-semibold">Username</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 4.96875C11 6.17051 10.572 7.32305 9.81012 8.17283C9.04825 9.0226 8.01494 9.5 6.9375 9.5C5.86006 9.5 4.82675 9.0226 4.06488 8.17283C3.30301 7.32305 2.875 6.17051 2.875 4.96875C2.875 3.76699 3.30301 2.61445 4.06488 1.76467C4.82675 0.914898 5.86006 0.4375 6.9375 0.4375C8.01494 0.4375 9.04825 0.914898 9.81012 1.76467C10.572 2.61445 11 3.76699 11 4.96875ZM16.6875 9.5C17.5495 9.5 18.3761 9.11808 18.9856 8.43826C19.5951 7.75844 19.9375 6.83641 19.9375 5.875C19.9375 4.91359 19.5951 3.99156 18.9856 3.31174C18.3761 2.63192 17.5495 2.25 16.6875 2.25C15.8255 2.25 14.9989 2.63192 14.3894 3.31174C13.7799 3.99156 13.4375 4.91359 13.4375 5.875C13.4375 6.83641 13.7799 7.75844 14.3894 8.43826C14.9989 9.11808 15.8255 9.5 16.6875 9.5ZM15.0625 14.2016V14.0312C15.0625 13.0508 14.7774 12.0968 14.25 11.3125H19.5686C20.6671 11.3125 21.5593 12.3058 21.5593 13.5328C21.5593 13.5328 21.5593 17.6562 16.6843 17.6562C15.7125 17.6562 14.9341 17.4931 14.3118 17.2303C14.6984 16.4363 14.945 15.5669 15.0381 14.6693C15.0479 14.5569 15.0544 14.4608 15.0576 14.3811L15.0625 14.2016ZM13.4375 14.0312C13.4375 13.3102 13.1807 12.6187 12.7236 12.1088C12.2665 11.5989 11.6465 11.3125 11 11.3125H2.875C2.22853 11.3125 1.60855 11.5989 1.15143 12.1088C0.694307 12.6187 0.4375 13.3102 0.4375 14.0312V14.1672C0.4375 14.1672 0.4375 19.4688 6.9375 19.4688C13.132 19.4688 13.4229 14.6547 13.4375 14.2016V14.0312Z"
                  fill="#928D8D" />
              </svg>
            </span>
            <input v-model="user.userName" type="text" placeholder="Type your Username"
              class="input input-bordered w-full rounded-lg pl-10 bg-gray-100 text-gray-700 border-2 border-gray-300 focus:border-blue-400 focus:ring-0 border-b-2" />
          </div>
          <span class="text-red-500 text-xs" v-if="validateInput.username">Max 50 characters</span>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-white-700 font-semibold">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.5 18.2857C8.87011 18.2857 8.26602 18.0449 7.82062 17.6162C7.37522 17.1876 7.125 16.6062 7.125 16C7.125 14.7314 8.18188 13.7143 9.5 13.7143C10.1299 13.7143 10.734 13.9551 11.1794 14.3838C11.6248 14.8124 11.875 15.3938 11.875 16C11.875 16.6062 11.6248 17.1876 11.1794 17.6162C10.734 18.0449 10.1299 18.2857 9.5 18.2857ZM16.625 21.7143V10.2857H2.375V21.7143H16.625ZM16.625 8C17.2549 8 17.859 8.24082 18.3044 8.66947C18.7498 9.09813 19 9.67951 19 10.2857V21.7143C19 22.3205 18.7498 22.9019 18.3044 23.3305C17.859 23.7592 17.2549 24 16.625 24H2.375C1.74511 24 1.14102 23.7592 0.695621 23.3305C0.250222 22.9019 0 22.3205 0 21.7143V10.2857C0 9.01714 1.05688 8 2.375 8H3.5625V5.71429C3.5625 4.19876 4.18806 2.74531 5.30155 1.67368C6.41505 0.602039 7.92528 0 9.5 0C10.2797 0 11.0518 0.147804 11.7722 0.434974C12.4926 0.722144 13.1471 1.14306 13.6984 1.67368C14.2498 2.2043 14.6871 2.83423 14.9855 3.52752C15.2839 4.22081 15.4375 4.96388 15.4375 5.71429V8H16.625ZM9.5 2.28571C8.55517 2.28571 7.64903 2.64694 6.98093 3.28992C6.31283 3.9329 5.9375 4.80497 5.9375 5.71429V8H13.0625V5.71429C13.0625 4.80497 12.6872 3.9329 12.0191 3.28992C11.351 2.64694 10.4448 2.28571 9.5 2.28571Z"
                  fill="#928D8D" />
              </svg>

            </span>
            <input v-model="user.password" type="password" placeholder="Type your Password"
              class="input input-bordered w-full rounded-lg pl-10 bg-gray-100 text-gray-700 border-2 border-gray-300 focus:border-blue-400 focus:ring-0 border-b-2" />
          </div>
          <span class="text-red-500 text-xs" v-if="validateInput.password">Max 14 characters</span>
        </div>
        <div class="flex justify-between gap-2 w-full">
          <button :disabled="user.userName.length <= 0 || user.password.length <= 0"
            class="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
            Sign in
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between w-full mt-2 text-sm text-white-500">
        <label class="flex items-center">
          <input type="checkbox" class="mr-2" />
          Remember me
        </label>
        <a href="#" class="hover:underline">Forgot Password?</a>
      </div>
      <div class="text-white-500 mt-4 text-sm">
        Don't have an account? <a href="#" class="text-blue-500 hover:underline">Register here</a>
      </div>
    </div>
  </div>
</template>
