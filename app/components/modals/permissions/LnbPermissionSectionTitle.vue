<script setup lang="ts">
  defineProps<{
    title: string
    columnNames: Array<string>;
  }>()
</script>

<template>
  <div class="wrapper">
    <div class="section-title">
      {{ title }}
    </div>
    <div class="column-title">
      <div v-for="k in columnNames" :key="k" class="column-name">
        {{ k }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .wrapper {display:flex;align-items:center;padding:4px 10px;background:var(--surface2);border-top:2px solid var(--border)}
  .section-title { font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;flex:1; }
  .column-title {display: flex;gap:6px;}
  .column-name { width:32px;display:flex;justify-content:center;align-items:center;font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase; text-align: center; }
</style>