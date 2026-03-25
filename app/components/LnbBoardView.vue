<script setup lang="ts">
import {ref} from "vue";
import LnbIconBtn from "~/components/LnbIconBtn.vue";
import type {MessageListDto} from "~/composables/messagesApi";
import LnbEditStatusModal from "~/components/LnbEditStatusModal.vue";
import type {EditStatusRequest} from "~/composables/statusesApi";
import LnbEditCategoryModal from "~/components/LnbEditCategoryModal.vue";
import LnbScrollArea from "~/components/LnbScrollArea.vue";

const board = useBoard();
const { t } = useI18n();

const categoryId = computed(() => board.state.value.categoryId);

const emits = defineEmits<{
  (e: 'openDelete', message: MessageListDto): void,
  (e: 'openEdit', message: MessageListDto): void,
}>()

const modal = reactive({
  createStatus: false,
  deleteStatus: false,
  editStatus: false,
  editCategory: false,
  addToBoard: false,
});

const createStatusInternal = async (value: CreateStatusRequest) => {
  await board.createStatus(value);
  modal.createStatus = false;
}

const statusToEdit = ref<StatusDto | null>()
const openDeleteStatus = (status: StatusDto) => {
  modal.deleteStatus = true;
  statusToEdit.value = status;
}

const deleteStatusInternal = async () => {
  await board.deleteStatus(statusToEdit.value!.id)
  modal.deleteStatus = false;
}

const openEditStatus = (status: StatusDto) => {
  modal.editStatus = true;
  statusToEdit.value = status;
}

const editStatusInternal = async (request: EditStatusRequest) => {
  await board.editStatus(statusToEdit.value!.id, request)
  modal.editStatus = false;
}

const openAddToBoard = (status: StatusDto) => {
  modal.addToBoard = true;
  statusToEdit.value = status;
}

const assignToBoard = async (request: CreateCardRequest) => {
  await board.createCard(request)
  modal.addToBoard = false;
}

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

const cardsByStatus = computed(() => {
  return Object.fromEntries(board.state.value.messages.map(x => [x.statusId, x.items]));
})

const onCardMoved = async (cardId: string, categoryId: number, statusId: number) => {
  await board.moveCard(Number(cardId), categoryId, statusId);
};

const onColMoved = async (statusId: string, newSortOrder: number) => {
  await board.changeColumnOrder(Number(statusId), newSortOrder);
};

const currentCategory = computed(() => {
  return board.state.value.currentCategory;
})

const searchString = computed(() => board.state.value.searchString);
</script>

<template>
  <!-- BOARD VIEW -->
  <div class="board-view">

    <LnbBoardHeader>
      <template v-if="currentCategory" #title>
        <span :style="`color:${currentCategory.color}`">●</span>
        {{ currentCategory.name }}
      </template>
      <template #subtitle>
        {{ board.dbMessagesCount }} {{ t('cards', board.dbMessagesCount.value) }}
      </template>
      <template #actions>
        <LnbIconBtn :title="t('editBoard')" @click="openEditCategory">
          <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"></path>
        </LnbIconBtn>
      </template>
    </LnbBoardHeader>

    <div class="board-columns" v-col-sortable="{ cat: currentCategory, onColMoved }">
      <div
        v-for="status in board.statuses.value"
        class="board-col"
        :key="status.id"
        :data-status-id="status.id">
        <div class="col-header">
          <div class="col-drag-handle">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.2"></circle>
              <circle cx="11" cy="4" r="1.2"></circle>
              <circle cx="5" cy="8" r="1.2"></circle>
              <circle cx="11" cy="8" r="1.2"></circle>
              <circle cx="5" cy="12" r="1.2"></circle>
              <circle cx="11" cy="12" r="1.2"></circle>
            </svg>
          </div>
          <div class="col-indicator" :style="`background:${status.color}`"></div>
          <div class="col-title">{{ status.name }}</div>
          <div class="col-count">{{ cardsByStatus[status.id]?.totalCount ?? 0 }}</div>
          <div class="col-del-btn" @click.stop="openEditStatus(status)" style="color:var(--text3)">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"/>
            </svg>
          </div>
          <div @click="openDeleteStatus(status)" class="col-del-btn" v-if="(currentCategory?.statuses.length ?? 0) > 1">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"></path>
            </svg>
          </div>
        </div>
        <LnbScrollArea :statusId="status.id">
          <div class="col-drag-inner" v-sortable="{ catId: board.state.value.categoryId, statusId: status?.id, onCardMoved }">
            <LnbCard
                v-for="msg in cardsByStatus[status.id]?.data"
                @openDelete="emits('openDelete', msg)"
                @openEdit="emits('openEdit', $event)"
                :deleteButton="true"
                :key="msg.id"
                :assignButton="false"
                :highlightText="searchString"
                :message="msg"/>
          </div>
        </LnbScrollArea>
        <div class="col-add-btn" @click="openAddToBoard(status)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M8 3v10M3 8h10"/>
          </svg>
          {{ t('addCard') }}
        </div>
      </div>

      <div class="add-col-btn" @click="modal.createStatus = true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" style="width:14px;height:14px">
          <path d="M8 3v10M3 8h10"/>
        </svg>
        {{ t('addColumn') }}
      </div>
    </div>
  </div>
  <LnbCreateStatusModal
    @create="createStatusInternal"
    @close="modal.createStatus = false"
    v-if="modal.createStatus"/>
  <LnbDeleteColumnModal
    @delete="deleteStatusInternal"
    @close="modal.deleteStatus = false"
    v-if="modal.deleteStatus"/>
  <LnbCreateCardModal
    :statusId="statusToEdit!.id"
    @create="assignToBoard"
    @close="modal.addToBoard = false"
    v-if="modal.addToBoard"/>
  <LnbEditStatusModal
    :status="statusToEdit!"
    @edit="editStatusInternal"
    @close="modal.editStatus = false"
    v-if="modal.editStatus"/>
  <LnbEditCategoryModal
    @close="closeEditCategory"
    @edit="editCategoryInternal"
    v-if="modal.editCategory"/>
</template>

<style scoped>
/* ── BOARD VIEW ── */
.board-view {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
}

.board-columns {
  flex: 1;
  overflow-x: auto; overflow-y: hidden; display: flex; gap: 10px;
  padding: 12px calc(max(12px, var(--safe-right))) 12px calc(max(12px, var(--safe-left)));
  align-items: flex-start; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.board-columns::-webkit-scrollbar { height: 4px; }
.board-columns::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.board-col{width:228px;min-width:228px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);display:flex;flex-direction:column;max-height:100%;flex-shrink:0;transition:box-shadow 0.15s}
.board-col.col-sortable-ghost{opacity:0.3;border:1.5px dashed var(--accent)!important}
.board-col.col-sortable-chosen{box-shadow:0 8px 32px rgba(0,0,0,0.5);border-color:var(--accent)}

.col-header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 7px;
  position: relative;
  cursor: grab;
}
.col-drag-handle{color:var(--text3);display:flex;align-items:center;cursor:grab;flex-shrink:0}
.col-drag-handle svg{width:12px;height:12px}
.col-indicator {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-title{font-size:12px;font-weight:700;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)}
.col-count {
  font-size: 10px;
  background: var(--surface3);
  border-radius: 8px;
  padding: 1px 6px;
  color: var(--text2);
  font-weight: 600;
}
.col-drag-inner{display:flex;flex-direction:column;gap:6px;}
.col-del-btn{width:22px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text3);transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.col-del-btn:hover{background:var(--red-glow);color:var(--red)}
.col-del-btn svg{width:13px;height:13px}

.col-add-btn {
  margin: 6px 8px 8px;
  padding: 7px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text3);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.col-add-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
.col-add-btn svg { width: 12px; height: 12px; }

.add-col-btn{width:220px;min-width:220px;height:50px;border:1.5px dashed var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;font-weight:600;color:var(--text3);cursor:pointer;transition:all 0.2s;flex-shrink:0;align-self:flex-start;-webkit-tap-highlight-color:transparent}
.add-col-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}
</style>