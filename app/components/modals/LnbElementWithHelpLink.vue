<script setup lang="ts">
  defineProps<{
    linkHref: string,
    linkTitle: string,
  }>()
</script>

<template>
  <div class="container">
    <slot></slot>
    <a class="help-link" :href="linkHref" target="_blank" :title="linkTitle">?</a>
  </div>
</template>

<style scoped>
.help-link{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;border:1px solid var(--border);color:var(--text3);font-size:10px;font-weight:700;cursor:pointer;text-decoration:none;flex-shrink:0;transition:all 0.15s;font-family:'JetBrains Mono',monospace;-webkit-tap-highlight-color:transparent}
.help-link:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}
.help-link-inline svg{width:10px;height:10px}
.container{display: flex; align-items: center; gap: 6px;}
</style>