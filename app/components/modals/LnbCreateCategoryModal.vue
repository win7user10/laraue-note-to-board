<script setup lang="ts">
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import {useAppState} from "~/composables/appState";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: CreateCategoryRequest): void
}>()

const { currentSpace } = useBoard()
const { t } = useI18n();

const { getRandomColor } = useAppState();

const newCategory = ref<CreateCategoryRequest>({
  name: "",
  color: getRandomColor(),
  spaceId: currentSpace.value!.id
})

const createCategory = () => {
  emit("create", newCategory.value)
}

</script>

<template>
  <LnbModal
    :applyText="t('createBoard')"
    :title="t('newCategoryBoard')"
    @close="emit('close')"
    @apply="createCategory">
    <LnbModalLabel>{{ t('categoryName') }}</LnbModalLabel>
    <LnbModalInput
      focus
      @enter="createCategory"
      v-model="newCategory.name"
      :placeholder="t('categoryNameExample')"/>
    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
      v-model="newCategory.color"/>
  </LnbModal>
</template>

<style scoped>

</style>