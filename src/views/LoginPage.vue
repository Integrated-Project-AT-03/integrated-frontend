<script setup>
import { computed, ref } from 'vue';
import Button from '../components/ButtonModal.vue'

const user = ref({
  username: '',
  password: ''
})

const validateInput = computed(() => {
  return {
    username: user.value.username.length > 50,
    password: user.value.password.length > 14
  };
});

async function login(data) {
  
}

</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center absolute">
    <div class="flex flex-col justify-center items-center w-[35rem] h-[30rem] p-4 gap-7">
        <div class="text-3xl font-bold text-slate-200">Welcome To ITB-KK</div>
      <div class="flex flex-col gap-3 items-center w-full">
        <div class="flex flex-col gap-2 text-xs">
            {{ validateInput.username ? 'Max 50 character' : '' }}
            <input v-model="user.username" type="text" placeholder="Username" class="itbkk-username input input-bordered w-[20rem] rounded-xl max-w-xs" />
        </div>
        <div class="flex flex-col gap-2 text-xs">
            {{ validateInput.password ? 'Max 14 character' : '' }}
            <input v-model="user.password" type="password" placeholder="Password" class="itbkk-password input input-bordered w-[20rem] rounded-xl max-w-xs" />
        </div>
        <div class="flex gap-1 w-[20rem] justify-center">
            <div class="">
                <Button
                class="itbkk-button-signup w-[10rem] rounded-[1.4rem] opacity-40"
                bgcolor="#444444"
                message="Sign up" />
            </div>
            <div class="">
                <Button :disabled="user.username.length <= 0 || user.password.length <= 0"
                class="itbkk-button-signin w-[10rem] rounded-[1.4rem]"
                bgcolor="#666666"
                message="Sign in" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>