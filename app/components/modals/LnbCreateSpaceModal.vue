<script setup lang="ts">

import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import {useAppState} from "~/composables/appState";

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const { t } = useI18n();

const { getRandomColor } = useAppState();
const { createSpace } = useBoard();
const { getEmptyErrorsObject } = useUtils()

const newSpace = ref<CreateSpaceRequest>({
  name: "",
  key: "",
  color: getRandomColor(),
})

const errors = ref(getEmptyErrorsObject())
const createSpaceInternal = async () => {
  try {
    await createSpace(newSpace.value);
    emit("close")
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      errors.value = error.errors;
    } else {
      throw error;
    }
  }
}

</script>

<template>
  <LnbModal
    :applyText="t('createSpace')"
    :title="t('newSpace')"
    @close="emit('close')"
    @cancel="emit('close')"
    @apply="createSpaceInternal">

    <LnbModalLabel>
      {{ t('spaceName') }}
    </LnbModalLabel>
    <LnbModalInput
        focus
        :errors="errors['Name']"
        v-model="newSpace.name"
        :placeholder="t('spaceNameExample')"/>

    <LnbModalLabel>
      {{ t('key') }}
    </LnbModalLabel>
    <LnbModalInput
        :errors="errors['Key']"
        v-model="newSpace.key"
        :placeholder="t('keyExample')"/>

    <LnbModalLabel>
      {{ t('color') }}
    </LnbModalLabel>
    <LnbColorPicker
        v-model="newSpace.color"/>
  </LnbModal>
</template>

<style scoped>

</style>