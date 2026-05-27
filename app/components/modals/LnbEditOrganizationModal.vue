<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import {type EditOrganizationRequest, useOrganizationsApi} from "~/composables/organizationsApi";

const props = defineProps<{
  organization: OrganizationListDto
}>()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'edit', value: EditOrganizationRequest): void
}>()

const { editOrganization } = useOrganizationsApi()

const request = ref<EditOrganizationRequest>({
  name: "",
  color: "",
  slug: ""
})

onMounted(() => {
  request.value.color = props.organization.color;
  request.value.name = props.organization.name;
  request.value.slug = props.organization.slug;
})

const { t } = useI18n();
const errors = ref<{ [key: string]: string[] }>({})

const editOrganizationInternal = async () => {
  try {
    await editOrganization(props.organization.id, request.value)
    emit('edit', request.value)
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
    :applyText="t('editOrganization')"
    :title="t('editOrganizationTitle')"
    @close="emit('close')"
    @cancel="emit('close')"
    @apply="editOrganizationInternal">

    <LnbModalLabel>
      {{ t('organizationName') }}
    </LnbModalLabel>
    <LnbModalInput
        focus
        @enter="emit('edit', request)"
        v-model="request.name"
        :placeholder="t('organizationNameExample')"/>

    <LnbModalLabel>
      {{ t('organizationSlug') }}
    </LnbModalLabel>
    <LnbModalInput
      :errors="errors['Slug']"
      v-model="request.slug"
      :placeholder="t('organizationSlugExample')"/>

    <LnbModalLabel>{{ t('color') }}</LnbModalLabel>
    <LnbColorPicker
      v-model="request.color"/>

  </LnbModal>
</template>

<style scoped>

</style>