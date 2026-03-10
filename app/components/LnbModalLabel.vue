<script setup lang="ts">

</script>

<template>
  <div class="modal-label">
    <slot></slot>
  </div>
</template>

<style scoped>
  .modal-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }
</style>