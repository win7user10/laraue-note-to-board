<script setup lang="ts">
  import LnbNavLoader from "~/components/LnbNavLoader.vue";

  const props = defineProps({
    title: { type: String, required: true },
    applyText: { type: String, required: false },
    fullHeight: { type: Boolean, required: false },
    determineScroll: { type: Boolean, required: false },
  })
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'apply'): Promise<void>,
    (e: 'scroll'): void,
  }>()

  const { t } = useI18n();
  const { addLoadingKey, removeLoadingKey, appState } = useAppState();

  const close = () => {
    emit('close')
  }

  const apply = async () => {
    const key = 'modalApply'
    addLoadingKey(key)
    try {
      await emit('apply')
    } finally {
      removeLoadingKey(key)
    }
  }

  const scrollableEl = ref<HTMLElement | null>(null);
  onMounted(() => {
    if (props.determineScroll)
      useInfiniteScroll(scrollableEl, async () => {
        emit('scroll')
      }, {
        distance: 150,
        canLoadMore: () => true,
      });
  })

  const isLoading = computed(() => appState.value.isLoading)
</script>

<template>
  <transition name="fade">
    <div class="modal-overlay" @click.self="close">
      <div class="modal" :class="{ 'modal-full': fullHeight }">
        <div class="modal-head">
          <div class="modal-handle"></div>
          <div class="modal-title">{{ title }}</div>
        </div>
        <div class="modal-body" ref="scrollableEl">
          <slot></slot>
          <div class="modal-btns">
            <button
                :class="{
                  disabled: isLoading,
                }"
                class="btn btn-ghost"
                @click="close">
              {{ t('cancel') }}
            </button>
            <button
                :class="{
                  disabled: isLoading,
                }"
                :disabled="isLoading"
                v-if="applyText"
                class="btn btn-primary"
                @click="apply">
              {{ applyText }}
            </button>
          </div>
          <div class="modal-loader" v-if="isLoading">
            <LnbNavLoader />
          </div>
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
  animation: slide-up 0.22s cubic-bezier(0.34,1.4,0.64,1);
  display: flex;
  flex-direction: column;
  max-height: 88dvh;
}
.modal.modal-full{
  height:92vh
}
@keyframes slide-up { from { transform: translateY(60px); opacity: 0; } to { transform: none; opacity: 1; } }
.modal-head {
  padding: 14px calc(max(16px, var(--safe-right))) 0 calc(max(16px, var(--safe-left)));
  flex-shrink: 0;
}
.modal-body {
  overflow-y: auto;
  padding: 0 calc(max(16px, var(--safe-right))) calc(max(20px, var(--safe-bottom))) calc(max(16px, var(--safe-left)));
  flex: 1;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.modal-handle {
  width: 36px; height: 4px;
  background: var(--border2);
  border-radius: 2px;
  margin: 0 auto 16px;
}
.modal-title { font-size: 16px; font-weight: 700; margin-bottom: 14px; color: var(--text); }
.modal-btns { display: flex; gap: 8px; }
.modal-loader { padding-top: 5px }
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
.btn-primary.disabled { background: var(--surface2); cursor: not-allowed; color: var(--text2); }
.btn-ghost { background: var(--surface3); color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--border2); }
.btn-ghost.disabled, .btn-ghost.disabled:hover { background: var(--surface2); cursor: not-allowed; border: none; color: var(--text2); }

</style>