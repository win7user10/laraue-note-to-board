<script setup lang="ts">
  import LnbManageOrganizationModal from "~/components/modals/LnbManageOrganizationModal.vue";

  const { appState } = useAppState();
  const { isPersonalOrg } = useUtils()
  const initUser = useInitUser();
  const userPopupOpen = ref(false);
  const currentUser = computed(() => appState.value.user!);
  const currentOrganization = computed(() => appState.value.organization!);
  const isInMiniApp = computed(() => appState.value.isInMiniApp!);
  const logout = () => {
    initUser.logout();
  }
  const logoutOrganization = () => {
    initUser.logoutOrganization()
  }
  const avatarData = computed(() => {
    if (isPersonalOrg(currentOrganization.value)) {
      return {
        color: currentUser.value.color,
        initials: currentUser.value.initials,
        name: currentUser.value.firstName + ' ' + currentUser.value.lastName,
      }
    } else {
      return {
        color: currentOrganization.value.color,
        initials: currentOrganization.value.name.toLocaleUpperCase().slice(0, 2),
        name: currentOrganization.value.name,
      }
    }
  })
  const modals = reactive({
    manage: false
  })
</script>

<template>
  <!-- USER AVATAR — shown on web only (hidden inside Telegram via CSS) -->
  <div class="user-avatar-btn" @click.stop="userPopupOpen = !userPopupOpen" v-if="!isInMiniApp">
    <div class="user-avatar"
       :style="`background:${avatarData.color}22;color:${avatarData.color}`">
      <span>{{avatarData.initials}}</span>
    </div>
  </div>

  <!-- User popup -->
  <transition name="fade">
    <div v-if="userPopupOpen" class="user-popup" @click.stop>
      <div class="user-popup-name">{{ avatarData.name }}</div>
      <div class="user-popup-handle">@{{currentUser.username}}</div>
      <div class="user-popup-divider"></div>
      <div
        v-if="currentOrganization.accessLevel >= AccessLevel.Manage"
        class="user-popup-btn"
        style="color: var(--text2);"
        @click="modals.manage = true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="6" cy="5" r="2.5"></circle>
          <path d="M1 14c0-3 2-5 5-5"></path>
          <circle cx="12" cy="9" r="2"></circle>
          <path d="M9 14c0-2 1.3-3 3-3s3 1 3 3"></path>
        </svg>
        My organisation
      </div>
      <div class="user-popup-btn" style="color: var(--accent);" @click="logoutOrganization">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H6"/>
        </svg>
        Change Organization
      </div>
      <div class="user-popup-btn" @click="logout">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H6"/>
        </svg>
        Sign out
      </div>
    </div>
  </transition>
  <!-- Close popup on outside click -->
  <div v-if="userPopupOpen" style="position:fixed;inset:0;z-index:89" @click="userPopupOpen=false"></div>
  <LnbManageOrganizationModal
    v-if="modals.manage"
    @close="modals.manage = false"/>
</template>

<style scoped>
/* USER AVATAR (bottom-left, web only) */
.user-avatar-btn{position:fixed;top:calc(12px + var(--safe-top));right:calc(12px + var(--safe-right));z-index:90;display:flex;align-items:center;gap:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.user-avatar{width:34px;height:34px;border-radius:50%;background:var(--surface3);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--text);transition:border-color 0.15s;overflow:hidden;flex-shrink:0}
.user-avatar img{width:100%;height:100%;object-fit:cover}
.user-avatar-btn:hover .user-avatar{border-color:var(--accent)}
.user-popup{position:fixed;top:calc(62px + var(--safe-top));right:calc(8px + var(--safe-right));background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:91;animation:slide-up 0.18s cubic-bezier(0.34,1.3,0.64,1)}
.user-popup-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.user-popup-handle{font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:12px}
.user-popup-divider{height:1px;background:var(--border);margin-bottom:10px}
.user-popup-btn{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;color:var(--red);transition:background 0.15s;-webkit-tap-highlight-color:transparent}
.user-popup-btn:hover{background:var(--red-glow)}
.user-popup-btn svg{width:14px;height:14px}
</style>