<script setup lang="ts">

import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import {useAppState} from "~/composables/appState";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateOrganizationRequest): void
}>()

const { t } = useI18n();
const { getRandomColor } = useAppState();

const newOrganization = ref<CreateOrganizationRequest>({
  name: "",
  color: getRandomColor(),
})

const create = () => {
  emit("create", newOrganization.value)
}
</script>

<template>
  <LnbModal
    :applyText="t('createOrganization')"
    :title="t('newOrganization')"
    @close="emit('close')"
    @apply="create">
    <LnbModalLabel>{{ t('organizationName') }}</LnbModalLabel>
    <LnbModalInput
      focus
      @enter="create"
      v-model="newOrganization.name"
      :placeholder="t('organizationNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
      v-model="newOrganization.color"/>
  </LnbModal>
</template>

<style scoped>

</style>