<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import type {CreateStatusRequest} from "~/composables/statusesApi";
import {useAppState} from "~/composables/appState";

const { appState, getRandomColor } = useAppState()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateStatusRequest): void
}>()

const newStatus = ref<CreateStatusRequest>({
  name: "",
  color: getRandomColor(),
  categoryId: appState.value.categoryId,
})

const createStatus = () => {
  emit("create", newStatus.value)
}

</script>

<template>
  <LnbModal
      apply-text="Add Column"
      title="Add Status Column"
      @close="emit('close')"
      @apply="createStatus">
    <LnbModalLabel>Status name</LnbModalLabel>
    <LnbModalInput
        @enter="createStatus"
        v-model="newStatus.name"
        placeholder="e.g. To Do, In Progress, Done..."/>
    <LnbModalLabel>Color</LnbModalLabel>
    <LnbColorPicker
        v-model="newStatus.color"/>
  </LnbModal>
</template>

<style scoped>

</style>