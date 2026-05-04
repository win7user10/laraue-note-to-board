<script setup lang="ts">

defineProps<{
  title: string,
  color?: string,
  columns: Array<{ id: number, name: string, type?: string }>,
  checked: (id: number, type?: string) => boolean,
  inherited: (id: number, type?: string) => boolean,
}>()
const emits = defineEmits<{
  (e: 'change', id: number, type?: string): void,
}>()
</script>

<template>
  <div class="perm-row">
    <div class="perm-row-label perm-indent-2">
      <div class="perm-row-label-color" :style="{ background: color }" v-if="color"></div>
      <div class="perm-row-name dim">{{ title }}</div>
    </div>
    <div v-for="k in columns" :key="k.id + (k.type ?? '')" class="checkbox-column">
      <input
        :checked="checked(k.id, k.type) || inherited(k.id, k.type)"
        :disabled="inherited(k.id, k.type)"
        :title="inherited(k.id, k.type) ? 'Added automatically' : ''"
        @change="emits('change', k.id, k.type)"
        type="checkbox" class="perm-check"/>
    </div>
  </div>
</template>

<style scoped>
.perm-row{display:flex;align-items:center;gap:6px;padding:9px 10px;border-bottom:1px solid var(--border);transition:background 0.12s}
.perm-row:last-child{border-bottom:none}
.perm-row-label{flex:1;min-width:0;display:flex;align-items:center;gap:5px}
.perm-row-name{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.perm-row-name.dim{color:var(--text3);font-weight:500}
.perm-check{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}
.perm-check:disabled{opacity:0.4;cursor:not-allowed}
.perm-indent-2{padding-left:14px}
.perm-row-label-color {width:6px;height:6px;border-radius:1px;flex-shrink:0}
.checkbox-column{width:32px;display:flex;justify-content:center}
</style>