<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'delete'): void
}>()
const { t } = useI18n();
</script>

<template>
  <LnbModal
    @close="emit('close')"
    @apply="emit('delete')"
    :applyText="t('delete')"
    :title="t('deleteSpaceTitle')">
      <LnbConfirmBody>
        {{ t('deleteSpaceConfirm') }}
      </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>

</style>