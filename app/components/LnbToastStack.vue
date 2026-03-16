<script setup lang="ts">
  import {useAppState} from "~/composables/appState";

  const { appState } = useAppState()
</script>

<template>
  <div class="toast-stack">
    <transition-group name="toast">
      <div v-for="t in appState.toasts" :key="t.id" class="toast">
        <div class="toast-icon" :class="t.type">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="t.type === 'danger'">
              <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"/>
            </template>
            <template v-else-if="t.type === 'success'">
              <path d="M3 8l3.5 3.5L13 4.5"/>
            </template>
            <template v-else>
              <circle cx="8" cy="8" r="6"/><path d="M8 5v4M8 11v.5"/>
            </template>
          </svg>
        </div>
        <div class="toast-body">
          <div class="toast-title">{{t.title}}</div>
          <div class="toast-sub" v-if="t.subTitle">{{ t.subTitle }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-stack{position:fixed;bottom:calc(24px + var(--safe-bottom));left:calc(12px + var(--safe-left));right:calc(12px + var(--safe-right));z-index:500;display:flex;flex-direction:column-reverse;gap:6px;pointer-events:none}
.toast{background:var(--text);border-radius:12px;padding:12px 14px;box-shadow:0 8px 32px rgba(0,0,0,0.6),0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;gap:12px;pointer-events:none}
.toast-icon{width:30px;height:30px;border-radius:7px;background:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.toast-icon.danger{background:var(--red)}
.toast-icon.success{background:var(--green)}
.toast-icon svg{width:15px;height:15px;color:#fff}
.toast-body{flex:1;min-width:0}
.toast-title{font-size:13px;font-weight:700;color:var(--bg);line-height:1.3}
.toast-sub{font-size:11px;color:rgba(13,17,23,0.6);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.toast-enter-active{transition:all 0.28s cubic-bezier(0.34,1.3,0.64,1)}
.toast-leave-active{transition:all 0.2s ease-in}
.toast-enter-from{opacity:0;transform:translateY(14px) scale(0.95)}
.toast-leave-to{opacity:0;transform:translateY(8px) scale(0.95)}
.toast-move{transition:transform 0.25s ease}
</style>