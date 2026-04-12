<script setup lang="ts">
  import { EpicSortOrder } from "~/composables/userPreferencesApi";
  const emits = defineEmits<{
    (e: 'close'): void,
  }>()

  const { t } = useI18n();

  const { updateEpicSortOrder } = useUserPreferencesApi()
  const { appState, updateCategoriesOrdering } = useAppState()
  const sortOrder = computed(() => appState.value.userPreferences!.epicSortOrder);

  const updateSortOrder = async (sortOrder: EpicSortOrder) => {
    updateCategoriesOrdering(sortOrder)
    await updateEpicSortOrder(sortOrder)
  }
</script>

<template>
  <!-- Sort popup -->
  <transition name="fade">
    <div class="nav-sort-popup">
      <div class="nav-sort-item" :class="{active: sortOrder === EpicSortOrder.LastUpdated}" @click="updateSortOrder(EpicSortOrder.LastUpdated)">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="5"/><path d="M8 5.5V8.5l2 1"/></svg>
        {{ t('lastUpdated') }}
      </div>
      <div class="nav-sort-item" :class="{active: sortOrder === EpicSortOrder.Alphabetical}" @click="updateSortOrder(EpicSortOrder.Alphabetical)">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12V4l3 5 3-5v8M13 9h-2"/></svg>
        {{ t('alphabetical') }}
      </div>
      <!-- Active Only
      <div style="height:1px;background:var(--border);margin:4px 0"></div>
      <div class="nav-sort-item" :class="{active: activeOnly}" @click="updateActiveOnly(!activeOnly)">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h10M5 8h6M7 11h2"/></svg>
        <span :style="activeOnly ? 'color:var(--green)':''" >{{ activeOnly ? '✓ Active only' : 'Active boards only' }}</span>
      </div>-->
    </div>
  </transition>
  <div style="position:fixed;inset:0;z-index:89" @click="emits('close')"></div>
</template>

<style scoped>
.nav-sort-popup{position:fixed;top:calc(86px + var(--safe-top));right:calc(8px + var(--safe-right));background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:5px;min-width:160px;box-shadow:0 6px 24px rgba(0,0,0,0.5);z-index:91;animation:slide-up 0.15s cubic-bezier(0.34,1.3,0.64,1)}
.nav-sort-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;color:var(--text2);transition:background 0.12s;-webkit-tap-highlight-color:transparent}
.nav-sort-item:hover{background:var(--surface3)}
.nav-sort-item.active{color:var(--accent);background:var(--accent-glow)}
.nav-sort-item svg{width:13px;height:13px;flex-shrink:0}
</style>