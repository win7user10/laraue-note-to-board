<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div class="popup-item" :class="{active: active}">
    <slot></slot>
  </div>
</template>

<style scoped>
.popup-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;color:var(--text2);transition:background 0.12s;-webkit-tap-highlight-color:transparent}
.popup-item:hover{background:var(--surface3)}
.popup-item.active{color:var(--accent);background:var(--accent-glow)}
</style>