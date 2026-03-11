<script setup lang="ts">
  import type {MessageListDto} from "~/composables/messagesApi";

  defineProps<{
    assignMsg?: MessageListDto,
    categories: CategoryCountDto[]
  }>()
  const emits = defineEmits<{
    (e: 'close'): void,
    (e: 'assignToCategory', categoryId: number): void,
  }>()
</script>

<template>
  <LnbModal
    @close="$emit('close')"
    title="Assign to Board">
    <div v-if="assignMsg" style="margin-bottom:12px">
      <div style="font-size:11px;color:var(--text3);margin-bottom:4px">
        {{ assignMsg.sender }} · {{ assignMsg.sender }}
      </div>
      <div style="font-size:13px;color:var(--text2);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        {{ assignMsg.text }}
      </div>
    </div>
    <div class="assign-options">
      <div
          v-for="cat in categories"
          :key="cat.id"
          class="assign-opt"
          @click="emits('assignToCategory', cat.id)">
        <LnbCardAvatar :color="cat.color">
          {{ cat.name[0] }}
        </LnbCardAvatar>
        <div class="assign-opt-info">
          <div class="assign-opt-name">{{ cat.name }}</div>
          <div class="assign-opt-count">{{ cat.statusesCount }} columns · {{ cat.count }} cards</div>
        </div>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" style="width:14px;height:14px;color:var(--text3)">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </div>
      <div v-if="categories.length === 0" style="text-align:center;padding:20px;font-size:12px;color:var(--text3)">
        No boards yet. Create a category first.
      </div>
    </div>
  </LnbModal>
</template>

<style scoped>
/* ── ASSIGN MODAL ── */
.assign-options { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.assign-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--surface3);
}
.assign-opt:hover { border-color: var(--accent); background: var(--accent-glow); }
.assign-opt.selected { border-color: var(--accent); background: var(--accent-glow); }
.assign-opt-info { flex: 1; }
.assign-opt-name { font-size: 13px; font-weight: 600; color: var(--text); }
.assign-opt-count { font-size: 11px; color: var(--text3); }
.assign-check { color: var(--accent); }
.assign-check svg { width: 14px; height: 14px; }
</style>