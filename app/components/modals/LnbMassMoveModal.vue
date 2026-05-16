<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";

const emits = defineEmits<{
  (e: 'close'): void,
}>()

const massMoveStep = ref(1); // 1=type, 2=source, 3=target, 4=mapping, 5=confirm
const massMoveType = ref<string | null>(null); // 'space'|'spaceEpics'|'epic'|'epicIssues'
const massMoveSource = ref(null); // selected space or epic
const massMoveTarget = ref(null); // selected org (null=personal)
const massMoveMappings = ref({}); // { [sourceStatusId]: targetStatusId }

const MASS_MOVE_TYPES = [
  { id: 'space',      title: 'Move entire space',         sub: 'Moves the space, all its epics and issues to another organization' },
  { id: 'spaceEpics', title: 'Move epics from a space',   sub: 'Moves all boards in a space — issues move with them' },
  { id: 'epic',       title: 'Move a single epic',        sub: 'Moves one board and all its issues to another organization' },
  { id: 'epicIssues', title: 'Move issues from an epic',  sub: 'Moves only the issues — requires mapping source statuses to target statuses' },
];

const massMoveNext = () => {
  if (massMoveStep.value === 1 && !massMoveType.value) return;
  if (massMoveStep.value === 2 && !massMoveSource.value) return;
  if (massMoveStep.value === 3 && massMoveTarget.value === undefined) return;
  // Skip mapping step for non-epicIssues types
  if (massMoveStep.value === 3 && massMoveType.value !== 'epicIssues') {
    massMoveStep.value = 5; return;
  }
  if (massMoveStep.value === 4) {
    // Auto-fill unmapped statuses with first available
    massMoveStep.value = 5; return;
  }
  massMoveStep.value++;
};

const massMoveBack = () => {
  if (massMoveStep.value === 1) {
    emits('close');
    return;
  }

  if (massMoveStep.value === 5 && massMoveType.value !== 'epicIssues') {
    massMoveStep.value = 3; return;
  }
  massMoveStep.value--;
};

const isNextStepDisabled = computed(() => {
  return massMoveStep.value === 1 && !massMoveType.value;
})
</script>

<template>
  <LnbModal
    title="Mass move"
    applyText="Next →"
    @cancel="massMoveBack"
    :cancel-text="massMoveStep > 1 ? '← Back' : undefined"
    :disable-apply="isNextStepDisabled"
    @apply="massMoveNext">

    <template #head>
      <!-- Step bar -->
      <div class="mmove-step-bar">
        <div class="mmove-step" :class="{active:massMoveStep===1,done:massMoveStep>1}">
          <div class="mmove-step-num">{{massMoveStep>1?'✓':'1'}}</div>
          <span>Type</span>
        </div>
        <div class="mmove-step-sep"></div>
        <div class="mmove-step" :class="{active:massMoveStep===2,done:massMoveStep>2}">
          <div class="mmove-step-num">{{massMoveStep>2?'✓':'2'}}</div>
          <span>Source</span>
        </div>
        <div class="mmove-step-sep"></div>
        <div class="mmove-step" :class="{active:massMoveStep===3,done:massMoveStep>3}">
          <div class="mmove-step-num">{{massMoveStep>3?'✓':'3'}}</div>
          <span>Target</span>
        </div>
        <template v-if="massMoveType==='epicIssues'">
          <div class="mmove-step-sep"></div>
          <div class="mmove-step" :class="{active:massMoveStep===4,done:massMoveStep>4}">
            <div class="mmove-step-num">{{massMoveStep>4?'✓':'4'}}</div>
            <span>Mapping</span>
          </div>
        </template>
        <div class="mmove-step-sep"></div>
        <div class="mmove-step" :class="{active:massMoveStep===5}">
          <div class="mmove-step-num">{{massMoveStep===5?'5':massMoveType==='epicIssues'?'5':'4'}}</div>
          <span>Confirm</span>
        </div>
      </div>
    </template>

    <template #default>
      <!-- ── STEP 1: Type ─────────────────────────────────────────────── -->
      <template v-if="massMoveStep===1">
        <LnbModalLabel>What do you want to move?</LnbModalLabel>
        <div v-for="t in MASS_MOVE_TYPES" :key="t.id"
             class="mmove-option" :class="{selected:massMoveType===t.id}"
             @click="massMoveType=t.id">
          <div class="mmove-option-icon">
            <svg v-if="t.id==='space'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M6 2v12M2 6h12"/></svg>
            <svg v-else-if="t.id==='spaceEpics'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M5 4V3M11 4V3"/></svg>
            <svg v-else-if="t.id==='epic'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="5" height="12" rx="1"/><rect x="9" y="2" width="5" height="8" rx="1"/></svg>
            <svg v-else viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="5" r="2"/><path d="M4 14c0-3 8-3 8 0"/><path d="M12 8h2M13 7v2"/></svg>
          </div>
          <div style="flex:1;min-width:0">
            <div class="mmove-option-title">{{t.title}}</div>
            <div class="mmove-option-sub">{{t.sub}}</div>
          </div>
          <svg v-if="massMoveType===t.id" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;color:var(--accent);flex-shrink:0"><path d="M3 8l4 4 6-7"/></svg>
        </div>
      </template>
    </template>
  </LnbModal>
</template>

<style scoped>
.mmove-step-bar{display:flex;align-items:center;gap:0;margin-bottom:16px}
.mmove-step{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--text3);flex-shrink:0}
.mmove-step.active{color:var(--accent)}
.mmove-step.done{color:var(--green)}
.mmove-step-num{width:20px;height:20px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
.mmove-step-sep{flex:1;height:1px;background:var(--border);margin:0 4px}
.mmove-option{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;margin-bottom:6px;transition:all 0.12s;-webkit-tap-highlight-color:transparent}
.mmove-option:hover{border-color:var(--accent);background:var(--accent-glow)}
.mmove-option.selected{border-color:var(--accent);background:var(--accent-glow)}
.mmove-option-icon{width:32px;height:32px;border-radius:8px;background:var(--surface3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mmove-option-icon svg{width:16px;height:16px;color:var(--text2)}
.mmove-option.selected .mmove-option-icon{background:var(--accent);color:#fff}
.mmove-option.selected .mmove-option-icon svg{color:#fff}
.mmove-option-title{font-size:12px;font-weight:700;color:var(--text);margin-bottom:2px}
.mmove-option-sub{font-size:10px;color:var(--text3);line-height:1.4}
.mmove-status-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid var(--border)}
.mmove-status-row:last-child{border-bottom:none}
.mmove-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.mmove-status-name{font-size:12px;font-weight:600;color:var(--text);flex:1;min-width:0}
.mmove-status-arrow{color:var(--text3);flex-shrink:0}
.mmove-status-arrow svg{width:14px;height:14px}
.mmove-status-select{background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-size:11px;color:var(--text);outline:none;cursor:pointer;max-width:120px}
.mmove-summary-row{display:flex;gap:6px;padding:6px 0;font-size:12px;border-bottom:1px solid var(--border)}
.mmove-summary-row:last-child{border-bottom:none}
.mmove-summary-label{color:var(--text3);min-width:80px;flex-shrink:0}
.mmove-summary-val{color:var(--text);font-weight:600}
</style>