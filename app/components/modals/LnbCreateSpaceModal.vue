<script setup lang="ts">

import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import {useAppState} from "~/composables/appState";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateSpaceRequest): void
}>()

const { t } = useI18n();

const { getRandomColor } = useAppState();

const newSpace = ref<CreateSpaceRequest>({
  name: "",
  color: getRandomColor(),
})

const createSpace = () => {
  emit("create", newSpace.value)
}

</script>

<template>
  <LnbModal
      :applyText="t('createSpace')"
      :title="t('newSpace')"
      @close="emit('close')"
      @apply="createSpace">
    <LnbModalLabel>{{ t('spaceName') }}</LnbModalLabel>
    <LnbModalInput
        focus
        @enter="createSpace"
        v-model="newSpace.name"
        :placeholder="t('spaceNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
        v-model="newSpace.color"/>
  </LnbModal>
</template>

<style scoped>

</style>