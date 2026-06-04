<script setup lang="ts">
  const { reloadEpics, spaces, updateSpaceId } = useBoard()
  const { params } = useRoute()

  watch(() => spaces.value, async () => {
    const spaceKey = params.spaceKey;
    const space = spaces.value.find(s => s.key === spaceKey)
    if (!space)
      return;

    updateSpaceId(space.id)
    await reloadEpics()
  }, { immediate: true })
</script>

<template>
  <NuxtPage />
</template>

<style scoped>

</style>