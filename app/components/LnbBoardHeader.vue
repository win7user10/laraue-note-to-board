<script setup lang="ts">
import LnbBoardSearch from "~/components/LnbBoardSearch.vue";
const board = useBoard();
const searchString = computed(() => board.state.value.searchString)
const showSearch = computed(() => searchString.value || board.dbMessagesCount.value > 0 || board.isLoading.value)
</script>

<template>
  <div class="board-header">
    <div>
      <div class="board-title">
        <slot name="title"></slot>
      </div>
      <div class="board-subtitle">
        <slot name="subtitle"></slot>
      </div>
    </div>
    <div class="board-actions">
      <LnbBoardSearch v-if="showSearch"
        @update:modelValue="board.search($event)"
        :modelValue="searchString"/>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
.board-header{
  padding: 10px calc(max(14px, var(--safe-right))) 8px calc(max(14px, var(--safe-left)));
  display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);flex-shrink:0;min-width:0}
.board-title { font-size: 14px; font-weight: 700; }
.board-subtitle { font-size: 11px; color: var(--text3); }
.board-actions { margin-left: auto; display: flex; gap: 6px; }
</style>