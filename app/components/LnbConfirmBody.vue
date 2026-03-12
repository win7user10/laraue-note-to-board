<script setup lang="ts">

</script>

<template>
  <div class="confirm-body">
    <slot></slot>
  </div>
  <div class="confirm-warn">⚠ This action cannot be undone.</div>
</template>

<style scoped>
.confirm-body { font-size: 13px; color: var(--text2); line-height: 1.5; margin-bottom: 12px; }
.confirm-body strong { color: var(--text); }
.confirm-warn { background: var(--red-glow); border: 1px solid rgba(248,81,73,0.35); border-radius: var(--radius-sm); padding: 9px 12px; font-size: 12px; color: var(--red); margin-bottom: 16px; line-height: 1.5; }
</style>