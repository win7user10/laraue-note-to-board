<script setup lang="ts">
  defineProps({
    title: {type: String, required: true},
    type: {type: String as PropType<'primary' | 'danger'>, required: false},
    bordered: {type: Boolean, default: false},
  })
  const emits = defineEmits<{
    (e: 'click'): void,
  }>()
</script>

<template>
  <div
    :class="['icon-btn', type, { bordered: bordered }]"
    @click="emits('click')" :title="title">
    <slot></slot>
  </div>
</template>

<style scoped>
.icon-btn {
  width: 34px; height: 34px;
  color: var(--text2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.icon-btn.bordered{
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface3);
}
.icon-btn:hover, .icon-btn.active {
  color: var(--accent);
}
.icon-btn.bordered:hover, .icon-btn.bordered.active {
  background: var(--accent-glow);
  border-color: var(--accent);
}
.icon-btn.danger:hover {
  color: var(--red);
}
.icon-btn.bordered.danger:hover {
  background: var(--red-glow);
  border-color: var(--red);
}
</style>