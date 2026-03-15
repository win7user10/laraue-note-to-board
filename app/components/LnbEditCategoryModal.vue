<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import type {EditCategoryRequest} from "~/composables/categoriesApi";
import {useAppState} from "~/composables/appState";

const { getRandomColor } = useAppState();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditCategoryRequest): void
}>()

const props = defineProps<{
  category: CategoryDto
}>()

const request = ref<EditCategoryRequest>({
  name: "",
  color: "",
})

onMounted(() => {
  request.value.color = props.category.color ?? getRandomColor();
  request.value.name = props.category.name;
})

</script>

<template>
  <LnbModal
      apply-text="Edit Category"
      title="Edit Category Board"
      @close="emit('close')"
      @apply="emit('edit', request)">
    <LnbModalLabel>Category name</LnbModalLabel>
    <LnbModalInput
        v-model="request.name"
        placeholder="e.g. Work, Personal, Design..."/>
    <LnbModalLabel>Color</LnbModalLabel>
    <LnbColorPicker
        v-model="request.color"/>
  </LnbModal>
</template>

<style scoped>

</style>