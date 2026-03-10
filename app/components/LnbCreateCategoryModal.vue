<script setup lang="ts">
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import {useAppState} from "~/composables/appState";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateCategoryRequest): void
}>()

const { getRandomColor } = useAppState();

const newCategory = ref<CreateCategoryRequest>({
  name: "",
  color: getRandomColor(),
})

const createCategory = () => {
  emit("create", newCategory.value)
}

</script>

<template>
  <LnbModal
      apply-text="Create Board"
      title="New Category Board"
      @close="emit('close')"
      @apply="createCategory">
    <LnbModalLabel>Name</LnbModalLabel>
    <LnbModalInput
      @enter="createCategory"
      v-model="newCategory.name"
      placeholder="e.g. Work, Personal, Design..."/>
    <LnbModalLabel>Color</LnbModalLabel>
    <LnbColorPicker
      v-model="newCategory.color"/>
  </LnbModal>
</template>

<style scoped>

</style>