<script setup lang="ts">
  const { appState } = useAppState()
</script>

<template>
  <div class="nav-loader" :class="{active: appState.isLoading}">
    <div class="nav-loader-fill"></div>
  </div>
</template>

<style scoped>
/* NAV LOADER — slim bar between stats and content */
.nav-loader{height:3px;flex-shrink:0;pointer-events:none;opacity:0;transition:opacity 0.2s;background:var(--border)}
.nav-loader.active{opacity:1}
.nav-loader-fill{height:100%;background:var(--accent);border-radius:0 2px 2px 0;animation:nav-progress 0.5s cubic-bezier(0.4,0,0.2,1) forwards}
@keyframes nav-progress{0%{width:0%}60%{width:75%}100%{width:100%}}
</style>