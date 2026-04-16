<script setup lang="ts">

import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalListOpts from "~/components/modals/LnbModalListOpts.vue";
import LnbModalListOpt from "~/components/modals/LnbModalListOpt.vue";

const { t } = useI18n();
const { spaces } = useBoard()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'select', id: number): void
}>()

</script>

<template>
  <LnbModal
    @close="emit('close')"
    title="Select Space">
    <LnbModalListOpts>
      <LnbModalListOpt
        v-for="space in spaces"
        :name="space.name"
        :sub="space.epicsCount + ' boards'"
        @click="emit('select', space.id)">
        <template #avatar>
          <LnbCardAvatar :color="space.color"></LnbCardAvatar>
        </template>
      </LnbModalListOpt>
    </LnbModalListOpts>
  </LnbModal>
</template>

<style scoped>

</style>