<script setup lang="ts">

import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalListOpts from "~/components/modals/LnbModalListOpts.vue";
import LnbModalListOpt from "~/components/modals/LnbModalListOpt.vue";

const props = defineProps<{
  spaceId: number
}>()

const { t } = useI18n();
const { loadCategories } = useCategoriesApi()
const result = await loadCategories({
  spaceId: props.spaceId,
})
result.categories.sort((a, b) => b.touchedAt.localeCompare(a.touchedAt));

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'select', epic: CategoryCountDto): void
}>()

</script>

<template>
  <LnbModal
    @close="emit('close')"
    title="Select Epic">
    <LnbModalListOpts>
      <LnbModalListOpt
        v-for="epic in result.categories"
        :name="epic.name"
        :sub="epic.count + ' columns'"
        @click="emit('select', epic)">
        <template #avatar>
          <LnbCardAvatar :color="epic.color"></LnbCardAvatar>
        </template>
      </LnbModalListOpt>
    </LnbModalListOpts>
  </LnbModal>
</template>

<style scoped>

</style>