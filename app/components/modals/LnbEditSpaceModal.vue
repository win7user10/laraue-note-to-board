<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import type {EditSpaceRequest} from "~/composables/spacesApi";

const props = defineProps<{
  space: SpaceDto
}>()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditSpaceRequest): void
}>()

const request = ref<EditSpaceRequest>({
  name: "",
  color: "",
})

onMounted(() => {
  request.value.color = props.space.color;
  request.value.name = props.space.name;
})

const { t } = useI18n();

</script>

<template>
  <LnbModal
      :applyText="t('editSpace')"
      :title="t('editSpaceTitle')"
      @close="emit('close')"
      @apply="emit('edit', request)">
    <LnbModalLabel>{{ t('spaceName') }}</LnbModalLabel>
    <LnbModalInput
        focus
        @enter="emit('edit', request)"
        v-model="request.name"
        :placeholder="t('spaceNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
        v-model="request.color"/>
  </LnbModal>
</template>

<style scoped>

</style>