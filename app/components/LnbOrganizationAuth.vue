<script setup lang="ts">
import { useOrganizationsApi } from "~/composables/organizationsApi";
import LnbCreateOrganizationModal from "~/components/modals/LnbCreateOrganizationModal.vue";
import {ref} from "vue";
import LnbEditOrganizationModal from "~/components/modals/LnbEditOrganizationModal.vue";
import LnbDeleteOrganizationModal from "~/components/modals/LnbDeleteOrganizationModal.vue";

const { appState } = useAppState()
const { getOrganizations, createOrganization, editOrganization, deleteOrganization } = useOrganizationsApi()
const authUser = appState.value.user

const organizationsResponse = ref(await getOrganizations());

const modals = reactive({
  createOrganization: false,
  editOrganization: false,
  deleteOrganization: false
})

const loginPersonal = () => {
}

const editingOrganization = ref<OrganizationDto>()
const openEditOrganization = (org: OrganizationDto) => {
  editingOrganization.value = org
  modals.editOrganization = true;
}

const openDeleteOrganization = (org: OrganizationDto) => {
  editingOrganization.value = org
  modals.deleteOrganization = true;
}

const openCreateOrganization = () => {
  modals.createOrganization = true;
}

const createOrganizationInternal = async (request: CreateOrganizationRequest) => {
  const id = await createOrganization(request)
  organizationsResponse.value.organizations.push({
    id: id,
    spacesCount: 0,
    name: request.name,
    color: request.color,
    accessLevel: AccessLevel.Manage
  })
  modals.createOrganization = false;
}

const editOrganizationInternal = async (request: EditOrganizationRequest) => {
  await editOrganization(editingOrganization.value!.id, request)
  editingOrganization.value!.color = request.color
  editingOrganization.value!.name = request.name
  modals.editOrganization = false;
}

const deleteOrganizationInternal = async () => {
  await deleteOrganization(editingOrganization.value!.id)

  const index = organizationsResponse.value.organizations.findIndex(o => o.id === editingOrganization.value!.id)
  organizationsResponse.value.organizations.splice(index, 1)

  modals.deleteOrganization = false;
}

const loginOrg = (id: number) => {
}
</script>

<template>
  <div class="auth-screen">
    <div class="org-select-card">
      <div class="org-select-head">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <LnbCardAvatar :color="authUser?.color">
            {{authUser?.initials}}
          </LnbCardAvatar>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text)">{{authUser?.firstName}} {{authUser?.lastName}}</div>
            <div style="font-size:11px;color:var(--text3)">@{{authUser?.username}}</div>
          </div>
        </div>
        <div class="org-select-title">Choose workspace</div>
        <div class="org-select-sub">Select where you want to work</div>
      </div>
      <div class="org-select-body">
        <!-- Personal space -->
        <div class="org-item personal" @click="loginPersonal">
          <div class="org-item-avatar" :style="`background:${authUser?.color}`">{{authUser?.initials}}</div>
          <div class="org-item-info">
            <div class="org-item-name">Personal</div>
            <div class="org-item-sub">Your private boards</div>
          </div>
          <div class="org-enter-btn"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></div>
        </div>
        <!-- User's organizations -->
        <div v-for="org in organizationsResponse.organizations" :key="org.id" class="org-item">
          <div class="org-item-avatar" :style="`background:${org.color}`">{{org.name.toLocaleLowerCase().slice(0, 2)}}</div>
          <div class="org-item-info" @click="loginOrg(org.id)" style="cursor:pointer">
            <div class="org-item-name">{{org.name}}</div>
            <div class="org-item-sub">{{org.spacesCount}} spaces</div>
          </div>
          <div class="org-item-actions">
            <div class="org-item-btn" title="Edit" @click.stop="openEditOrganization(org)">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"/></svg>
            </div>
            <div class="org-item-btn danger" title="Delete" @click.stop="openDeleteOrganization(org)">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9"/></svg>
            </div>
            <div class="org-enter-btn"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></div>
          </div>
        </div>
        <!-- Create new org -->
        <div class="org-item" style="border-style:dashed;justify-content:center;gap:8px" @click="openCreateOrganization">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" style="width:15px;height:15px;color:var(--text3)"><path d="M8 3v10M3 8h10"/></svg>
          <span style="font-size:13px;font-weight:600;color:var(--text3)">New organization</span>
        </div>
      </div>
    </div>
  </div>
  <LnbCreateOrganizationModal
    v-if="modals.createOrganization"
    @create="createOrganizationInternal"
    @close="modals.createOrganization = false"/>
  <LnbEditOrganizationModal
    v-if="modals.editOrganization"
    :organization="editingOrganization!"
    @edit="editOrganizationInternal"
    @close="modals.editOrganization = false"/>
  <LnbDeleteOrganizationModal
    v-if="modals.deleteOrganization"
    @delete="deleteOrganizationInternal"
    @close="modals.deleteOrganization = false"/>
</template>

<style scoped>
/* AUTH SCREENS */
.auth-screen{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:99;padding:calc(20px + var(--safe-top)) calc(20px + var(--safe-right)) calc(20px + var(--safe-bottom)) calc(20px + var(--safe-left))}
/* Org selection screen */
.org-select-card{width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.4)}
.org-select-head{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
.org-select-title{font-size:16px;font-weight:800;color:var(--text);margin-bottom:2px}
.org-select-sub{font-size:12px;color:var(--text3)}
.org-select-body{padding:12px}
.org-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface3);margin-bottom:8px;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.org-item:hover{border-color:var(--accent);background:var(--accent-glow)}
.org-item.personal{border-style:dashed}
.org-item-avatar{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;color:#fff}
.org-item-info{flex:1;min-width:0}
.org-item-name{font-size:13px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.org-item-sub{font-size:11px;color:var(--text3)}
.org-item-actions{display:flex;gap:4px;flex-shrink:0}
.org-item-btn{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.org-item-btn:hover{border-color:var(--accent);color:var(--accent)}
.org-item-btn.danger:hover{border-color:var(--red);color:var(--red)}
.org-item-btn svg{width:12px;height:12px}
.org-enter-btn{width:26px;height:26px;border-radius:6px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.org-enter-btn svg{width:12px;height:12px}
</style>