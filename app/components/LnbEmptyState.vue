<script setup lang="ts">
  defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  })
</script>

<template>
  <div class="empty-state" style="min-width:240px">
    <div class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="7" height="18" rx="1"/>
        <rect x="14" y="3" width="7" height="18" rx="1"/>
      </svg>
    </div>
    <div class="empty-title">{{ title }}</div>
    <div class="empty-sub">{{ subtitle }}</div>
  </div>
</template>

<style scoped>
/* ── EMPTY STATE ── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--text3);
}
.empty-title { font-size: 14px; font-weight: 700; color: var(--text2); }
.empty-sub { font-size: 12px; text-align: center; line-height: 1.5; }
.empty-icon {
  width: 52px; height: 52px;
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.empty-icon svg { width: 24px; height: 24px; color: var(--text3); }
</style>