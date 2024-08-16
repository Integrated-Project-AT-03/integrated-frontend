<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router'
import Button from '../components/ButtonModal.vue'
import { addItem } from '@/lib/fetch';

const router = useRouter();
const uri = import.meta.env.VITE_SERVER_URI
const user = ref({
  userName: '',
  password: ''
})

async function login(data) {
    try {
        const res = await addItem(`${uri}/authentications/login`, data)
        if(res.httpStatus === 200){
          console.log('Okay');
        }
        else if(res.httpStatus === 401){
          console.log('Username or Password is Incorrect');
          router.push({name: 'login'})
        }
        return router.push({name: 'Task'})
    } catch (error) {
        return error
    }
}

</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center absolute">
    <div class="flex flex-col justify-center items-center w-[35rem] h-[30rem] p-4 gap-7">
        <div class="text-3xl font-bold text-slate-200">Welcome To ITB-KK</div>
      <div class="flex flex-col gap-3 items-center w-full">
        <div class="flex flex-col gap-2 text-xs">
            <!-- {{ validateInput.username ? 'Max 50 character' : '' }} -->
            <input v-model="user.userName" maxlength="50" type="text" placeholder="Username" class="itbkk-username input input-bordered w-[20rem] rounded-xl max-w-xs" />
        </div>
        <div class="flex flex-col gap-2 text-xs">
            <!-- {{ validateInput.password ? 'Max 14 character' : '' }} -->
            <input v-model="user.password" maxlength="14" type="password" placeholder="Password" class="itbkk-password input input-bordered w-[20rem] rounded-xl max-w-xs" />
        </div>
        <div class="flex gap-1 w-[20rem] justify-center">
            <div class="">
                <Button
                class="itbkk-button-signup w-[10rem] rounded-[1.4rem] opacity-40"
                bgcolor="#444444"
                message="Sign up" />
            </div>
            <div class="">
                <Button :disabled="user.userName.length <= 0 || user.password.length <= 0"
                class="itbkk-button-signin w-[10rem] rounded-[1.4rem]"
                bgcolor="#666666"
                message="Sign in" 
                @click="login(user)" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>