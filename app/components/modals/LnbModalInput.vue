<script setup lang="ts">
  import LnbInput from "~/components/LnbInput.vue";

  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String },
    focus: { type: Boolean, required: false },
    preventDisableOnLoading: { type: Boolean, required: false },
    errors: { type: Array<string>, required: false },
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
    (e: 'enter'): void,
  }>()

  const { appState } = useAppState()

  const isLoading = computed(() => appState.value.isLoading);
  const isDisabled = computed(() => isLoading.value && !props.preventDisableOnLoading);

  const inputClass = computed(() => ({
    "modal-input": !isDisabled.value && !props.errors,
    "modal-input-disabled": isDisabled.value,
    "modal-input-error": !isDisabled.value && !!props.errors,
  }));
</script>

<template>
  <div class="input-wrapper">
    <LnbInput
      :focus="focus"
      :class="inputClass"
      :modelValue="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      @input="emits('update:modelValue', $event.target.value)"
      @enter="emits('enter')" />
    <p v-for="(msg, index) in errors" :key="index" class="error-message">
      {{ msg }}
    </p>
  </div>
</template>

<style scoped>
  .input-wrapper {
    width: 100%;
  }

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

  .modal-input-error {
    width: 100%;
    background: var(--surface3);
    border: 1px solid var(--red);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    font-size: 14px;
    color: var(--text);
    font-family: "Syne", sans-serif;
    outline: none;
    margin-bottom: 4px;
    transition: border-color 0.15s;
  }
  .modal-input-error:focus {
    border-color: var(--red-glow);
  }

  .error-message {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: var(--red);
    line-height: 1.3;
  }
</style>