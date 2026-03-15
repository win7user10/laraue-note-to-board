<script setup lang="ts">
  import {useUtils} from "~/composables/utils";

  const props = defineProps<{
    message: MessageListDto,
    assignButton: Boolean
  }>()

  const emits = defineEmits<{
    (e: 'openAssignToCategory', message: MessageListDto): void,
    (e: 'openDelete', message: MessageListDto): void,
    (e: 'openEdit', message: MessageListDto): void,
  }>()

  const { formatDate } = useUtils()
</script>

<template>
  <div class="msg-card"
      :style="`--card-color: ${props.message.color}`"
      :data-card-id="props.message.id"
      @click="emits('openEdit', props.message)">
    <div class="card-header">
      <div class="card-avatar" :style="`background:${props.message.senderColor}22; color:${props.message.senderColor}`">
        {{ props.message.senderInitial }}
      </div>
      <div class="card-sender">{{ props.message.sender }}</div>
      <div class="card-time">{{ formatDate(props.message.time) }}</div>
    </div>
    <div class="card-text">{{ props.message.content }}</div>
    <div class="card-footer">
      <!--<span class="card-tag">PM</span>-->
      <div class="card-actions">
        <div
          v-if="assignButton"
          class="card-action-btn"
          title="Assign to board"
          @click.stop="emits('openAssignToCategory', props.message)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </div>
        <div
          @click.stop="emits('openDelete', props.message)"
          class="card-action-btn danger"
          title="Delete">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"/>
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
    transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .msg-card:active {
    cursor: grab;
  }
  .msg-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--card-color, var(--accent));
    border-radius: 3px 0 0 3px;
  }
  .msg-card.sortable-ghost {
    opacity: 0.2;
    border: 1.5px dashed var(--accent) !important;
    background: var(--surface2) !important;
  }
  .msg-card.sortable-chosen {
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    border-color: var(--accent);
    transform: scale(1.02);
  }

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
  .card-action-btn.danger:hover { background: var(--red-glow); color: var(--red); border-color: var(--red); }
  .card-action-btn svg { width: 11px; height: 11px; }
</style>