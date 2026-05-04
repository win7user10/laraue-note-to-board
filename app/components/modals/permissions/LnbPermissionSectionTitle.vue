<script setup lang="ts">
  defineProps<{
    title: string
    columnNames: Array<string>;
  }>()
</script>

<template>
  <div style="display:flex;align-items:center;padding:4px 10px;background:var(--surface2);border-top:2px solid var(--border)">
    <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;flex:1">
      {{ title }}
    </div>
    <div style="display: flex;gap:6px;">
      <div v-for="k in columnNames" :key="k" style="width:32px;display:flex;justify-content:center;align-items:center;font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase">
        {{ k }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>