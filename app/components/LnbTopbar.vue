<script setup lang="ts">
import LnbSpacePopup from "~/components/popups/LnbSpacePopup.vue";
import {ref} from "vue";
import LnbOrganizationPopup from "~/components/popups/LnbOrganizationPopup.vue";
const { currentSpace, spaces } = useBoard()
const { appState } = useAppState()
const spacePopupOpen = ref(false);
const orgSwitcherOpen = ref(false);

</script>

<template>

  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-breadcrumb" style="position:relative">

      <!-- Brand mark -->
      <div class="topbar-breadcrumb-seg brand">
        <LnbUserAvatar />
      </div>

      <!-- Org segment — always shown, tap to switch -->
      <div class="topbar-breadcrumb-seg" @click.stop="orgSwitcherOpen=!orgSwitcherOpen">
        <div class="topbar-breadcrumb-dot" :style="`background:${appState.organization?.color}`"></div>
        <div class="topbar-breadcrumb-name">{{appState.organization?.name}}</div>
        <div class="topbar-breadcrumb-chevron">
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3.5l3 3 3-3"/></svg>
        </div>
      </div>
      <LnbOrganizationPopup
        v-if="orgSwitcherOpen"
        @close="orgSwitcherOpen = false"/>

      <!-- Space segment -->
      <template v-if="spaces.length > 0">
        <div class="topbar-breadcrumb-sep">/</div>
        <div class="topbar-breadcrumb-seg space" @click.stop="spacePopupOpen=!spacePopupOpen">
          <div class="topbar-breadcrumb-dot" :style="`background:${currentSpace?.color}`"></div>
          <div class="topbar-breadcrumb-name">{{currentSpace?.name}}</div>
          <div class="topbar-breadcrumb-chevron">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3.5l3 3 3-3"/></svg>
          </div>
        </div>
        <LnbSpacePopup
          v-if="spacePopupOpen"
          @close="spacePopupOpen = false"/>
      </template>

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

/* BREADCRUMB NAV */
.topbar-breadcrumb{display:flex;align-items:center;background:var(--surface3);border:1px solid var(--border);border-radius:10px;flex-shrink:0;max-width:320px;min-width:0;cursor:pointer;}
.topbar-breadcrumb-seg{display:flex;align-items:center;gap:6px;padding:5px 10px;transition:background 0.12s;min-width:0;-webkit-tap-highlight-color:transparent;flex-shrink:0}
.topbar-breadcrumb-seg.brand{padding:0;flex-shrink:0}
.org-switcher-check svg{width:12px;height:12px;color:var(--accent)}
.topbar-breadcrumb-seg.brand svg{display:block}
.topbar-breadcrumb-sep{color:var(--text3);font-size:14px;line-height:1;flex-shrink:0;opacity:0.4;user-select:none}
.topbar-breadcrumb-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.topbar-breadcrumb-name{font-size:12px;font-weight:600;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px}
.topbar-breadcrumb-chevron{color:var(--text3);flex-shrink:0;display:flex;align-items:center}
.topbar-breadcrumb-chevron svg{width:9px;height:9px}
.topbar-breadcrumb-seg:hover .topbar-breadcrumb-name, .topbar-breadcrumb-seg:hover .topbar-breadcrumb-chevron{color:var(--text);}
</style>