<script setup lang="ts">
import type {SearchIssueDto} from "~/composables/messagesApi";

const { t } = useI18n()
import LnbElementWithHelpLink from "~/components/modals/LnbElementWithHelpLink.vue";
import LnbScrollArea from "~/components/LnbScrollArea.vue";
import LnbSection from "~/components/LnbSection.vue";

const { currentSpace, state } = useBoard()
const { searchMessages } = useMessagesApi();

const request = ref({
  searchString: '',
  epicId: null as null | number,
})

const pagination = ref(DefaultPagination);
const searchResults = ref<ShortPaginatedResult<SearchIssueDto>>()

const isLoading = ref(true)
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

const currentSpaceId = computed(() => currentSpace.value?.id)
const fetchSearchResults = async () => {
  isLoading.value = true;
  try {
    searchResults.value = await searchMessages({
      epicId: request.value.epicId,
      searchString: request.value.searchString,
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      spaceId: currentSpace.value!.id
    });
  } finally {
    isLoading.value = false;
  }
}

watch(currentSpaceId, async (newValue) => {
  if (newValue)
    await fetchSearchResults();
}, { immediate: true })

watch(request, async () => {
  if (currentSpaceId.value)
    await fetchSearchResults();
}, { deep: true })

</script>

<template>
  <LnbBoardHeader>
    <template #title>
      <LnbElementWithHelpLink link-href="asd" link-title="asd">
        All Issues
      </LnbElementWithHelpLink>
    </template>
    <template #actions>
      <LnbBoardSearch v-model="request.searchString" />
    </template>
  </LnbBoardHeader>
  <LnbView>
    <LnbSection title="Filters">

      <div class="filter-row">
        <div class="filter-title">
          Epic
        </div>
        <div
          class="filter-chip"
          :class="{active: !request.epicId}"
          @click="request.epicId = null">
          All
        </div>
        <div
          v-for="cat in state.epics"
          :key="cat.id"
          class="filter-chip"
          :class="{active: request.epicId === cat.id}"
          @click="request.epicId = cat.id">
          <span :style="`color:${cat.color}`">● </span>{{cat.name}}
        </div>
      </div>

      <LnbScrollArea v-if="(searchResults?.data.length ?? 0) > 0"
        :load-next="() => loadMore()"
        :can-load-more="() => searchResults?.hasNextPage ?? false">
        <LnbCard
          v-for="searchResult in searchResults!.data"
          :deleteButton="false"
          :assignButton="false"
          :highlightText="request.searchString"
          :message="searchResult">
          <template #footer>
            <LnbCardTag :color="searchResult.statusColor">
              {{ searchResult.statusName }}
            </LnbCardTag>
            <LnbCardTag :color="searchResult.epicColor">
              {{ searchResult.epicName }} ↗
            </LnbCardTag>
          </template>
        </LnbCard>
      </LnbScrollArea>

      <LnbEmptyState v-else
        :title="t('noSearchResults')"
        subtitle="Try to change filters to see results"/>

    </LnbSection>
  </LnbView>
</template>

<style scoped>
</style>