<script setup lang="ts">
  defineProps<{
    title: string;
  }>()
  const emits = defineEmits<{
    (e: 'click'): void,
  }>()
</script>

<template>
  <div class="fab-item" style="transition-delay:0ms">
    <div class="fab-item-label">{{ title }}</div>
    <div class="fab-item-btn" @click="emits('click')">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <slot></slot>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.fab-item{display:flex;align-items:center;gap:10px;transition:opacity 0.18s,transform 0.18s;}
.fab-item-btn{width:42px;height:42px;border-radius:50%;border:1px solid var(--border);background:var(--surface);color:var(--text2);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.4);transition:all 0.15s;-webkit-tap-highlight-color:transparent;flex-shrink:0}
.fab-item-btn:hover{background:var(--surface3);color:var(--text);border-color:var(--border2)}
.fab-item-btn.danger{color:var(--red);border-color:rgba(248,81,73,0.3)}
.fab-item-btn.danger:hover{background:var(--red-glow)}
.fab-item-btn svg{width:16px;height:16px}
.fab-item-label{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:var(--text2);white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
</style>