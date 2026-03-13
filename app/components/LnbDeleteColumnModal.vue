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
      title="Delete Column?">
    <LnbConfirmBody>
      The column will be permanently removed. Messages will me moved to the first available status.
    </LnbConfirmBody>
  </LnbModal>
</template>

<style scoped>

</style>