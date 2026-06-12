<script setup lang="ts">

import LnbIcon from "~/components/icons/LnbIcon.vue";

const props = defineProps<{
  modelValue: string;
  label?: string;
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void,
}>()

const updateValue = (value: string) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <LnbFilterPill :label="label" :has-filter="!!modelValue">
    <LnbIcon icon="search" size="mini" v-if="!modelValue" />
    {{ modelValue }}
    <span class="pill-x" @click.stop="updateValue('')" v-if="modelValue">
      <LnbIcon icon="clear" size="mini" />
    </span>

    <template #popup>
      <LnbInput :model-value="modelValue" @update:modelValue="updateValue" placeholder="Search" />
    </template>
  </LnbFilterPill>
</template>

<style scoped>
.pill-x{display:flex;align-items:center;justify-content:center;}
</style>