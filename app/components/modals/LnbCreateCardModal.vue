<script setup lang="ts">

import type {CreateCardRequest} from "~/composables/messagesApi";
import LnbModalTextarea from "~/components/modals/LnbModalTextarea.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateCardRequest): void
}>()

const { t } = useI18n();

const props = defineProps<{
  statusId: number,
}>()

const newCard = ref<CreateCardRequest>({
  content: "",
  statusId: props.statusId,
})

const createCard = () => {
  emit("create", newCard.value)
}

</script>

<template>
  <LnbModal
    :applyText="t('create')"
    :title="t('createCard')"
    @apply="createCard"
    @close="emit('close')">
    <LnbModalLabel>{{ t('text') }}</LnbModalLabel>
    <LnbModalTextarea
        @enter="createCard"
        focus
        v-model="newCard.content"
        :placeholder="t('contentExample')"/>
  </LnbModal>
</template>

<style scoped>

</style>