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

const backlogMessagesResult = computed<InitialBatchResult<MessageListDto> | undefined>(() => {
  return state.value.messages.length > 0
    ? state.value.messages[0]!.items
    : undefined
})

const statusId = 0;
const { t } = useI18n();
</script>

<template>
  <div class="backlog-view">
    <div class="backlog-header">
      <h2>{{ t('backlog') }}</h2>
      <span class="badge">
        {{ backlogMessagesResult?.totalCount }} {{ t('messages', { count: backlogMessagesResult?.totalCount }) }}
      </span>
    </div>

    <LnbEmptyState
      v-if="backlogMessagesResult?.data.length === 0"
      :title="t('backlogEmpty')"
      :subtitle="t('backlogEmptySubtitle')"/>

    <div class="section-label" v-else>{{ t('unassignedTitle') }}</div>
    <LnbScrollArea :statusId="statusId">
      <LnbCard
          v-for="msg in backlogMessagesResult?.data"
          :deleteButton="true"
          :message="msg"
          :key="msg.id"
          :assignButton="true"
          @openDelete="emits('openDelete', $event)"
          @openAssignToCategory="emits('openAssignToCategory', $event)"
          @openEdit="emits('openEdit', $event)"
          sender-color="#3fb950"/>
    </LnbScrollArea>
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
.backlog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0 8px;
}
.backlog-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}
.badge {
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 11px;
  color: var(--text2);
  font-weight: 600;
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