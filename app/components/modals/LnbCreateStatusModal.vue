<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import type {CreateStatusRequest} from "~/composables/statusesApi";
import {useAppState} from "~/composables/appState";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";

const { getRandomColor } = useAppState()
const { state } = useBoard()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateStatusRequest): void
}>()

const { t } = useI18n();

const newStatus = ref<CreateStatusRequest>({
  name: "",
  color: getRandomColor(),
  epicId: state.value.epicId!,
})

const createStatus = () => {
  emit("create", newStatus.value)
}

</script>

<template>
  <LnbModal
      :apply-text="t('addColumn')"
      :title="t('addStatusColumn')"
      @close="emit('close')"
      @apply="createStatus">
    <LnbModalLabel>{{ t('statusName') }}</LnbModalLabel>
    <LnbModalInput
        focus
        @enter="createStatus"
        v-model="newStatus.name"
        :placeholder="t('statusNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
        v-model="newStatus.color"/>
  </LnbModal>
</template>

<style scoped>

</style>