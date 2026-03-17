<script setup lang="ts">
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
    :title="t('deleteCardTitle')">
      <LnbConfirmBody>
        {{ t('deleteCardConfirm') }}
      </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>

</style>