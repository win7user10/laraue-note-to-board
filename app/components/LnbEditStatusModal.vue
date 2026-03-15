<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import type {EditStatusRequest} from "~/composables/statusesApi";
import {useAppState} from "~/composables/appState";

const { getRandomColor } = useAppState();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditStatusRequest): void
}>()

const props = defineProps<{
  status: StatusDto
}>()

const newStatus = ref<EditStatusRequest>({
  name: "",
  color: "",
})

onMounted(() => {
  newStatus.value.color = props.status.color ?? getRandomColor();
  newStatus.value.name = props.status.name;
})

</script>

<template>
  <LnbModal
      apply-text="Edit Column"
      title="Edit Status Column"
      @close="emit('close')"
      @apply="emit('edit', newStatus)">
    <LnbModalLabel>Status name</LnbModalLabel>
    <LnbModalInput
        v-model="newStatus.name"
        placeholder="e.g. To Do, In Progress, Done..."/>
    <LnbModalLabel>Color</LnbModalLabel>
    <LnbColorPicker
        v-model="newStatus.color"/>
  </LnbModal>
</template>

<style scoped>

</style>