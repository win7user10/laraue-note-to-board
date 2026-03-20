<script setup lang="ts">
import LnbBacklogView from "~/components/LnbBacklogView.vue";
import LnbBoardView from "~/components/LnbBoardView.vue";
import { useAppState } from "~/composables/appState";
import LnbCreateCategoryModal from "~/components/LnbCreateCategoryModal.vue";
import {onMounted, ref} from "vue";
import LnbFabItem from "~/components/LnbFabItem.vue";
import {DefaultPagination} from "~/composables/pagination";
import {useBoard} from "~/composables/boardState";

const { appState } = useAppState()
const { setCategory, state } = useBoard()
const categoryId = computed(() => state.value.categoryId);

const { t } = useI18n();
const board = useBoard();

onMounted( async () => {
  await board.reloadBoard()
  await board.reloadCategories()
});

watch(() => state.value.categoryId, () => {
  return board.reloadBoard();
})

const modal = reactive({
  createCard: false,
  editCard: false,
  createCategory: false,
  assign: false,
  delete: false,
  search: false,
});

const openCreateCategory = () => {
  modal.createCategory = true;
}

const closeCreateCategory = () => {
  modal.createCategory = false;
}

const createCategoryInternal = async (value: CreateCategoryRequest) => {
  await board.createCategory(value);
  closeCreateCategory();
  closeFab();
}

const categories = computed(() => board.state.value.categories);

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

</script>

<template>
  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-logo">Msg<span>Board</span></div>
  </div>

  <div class="nav-loader" :class="{active: appState.isLoading}">
    <div class="nav-loader-fill"></div>
  </div>

  <!-- NAV TABS -->
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

  <template v-if="categoryId === 0">
    <LnbBacklogView
      @openAssignToCategory="openAssignToCategory"
      @openEdit="openEditCard"
      @openDelete="openDelete" />
  </template>
  <template v-else>
    <LnbBoardView
      @openEdit="openEditCard"
      @openDelete="openDelete"/>
  </template>

  <LnbCreateCategoryModal
    @create="createCategoryInternal"
    @close="closeCreateCategory"
    v-if="modal.createCategory"/>

  <LnbAssignModal
    :assign-msg="assignMsg"
    :categories="categories"
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
</template>

<style scoped>
/* ── TOP BAR ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: calc(12px + var(--safe-top)) var(--safe-right) 14px var(--safe-left);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}
.topbar-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--accent);
  white-space: nowrap;
}
.topbar-logo span { color: var(--text2); font-weight: 400; margin-left: 10px; }

/* ── NAV TABS ── */
.nav-tabs {
  display: flex;
  gap: 4px;
  padding: 8px calc(max(8px, var(--safe-right))) 8px calc(max(8px, var(--safe-left)));
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  flex-shrink: 0;
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
/* NAV LOADER — slim bar between stats and content */
.nav-loader{height:3px;flex-shrink:0;pointer-events:none;opacity:0;transition:opacity 0.2s;background:var(--border)}
.nav-loader.active{opacity:1}
.nav-loader-fill{height:100%;background:var(--accent);border-radius:0 2px 2px 0;animation:nav-progress 0.5s cubic-bezier(0.4,0,0.2,1) forwards}
@keyframes nav-progress{0%{width:0%}60%{width:75%}100%{width:100%}}


/* FAB */
.fab-wrap{position:fixed;bottom:calc(20px + var(--safe-bottom));right:calc(16px + var(--safe-right));z-index:90;display:flex;flex-direction:column-reverse;align-items:flex-end;gap:10px}
.fab-main{width:52px;height:52px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(47,129,247,0.45);transition:transform 0.2s,background 0.2s;-webkit-tap-highlight-color:transparent;flex-shrink:0;border:none}
.fab-main:hover{background:var(--accent2)}
.fab-main.open{transform:rotate(45deg)}
.fab-main svg{width:22px;height:22px}
.fab-items{display:flex;flex-direction:column-reverse;gap:8px;align-items:flex-end}
.fab-backdrop{position:fixed;inset:0;z-index:89;background:rgba(0,0,0,0);cursor:default}
</style>