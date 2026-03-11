<script setup lang="ts">
import LnbBacklogView from "~/components/LnbBacklogView.vue";
import LnbBoardView from "~/components/LnbBoardView.vue";
import { useAppState } from "~/composables/appState";
import LnbCreateCategoryModal from "~/components/LnbCreateCategoryModal.vue";

const { appState, setCategory } = useAppState()
const categoryId = computed(() => appState.value.categoryId);

import {onMounted, ref} from "vue";
import {useUserApi} from "~/composables/userApi";
const { loadCategories, createCategory } = useCategoriesApi();
const { loadUser } = useUserApi();
const { loadMessages, updateCategory } = useMessagesApi();
const categories = ref<CategoryCountDto[]>([])
let initError = ref<any>({})
const userName = ref<string>()

const messages = ref<MessageListDto[]>([]);

onMounted(async () => {
  try {
    categories.value = await loadCategories()
    messages.value = await loadMessages(categoryId.value)
    const user = await loadUser()
    userName.value = user.username

  } catch (err) {
    initError.value = err;
  }
});

watch(() => appState.value.categoryId, async () => {
  messages.value = await loadMessages(categoryId.value)
})

const modal = reactive({
  createCategory: false,
  assign: false,
});

const openCreateCategory = () => {
  modal.createCategory = true;
}

const closeCreateCategory = () => {
  modal.createCategory = false;
}

const createCategoryInternal = async (value: CreateCategoryRequest) => {
  const id = await createCategory(value);
  categories.value.push({
    id: id,
    name: value.name,
    color: value.color,
    count: 0,
    statusesCount: 0,
  })
  closeCreateCategory();
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
  await updateCategory(assignMsg.value!.id, categoryId)
  modal.assign = false;
  messages.value = messages.value.filter(x => x.id != assignMsg.value!.id)
}

</script>

<template>
  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-logo">{{ userName }}<span></span></div>
    <div class="topbar-spacer"></div>
    <LnbIconBtn title="Search">
      <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5l3 3"/>
    </LnbIconBtn>
    <LnbIconBtn title="Add Category" @click="openCreateCategory">
      <path d="M8 3v10M3 8h10"/>
    </LnbIconBtn>
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
    <div class="nav-tab-add" title="Add category">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3v10M3 8h10"/>
      </svg>
    </div>
  </div>

  <template v-if="categoryId === null">
    <LnbBacklogView
        :messages="messages"
        @openAssignToCategory="openAssignToCategory"/>
  </template>
  <template v-else>
    <LnbBoardView
      :messages="messages"/>
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
</template>

<style scoped>
/* ── TOP BAR ── */
.topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 10px;
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
.topbar-spacer { flex: 1; }

/* ── NAV TABS ── */
.nav-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
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
  width: 28px; height: 28px;
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
</style>