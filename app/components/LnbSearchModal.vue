<script setup lang="ts">

defineProps<{
  categories: CategoryCountDto[]
}>()

const emits = defineEmits<{
  (e: 'openCard', card: MessageListDto): void,
}>()

const { searchMessages } = useMessagesApi();
const request = ref({
  searchString: '',
  categoryId: null as null | number
})

const searchResults = ref<MessageListDto[]>([])
watch(request, async (newValue) => {
  searchResults.value = await searchMessages(newValue);
}, { deep: true })

</script>

<template>
  <LnbModal
      title="Search">
    <LnbModalInput
      v-model="request.searchString"
      placeholder="Search messages…"/>
    <div class="search-filters">
      <div class="filter-chip"
        :class="{active:request.categoryId === null}"
        @click="request.categoryId = null">
        All
      </div>
      <div
        v-for="cat in categories"
        :key="'f' + cat.id"
        class="filter-chip"
        :class="{active: request.categoryId === cat.id}"
        @click="request.categoryId = cat.id">
        <span :style="`color:${cat.color}`">● </span>{{cat.name}}
      </div>
    </div>
    <div v-if="searchResults.length">
      <div v-for="searchResult in searchResults">
        <LnbCard
          @click.stop="emits('openCard', searchResult)"
          style="margin-bottom: 6px;"
          :deleteButton="false"
          :assignButton="false"
          :highlightText="request.searchString"
          :message="searchResult"/>
      </div>
    </div>
    <div class="search-empty" v-else-if="request.searchString.trim()">
      No messages found
    </div>
    <div class="search-empty" v-else>
      Type to search…
    </div>
  </LnbModal>

</template>

<style scoped>
.search-filters{display:flex;gap:5px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.search-filters::-webkit-scrollbar{display:none}
.filter-chip{padding:4px 10px;border-radius:14px;border:1px solid var(--border);background:var(--surface3);font-size:11px;font-weight:600;color:var(--text2);cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.filter-chip.active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}
.search-empty{text-align:center;padding:28px 0;font-size:12px;color:var(--text3)}
</style>