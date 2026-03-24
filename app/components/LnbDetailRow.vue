<script setup lang="ts">
  defineProps({
    label: { type: String, required: true },
  })
</script>

<template>
  <div class="detail-row">
    <div class="detail-label">{{ label }}</div>
    <div class="detail-val">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.detail-row{display:flex;align-items:center;gap:8px}
.detail-label{font-size:11px;color:var(--text3);font-weight:600;width:100px;flex-shrink:0}
.detail-val{font-size:12px;color:var(--text2)}
</style>