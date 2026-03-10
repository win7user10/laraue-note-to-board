<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import type {MessageListDto} from "~/composables/messagesApi";
  const { loadBacklogMessages } = useMessagesApi();

  const messages = ref<MessageListDto[]>([]);
  onMounted(async () => {
    messages.value = await loadBacklogMessages()
  });
</script>

<template>
  <div class="backlog-view">
    <div class="backlog-header">
      <h2>Backlog</h2>
      <span class="badge">{{ messages.length }} messages</span>
    </div>

    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </div>
      <div class="empty-title">Backlog is clear</div>
      <div class="empty-sub">All messages have been assigned to boards</div>
    </div>

    <div class="section-label" v-else>Unassigned · Drag to a board</div>

    <lnb-card
      v-for="msg in messages"
      :key="msg.id"
      :sender="msg.sender"
      drag-card-id="nbv"
      :senderInitial="msg.senderInitial"
      :text="msg.text"
      :time="msg.time"
      sender-color="#3fb950"/>
  </div>
</template>

<style scoped>
/* ── BACKLOG ── */
.backlog-view {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
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