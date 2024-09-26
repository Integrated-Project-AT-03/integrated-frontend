<script setup>
import { useRouter } from "vue-router"
const router = useRouter()

function back() {
    router.push("/")
}
</script>

<template>
    <div class="w-screen h-screen fixed top-0 left-0 bg-black-50 z-50 flex justify-center items-center">
        <div class="p-10 bg-white rounded-lg shadow-xl text-center space-y-9">

            <div class="text-5xl font-bold text-pink-600 drop-shadow-lg">
                404 PAGE NOT FOUND
            </div>


            <button @click="back"
                class="transition border bg-pink-500 w-[180px] h-[50px] rounded-md text-white font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl">
                BACK TO HOME PAGE
            </button>
        </div>
    </div>
</template>

<style scoped>
.drop-shadow-lg {
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
}
</style>
