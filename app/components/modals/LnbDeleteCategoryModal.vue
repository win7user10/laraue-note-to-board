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
    :title="t('deleteBoardTitle')">
      <LnbConfirmBody>
        {{ t('deleteBoardConfirm') }}
      </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>

</style>