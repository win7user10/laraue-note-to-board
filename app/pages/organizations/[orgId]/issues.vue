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
  epicIds: [] as Array<number>,
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
      epicIds: request.value.epicIds,
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
      epicIds: request.value.epicIds,
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

const updateIssue = (source: SearchIssueDto, value: EditCardRequest) => {
  source.content = value.content;
}

</script>

<template>
  <LnbBoardHeader>
    <template #title>
      All Issues
    </template>
    <template #actions>
      <LnbBoardSearch v-model="request.searchString" />
    </template>
  </LnbBoardHeader>
  <LnbView>
    <LnbSection title="Filters">

      <LnbFilterPill
        :options="state.epics"
        label="Epic"
        no-filter-title="All Epics"
        v-model="request.epicIds"/>

      <LnbScrollArea v-if="(searchResults?.data.length ?? 0) > 0"
        :load-next="() => loadMore()"
        :can-load-more="() => searchResults?.hasNextPage ?? false">
        <LnbCard
          v-for="searchResult in searchResults!.data"
          :deleteButton="false"
          :assignButton="false"
          :highlightText="request.searchString"
          :message="searchResult"
          @update="updateIssue(searchResult, $event)">
          <template #footer>
            <LnbCardTag :color="searchResult.epicColor">
              {{ searchResult.epicName }}
            </LnbCardTag>
            <LnbCardTag v-if="searchResult.statusName" :color="searchResult.statusColor!">
              {{ searchResult.statusName }}
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