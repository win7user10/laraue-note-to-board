<script setup lang="ts">
  import LnbManageOrganizationModal from "~/components/modals/LnbManageOrganizationModal.vue";
  import LnbPopup from "~/components/popups/LnbPopup.vue";

  const { appState } = useAppState();
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
    return {
      color: currentUser.value.color,
      initials: currentUser.value.initials!.toLocaleUpperCase(),
      name: (currentUser.value.firstName ?? '') + ' ' + (currentUser.value.lastName ?? ''),
    }
  })
  const modals = reactive({
    manage: false
  })
  const closeManageModal = () => {
    modals.manage = false
    userPopupOpen.value = false
  }
  const { t } = useI18n();
</script>

<template>

  <!-- USER AVATAR — shown on web only (hidden inside Telegram via CSS) -->
  <LnbCardAvatar :color="avatarData.color" @click.stop="userPopupOpen = !userPopupOpen" v-if="!isInMiniApp" class="user-avatar">
    {{avatarData.initials}}
  </LnbCardAvatar>

  <!-- User popup -->
  <LnbPopup v-if="userPopupOpen" @close="userPopupOpen = false" :min-width="200">
    <div class="user-popup-name">{{ avatarData.name }}</div>
    <div class="user-popup-handle">@{{currentUser.username}}</div>
    <div class="user-popup-divider"></div>
    <div
      v-if="currentOrganization.canManage"
      class="user-popup-btn"
      style="color: var(--text2);"
      @click="modals.manage = true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="6" cy="5" r="2.5"></circle>
        <path d="M1 14c0-3 2-5 5-5"></path>
        <circle cx="12" cy="9" r="2"></circle>
        <path d="M9 14c0-2 1.3-3 3-3s3 1 3 3"></path>
      </svg>
      {{ t('manageOrganization') }}
    </div>
    <div class="user-popup-btn" style="color: var(--accent);" @click="logoutOrganization">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H6"/>
      </svg>
      {{ t('changeOrganization') }}
    </div>
    <div class="user-popup-btn" @click="logout">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H6"/>
      </svg>
      {{ t('signOut') }}
    </div>
  </LnbPopup>

  <!-- Close popup on outside click -->
  <LnbManageOrganizationModal
    v-if="modals.manage"
    @close="closeManageModal"/>

</template>

<style scoped>
/* USER AVATAR (bottom-left, web only) */
.user-popup-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.user-popup-handle{font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:12px;padding: 2px 6px;}
.user-popup-divider{height:1px;background:var(--border);margin-bottom:10px}
.user-popup-btn{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;color:var(--red);transition:background 0.15s;-webkit-tap-highlight-color:transparent}
.user-popup-btn:hover{background:var(--red-glow)}
.user-popup-btn svg{width:14px;height:14px}
.user-avatar{border-radius: 9px 0 0 9px;}
.user-avatar:hover{opacity: 0.8;}
</style>