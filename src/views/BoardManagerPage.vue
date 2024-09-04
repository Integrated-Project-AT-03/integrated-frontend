<script setup>
import ButtonModal from '@/components/ButtonModal.vue';
</script>
 
<template>
    <div class="w-full h-screen">
        <ButtonModal message="+ Create personal board" @click="$router.push({name: 'AddBoard'})" />
    </div>
    <RouterView />
</template>
 
<style scoped>

</style>
