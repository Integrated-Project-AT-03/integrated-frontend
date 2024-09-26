<script setup>
import { ref } from 'vue';


const isTooltipVisible = ref(false);

// Show tooltip on hover
const showTooltip = () => {
  isTooltipVisible.value = true;
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
    <!-- <button @mouseover="showTooltip" @mouseleave="hideTooltip">
      Hover over me
    </button> -->
    <div v-if="isTooltipVisible" class="tooltip-content">
      You need to be board owner to perform this action.
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