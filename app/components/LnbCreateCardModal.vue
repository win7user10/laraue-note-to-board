<script setup lang="ts">

import type {CreateCardRequest} from "~/composables/messagesApi";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateCardRequest): void
}>()

const { appState } = useAppState()

const newCard = ref<CreateCardRequest>({
  text: "",
  categoryId: 0,
  sender: ""
})

onMounted(async () => {
  newCard.value.categoryId = appState.value.categoryId;
  newCard.value.sender = appState.value.user.username;
})

const createCard = () => {
  emit("create", newCard.value)
}

</script>

<template>
  <LnbModal
    applyText="Create"
    title="Create Card"
    @apply="createCard"
    @close="emit('close')">
    <LnbModalLabel>Text</LnbModalLabel>
    <LnbModalInput
        @enter="createCard"
        v-model="newCard.text"
        placeholder="e.g. Make onboarding for new team members..."/>
  </LnbModal>
</template>

<style scoped>

</style>