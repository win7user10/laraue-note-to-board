<script setup lang="ts">

import LnbColorPicker from "~/components/LnbColorPicker.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import type {EditSpaceRequest} from "~/composables/spacesApi";

const props = defineProps<{
  space: SpaceListDto
}>()

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const { editSpace } = useBoard();
const { getEmptyErrorsObject } = useUtils();

const request = ref<EditSpaceRequest>({
  name: "",
  color: "",
  key: ""
})

onMounted(() => {
  request.value.color = props.space.color;
  request.value.name = props.space.name;
  request.value.key = props.space.key;
})

const { t } = useI18n();

const errors = ref(getEmptyErrorsObject())
const editSpaceInternal = async () => {
  try {
    await editSpace(props.space.id, request.value);
    emit("close")
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      errors.value = error.errors;
    } else {
      throw error;
    }
  }
}

</script>

<template>
  <LnbModal
    :applyText="t('editSpace')"
    :title="t('editSpaceTitle')"
    @close="emit('close')"
    @cancel="emit('close')"
    @apply="editSpaceInternal">

    <LnbModalLabel>
      {{ t('spaceName') }}
    </LnbModalLabel>
    <LnbModalInput
        focus
        :errors="errors['Name']"
        v-model="request.name"
        :placeholder="t('spaceNameExample')"/>

    <LnbModalLabel>
      {{ t('key') }}
    </LnbModalLabel>
    <LnbModalInput
        v-model="request.key"
        :errors="errors['Key']"
        :placeholder="t('keyExample')"/>

    <LnbModalLabel>
      {{ t('color') }}
    </LnbModalLabel>
    <LnbColorPicker
        v-model="request.color"/>
  </LnbModal>
</template>

<style scoped>

</style>