<script setup lang="ts">
import LnbBacklogView from "~/components/LnbBacklogView.vue";
import LnbBoardView from "~/components/LnbBoardView.vue";
import { useAppState } from "~/composables/appState";

const { appState } = useAppState()
const categoryId = computed(() => appState.value.categoryId);
</script>

<template>
  <template v-if="categoryId === 0">
    <lnb-backlog-view />
  </template>
  <template v-else>
    <lnb-board-view />
  </template>
</template>

