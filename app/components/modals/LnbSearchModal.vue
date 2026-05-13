<script setup lang="ts">

import type {MessageListDto} from "~/composables/messagesApi";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";

const emits = defineEmits<{
  (e: 'openCard', card: MessageListDto): void,
}>()

const { searchMessages } = useMessagesApi();
const request = ref({
  searchString: '',
  epicId: null as null | number,
})

const { state, currentSpace } = useBoard()
const categories = computed(() => state.value.categories)

const pagination = ref(DefaultPagination);
const searchResults = ref<FullPaginatedResult<MessageListDto> | null>()

const isLoading = ref(true)
watch(request, async (newValue) => {
  isLoading.value = true;
  searchResults.value = await searchMessages({
    epicId: newValue.epicId,
    searchString: newValue.searchString,
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    spaceId: currentSpace.value!.id
  });
  isLoading.value = false;
}, { deep: true, immediate: true })

const loadMore = async () => {
  if (!searchResults?.value?.hasNextPage || isLoading.value)
    return;
  try {
    isLoading.value = true;
    const item = searchResults.value!;
    const newMessages = await searchMessages({
      searchString: request.value.searchString,
      epicId: request.value.epicId,
      perPage: searchResults.value!.perPage,
      page: searchResults.value!.page + 1,
      spaceId: currentSpace.value!.id
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
      @scroll="loadMore"
      :title="t('search')"
      :fullHeight="true"
      :determineScroll="true">
    <LnbModalInput
      preventDisableOnLoading
      v-model="request.searchString"
      :placeholder="t('searchPlaceholder')"/>
    <div class="search-filters">
      <div class="filter-chip"
        :class="{active:request.epicId === null}"
        @click="request.epicId = null">
        All
      </div>
      <div
        v-for="cat in categories"
        :key="'f' + cat.id"
        class="filter-chip"
        :class="{active: request.epicId === cat.id}"
        @click="request.epicId = cat.id">
        <span :style="`color:${cat.color}`">● </span>{{cat.name}}
      </div>
    </div>
    <div v-if="searchResults?.data?.length" ref="scrollableEl">
      <div v-for="searchResult in searchResults.data" :key="searchResult.id">
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