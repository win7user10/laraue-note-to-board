<script setup lang="ts">
  defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String },
    disabled: { type: Boolean, default: false },
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
    (e: 'enter'): void,
  }>()
</script>

<template>
  <input
    :class="disabled ? 'modal-input-disabled' : 'modal-input'"
    :value="modelValue"
    @input="emits('update:modelValue', ($event.target as any).value)"
    :placeholder="placeholder"
    :disabled="disabled"
    @keyup.enter="emits('enter')" />
</template>

<style scoped>
  .modal-input {
    width: 100%;
    background: var(--surface3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    font-size: 14px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    outline: none;
    margin-bottom: 14px;
    transition: border-color 0.15s;
  }
  .modal-input:focus { border-color: var(--accent); }
  .modal-input::placeholder { color: var(--text3); }
  .modal-input-disabled{
    width:100%;
    background:var(--surface2);
    border:1px solid var(--border);
    border-radius:var(--radius-sm);
    padding:10px 12px;
    font-size:14px;
    color:var(--text3);
    font-family:'JetBrains Mono',monospace;
    outline:none;
    margin-bottom:12px;
    cursor:not-allowed;
    user-select:none;
    opacity:0.7
  }
</style>