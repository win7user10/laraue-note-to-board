<script setup lang="ts">

import {useAppState} from "~/composables/appState";
const { palette } = useAppState();

defineProps({
  modelValue: { type: String, required: true },
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void,
}>()

const { appState } = useAppState()
const isLoading = computed(() => appState.value.isLoading);
</script>

<template>
  <div class="color-picker">
    <div
      v-for="c in palette"
      :key="c"
      class="color-swatch"
      :style="isLoading ? `background:var(--surface2)` : `background:${c}`"
      :class="{
        selected: modelValue === c,
        disabled: isLoading,
      }"
      @click="isLoading ? () => {} : emits('update:modelValue', c)">
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.color-swatch {
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s;
}
.color-swatch.selected { border-color: white; transform: scale(1.15); }
.color-swatch.disabled { cursor: not-allowed; }
</style>