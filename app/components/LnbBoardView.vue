<script setup lang="ts">
import { useAppState } from "~/composables/appState";
import {ref} from "vue";
import LnbIconBtn from "~/components/LnbIconBtn.vue";
import {useCategoriesApi} from "~/composables/categoriesApi";
import type {MessageListDto} from "~/composables/messagesApi";
import LnbEditStatusModal from "~/components/LnbEditStatusModal.vue";
import type {EditStatusRequest} from "~/composables/statusesApi";
import LnbEditCategoryModal from "~/components/LnbEditCategoryModal.vue";

const { appState } = useAppState()
const { updateStatus, createMessage } = useMessagesApi();
const { loadCategory, reorderStatuses, editCategory } = useCategoriesApi();

const categoryId = computed(() => appState.value.categoryId);
const currentCategory = ref<CategoryDto>()

const props = defineProps<{
  messages: MessageListDto[],
}>()

const emits = defineEmits<{
  (e: 'openDelete', message: MessageListDto): void,
  (e: 'openEdit', message: MessageListDto): void,
  (e: 'reloadMessages'): void,
  (e: 'categoryUpdated', category: CategoryDto): void,
}>()

watch(() => categoryId.value, async _ => {
  await reloadCategory();
})

onMounted(async () => {
  await reloadCategory();
})

const reloadCategory = async () => {
  currentCategory.value = undefined;
  currentCategory.value = await loadCategory(categoryId.value!)
}

const modal = reactive({
  createStatus: false,
  deleteStatus: false,
  editStatus: false,
  editCategory: false,
  addToBoard: false,
});

const { createStatus, deleteStatus, editStatus } = useStatusesApi();
const openCreateStatus = () => {
  modal.createStatus = true;
}

const closeCreateStatus = () => {
  modal.createStatus = false;
}

const createStatusInternal = async (value: CreateStatusRequest) => {
  const id = await createStatus(value);
  const statuses = currentCategory.value?.statuses;
  if (!statuses)
    return;

  const lastOrder = Math.max(...statuses.map(x => x.sortOrder))
  currentCategory.value?.statuses.push({
    id: id,
    name: value.name,
    color: value.color,
    sortOrder: lastOrder + 1
  })
  closeCreateStatus();
}

const statusToEdit = ref<StatusDto | null>()
const openDeleteStatus = (status: StatusDto) => {
  modal.deleteStatus = true;
  statusToEdit.value = status;
}

const closeDeleteStatus = () => {
  modal.deleteStatus = false;
}

const deleteStatusInternal = async () => {
  await deleteStatus(statusToEdit.value!.id);
  await reloadCategory();
  emits('reloadMessages')
  closeDeleteStatus();
}

const openEditStatus = (status: StatusDto) => {
  modal.editStatus = true;
  statusToEdit.value = status;
}

const closeEditStatus = () => {
  modal.editStatus = false;
}

const editStatusInternal = async (request: EditStatusRequest) => {
  const status = statusToEdit.value!;
  await editStatus(status.id, request);
  status.color = request.color;
  status.name = request.name;
  closeEditStatus();
}

const openAddToBoard = (status: StatusDto) => {
  modal.addToBoard = true;
  statusToEdit.value = status;
}

const closeAddToBoard = () => {
  modal.addToBoard = false;
}

const assignToBoard = async (request: CreateCardRequest) => {
  await createMessage(request);
  emits('reloadMessages');
  closeAddToBoard();
}

const openEditCategory = () => {
  modal.editCategory = true;
}

const closeEditCategory = () => {
  modal.editCategory = false;
}

const editCategoryInternal = async (request: EditCategoryRequest) => {
  const category = currentCategory.value!;
  await editCategory(appState.value.categoryId, request)
  category.color = request.color;
  category.name = request.name;
  emits('categoryUpdated', category)
  closeEditCategory();
}

const cardsByStatus = computed(() => {
  return Object.groupBy(props.messages, item => item.statusId);
})

const statuses = computed(() => {
  return currentCategory.value?.statuses.sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
})

const onCardMoved = async (cardId: string, categoryId: number, statusId: number) => {
  const card = props.messages.find(m => m.id === Number(cardId));
  if (!card) return;

  await updateStatus(card.id, statusId);
  card.categoryId = categoryId!;
  card.statusId = statusId;
};

const onColMoved = async (statusId: number, newSortOrder: number) => {
  const cat = currentCategory.value;
  if (!cat) return;

  const idx = cat.statuses.findIndex(s => s.id === Number(statusId));
  if (idx < 0) return;

  const newStatuses = [...cat.statuses];
  const [removed] = newStatuses.splice(idx, 1);
  newStatuses.splice(newSortOrder, 0, removed!);
  newStatuses.forEach((status, i) => {
    status.sortOrder = i;
  })

  await reorderStatuses(
      categoryId.value,
      Object.fromEntries(newStatuses.map(item => [item.id, item.sortOrder])))

  cat.statuses = newStatuses;
};

</script>

<template>
  <!-- BOARD VIEW -->
  <div class="board-view">
    <div class="board-header">
      <div>
        <div class="board-title" v-if="currentCategory">
          <span :style="`color:${currentCategory.color}`">●</span> {{ currentCategory.name }}
        </div>
        <div class="board-subtitle">{{ messages.length }} cards</div>
      </div>
      <div class="board-actions">
        <LnbIconBtn title="Edit board" @click="openEditCategory">
          <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"></path>
        </LnbIconBtn>
      </div>
    </div>

    <div class="board-columns" v-col-sortable="{ cat: currentCategory, onColMoved }">
      <div
        v-for="status in statuses"
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
          <div class="col-count">{{ cardsByStatus[status.id]?.length ?? 0 }}</div>
          <div class="col-del-btn" @click.stop="openEditStatus(status)" style="color:var(--text3)">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"/>
            </svg>
          </div>
          <div @click="openDeleteStatus(status)" class="col-del-btn" v-if="statuses.length > 1">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"></path>
            </svg>
          </div>
        </div>
        <div class="col-drag-area" v-sortable="{ catId: appState.categoryId, statusId: status?.id, onCardMoved }">
          <lnb-card
            v-for="msg in cardsByStatus[status.id]"
            @openDelete="emits('openDelete', msg)"
            @openEdit="emits('openEdit', $event)"
            :deleteButton="true"
            :key="msg.id"
            :assignButton="false"
            :message="msg"/>
        </div>
        <div class="col-add-btn" @click="openAddToBoard(status)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M8 3v10M3 8h10"/>
          </svg>
          Add card
        </div>
      </div>

      <div class="add-col-btn" @click="openCreateStatus">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" style="width:14px;height:14px">
          <path d="M8 3v10M3 8h10"/>
        </svg>
        Add column
      </div>
    </div>
  </div>
  <LnbCreateStatusModal
    @create="createStatusInternal"
    @close="closeCreateStatus"
    v-if="modal.createStatus"/>
  <LnbDeleteColumnModal
    @delete="deleteStatusInternal"
    @close="closeDeleteStatus"
    v-if="modal.deleteStatus"/>
  <LnbCreateCardModal
    :statusId="statusToEdit!.id"
    @create="assignToBoard"
    @close="closeAddToBoard"
    v-if="modal.addToBoard"/>
  <LnbEditStatusModal
    :status="statusToEdit!"
    @edit="editStatusInternal"
    @close="closeEditStatus"
    v-if="modal.editStatus"/>
  <LnbEditCategoryModal
    :category="currentCategory!"
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
.board-header {
  padding: 10px 14px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.board-title { font-size: 14px; font-weight: 700; }
.board-subtitle { font-size: 11px; color: var(--text3); }
.board-actions { margin-left: auto; display: flex; gap: 6px; }

.board-columns { flex: 1; overflow-x: auto; overflow-y: hidden; display: flex; gap: 10px; padding: 12px; align-items: flex-start; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
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
.col-del-btn{width:22px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text3);transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.col-del-btn:hover{background:var(--red-glow);color:var(--red)}
.col-del-btn svg{width:13px;height:13px}

.col-drag-area { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 60px; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--border) transparent; transition: background 0.15s; }
.col-drag-area::-webkit-scrollbar { width: 3px; }
.col-drag-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.col-drag-area.drag-over { background: var(--accent-glow); }

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

.add-col-btn {
  width: 240px;
  min-width: 240px;
  height: 52px;
  border: 1.5px dashed var(--border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text3);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: flex-start;
}
.add-col-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
</style>