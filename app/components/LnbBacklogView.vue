<script setup lang="ts">
  import type {MessageListDto} from "~/composables/messagesApi";
  import LnbEmptyState from "~/components/LnbEmptyState.vue";

  const emits = defineEmits<{
    (e: 'openAssignToCategory', message: MessageListDto): void,
    (e: 'openDelete', message: MessageListDto): void,
    (e: 'openEdit', message: MessageListDto): void,
  }>()

  defineProps<{
    messages: MessageListDto[],
  }>()

  const { t } = useI18n();
</script>

<template>
  <div class="backlog-view">
    <div class="backlog-header">
      <h2>Backlog</h2>
      <span class="badge">{{ messages.length }} {{ t('messages') }}</span>
    </div>

    <LnbEmptyState
      v-if="messages.length === 0"
      :title="t('backlogEmpty')"
      :subtitle="t('backlogEmptySubtitle')"/>

    <div class="section-label" v-else>{{ t('unassignedTitle') }}</div>

    <LnbCard
      v-for="msg in messages"
      :deleteButton="true"
      :message="msg"
      :key="msg.id"
      :assignButton="true"
      @openDelete="emits('openDelete', $event)"
      @openAssignToCategory="emits('openAssignToCategory', $event)"
      @openEdit="emits('openEdit', $event)"
      sender-color="#3fb950"/>
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

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--text3);
}

</style>