<script setup lang="ts">
  defineProps({
    title: { type: String, required: true },
    applyText: { type: String, required: false },
  })
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'apply'): void
  }>()

  const close = () => {
    emit('close')
  }

  const apply = () => {
    emit('apply')
  }
</script>

<template>
  <transition name="fade">
    <div class="modal-overlay" @click.self="close">
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-title">{{ title }}</div>
        <slot></slot>
        <div class="modal-btns">
          <button class="btn btn-ghost" @click="close">Cancel</button>
          <button
            v-if="applyText"
            class="btn btn-primary"
            @click="apply">
            {{ applyText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.15s;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.modal {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 32px;
  animation: slide-up 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes slide-up { from { transform: translateY(60px); opacity: 0; } to { transform: none; opacity: 1; } }
.modal-handle {
  width: 36px; height: 4px;
  background: var(--border2);
  border-radius: 2px;
  margin: 0 auto 16px;
}
.modal-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text);
}
.modal-btns { display: flex; gap: 8px; }
.btn {
  flex: 1;
  padding: 11px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  font-family: 'Syne', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  letter-spacing: 0.3px;
}
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent2); }
.btn-ghost { background: var(--surface3); color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--border2); }

</style>