<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'delete'): void
}>()
</script>

<template>
  <LnbModal
    @close="emit('close')"
    @apply="emit('delete')"
    applyText="Delete"
    title="Delete Card?">
      <LnbConfirmBody>
        Message will be permanently removed.
      </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>

</style>