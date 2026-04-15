<script setup lang="ts">
import LnbPopup from "~/components/popups/LnbPopup.vue";
import LnbPopupItem from "~/components/popups/LnbPopupItem.vue";
import LnbPopupItemDivider from "~/components/popups/LnbPopupItemDivider.vue";
import LnbCreateSpaceModal from "~/components/modals/LnbCreateSpaceModal.vue";

const emits = defineEmits<{
  (e: 'close'): void,
}>()

const { t } = useI18n()

const { currentSpace, spaces, createSpace, reloadBoard, reloadCategories, setCategory } = useBoard()
const { updateSpaceId } = useAppState()
const { updateSpace } = useUserPreferencesApi()
const openSpaceModal = ref(false)

const setSpaceInternal = async (id: number) => {
  // change state
  updateSpaceId(id)
  setCategory(0)

  // reload data
  await reloadCategories()
  await reloadBoard(true)

  // update preferences
  await updateSpace(id)
  emits('close')
}

const createSpaceInternal = async (request: CreateSpaceRequest) => {
  await createSpace(request);
  openSpaceModal.value = false;
}

</script>

<template>
  <!-- Space popup -->
  <LnbPopup @close="emits('close')" :min-width="200">

    <!-- Spaces -->
    <LnbPopupItem
      v-for="s in spaces"
      :active="currentSpace?.id === s.id"
      :key="s.id"
      @click="setSpaceInternal(s.id)">
      <div class="space-switcher-dot" :style="`background:${s.color}`"></div>
      <div class="space-popup-item-name">{{s.name}}</div>
      <div class="space-popup-item-count">{{ s.epicsCount }} {{ t('boards', s.epicsCount) }}</div>
      <svg v-if="currentSpace?.id === s.id" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;color:var(--accent)"><path d="M2 7l3.5 3.5L12 3"/></svg>
    </LnbPopupItem>

    <LnbPopupItemDivider />

    <LnbPopupItem @click="openSpaceModal = true" class="space-popup-add">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v10M3 8h10"/></svg>
      {{ t('newSpace') }}
    </LnbPopupItem>
  </LnbPopup>
  <LnbCreateSpaceModal
    v-if="openSpaceModal"
    @create="createSpaceInternal"
    @close="openSpaceModal = false"/>
</template>

<style scoped>
.space-popup-add{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:var(--accent);transition:background 0.12s;-webkit-tap-highlight-color:transparent}
.space-popup-add:hover{background:var(--accent-glow)}
.space-popup-add svg{width:13px;height:13px}
.space-switcher-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.space-popup-item-name{font-size:12px;font-weight:600;color:var(--text);flex:1}
.space-popup-item-count{font-size:10px;color:var(--text3)}
</style>