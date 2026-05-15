<script setup lang="ts">

import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalListOpts from "~/components/modals/LnbModalListOpts.vue";
import LnbModalListOpt from "~/components/modals/LnbModalListOpt.vue";

const props = defineProps<{
  epicId: number
}>()

const { t } = useI18n();
const { getStatuses } = useStatusesApi()
const statuses = await getStatuses(props.epicId)

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'select', status: MessageStatusDto): void
}>()

</script>

<template>
  <LnbModal
    @close="emit('close')"
    title="Select Status">
    <LnbModalListOpts>
      <LnbModalListOpt
        v-for="status in statuses"
        :name="status.name"
        :sub="status.count + ' cards'"
        @click="emit('select', status)">
        <template #avatar>
          <LnbCardAvatar :color="status.color">
            {{status.name.slice(0, 1).toUpperCase()}}
          </LnbCardAvatar>
        </template>
      </LnbModalListOpt>
    </LnbModalListOpts>
  </LnbModal>
</template>

<style scoped>

</style>