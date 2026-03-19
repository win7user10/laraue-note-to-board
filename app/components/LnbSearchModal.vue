<script setup lang="ts">

import type {MessageListDto} from "~/composables/messagesApi";

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

const pagination = ref(DefaultPagination);
const searchResults = ref<FullPaginatedResult<MessageListDto> | null>()

watch(request, async (newValue) => {
  searchResults.value = await searchMessages({
    categoryId: newValue.categoryId,
    searchString: newValue.searchString,
    page: pagination.value.page,
    perPage: pagination.value.perPage
  });
}, { deep: true, immediate: true })


const isLoading = ref(false)
const loadMore = async () => {
  try {
    isLoading.value = true;
    const item = searchResults.value!;
    const newMessages = await searchMessages({
      searchString: request.value.searchString,
      categoryId: request.value.categoryId,
      perPage: searchResults.value!.perPage,
      page: searchResults.value!.page + 1
    })
    item.data.push(...newMessages.data);
    item.page = newMessages.page;
    item.hasNextPage = newMessages.hasNextPage
  } finally {
    isLoading.value = false;
  }
}

const { t } = useI18n();

</script>

<template>
  <LnbModal
      :title="t('search')"
      :fullHeight="true">
    <LnbModalInput
      v-model="request.searchString"
      :placeholder="t('searchPlaceholder')"/>
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
    <div v-if="searchResults?.total != 0">
      <LnbScrollArea
        :hasMore="!!searchResults?.hasNextPage"
        :isLoading="isLoading"
        @loadMore="loadMore">
        <div v-for="searchResult in searchResults?.data">
          <LnbCard
              @click.stop="emits('openCard', searchResult)"
              style="margin-bottom: 6px;"
              :deleteButton="false"
              :assignButton="false"
              :key="searchResult.id"
              :highlightText="request.searchString"
              :message="searchResult"/>
        </div>
      </LnbScrollArea>
    </div>
    <div class="search-empty" v-else-if="request.searchString.trim()">
      {{ t('noSearchResults') }}
    </div>
    <div class="search-empty" v-else>
      {{ t('emptySearch') }}
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