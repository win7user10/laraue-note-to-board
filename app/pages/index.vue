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
import LnbEmptyState from "~/components/LnbEmptyState.vue";
import LnbIconBtn from "~/components/icons/LnbIconBtn.vue";
import LnbDeleteCategoryModal from "~/components/modals/LnbDeleteCategoryModal.vue";
import LnbEditCategoryModal from "~/components/modals/LnbEditCategoryModal.vue";

const { setCategory, state, anySpaceAvailable } = useBoard()
const { getSpace } = useSpacesApi()
const isBacklog = computed(() => state.value.categories.find(c => state.value.categoryId == c.id)?.isDefault);
const categoryId = computed(() => state.value.categoryId);
const currentCategory = computed(() => state.value.currentCategory);
const defaultStatus = computed(() => currentCategory.value?.statuses[0]);

const { t } = useI18n();
const board = useBoard();

onMounted(async () => {
  await board.reloadSpaces();
  await board.reloadCategories();
  await board.reloadBoard(true);
});

watch(() => state.value.categoryId, async () => {
  await board.reloadCategory();
  await board.reloadBoard(true);
})

const spaceAdditionalData = ref<SpaceDto | null>(null)
const loadSpaceData = async () => {
  if (!board.currentSpace.value)
    spaceAdditionalData.value = null;
  else
    spaceAdditionalData.value = await getSpace(board.currentSpace.value.id)
}

watch(() => board.currentSpace.value, (value) => loadSpaceData(), {  immediate: true })

const epicTabsAvailable = computed(() => {
  return categories.value.length > 0 || spaceAdditionalData.value?.canCreateEpics
})

const modal = reactive({
  createCard: false,
  editCard: false,
  createCategory: false,
  assign: false,
  delete: false,
  search: false,
  editCategory: false,
  deleteCategory: false,
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
  await board.moveCard(assignMsg.value!.id, board.currentSpace.value!.id, categoryId)
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



const openEditCategory = () => {
  modal.editCategory = true;
}

const closeEditCategory = () => {
  modal.editCategory = false;
}

const editCategoryInternal = async (request: EditCategoryRequest) => {
  await board.editCategory(request);
  closeEditCategory();
}

const openDeleteCategory = () => {
  modal.deleteCategory = true;
}

const closeDeleteCategory = () => {
  modal.deleteCategory = false;
}

const deleteCategoryInternal = async () => {
  await board.deleteCategory();
  closeDeleteCategory();
}

</script>

<template>
  <!-- TOP BAR -->
  <div class="topbar">
    <LnbUserAvatar />

    <!-- Space switcher — only visible when spaces exist -->
    <div class="space-switcher-wrap" v-if="anySpaceAvailable">
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
  <div class="nav-tabs-wrap" v-if="epicTabsAvailable">
    <div class="nav-tabs">
      <div
          v-for="cat in categories"
          class="nav-tab"
          :class="{active: categoryId === cat.id}"
          :style="categoryId === cat.id ? `--dot-color:${cat.color}` : ''"
          @click="setCategory(cat.id)">
        <span class="dot" :style="`background:${cat.color}`"></span>
        {{ cat.name }}
        <span class="nav-tab-count">{{ cat.issuesCount }}</span>
      </div>
      <div v-if="spaceAdditionalData?.canCreateEpics" class="nav-tab-add" :title="t('addEpic')" @click="openCreateCategory">
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

  <template v-if="state.categories.length > 0 && state.currentCategory?.canViewIssues">

    <LnbBoardHeader>
      <template v-if="currentCategory" #title>
        <span :style="`color:${currentCategory.color}`">●</span>
        {{ currentCategory.name }}
      </template>
      <template #subtitle>
        {{ board.dbMessagesCount }} {{ t('cards', board.dbMessagesCount.value) }}
      </template>
      <template #actions>
        <LnbIconBtn
            v-if="currentCategory?.canUpdate"
            :title="t('editBoard')"
            btnSize="medium"
            iconSize="medium"
            icon="edit"
            @click="openEditCategory" />
        <LnbIconBtn
            v-if="currentCategory?.canDelete"
            type="danger"
            btnSize="medium"
            iconSize="medium"
            :title="t('deleteBoard')"
            icon="delete"
            @click="openDeleteCategory" />
      </template>
    </LnbBoardHeader>

    <template v-if="isBacklog">
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
  </template>

  <template v-if="!anySpaceAvailable">
    <LnbEmptyState
      title="No spaces are available"
      subtitle="Please contact organization administrator and ask for permissions"/>
  </template>

  <template v-if="anySpaceAvailable && !epicTabsAvailable">
    <LnbEmptyState
        title="No epics are available in Space"
        subtitle="Please contact organization administrator and ask for permissions"/>
  </template>

  <template v-if="anySpaceAvailable && epicTabsAvailable && !state.currentCategory?.canViewIssues">
    <LnbEmptyState
        title="Issues are not available for view"
        subtitle="Please contact organization administrator and ask for permissions"/>
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
    :statusId="defaultStatus!.id"
    @close="closeCreateCard"
    @create="createCardInternal"
    v-if="modal.createCard"/>

  <LnbSearchModal
    @openCard="openEditCard($event)"
    @close="closeSearch"
    v-if="modal.search"/>

  <LnbEditCardModal
    :id="assignMsg!.id"
    :hide-status="(currentCategory?.statuses?.length ?? 0) < 2"
    @edit="editCardInternal"
    @close="closeEditCard"
    v-if="modal.editCard"/>

  <LnbEditCategoryModal
    @close="closeEditCategory"
    @edit="editCategoryInternal"
    v-if="modal.editCategory"/>
  <LnbDeleteCategoryModal
    @close="closeDeleteCategory"
    @delete="deleteCategoryInternal"
    v-if="modal.deleteCategory"/>

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
      <LnbFabItem v-if="spaceAdditionalData?.canCreateEpics" :title="t('newCategoryBoard')" @click="openCreateCategory">
        <rect x="2" y="2" width="12" height="12" rx="2"/>
        <path d="M8 5v6M5 8h6"/>
      </LnbFabItem>
      <LnbFabItem :title="t('search')" @click="openSearch">
        <circle cx="6.5" cy="6.5" r="4.5"/>
        <path d="M10.5 10.5l3 3"/>
      </LnbFabItem>
      <LnbFabItem v-if="currentCategory?.canCreateIssues" :title="t('createCard')" @click="openCreateCard">
        <path d="M8 5v6M5 8h6"/>
      </LnbFabItem>
    </div>
  </div>

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