<script setup lang="ts">
  import LnbInput from "~/components/LnbInput.vue";

  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String },
    focus: { type: Boolean, required: false },
    preventDisableOnLoading: { type: Boolean, required: false },
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
    (e: 'enter'): void,
  }>()

  const { appState } = useAppState()

  const isLoading = computed(() => appState.value.isLoading);
  const isDisabled = computed(() => isLoading.value && !props.preventDisableOnLoading);
</script>

<template>
  <LnbInput
    :focus="focus"
    :class="isDisabled ? 'modal-input-disabled' : 'modal-input'"
    :modelValue="modelValue"
    :placeholder="placeholder"
    :disabled="isDisabled"
    @input="emits('update:modelValue', $event.target.value)"
    @enter="emits('enter')" />
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
    cursor:not-allowed;
    border:1px solid var(--border);
    border-radius:var(--radius-sm);
    padding:10px 12px;
    font-size:14px;
    color:var(--text3);
    font-family:'JetBrains Mono',monospace;
    outline:none;
    margin-bottom:12px;
    user-select:none;
    opacity:0.7
  }
</style>