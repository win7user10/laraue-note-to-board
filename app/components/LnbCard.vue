<script setup lang="ts">
  const props = defineProps({
    senderColor: String,
    senderInitial: String,
    sender: String,
    time: String,
    text: String,
    chat: String,
    id: { type: Number, required: true },
  })

  const { appState, setDragStateCardId } = useAppState();

  const onDragStart = (e: DragEvent) => {
    setDragStateCardId(props.id);
    (e.dataTransfer as any).effectAllowed = 'move';
  };
</script>

<template>
  <div class="msg-card"
     :style="`--card-color: ${senderColor}`"
     :class="{dragging: appState.dragState.cardId === id}"
     draggable="true"
     @dragstart="onDragStart($event)">
    <div class="card-header">
      <div class="card-avatar" :style="`background:${senderColor}22; color:${senderColor}`">
        {{ senderInitial }}
      </div>
      <div class="card-sender">{{ sender }}</div>
      <div class="card-time">{{ time }}</div>
    </div>
    <div class="card-text">{{ text }}</div>
    <div class="card-footer">
      <span class="card-tag">{{ chat }}</span>
      <div class="card-actions">
        <div class="card-action-btn" title="Assign to board">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* ── MESSAGE CARD ── */
  .msg-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 13px;
    cursor: grab;
    transition: all 0.15s;
    position: relative;
    user-select: none;
  }
  .msg-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--card-color, var(--accent));
    border-radius: 3px 0 0 3px;
  }
  .msg-card:hover {
    border-color: var(--border2);
    transform: translateY(-1px);
    box-shadow: var(--card-shadow);
  }
  .msg-card.dragging { opacity: 0.4; transform: scale(0.97); }
  .msg-card.drag-over { border-color: var(--accent); background: var(--accent-glow); }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .card-avatar {
    width: 26px; height: 26px;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: var(--surface3);
    color: var(--text);
  }
  .card-sender { font-size: 12px; font-weight: 700; color: var(--text); flex: 1; }
  .card-time { font-size: 10px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
  .card-text {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.45;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .card-tag {
    background: var(--surface3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    color: var(--text2);
    font-weight: 600;
  }
  .card-actions {
    margin-left: auto;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .msg-card:hover .card-actions { opacity: 1; }
  .card-action-btn {
    width: 22px; height: 22px;
    border-radius: 4px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text3);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }
  .card-action-btn:hover { background: var(--surface3); color: var(--text); border-color: var(--border2); }
  .card-action-btn svg { width: 11px; height: 11px; }
</style>