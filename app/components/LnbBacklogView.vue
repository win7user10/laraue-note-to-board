<script setup lang="ts">
import type {MessageListDto} from "~/composables/messagesApi";
import LnbEmptyState from "~/components/LnbEmptyState.vue";
import LnbScrollArea from "~/components/LnbScrollArea.vue";
import {useBoard} from "~/composables/boardState";

const emits = defineEmits<{
  (e: 'openAssignToCategory', message: MessageListDto): void,
  (e: 'openDelete', message: MessageListDto): void,
  (e: 'openEdit', message: MessageListDto): void,
}>()

const { state } = useBoard()

const backlogMessagesResult = computed(() => {
  return state.value.messages.length > 0
    ? state.value.messages[0]!.items
    : undefined
})

const searchString = computed(() => state.value.searchString)

const statusId = 0;
const { t } = useI18n();
</script>

<template>
  <div class="backlog-view">

    <template v-if="backlogMessagesResult?.data.length === 0">
      <template v-if="state.epics.length > 0 && !state.searchString">
        <LnbBoardSummaryGrid />
      </template>
      <template v-else>
        <LnbEmptyState
            v-if="backlogMessagesResult?.data.length === 0"
            :title="t('backlogEmpty')"
            :subtitle="t('backlogEmptySubtitle')"/>
      </template>
    </template>
    <template v-else>
      <div class="section-label">{{ t('unassignedTitle') }}</div>
      <LnbScrollArea :statusId="statusId">
        <LnbCard
            v-for="msg in backlogMessagesResult?.data"
            :deleteButton="!!state.currentEpic?.canDeleteIssues"
            :message="msg as any"
            :key="msg.id"
            :assignButton="!!state.currentEpic?.canUpdateIssues"
            :highlightText="searchString"
            @openDelete="emits('openDelete', $event)"
            @openAssignToCategory="emits('openAssignToCategory', $event)"
            @openEdit="emits('openEdit', $event)"
            sender-color="#3fb950"/>
      </LnbScrollArea>
    </template>
  </div>
</template>

<style scoped>
/* ── BACKLOG ── */
.backlog-view {
  flex: 1;
  overflow-y: auto;
  padding: 12px calc(max(12px, var(--safe-right))) 12px calc(max(12px, var(--safe-left)));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.backlog-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}
.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text3);
  text-transform: uppercase;
  padding: 6px 2px 4px;
}

/* ── SCROLLBAR ── */
.backlog-view { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.backlog-view::-webkit-scrollbar { width: 4px; }
.backlog-view::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

</style>