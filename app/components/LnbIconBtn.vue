<script setup lang="ts">
  defineProps({
    title: { type: String, required: true },
  })
  const emits = defineEmits<{
    (e: 'click'): void,
  }>()
</script>

<template>
  <div class="icon-btn" @click="emits('click')" :title="title">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
      <slot></slot>
    </svg>
  </div>
</template>

<style scoped>
.icon-btn {
  width: 34px; height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface3);
  color: var(--text2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.icon-btn:hover, .icon-btn.active { background: var(--accent-glow); border-color: var(--accent); color: var(--accent); }
.icon-btn svg { width: 16px; height: 16px; }
</style>