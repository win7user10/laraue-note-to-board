<script setup lang="ts">

import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalListOpts from "~/components/modals/LnbModalListOpts.vue";
import LnbModalListOpt from "~/components/modals/LnbModalListOpt.vue";
import type {EpicListDto} from "~/composables/spacesApi";

const props = defineProps<{
  spaceId: number
}>()

const { loadSpaceEpics } = useSpacesApi()
const result = await loadSpaceEpics(props.spaceId)
result.sort((a, b) => b.touchedAt.localeCompare(a.touchedAt));

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'select', epic: EpicListDto): void
}>()

const { t } = useI18n()
</script>

<template>
  <LnbModal
    @close="emit('close')"
    :title="t('selectEpic')">
    <LnbModalListOpts>
      <LnbModalListOpt
        v-for="epic in result"
        :name="epic.name"
        sub=""
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