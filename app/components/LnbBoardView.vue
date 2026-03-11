<script setup lang="ts">
import { useAppState } from "~/composables/appState";
import {ref} from "vue";
import LnbIconBtn from "~/components/LnbIconBtn.vue";
import {useCategoriesApi} from "~/composables/categoriesApi";

const { appState, setDragStateCardId, setDragStateOverStatus } = useAppState()
const { updateStatus } = useMessagesApi();
const { loadCategory } = useCategoriesApi();

const categoryId = computed(() => appState.value.categoryId);
const currentCategory = ref<CategoryDto>()

const props = defineProps<{
  messages: MessageListDto[],
}>()

watch(() => categoryId.value, async _ => {
  currentCategory.value = await loadCategory(categoryId.value!)
})

onMounted(async () => {
  currentCategory.value = await loadCategory(categoryId.value!)
})

const modal = reactive({
  createStatus: false,
});

const { createStatus } = useStatusesApi();
const openCreateStatus = () => {
  modal.createStatus = true;
}

const closeCreateStatus = () => {
  modal.createStatus = false;
}

const createStatusInternal = async (value: CreateStatusRequest) => {
  const id = await createStatus(value);
  currentCategory.value?.statuses.push({
    id: id,
    name: value.name,
    color: value.color,
  })
  closeCreateStatus();
}

const cardsByStatus = computed(() => {
  return Object.groupBy(props.messages, item => item.statusId);
})

const statuses = computed(() => {
  let result = [{
    id: 0,
    name: "NO STATUS",
    color: "#e3bf0d"
  }]

  if (currentCategory.value)
    result.push(...currentCategory.value.statuses)


  return result;
})

const onDrop = async (statusId: number) => {
  const card = props.messages.find(m => m.id === appState.value.dragState.cardId);
  if (!card) return;
  setDragStateCardId(null);
  setDragStateOverStatus(null);

  await updateStatus(card.id, statusId);
  card.categoryId = appState.value.categoryId!;
  card.statusId = statusId;
  // TODO - notification
};

const onDragOver = (e: any, statusId: number | null) => {
  setDragStateOverStatus(statusId);
  e.dataTransfer.dropEffect = 'move';
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
        <div class="board-subtitle">0 cards</div>
      </div>
      <div class="board-actions">
        <LnbIconBtn title="Add Message to Board">
          <rect x="2" y="2" width="12" height="12" rx="2"/>
          <path d="M8 5v6M5 8h6"/>
        </LnbIconBtn>
      </div>
    </div>

    <div class="board-columns">
      <div
        v-for="status in statuses"
        class="board-col"
        @dragover.prevent="onDragOver($event, status.id)"
        @drop="onDrop(status.id)">
        <div class="col-header">
          <div class="col-indicator" :style="`background:${status.color}`"></div>
          <div class="col-title">{{ status.name }}</div>
          <div class="col-count">{{ cardsByStatus[status.id]?.length }}</div>
          <div class="col-menu-btn" title="Delete column">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 8h10"/>
            </svg>
          </div>
        </div>
        <div class="col-cards">
          <div
            v-if="!cardsByStatus[status.id] && appState.dragState.cardId"
            class="col-drop-zone"
            :class="{active: appState.dragState.overStatus === status.id}">
            Drop here
          </div>
          <lnb-card
              v-for="msg in cardsByStatus[status.id]"
              :key="msg.id"
              :assignButton="false"
              :message="msg"/>
        </div>
        <div class="col-add-btn">
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
</template>

<style scoped>
/* ── BOARD VIEW ── */
.board-view {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.board-columns {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  gap: 10px;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  align-items: flex-start;
}
.board-columns::-webkit-scrollbar { height: 6px; }
.board-columns::-webkit-scrollbar-track { background: transparent; }
.board-columns::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.board-col {
  width: 240px;
  min-width: 240px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  flex-shrink: 0;
}
.col-header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 7px;
  position: relative;
}
.col-indicator {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.col-title { font-size: 12px; font-weight: 700; flex: 1; color: var(--text); letter-spacing: 0.3px; }
.col-count {
  font-size: 10px;
  background: var(--surface3);
  border-radius: 8px;
  padding: 1px 6px;
  color: var(--text2);
  font-weight: 600;
}
.col-menu-btn {
  width: 20px; height: 20px;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text3);
  transition: all 0.15s;
}
.col-menu-btn:hover { background: var(--surface3); color: var(--text); }
.col-menu-btn svg { width: 13px; height: 13px; }

.col-cards {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 60px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.col-cards::-webkit-scrollbar { width: 3px; }
.col-cards::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.col-drop-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text3);
  transition: all 0.15s;
}
.col-drop-zone.active { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

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