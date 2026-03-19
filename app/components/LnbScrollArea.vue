<script setup lang="ts">

import LnbLoadMore from "~/components/LnbLoadMore.vue";

const props = defineProps<{
  hasMore: boolean,
  isLoading: boolean,
}>()

const emits = defineEmits<{
  (e: 'loadMore'): void,
}>()

const isLoading = ref(false)
const scrollableEl = ref(null);

useInfiniteScroll(scrollableEl, async () => {
  if (isLoading.value)
    return
  emits('loadMore')
}, { distance: 80, canLoadMore: () => props.hasMore });
</script>

<template>
  <div class="col-drag-area" ref="scrollableEl">
    <slot></slot>
  </div>
</template>

<style scoped>

.col-drag-area { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 60px; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--border) transparent; transition: background 0.15s; }
.col-drag-area::-webkit-scrollbar { width: 3px; }
.col-drag-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.col-drag-area.drag-over { background: var(--accent-glow); }

</style>