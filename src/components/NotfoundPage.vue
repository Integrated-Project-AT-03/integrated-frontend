<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
 
<template>
<div class="w-full h-screen flex justify-center items-center">
    <div class="flex flex-col">
        <img src="../../public/images/404-animation.gif" width="500" height="500" alt="Notfound-animation">
        <div class="flex flex-col absolute bottom-52 right-[25.5rem] items-center font-bold gap-2 font-serif">
            <div class="text-3xl">Page not Found</div>
            <div>Seems like you have lost your way. Let's bring you back home to
                <span class="text-[#CE50B7] hover:underline cursor-pointer" 
                @click="router.push({name: 'Boards'})"> Go home</span>
            </div>
        </div>
    </div>
</div>
</template>
 
<style scoped>

</style>