<script setup lang="ts">
  defineProps<{
    color: string;
  }>()
</script>

<template>
  <span class="card-tag" :style="{ color: color, borderColor: color + '44' }">
    <slot></slot>
  </span>
</template>

<style scoped>
.card-tag {
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  color: var(--text2);
  font-weight: 600;
}
</style>