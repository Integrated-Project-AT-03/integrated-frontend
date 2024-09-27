<script setup>
import { useRouter } from "vue-router"
const router = useRouter()

function back() {
    router.push("/")
}
</script>

<template>
    <div class="w-screen h-screen fixed top-0 left-0 bg-grey z-50 flex justify-center items-center">
        <div class="text-center space-y-10">

            <div class="space-y-4">
                <div class="text-7xl font-extrabold text-gray-200 drop-shadow-xl">
                    404
                </div>
                <div class="text-2xl font-semibold text-gray-400">
                    Page Not Found
                </div>
            </div>

            <div class="text-white-500">
                It seems the page you're looking for doesn't exist. Perhaps it was moved or the URL is incorrect.
            </div>

            <button @click="back"
                class="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 w-[200px] h-[55px] rounded-lg text-white text-lg font-semibold shadow-lg hover:shadow-2xl">
                Back to Home
            </button>
        </div>
    </div>
</template>

<style scoped>
.drop-shadow-xl {
    text-shadow: 2px 5px 8px rgba(0, 0, 0, 0.5);
}
</style>
