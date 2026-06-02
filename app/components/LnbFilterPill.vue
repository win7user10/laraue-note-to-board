<script setup lang="ts">
  export interface Option{
    name: string;
    id: number;
    color?: string;
  }

  const props = defineProps<{
    options: Option[];
    modelValue: number | null;
    noFilterTitle: string;
    label: string;
  }>()

  const emits = defineEmits<{
    (e: 'update:modelValue', value: number | null): void,
  }>()

  const updateValue = (value: number | null) => {
    emits('update:modelValue', value)
  }

  const currentColor = computed(() => {
    return currentOption.value?.color
  })

  const currentName = computed(() => {
    return currentOption.value?.name ?? props.noFilterTitle
  })

  const currentOption = computed(() => {
    return props.options.find(option => option.id === props.modelValue)
  })
</script>

<template>
  <div class="filter-row">
    <div class="filter-title">
      {{ label }}
    </div>
    <div
        class="filter-chip"
        :class="{active: !modelValue}"
        @click="updateValue(null)">
      {{ currentName }}
    </div>
    <div
        v-for="option in options"
        class="filter-chip"
        :class="{active: modelValue === option.id}"
        @click="updateValue(option.id)">
      <span v-if="currentColor" :style="`color:${currentColor}`">● </span>{{option.name}}
    </div>
  </div>
</template>

<style scoped>
.filter-chip{padding:4px 10px;border-radius:14px;border:1px solid var(--border);background:var(--surface3);font-size:11px;font-weight:600;color:var(--text2);cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.filter-chip.active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}
.filter-title{font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; flex-shrink: 0;}
.filter-row{display: flex; gap: 5px; flex-wrap: wrap; align-items: center; margin-bottom: 8px;}
</style>