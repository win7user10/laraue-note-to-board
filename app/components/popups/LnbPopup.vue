<script setup lang="ts">
defineProps<{
  alignRight?: boolean,
  minWidth: number,
}>()
const emits = defineEmits<{
  (e: 'close'): void,
}>()
</script>

<template>
  <!-- Sort popup -->
  <transition name="fade">
    <div class="popup" :style="{ right: alignRight ? '0' : undefined, minWidth: minWidth + 'px' }">
      <slot></slot>
    </div>
  </transition>
  <div style="position:fixed;inset:0;z-index:89" @click="emits('close')"></div>
</template>

<style scoped>
.popup{position:absolute;top:calc(100% + 6px);background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:5px;min-width:160px;box-shadow:0 6px 24px rgba(0,0,0,0.5);z-index:91;animation:slide-up 0.15s cubic-bezier(0.34,1.3,0.64,1)}
</style>