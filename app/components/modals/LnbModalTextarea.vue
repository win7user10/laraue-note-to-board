<script setup lang="ts">
  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String, required: true },
    focus: { type: Boolean, required: false },
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
  }>()

  const textarea = ref(null);
  onMounted(() => {
    if (props.focus)
      (textarea.value as any)?.focus();
  })

  const { appState } = useAppState();
  const isLoading = computed(() => appState.value.isLoading);
</script>

<template>
  <textarea
    ref="textarea"
    class="modal-textarea"
    :class="{
      disabled: isLoading,
    }"
    :value="modelValue"
    @input="emits('update:modelValue', ($event.target as any).value)"
    :disabled="isLoading"
    :placeholder="placeholder">
  </textarea>
</template>

<style scoped>
.modal-textarea{width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;font-size:13px;color:var(--text);font-family:'Syne',sans-serif;outline:none;margin-bottom:12px;resize:vertical;min-height:80px;transition:border-color 0.15s;line-height:1.5}
.modal-textarea:focus{border-color:var(--accent)}
.modal-textarea.disabled{background:var(--surface2);cursor:not-allowed;}
</style>