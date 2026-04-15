<script setup lang="ts">
  import { EpicSortOrder } from "~/composables/userPreferencesApi";
  import LnbPopup from "~/components/popups/LnbPopup.vue";
  import LnbPopupItem from "~/components/popups/LnbPopupItem.vue";
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
  <LnbPopup align-right @close="emits('close')" :min-width="160">
    <LnbPopupItem :active="sortOrder === EpicSortOrder.LastUpdated" @click="updateSortOrder(EpicSortOrder.LastUpdated)">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="5"/><path d="M8 5.5V8.5l2 1"/></svg>
      {{ t('lastUpdated') }}
    </LnbPopupItem>
    <LnbPopupItem :active="sortOrder === EpicSortOrder.Alphabetical" @click="updateSortOrder(EpicSortOrder.Alphabetical)">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12V4l3 5 3-5v8M13 9h-2"/></svg>
      {{ t('alphabetical') }}
    </LnbPopupItem>
  </LnbPopup>
</template>

<style scoped>
svg{width:13px;height:13px;flex-shrink:0}
</style>