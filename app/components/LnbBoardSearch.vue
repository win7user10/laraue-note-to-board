<script setup lang="ts">
  import LnbInput from "~/components/LnbInput.vue";

  const emits = defineEmits<{
    (e: 'search', value: string): void,
    (e: 'update:modelValue', value: string): void,
  }>()

  const { t } = useI18n()
  const props = defineProps({
    modelValue: { type: String, required: true },
  })

  const searchFocus = ref(false);

  const openBoardSearch = () => {
    searchFocus.value = true;
  };

  const closeBoardSearch = () => {
    searchFocus.value = false;
  };

  const clearBoardSearch = () => {
    emits('update:modelValue', '')
    closeBoardSearch();
  };
</script>

<template>
  <div class="board-search-wrap"
    :class="{
      focused: searchFocus,
      'has-value': !!props.modelValue
    }"
     v-click-outside="closeBoardSearch">
    <LnbInput
      :key="searchFocus ? 1 : 0"
      @click="openBoardSearch"
      focus
      class="board-search-input"
      :modelValue="modelValue"
      @input="emits('update:modelValue', $event.target.value)"
      :placeholder="t('searchCards')"
      @escape="closeBoardSearch" />
    <div class="board-search-btn">
      <svg
        @click="openBoardSearch"
        v-if="!searchFocus && !modelValue"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8">
          <circle cx="6.5" cy="6.5" r="4"/>
          <path d="M10 10l3 3"/>
      </svg>
      <svg v-else @click="clearBoardSearch" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 3l10 10M13 3L3 13"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.board-search-wrap{display:flex;align-items:center;gap:0;overflow:hidden;transition:width 0.22s cubic-bezier(0.4,0,0.2,1);width:28px}
.board-search-wrap.has-value, .board-search-wrap.focused{width:160px}
.board-search-input{flex:1;background:transparent;border:none;outline:none;font-size:12px;color:var(--text);font-family:'Syne',sans-serif;padding:0;min-width:0;width:0;transition:width 0.22s}
.board-search-wrap.focused .board-search-input{width:100%}
.board-search-btn{width:28px;height:28px;border-radius:var(--radius-sm);border:1px solid transparent;background:transparent;color:var(--text3);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.board-search-wrap.has-value, .board-search-wrap.focused {padding:0 4px 0 8px;border-radius:var(--radius-sm);}
.board-search-wrap.has-value{border:1px solid var(--surface2);}
.board-search-wrap.focused{background:var(--surface3);border:1px solid var(--accent);}
.board-search-wrap.focused .board-search-btn{color:var(--accent);border-color:transparent;background:transparent}
.board-search-btn:hover{color:var(--text)}
.board-search-btn svg{width:14px;height:14px}
.board-search-clear{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text3);flex-shrink:0;transition:color 0.15s}
.board-search-clear:hover{color:var(--text)}
.board-search-clear svg{width:10px;height:10px}
.board-search-active-badge{background:var(--accent);color:#fff;font-size:9px;font-weight:700;border-radius:8px;padding:1px 5px;margin-left:2px}
</style>