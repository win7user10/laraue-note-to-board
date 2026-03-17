<script setup lang="ts">
import type {EditCardRequest} from "~/composables/messagesApi";
import LnbModalTextarea from "~/components/LnbModalTextarea.vue";
import {ref} from "vue";
import {useUtils} from "~/composables/utils";

const props = defineProps<{
  message: MessageListDto
}>()

const { t } = useI18n();

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
      :applyText="t('save')"
      :title="t('editCard')"
      @apply="emit('edit', request)"
      @close="emit('close')">

    <LnbModalLabel>{{ t('sender') }}</LnbModalLabel>
    <LnbModalInput
      :modelValue="message.sender ?? ''"
      disabled />

    <LnbModalLabel>{{ t('created') }}</LnbModalLabel>
    <LnbModalInput
        :modelValue="formatDate(message.time)"
        disabled />

    <LnbModalLabel>{{ t('text') }}</LnbModalLabel>
    <LnbModalTextarea
      v-model="request.content"
      :placeholder="t('contentExample')"/>
  </LnbModal>
</template>

<style scoped>

</style>