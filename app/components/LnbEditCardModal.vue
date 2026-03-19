<script setup lang="ts">
import type {EditCardRequest} from "~/composables/messagesApi";
import LnbModalTextarea from "~/components/LnbModalTextarea.vue";
import {ref} from "vue";
import {useUtils} from "~/composables/utils";

const props = defineProps<{
  id: number
}>()

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', request: EditCardRequest): void
}>()

const { formatDate } = useUtils()
const { getMessage } = useMessagesApi()

const request = ref<EditCardRequest>({
  content: ''
})

const data = ref<MessageDetailDto>()

onMounted(async () => {
  data.value = await getMessage(props.id);
  request.value.content = data.value.content;
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
      :modelValue="data?.sender ?? ''"
      disabled />

    <LnbModalLabel>{{ t('created') }}</LnbModalLabel>
    <LnbModalInput
      :modelValue="formatDate(data?.time)"
      disabled />

    <LnbModalLabel>{{ t('text') }}</LnbModalLabel>
    <LnbModalTextarea
      v-model="request.content"
      :placeholder="t('contentExample')"/>
  </LnbModal>
</template>

<style scoped>

</style>