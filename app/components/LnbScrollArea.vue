<script setup lang="ts">

import LnbLoadMore from "~/components/LnbLoadMore.vue";

defineProps<{
  hasMore: boolean,
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'loadMore'): void,
}>()
</script>

<template>
  <div class="col-drag-area" v-col-scroll="{
      statusId: 0,
      onLoad: () => emits('loadMore'),
      hasMore: (sid: number) => hasMore }">
    <slot></slot>
  </div>
  <LnbLoadMore
      v-if="hasMore"
      :isLoading="isLoading"/>
</template>

<style scoped>

.col-drag-area { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 60px; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--border) transparent; transition: background 0.15s; }
.col-drag-area::-webkit-scrollbar { width: 3px; }
.col-drag-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.col-drag-area.drag-over { background: var(--accent-glow); }

</style>