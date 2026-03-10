<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import WebApp from "@twa-dev/sdk";
  import {useUserApi} from "~/composables/userApi";
  import {useAppState} from "~/composables/appState";
  const { validate } = useTelegramUserApi();
  const { loadCategories } = useCategoriesApi();
  const { loadUser } = useUserApi();
  const categories = ref<CategoryCountDto[]>([])
  let initError = ref<any>({})
  const userName = ref<string>()

  const configuration = useRuntimeConfig();
  const testUserToken = configuration.public.testUserToken;

  onMounted(async () => {
    try {
      let token = testUserToken;
      if (!token) {
        token = WebApp.initData;
        if (!token) {
          initError.value("The app should be run as Mini App");
          return;
        }

        WebApp.ready(); // init telegram mini app
      }

      const bearer = await validate(token)
      localStorage.setItem('bearer', bearer)

      categories.value = await loadCategories()
      const user = await loadUser()
      userName.value = user.username

    } catch (err) {
      initError.value = err;
    }
  });

  const { appState, setCategory } = useAppState()
  const categoryId = computed(() => appState.value.categoryId);
</script>

<template>

  <div id="app" v-if="categories.length > 0">
    <!-- TOP BAR -->
    <div class="topbar">
      <div class="topbar-logo">NoteBoard<span>{{ userName }}</span></div>
      <div class="topbar-spacer"></div>
      <div class="icon-btn" title="Search">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5l3 3"/>
        </svg>
      </div>
      <div class="icon-btn" title="Add Category">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 3v10M3 8h10"/>
        </svg>
      </div>
    </div>

    <!-- NAV TABS -->
    <div class="nav-tabs">
      <div
          v-for="cat in categories"
          class="nav-tab"
          :class="{active: categoryId === cat.id}"
          :style="categoryId === cat.id ? `--dot-color:${cat.color}` : ''"
          @click="setCategory(cat.id)"
      >
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

    <NuxtPage />
  </div>
  <div v-else>{{ initError }}</div>
</template>

<style scoped>

#app { height: 100%; display: flex; flex-direction: column; overflow: hidden; }
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
.icon-btn {
  width: 34px; height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface3);
  color: var(--text2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.icon-btn:hover, .icon-btn.active { background: var(--accent-glow); border-color: var(--accent); color: var(--accent); }
.icon-btn svg { width: 16px; height: 16px; }

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