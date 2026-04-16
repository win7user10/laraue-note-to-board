<script setup lang="ts">
  defineProps({
    color: { type: String, required: false },
  })
</script>

<template>
  <div class="card-avatar" :style="`background:${color}22;color:${color};width:30px;height:30px;font-size:13px`">
    <slot></slot>
  </div>
</template>

<style scoped>
.card-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: var(--surface3);
  color: var(--text);
}
</style>