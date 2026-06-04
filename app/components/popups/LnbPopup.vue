<script setup lang="ts">
const props = defineProps<{
  alignRight?: boolean,
  minWidth: number,
  parentRef?: HTMLDivElement,
}>()
const emits = defineEmits<{
  (e: 'close'): void,
}>()

const spaceMenuPos = reactive({ top: 0, left: 0, width: 0 });
onMounted(() => {
  const ref = props.parentRef;
  if (!ref)
    return;

  const r = ref.getBoundingClientRect();
  spaceMenuPos.top = r.bottom + 4;
  spaceMenuPos.left = r.left;
  spaceMenuPos.width = r.width;
})
</script>

<template>
  <!-- Sort popup -->
  <transition name="fade">
    <div class="popup" :style="{
      top: spaceMenuPos.top + 'px',
      left: alignRight ? spaceMenuPos.left - minWidth + spaceMenuPos.width + 'px' : spaceMenuPos.left + 'px',
      minWidth: minWidth + 'px' }">
      <slot></slot>
    </div>
  </transition>
  <div style="position:fixed;inset:0;z-index:89;cursor:default" @click="emits('close')"></div>
</template>

<style scoped>
.popup{
  position:fixed;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:10px;
  padding:5px;
  min-width:160px;
  box-shadow:0 6px 24px rgba(0,0,0,0.5);
  z-index:91;
  animation:slide-up 0.15s cubic-bezier(0.34,1.3,0.64,1)
}
</style>