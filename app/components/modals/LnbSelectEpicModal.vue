<script setup lang="ts">

import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalListOpts from "~/components/modals/LnbModalListOpts.vue";
import LnbModalListOpt from "~/components/modals/LnbModalListOpt.vue";

const props = defineProps<{
  spaceId: number
}>()

const { loadSpaceEpics } = useSpacesApi()
const result = await loadSpaceEpics(props.spaceId)
result.sort((a, b) => b.touchedAt.localeCompare(a.touchedAt));

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'select', epic: EpicCountDto): void
}>()

</script>

<template>
  <LnbModal
    @close="emit('close')"
    title="Select Epic">
    <LnbModalListOpts>
      <LnbModalListOpt
        v-for="epic in result"
        :name="epic.name"
        :sub="epic.statusesCount + ' columns'"
        @click="emit('select', epic)">
        <template #avatar>
          <LnbCardAvatar :color="epic.color">
            {{epic.name.slice(0, 1).toUpperCase()}}
          </LnbCardAvatar>
        </template>
      </LnbModalListOpt>
    </LnbModalListOpts>
  </LnbModal>
</template>

<style scoped>

</style>