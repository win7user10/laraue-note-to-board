<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";
import type { PermittableSpace, UserPermissions } from "~/composables/organizationsApi";
import LnbPermissionSectionTitle from "~/components/modals/permissions/LnbPermissionSectionTitle.vue";
import LnbPermissionSectionRow from "~/components/modals/permissions/LnbPermissionSectionRow.vue";

const { getRoleKey, hasFlag, addFlag, deleteFlag } = useUtils()
const { getUserPermissions } = useOrganizationsApi()
const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'update', value: UserPermissions): void,
}>()

const props = defineProps<{
  member: OrganizationMember,
  permittableEntities: PermittableSpace[],
}>()

const { t } = useI18n()

const READ = {
  id: EntityAccessLevel.Read,
  name: t('readAbbreviation'),
}

const CREATE = {
  id: EntityAccessLevel.Create,
  name: t('createAbbreviation'),
}

const UPDATE = {
  id: EntityAccessLevel.Update,
  name: t('updateAbbreviation'),
}

const DELETE = {
  id: EntityAccessLevel.Delete,
  name: t('deleteAbbreviation'),
}

const GLOBAL_PERMS = [READ, CREATE, UPDATE, DELETE];
const SELF_PERMS = [READ, UPDATE, DELETE];
const EPICS_ISSUES_PERMS = [CREATE, UPDATE, DELETE];

const ADMIN_PERMS = [
  {
    name: t('organization'),
    perms: [
      {
        id: AdminAccessLevel.UpdateOrganization,
        name: t('update'),
      },
      {
        id: AdminAccessLevel.DeleteOrganization,
        name: t('delete'),
      }
    ],
  },
  {
    name: t('permissions'),
    perms: [
      {
        id: AdminAccessLevel.Manage,
        name: t('manage'),
      }
    ]
  }
];

const permissions = ref(await getUserPermissions(props.member.organizationUserId))
const permittedRows = computed(() => {
  return props.permittableEntities;
})

const toggleFlag = <T extends number>(currentValue: T, valueToToggle: T) => {
  if (hasFlag(currentValue, valueToToggle))
    return deleteFlag(currentValue, valueToToggle)
  return addFlag(currentValue, valueToToggle)
}

const isGlobalSpacesInherited = (level: EntityAccessLevel) => {
  if (isValueInherited(permissions.value.global.spaces, level))
    return true;
  if (level === EntityAccessLevel.Read)
    return isValueInherited(permissions.value.global.epics, level) || isValueInherited(permissions.value.global.issues, level);
  return false;
}

const isGlobalEpicsInherited = (level: EntityAccessLevel) => {
  if (hasFlag(permissions.value.global.spaces, level))
    return true;
  if (isValueInherited(permissions.value.global.epics, level))
    return true;
  return false;
}

const isGlobalIssuesInherited = (level: EntityAccessLevel) => {
  if (hasFlag(permissions.value.global.spaces, level))
    return true;
  if (hasFlag(permissions.value.global.epics, level))
    return true;
  return isValueInherited(permissions.value.global.issues, level)
}

const toggleGlobalSpaces = (level: EntityAccessLevel) => {
  permissions.value.global.spaces = toggleFlag(permissions.value.global.spaces, level)
}

const toggleGlobalEpics = (level: EntityAccessLevel) => {
  permissions.value.global.epics = toggleFlag(permissions.value.global.epics, level)
}

const toggleGlobalIssues = (level: EntityAccessLevel) => {
  permissions.value.global.issues = toggleFlag(permissions.value.global.issues, level)
}

const isSpaceSelfAccessInherited = (spaceId: number, level: EntityAccessLevel) => {
  const castedLevel = level as unknown as EntityAccessLevel
  if (hasFlag(permissions.value.global.spaces, castedLevel) || isGlobalSpacesInherited(castedLevel))
    return true;
  if (!hasDirectSpacePermission(spaceId))
    return false;
  const value = permissions.value.direct[spaceId]!.self;
  if (level === EntityAccessLevel.Read)
    return shouldAddReadForEntity(value);
  return false;
}

const isSpaceEpicsInherited = (spaceId: number, level: EntityAccessLevel) => {
  if (hasFlag(permissions.value.global.epics, level) || isGlobalEpicsInherited(level))
    return true;
  if (!hasDirectSpacePermission(level))
    return false;
  if (isValueInherited(permissions.value.direct[spaceId]!.epics, level) || isSpaceIssuesInherited(spaceId, level))
    return true;
  return level === EntityAccessLevel.Read && hasFlag(permissions.value.direct[spaceId]!.issues, level);
}

const isSpaceIssuesInherited = (spaceId: number, level: EntityAccessLevel) => {
  if (hasFlag(permissions.value.global.issues, level) || isGlobalIssuesInherited(level))
    return true;
  if (!hasDirectSpacePermission(level))
    return false;
  return isValueInherited(permissions.value.direct[spaceId]!.issues, level)
};

const isValueInherited = (valueToCheck: EntityAccessLevel, level: EntityAccessLevel) => {
  if (level === EntityAccessLevel.Read)
    return shouldAddRead(valueToCheck);
  return false;
}

const isValueOfEntityInherited = (valueToCheck: EntityAccessLevel, level: EntityAccessLevel) => {
  if (level === EntityAccessLevel.Read)
    return shouldAddReadForEntity(valueToCheck);
  return false;
}

const toggleSpaceSelfAccess = (spaceId: number, level: EntityAccessLevel) => {
  const space = getOrAddSpacePermission(spaceId);
  space.self = toggleFlag(space.self, level)
}

const toggleSpaceEpicsAccess = (spaceId: number, level: EntityAccessLevel) => {
  const space = getOrAddSpacePermission(spaceId);
  space.epics = toggleFlag(space.epics, level)
}

const toggleSpaceIssuesAccess = (spaceId: number, level: EntityAccessLevel) => {
  const space = getOrAddSpacePermission(spaceId);
  space.issues = toggleFlag(space.issues, level)
}

const getOrAddSpacePermission = (spaceId: number) => {
  if (!hasDirectSpacePermission(spaceId))
    permissions.value.direct[spaceId] = {
      epics: EntityAccessLevel.None,
      issues: EntityAccessLevel.None,
      self: EntityAccessLevel.None,
    };
  return permissions.value.direct[spaceId]!
}

const hasDirectSpacePermission = (spaceId: number) => {
  const value = permissions.value.direct[spaceId];
  return !!value;
}

const shouldAddRead = (level: EntityAccessLevel) => {
  return hasFlag(level, EntityAccessLevel.Create) || hasFlag(level, EntityAccessLevel.Update) || hasFlag(level, EntityAccessLevel.Delete)
}

const shouldAddReadForEntity = (level: EntityAccessLevel) => {
  return hasFlag(level, EntityAccessLevel.Update) || hasFlag(level, EntityAccessLevel.Delete)
}

enum PermissionTab {
  Global,
  Direct,
  Admin,
}

const tab = ref(PermissionTab.Global)
const expandedSpaces = ref<Set<number>>(new Set())

const toggleDirectSpace = (id: number) => {
  return expandedSpaces.value.has(id) ? expandedSpaces.value.delete(id) : expandedSpaces.value.add(id)
}

</script>

<template>
  <LnbModal
    title="Edit Permissions"
    @close="emit('close')"
    @cancel="emit('close')"
    @apply="emit('update', permissions)"
    apply-text="Save">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px; margin-top:14px;">
      <LnbCardAvatar :color="member.color">
        {{ props.member.initials?.toUpperCase() }}
      </LnbCardAvatar>
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text)"> {{ member.firstName }} {{member.lastName}} </div>
        <div style="font-size:10px;color:var(--text3)">@{{member.username}} · {{ getRoleKey(member) }}</div>
      </div>
    </div>

    <!-- Three tabs -->
    <div style="display:flex;gap:4px;margin-bottom:12px">
      <div class="org-panel-tab" :class="{active: tab === PermissionTab.Global }" @click="tab = PermissionTab.Global">Organization</div>
      <div class="org-panel-tab" :class="{active: tab === PermissionTab.Direct }" @click="tab = PermissionTab.Direct">By Space</div>
      <div class="org-panel-tab" :class="{active: tab === PermissionTab.Admin }" @click="tab = PermissionTab.Admin">Administrative</div>
    </div>

    <div v-if="tab === PermissionTab.Global">

      <div style="font-size:11px;color:var(--text3);background:var(--surface3);border-radius:8px;padding:8px 10px;margin-bottom:12px;line-height:1.5">
        ✦ Grants apply to <strong style="color:var(--text2)">all</strong> spaces, epics and issues in the organization.
        <br>✦ Granting <strong style="color:var(--accent)">Read</strong> on Issues implies navigation access to all Spaces and Epics.
      </div>

      <div class="perm-section">
        <!-- Column headers: C R U D -->
        <LnbPermissionSectionTitle title="Spaces Access" :column-names="GLOBAL_PERMS.map(x => x.name)" />

        <!-- Spaces row -->
        <LnbPermissionSectionRow
          title="Level"
          :columns="GLOBAL_PERMS"
          :checked="id => hasFlag(permissions.global.spaces, id)"
          :inherited="id => isGlobalSpacesInherited(id)"
          @change="id => toggleGlobalSpaces(id)"/>

        <LnbPermissionSectionTitle title="Children Access" :column-names="EPICS_ISSUES_PERMS.map(x => x.name)" />

        <!-- Epics row -->
        <LnbPermissionSectionRow
          title="Epics"
          :columns="EPICS_ISSUES_PERMS"
          :checked="id => hasFlag(permissions.global.epics, id)"
          :inherited="id => isGlobalEpicsInherited(id)"
          @change="id => toggleGlobalEpics(id)"/>

        <!-- Issues row -->
        <LnbPermissionSectionRow
          title="Issues"
          :columns="EPICS_ISSUES_PERMS"
          :checked="id => hasFlag(permissions.global.issues, id)"
          :inherited="id => isGlobalIssuesInherited(id)"
          @change="id => toggleGlobalIssues(id)"/>

      </div>
    </div>

    <div v-if="tab === PermissionTab.Direct">

      <div style="font-size:10px;color:var(--text3);margin-bottom:10px;line-height:1.5;background:var(--surface3);padding:8px 10px;border-radius:8px">
        ✦ C/U/D are explicit — granting Update on Issues does not affect Epics.
        <br>✦ Granting <strong style="color:var(--accent)">Read</strong> on Issues or Epics automatically gives read-only navigation access to the parent Space.
      </div>

      <div class="perm-section" style="margin-bottom:8px" v-for="permission in permittedRows">

        <!-- Space header row -->
        <div style="display:flex;align-items:center;padding:8px 10px;background:var(--surface3);cursor:pointer;border-bottom:1px solid var(--border)"
          @click="toggleDirectSpace(permission.id)">
          <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0">
            <div style="width:9px;height:9px;border-radius:50%;flex-shrink:0" :style="{ background: permission.color }"></div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">{{ permission.name }}</div>
          </div>
          <div class="perm-expand-btn" :class="{open: expandedSpaces.has(permission.id)}">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 2l4 3-4 3"/></svg>
            {{ expandedSpaces.has(permission.id) ? 'hide' : 'show' }}
          </div>
        </div>

        <template v-if="expandedSpaces.has(permission.id)">

          <LnbPermissionSectionTitle title="Self Access" :column-names="SELF_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            title="Space"
            :columns="SELF_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.self, id)"
            :inherited="id => isSpaceSelfAccessInherited(permission.id, id)"
            @change="id => toggleSpaceSelfAccess(permission.id, id)"/>

          <!-- Global Children in Space -->
          <LnbPermissionSectionTitle title="Children Access" :column-names="EPICS_ISSUES_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            title="Epics"
            :columns="EPICS_ISSUES_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.epics, id)"
            :inherited="id => isSpaceEpicsInherited(permission.id, id)"
            @change="id => toggleSpaceEpicsAccess(permission.id, id)"/>
          <LnbPermissionSectionRow
            title="Issues"
            :columns="EPICS_ISSUES_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.issues, id)"
            :inherited="id => isSpaceIssuesInherited(permission.id, id)"
            @change="id => toggleSpaceIssuesAccess(permission.id, id)" />
        </template>

      </div>

    </div>
    <div v-if="tab === PermissionTab.Admin" class="perm-section">
      <template v-for="adminPerm in ADMIN_PERMS">
        <LnbPermissionSectionTitle :title="adminPerm.name" :column-names="['']" />
        <LnbPermissionSectionRow
          v-for="perm in adminPerm.perms"
          :title="perm.name" :columns="[perm]"
          :checked="id => hasFlag(permissions.admin, id)"
          :inherited="_ => false"
          @change="id => permissions.admin = toggleFlag(permissions.admin, id)"
        />
      </template>
    </div>

  </LnbModal>
</template>

<style scoped>
/* Permissions table */
/* PERMISSIONS TABLE */
.perm-section{border:1px solid var(--border);border-radius:var(--radius);margin-bottom:8px;overflow:hidden}
.perm-expand-btn{display:flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:var(--text3);cursor:pointer;padding:2px 6px;border-radius:10px;border:1px solid var(--border);background:var(--surface3);transition:all 0.12s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.perm-expand-btn:hover{border-color:var(--accent);color:var(--accent)}
.perm-expand-btn svg{width:9px;height:9px;transition:transform 0.15s}
.perm-expand-btn.open svg{transform:rotate(90deg)}

.org-panel-tab{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;color:var(--text3);transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.org-panel-tab.active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}
</style>