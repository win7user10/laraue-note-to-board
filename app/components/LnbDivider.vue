<script setup lang="ts">
  const { t } = useI18n()
</script>

<template>
  <!-- Divider -->
  <div style="display:flex;align-items:center;gap:8px;margin:4px 0">
    <div style="flex:1;height:1px;background:var(--border)"></div>
    <div style="font-size:10px;color:var(--text3);font-weight:600">
      {{ t('or') }}
    </div>
    <div style="flex:1;height:1px;background:var(--border)"></div>
  </div>
</template>

<style scoped>

</style>