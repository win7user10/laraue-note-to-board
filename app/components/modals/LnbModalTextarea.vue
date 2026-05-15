<script setup lang="ts">

  const props = defineProps({
    modelValue: { type: String, required: true },
    placeholder: { type: String, required: true },
    focus: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
    (e: 'enter'): void,
  }>()

  const textarea = ref<any>(null);
  onMounted(() => {
    if (props.focus)
      (textarea.value as any)?.focus();
  })

  watch(() => props.modelValue, (): void => {
    if (props.focus)
      (textarea.value as any)?.focus();
  })

  const { appState } = useAppState();
  const isLoading = computed(() => appState.value.isLoading);

  const handleEnter = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {

      const start = textarea.value.selectionStart;
      const end = textarea.value.selectionEnd;
      const newText = props.modelValue.substring(0, start) + (e.shiftKey ? '' : '\n') + props.modelValue.substring(end)
      emits('update:modelValue', newText);
      nextTick(() => {
        textarea.value.selectionStart = textarea.value.selectionEnd = start + 1
      })

      return;
    }
    e.preventDefault()
    emits('enter')
  }
</script>

<template>
  <textarea
    ref="textarea"
    class="modal-textarea"
    :class="{
      disabled: disabled || isLoading,
    }"
    :value="modelValue"
    @input="emits('update:modelValue', ($event.target as any).value)"
    @keydown.enter="handleEnter"
    :disabled="disabled || isLoading"
    :placeholder="placeholder">
  </textarea>
</template>

<style scoped>
.modal-textarea{width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;font-size:13px;color:var(--text);font-family:'Syne',sans-serif;outline:none;margin-bottom:12px;resize:vertical;min-height:80px;transition:border-color 0.15s;line-height:1.5;field-sizing: content;}
.modal-textarea:focus{border-color:var(--accent)}
.modal-textarea.disabled{background:var(--surface2);cursor:text;}
</style>