<script setup lang="ts">

import LnbModalLabel from "~/components/modals/LnbModalLabel.vue";
import LnbModalInput from "~/components/modals/LnbModalInput.vue";
import LnbModal from "~/components/modals/LnbModal.vue";
import LnbColorPicker from "~/components/LnbColorPicker.vue";
import {useAppState} from "~/composables/appState";
import {useOrganizationsApi} from "~/composables/organizationsApi";

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'create', value: OrganizationListDto): void
}>()

const { t } = useI18n();
const { getRandomColor } = useAppState();
const { createOrganization } = useOrganizationsApi()

const newOrganization = ref<CreateOrganizationRequest>({
  name: "",
  color: getRandomColor(),
  slug: ""
})

const errors = ref<{ [key: string]: string[] }>({})

const createOrganizationInternal = async () => {
  try {
    const result = await createOrganization(newOrganization.value)

    const organization = {
      id: result.id,
      name: newOrganization.value.name,
      color: newOrganization.value.color,
      isPersonal: false,
      canUpdate: true,
      canDelete: true,
      canCreateSpaces: true,
      slug: result.slug,
      slugPostfix: result.slugPostfix,
    }

    emit("create", organization)
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
    :applyText="t('createOrganization')"
    :title="t('newOrganization')"
    @close="emit('close')"
    @cancel="emit('close')"
    @apply="createOrganizationInternal">

    <LnbModalLabel>
      {{ t('organizationName') }}
    </LnbModalLabel>
    <LnbModalInput
      :errors="errors['Name']"
      focus
      v-model="newOrganization.name"
      :placeholder="t('organizationNameExample')"/>

    <LnbModalLabel>
      {{ t('organizationSlug') }}
    </LnbModalLabel>
    <LnbModalInput
      :errors="errors['Slug']"
      v-model="newOrganization.slug"
      :placeholder="t('organizationSlugExample')"/>

    <LnbModalLabel>
      {{ t('color') }}
    </LnbModalLabel>
    <LnbColorPicker
      v-model="newOrganization.color"/>

  </LnbModal>
</template>

<style scoped>

</style>