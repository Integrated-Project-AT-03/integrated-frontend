<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import {getVisibilityByOid} from '../services/apiVisibility'
import { useRoute } from 'vue-router';

const route = useRoute()

const userStore = useUserStore()
const isTooltipVisible = ref(false);
const isOwnerBoard = ref()

onMounted(async () => {
    const visibilityLoad = await getVisibilityByOid(route.params.oid);
    if(userStore.getUser().oid === visibilityLoad.data.owner.oid){
        isOwnerBoard.value = true
  } else{
    isOwnerBoard.value = false
  }
})

// Show tooltip on hover
const showTooltip = () => {
    if(isOwnerBoard.value){
        isTooltipVisible.value = false;
    } else {
        isTooltipVisible.value = true;
    }
};

// Hide tooltip when not hovering
const hideTooltip = () => {
  isTooltipVisible.value = false;
};

</script>
 
<template>
  <div class="tooltip-container">
    <div @mouseover="showTooltip" @mouseleave="hideTooltip">
        <slot></slot>
    </div>
    <div v-if="isTooltipVisible" class="tooltip-content bg-[#555555]">
      <div class="text-gray-200 m-[0.1rem]">You need to be board owner to perform this action.</div>
    </div>
  </div>
</template>
 
<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%; /* Position the tooltip above the button */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s;
}
</style>