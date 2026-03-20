<script setup lang="ts">
defineProps<{
  isLoading: boolean,
}>()
</script>

<template>
  <!-- Load more sentinel -->
  <div class="col-load-more">
    <template v-if="isLoading">
      <div class="col-loader">
        <div class="col-loader-dot"></div>
        <div class="col-loader-dot"></div>
        <div class="col-loader-dot"></div>
      </div>
    </template>
    <template v-else>
      <div class="col-load-label">Scroll for more</div>
    </template>
  </div>
</template>

<style scoped>
.col-load-more{padding:6px 8px;display:flex;align-items:center;justify-content:center;min-height:36px}
.col-load-label{font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.col-loader{display:flex;gap:5px;align-items:center;justify-content:center}
.col-loader-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:col-bounce 0.9s ease-in-out infinite}
.col-loader-dot:nth-child(2){animation-delay:0.15s}
.col-loader-dot:nth-child(3){animation-delay:0.3s}
@keyframes col-bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
</style>