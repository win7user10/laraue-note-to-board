<script setup lang="ts">
import type {EditCardRequest} from "~/composables/messagesApi";
import LnbModalTextarea from "~/components/LnbModalTextarea.vue";
import {ref} from "vue";
import {useUtils} from "~/composables/utils";

const props = defineProps<{
  message: MessageListDto
}>()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditCardRequest): void
}>()

const { formatDate } = useUtils()

const request = ref<EditCardRequest>({
  content: ''
})

onMounted(() => {
  request.value.content = props.message.content;
})
</script>

<template>
  <LnbModal
      applyText="Save"
      title="Edit Card"
      @apply="emit('edit', request)"
      @close="emit('close')">

    <LnbModalLabel>Sender Name</LnbModalLabel>
    <LnbModalInput
      :modelValue="message.sender ?? ''"
      disabled />

    <LnbModalLabel>Created</LnbModalLabel>
    <LnbModalInput
        :modelValue="formatDate(message.time)"
        disabled />

    <LnbModalLabel>Text</LnbModalLabel>
    <LnbModalTextarea
      v-model="request.content"
      placeholder="e.g. Make onboarding for new team members..."/>
  </LnbModal>
</template>

<style scoped>

</style>