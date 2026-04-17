<script setup lang="ts">
import LnbBacklogView from "~/components/LnbBacklogView.vue";
import LnbBoardView from "~/components/LnbBoardView.vue";
import LnbCreateCategoryModal from "~/components/modals/LnbCreateCategoryModal.vue";
import {onMounted, ref} from "vue";
import LnbFabItem from "~/components/LnbFabItem.vue";
import {useBoard} from "~/composables/boardState";
import LnbNavLoader from "~/components/LnbNavLoader.vue";
import LnbEditCardModal from "~/components/modals/LnbEditCardModal.vue";
import LnbSearchModal from "~/components/modals/LnbSearchModal.vue";
import LnbMoveCardModal from "~/components/modals/LnbMoveCardModal.vue";
import LnbCreateCardModal from "~/components/modals/LnbCreateCardModal.vue";
import LnbDeleteCardModal from "~/components/modals/LnbDeleteCardModal.vue";
import LnbSpacePopup from "~/components/popups/LnbSpacePopup.vue";
import LnbNavSortPopup from "~/components/popups/LnbNavSortPopup.vue";

const { setCategory, state } = useBoard()
const categoryId = computed(() => state.value.categoryId);

const { t } = useI18n();
const board = useBoard();

onMounted(() => {
  return Promise.all([
    board.reloadBoard(true),
    board.reloadCategories()
  ]);
});

watch(() => state.value.categoryId, () => {
  return Promise.all([
    board.reloadBoard(true),
    board.reloadCategory()
  ]);
})

onMounted(async () => {
  return Promise.all([
    board.reloadCategory(),
    board.reloadSpaces(),
  ]);
})

const modal = reactive({
  createCard: false,
  editCard: false,
  createCategory: false,
  assign: false,
  delete: false,
  search: false,
});

const navSortPopupOpen = ref(false);
const spacePopupOpen = ref(false);

const openCreateCategory = () => {
  modal.createCategory = true;
}

const closeCreateCategory = () => {
  modal.createCategory = false;
}

const createCategoryInternal = async (value: CreateCategoryRequest) => {
  const id = await board.createCategory(value);
  closeCreateCategory();
  closeFab();
  setCategory(id);
}

const categories = board.categories;

const openCreateCard = () => {
  modal.createCard = true;
}

const closeCreateCard = () => {
  modal.createCard = false;
}

const createCardInternal = async (value: CreateCardRequest) => {
  await board.createCard(value);
  closeCreateCard();
  closeFab();
}

const openEditCard = (message: MessageListDto) => {
  assignMsg.value = message;
  modal.editCard = true;
}

const closeEditCard = () => {
  modal.editCard = false;
}

const editCardInternal = async (value: EditCardRequest) => {
  await board.editCard(assignMsg.value!.id, value);
  closeEditCard();
}

const assignMsg = ref<MessageListDto | undefined>(undefined);
const openAssignToCategory = (message: MessageListDto) => {
  assignMsg.value = message;
  modal.assign = true;
}

const closeAssignToCategory = () => {
  modal.assign = false;
}

const assignToCategory = async (categoryId: number) => {
  await board.updateCardCategory(assignMsg.value!.id, categoryId)
  modal.assign = false;
}

const openDelete = (message: MessageListDto) => {
  assignMsg.value = message;
  modal.delete = true;
}

const closeDelete = () => {
  modal.delete = false;
}

const deleteCard = async () => {
  await board.deleteCard(assignMsg.value!.id)
  closeDelete();
}

const openSearch = () => {
  modal.search = true;
}

const closeSearch = () => {
  modal.search = false;
}

const closeFab = () => {
  fabOpen.value = false;
}

const fabOpen = ref(false);
const currentSpace = board.currentSpace;

</script>

<template>
  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-logo">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#2f81f7"/>
        <text x="18" y="24" font-size="14" font-weight="800" fill="white" text-anchor="middle" font-family="Inter,sans-serif" letter-spacing="-0.5">LB</text>
      </svg>
    </div>

    <!-- Space switcher — only visible when spaces exist -->
    <div class="space-switcher-wrap">
      <div class="space-switcher" @click.stop="spacePopupOpen =! spacePopupOpen">
        <div class="space-switcher-dot" :style="`background:${currentSpace?.color||'var(--text3)'}`"></div>
        <div class="space-switcher-name">{{currentSpace?.name}}</div>
        <div class="space-switcher-chevron"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3.5l3 3 3-3"/></svg></div>
      </div>

      <LnbSpacePopup
        v-if="spacePopupOpen"
        @close="spacePopupOpen = false"/>
    </div>
  </div>

  <LnbNavLoader />

  <!-- NAV TABS -->
  <div class="nav-tabs-wrap">
    <div class="nav-tabs">
      <div
          v-for="cat in categories"
          class="nav-tab"
          :class="{active: categoryId === cat.id}"
          :style="categoryId === cat.id ? `--dot-color:${cat.color}` : ''"
          @click="setCategory(cat.id)">
        <span class="dot" :style="`background:${cat.color}`"></span>
        {{ cat.name }}
        <span class="nav-tab-count">{{ cat.count }}</span>
      </div>
      <div class="nav-tab-add" title="Add category" @click="openCreateCategory">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v10M3 8h10"/>
        </svg>
      </div>
    </div>

    <!-- Board nav controls: search + sort — pinned to right edge -->
    <div class="nav-tabs-controls">
      <!-- Sort -->
      <div class="nav-ctrl-btn" @click.stop="navSortPopupOpen = !navSortPopupOpen">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h10M5 8h6M7 11h2"/></svg>
      </div>
      <LnbNavSortPopup
        v-if="navSortPopupOpen"
        @close="navSortPopupOpen = false"/>
    </div>
  </div>

  <template v-if="categoryId === 0">
    <LnbBacklogView
      @openAssignToCategory="openAssignToCategory"
      @openEdit="openEditCard"
      @openDelete="openDelete" />
  </template>
  <template v-else>
    <LnbBoardView
      @openAssignToCategory="openAssignToCategory"
      @openEdit="openEditCard"
      @openDelete="openDelete"/>
  </template>

  <LnbCreateCategoryModal
    @create="createCategoryInternal"
    @close="closeCreateCategory"
    v-if="modal.createCategory"/>

  <LnbMoveCardModal
    :assign-msg="assignMsg"
    @close="closeAssignToCategory"
    @assignToCategory="assignToCategory"
    v-if="modal.assign" />

  <LnbDeleteCardModal
    @close="closeDelete"
    @delete="deleteCard"
    v-if="modal.delete"/>

  <LnbCreateCardModal
    :statusId="0"
    @close="closeCreateCard"
    @create="createCardInternal"
    v-if="modal.createCard"/>

  <LnbSearchModal
    @openCard="openEditCard($event)"
    @close="closeSearch"
    v-if="modal.search"/>

  <LnbEditCardModal
    :id="assignMsg!.id"
    @edit="editCardInternal"
    @close="closeEditCard"
    v-if="modal.editCard"/>

  <LnbMediaViewer
    v-if="board.state.value.openedMedia.length > 0" />

  <!-- FAB backdrop -->
  <div class="fab-backdrop" v-if="fabOpen" @click="fabOpen=false"></div>

  <!-- FAB speed-dial -->
  <div class="fab-wrap">
    <div class="fab-main" :class="{open: fabOpen}" @click="fabOpen=!fabOpen">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v10M3 8h10"/></svg>
    </div>
    <div class="fab-items" v-if="fabOpen">
      <LnbFabItem :title="t('newBoard')" @click="openCreateCategory">
        <rect x="2" y="2" width="12" height="12" rx="2"/>
        <path d="M8 5v6M5 8h6"/>
      </LnbFabItem>
      <LnbFabItem :title="t('search')" @click="openSearch">
        <circle cx="6.5" cy="6.5" r="4.5"/>
        <path d="M10.5 10.5l3 3"/>
      </LnbFabItem>
      <LnbFabItem :title="t('createCard')" @click="openCreateCard">
        <path d="M8 5v6M5 8h6"/>
      </LnbFabItem>
    </div>
  </div>

  <LnbToastStack />
  <LnbUserAvatar />
</template>

<style scoped>
/* ── TOP BAR ── */
.topbar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: calc(10px + var(--safe-top)) calc(14px + var(--safe-right)) 10px calc(14px + var(--safe-left));
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 10;
  justify-content: center;
}
.topbar-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.topbar-logo span { color: var(--text2); font-weight: 400; margin-left: 10px; }

/* ── NAV TABS ── */
.nav-tabs-wrap{display:flex;align-items:center;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}
.nav-tabs {
  display: flex;
  gap: 4px;
  padding: 8px calc(max(8px, var(--safe-right))) 8px calc(max(8px, var(--safe-left)));
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
}
.nav-tabs::-webkit-scrollbar { display: none; }
.nav-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 20px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  color: var(--text2);
  background: transparent;
  transition: all 0.15s;
  letter-spacing: 0.2px;
}
.nav-tab:hover { background: var(--surface3); color: var(--text); }
.nav-tab.active {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
}
.nav-tab .dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}
.nav-tab-count {
  background: var(--surface3);
  border-radius: 10px;
  padding: 0 5px;
  font-size: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 16px;
  height: 16px;
}
.nav-tab.active .nav-tab-count { background: var(--accent); color: #fff; }
.nav-tab-add {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px dashed var(--border2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text3);
  flex-shrink: 0;
  align-self: center;
  transition: all 0.15s;
}
.nav-tab-add:hover { border-color: var(--accent); color: var(--accent); }
.nav-tab-add svg { width: 16px; height: 16px; }

/* FAB */
.fab-wrap{position:fixed;bottom:calc(20px + var(--safe-bottom));right:calc(16px + var(--safe-right));z-index:90;display:flex;flex-direction:column-reverse;align-items:flex-end;gap:10px}
.fab-main{width:52px;height:52px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(47,129,247,0.45);transition:transform 0.2s,background 0.2s;-webkit-tap-highlight-color:transparent;flex-shrink:0;border:none}
.fab-main:hover{background:var(--accent2)}
.fab-main.open{transform:rotate(45deg)}
.fab-main svg{width:22px;height:22px}
.fab-items{display:flex;flex-direction:column-reverse;gap:8px;align-items:flex-end}
.fab-backdrop{position:fixed;inset:0;z-index:89;background:rgba(0,0,0,0);cursor:default}

/* BOARD LIST CONTROLS */
.nav-tabs-controls{display:flex;align-items:center;gap:4px;margin-left:auto;flex-shrink:0; padding: 0 10px;border-left:1px solid var(--border);position: relative;}
.nav-ctrl-btn{width:26px;height:26px;border-radius:var(--radius-sm);border:1px solid transparent;background:transparent;color:var(--text3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.nav-ctrl-btn:hover,.nav-ctrl-btn.active{background:var(--surface3);border-color:var(--border);color:var(--text)}
.nav-ctrl-btn svg{width:13px;height:13px}

/* SPACE SWITCHER */
.space-switcher{display:flex;align-items:center;gap:5px;padding:8px;border-radius:10px;border:1px solid var(--border);background:var(--surface3);cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;max-width: 200px;}
.space-switcher:hover{border-color:var(--border2);background:var(--surface2)}
.space-switcher-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.space-switcher-name{font-size:11px;font-weight:700;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.space-switcher-chevron{color:var(--text3);flex-shrink:0}
.space-switcher-chevron svg{width:10px;height:10px}
.space-switcher-wrap{position:relative;display:flex;flex-direction:column;gap:1px}
</style>