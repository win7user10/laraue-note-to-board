<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'revoke'): void
}>()
const { t } = useI18n();
</script>

<template>
  <LnbModal
      @close="emit('close')"
      @apply="emit('revoke')"
      :applyText="t('revoke')"
      :title="t('revokeAccessTitle')">
    <LnbConfirmBody>
      {{ t('revokeAccessConfirm') }}
    </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>
</style>