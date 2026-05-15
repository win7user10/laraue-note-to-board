<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import type {EditCategoryRequest} from "~/composables/epicsApi";
import {useAppState} from "~/composables/appState";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";

const { getRandomColor } = useAppState();
const { state } = useBoard();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditCategoryRequest): void
}>()

const request = ref<EditCategoryRequest>({
  name: "",
  color: "",
})

onMounted(() => {
  request.value.color = state.value.currentEpic?.color ?? getRandomColor();
  request.value.name = state.value.currentEpic?.name ?? '';
})

const { t } = useI18n();

</script>

<template>
  <LnbModal
      :applyText="t('editCategory')"
      :title="t('editBoardTitle')"
      @close="emit('close')"
      @apply="emit('edit', request)">
    <LnbModalLabel>{{ t('categoryName') }}</LnbModalLabel>
    <LnbModalInput
        focus
        @enter="emit('edit', request)"
        v-model="request.name"
        :placeholder="t('categoryNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
        v-model="request.color"/>
  </LnbModal>
</template>

<style scoped>

</style>