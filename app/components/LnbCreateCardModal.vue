<script setup lang="ts">

import type {CreateCardRequest} from "~/composables/messagesApi";
import LnbModalTextarea from "~/components/LnbModalTextarea.vue";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateCardRequest): void
}>()

const { appState } = useAppState()
const { t } = useI18n();

const newCard = ref<CreateCardRequest>({
  content: "",
  categoryId: 0,
  statusId: 0,
})

const props = defineProps<{
  statusId: number,
}>()

onMounted(async () => {
  newCard.value.categoryId = appState.value.categoryId;
  newCard.value.statusId = props.statusId;
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
        v-model="newCard.content"
        :placeholder="t('contentExample')"/>
  </LnbModal>
</template>

<style scoped>

</style>