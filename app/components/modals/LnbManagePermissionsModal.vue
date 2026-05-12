<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";
import type {DirectEpicAccessLevel, PermittableSpace, UserPermissions} from "~/composables/organizationsApi";
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

const GLOBAL_PERMS = [
  {
    id: ChildrenAccessLevel.Read,
    name: 'R',
  },
  {
    id: ChildrenAccessLevel.Create,
    name: 'C',
  },
  {
    id: ChildrenAccessLevel.Update,
    name: 'U',
  },
  {
    id: ChildrenAccessLevel.Delete,
    name: 'D',
  }
];

const CHILD_PERMS = [
  {
    id: ChildrenAccessLevel.Read,
    name: 'R (Is)',
  },
  {
    id: ChildrenAccessLevel.Create,
    name: 'C (Is)',
  },
  {
    id: ChildrenAccessLevel.Update,
    name: 'U (Is)',
  },
  {
    id: ChildrenAccessLevel.Delete,
    name: 'D (Is)',
  }
];

const SELF_PERMS = [
  {
    id: EntityAccessLevel.Read,
    name: 'R',
  },
  {
    id: EntityAccessLevel.Update,
    name: 'U',
  },
  {
    id: EntityAccessLevel.Delete,
    name: 'D',
  }
];

const CHILDREN_TYPE = 'children';
const SELF_TYPE = 'self';
const CHILD_AND_SELF_PERMS = [
  ...SELF_PERMS.map(x => { return { id: x.id, name: x.name, type: SELF_TYPE } }),
  ...CHILD_PERMS.map(x => { return { id: x.id, name: x.name, type: CHILDREN_TYPE } }),
];

const ADMIN_PERMS = [
  {
    name: 'Organization',
    perms: [
      {
        id: AdminAccessLevel.UpdateOrganization,
        name: 'Update',
      },
      {
        id: AdminAccessLevel.DeleteOrganization,
        name: 'Delete',
      }
    ],
  },
  {
    name: 'Permissions',
    perms: [
      {
        id: AdminAccessLevel.ManagePermissions,
        name: 'Manage',
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

const isGlobalSpacesInherited = (level: ChildrenAccessLevel) => {
  if (isValueInherited(permissions.value.global.spaces, level))
    return true;
  if (level === ChildrenAccessLevel.Read)
    return isGlobalEpicsInherited(level) || hasFlag(permissions.value.global.issues, ChildrenAccessLevel.Read) || hasFlag(permissions.value.global.epics, ChildrenAccessLevel.Read);
  return false;
}

const isGlobalEpicsInherited = (level: ChildrenAccessLevel) => {
  if (isValueInherited(permissions.value.global.epics, level))
    return true;
  if (level === ChildrenAccessLevel.Read)
    return isGlobalIssuesInherited(level) || hasFlag(permissions.value.global.issues, ChildrenAccessLevel.Read);
  return false;
}

const isGlobalIssuesInherited = (level: ChildrenAccessLevel) => isValueInherited(permissions.value.global.issues, level)

const toggleGlobalSpaces = (level: ChildrenAccessLevel) => {
  permissions.value.global.spaces = toggleFlag(permissions.value.global.spaces, level)
}

const toggleGlobalEpics = (level: ChildrenAccessLevel) => {
  permissions.value.global.epics = toggleFlag(permissions.value.global.epics, level)
}

const toggleGlobalIssues = (level: ChildrenAccessLevel) => {
  permissions.value.global.issues = toggleFlag(permissions.value.global.issues, level)
}

const isSpaceSelfAccessInherited = (spaceId: number, level: EntityAccessLevel) => {
  const castedLevel = level as unknown as ChildrenAccessLevel
  if (hasFlag(permissions.value.global.spaces, castedLevel) || isGlobalSpacesInherited(castedLevel))
    return true;
  if (!hasDirectSpacePermission(spaceId))
    return false;
  const value = permissions.value.direct[spaceId]!.self;
  if (level === EntityAccessLevel.Read)
    return shouldAddReadForEntity(value);
  return false;
}

const isSpaceEpicsInherited = (spaceId: number, level: ChildrenAccessLevel) => {
  if (hasFlag(permissions.value.global.epics, level) || isGlobalEpicsInherited(level))
    return true;
  if (!hasDirectSpacePermission(level))
    return false;
  if (isValueInherited(permissions.value.direct[spaceId]!.epics, level) || isSpaceIssuesInherited(spaceId, level))
    return true;
  return level === ChildrenAccessLevel.Read && hasFlag(permissions.value.direct[spaceId]!.issues, level);
}
const isSpaceIssuesInherited = (spaceId: number, level: ChildrenAccessLevel) => {
  if (hasFlag(permissions.value.global.issues, level) || isGlobalIssuesInherited(level))
    return true;
  if (!hasDirectSpacePermission(level))
    return false;
  return isValueInherited(permissions.value.direct[spaceId]!.issues, level)
};

const isSpaceEpicChecked = (spaceId: number, epicId: number, level: number, type: string) => {
  return type == CHILDREN_TYPE
      ? hasFlag(permissions.value.direct[spaceId]!.directEpics[epicId]!.issues, level)
      : hasFlag(permissions.value.direct[spaceId]!.directEpics[epicId]!.self, level)
}

const isSpaceEpicInherited = (spaceId: number, epicId: number, level: number, type: string) => {
  if (type == CHILDREN_TYPE && (hasFlag(permissions.value.global.issues, level) || isGlobalIssuesInherited(level)))
    return true;
  if (type == SELF_TYPE && (hasFlag(permissions.value.global.epics, level) || isGlobalEpicsInherited(level)))
    return true;

  if (!hasDirectEpicPermission(spaceId, epicId))
    return false;
  return type == CHILDREN_TYPE
    ? isValueInherited(permissions.value.direct[spaceId]!.directEpics[epicId]!.issues, level)
    : isValueOfEntityInherited(permissions.value.direct[spaceId]!.directEpics[epicId]!.self, level)
}

const isValueInherited = (valueToCheck: ChildrenAccessLevel, level: ChildrenAccessLevel) => {
  if (level === ChildrenAccessLevel.Read)
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

const toggleSpaceEpicsAccess = (spaceId: number, level: ChildrenAccessLevel) => {
  const space = getOrAddSpacePermission(spaceId);
  space.epics = toggleFlag(space.epics, level)
}

const toggleSpaceIssuesAccess = (spaceId: number, level: ChildrenAccessLevel) => {
  const space = getOrAddSpacePermission(spaceId);
  space.issues = toggleFlag(space.issues, level)
}

const toggleSpaceEpicAccess = (spaceId: number, epicId: number, level: number, type: string) => {
  const epic = getOrAddSpaceEpicPermission(spaceId, epicId);
  if (type == CHILDREN_TYPE)
    epic.issues = toggleFlag(epic.issues, level)
  else
    epic.self = toggleFlag(epic.self, level)
}

const getOrAddSpacePermission = (spaceId: number) => {
  if (!hasDirectSpacePermission(spaceId))
    permissions.value.direct[spaceId] = {
      epics: ChildrenAccessLevel.None,
      issues: ChildrenAccessLevel.None,
      self: EntityAccessLevel.None,
      directEpics: {}
    };
  return permissions.value.direct[spaceId]!
}

const getOrAddSpaceEpicPermission = (spaceId: number, epicId: number) => {
  const space = getOrAddSpacePermission(spaceId);
  if (!hasDirectEpicPermission(spaceId, epicId))
    space.directEpics[epicId] = {
      issues: ChildrenAccessLevel.None,
      self: EntityAccessLevel.None,
    }
  return space.directEpics[epicId]!
}

const hasDirectSpacePermission = (spaceId: number) => {
  const value = permissions.value.direct[spaceId];
  return !!value;
}

const hasDirectEpicPermission = (spaceId: number, epicId: number) => {
  if (!hasDirectSpacePermission(spaceId))
    return false;
  const value = permissions.value.direct[spaceId]!.directEpics[epicId];
  return !!value;
}

const shouldAddRead = (level: ChildrenAccessLevel) => {
  return hasFlag(level, ChildrenAccessLevel.Create) || hasFlag(level, ChildrenAccessLevel.Update) || hasFlag(level, ChildrenAccessLevel.Delete)
}

const shouldAddReadForEntity = (level: EntityAccessLevel) => {
  return hasFlag(level, EntityAccessLevel.Update) || hasFlag(level, EntityAccessLevel.Delete)
}

const disabledForDefaultEntity = (level: ChildrenAccessLevel) => {
  return level == ChildrenAccessLevel.Delete
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
      <div class="org-panel-tab" :class="{active: tab === PermissionTab.Direct }" @click="tab = PermissionTab.Direct">Direct</div>
      <div class="org-panel-tab" :class="{active: tab === PermissionTab.Admin }" @click="tab = PermissionTab.Admin">Administrative</div>
    </div>

    <div v-if="tab === PermissionTab.Global">

      <div style="font-size:11px;color:var(--text3);background:var(--surface3);border-radius:8px;padding:8px 10px;margin-bottom:12px;line-height:1.5">
        ✦ Grants apply to <strong style="color:var(--text2)">all</strong> spaces, epics and issues in the organization.
        <br>✦ Granting <strong style="color:var(--accent)">Read</strong> on Issues implies navigation access to all Spaces and Epics.
      </div>

      <div class="perm-section">
        <!-- Column headers: C R U D -->
        <LnbPermissionSectionTitle title="Children Access" :column-names="GLOBAL_PERMS.map(x => x.name)" />

        <!-- Spaces row -->
        <LnbPermissionSectionRow
          title="Spaces"
          :columns="GLOBAL_PERMS"
          :checked="id => hasFlag(permissions.global.spaces, id)"
          :inherited="id => isGlobalSpacesInherited(id)"
          @change="id => toggleGlobalSpaces(id)"/>

        <!-- Epics row -->
        <LnbPermissionSectionRow
          title="Epics"
          :columns="GLOBAL_PERMS"
          :checked="id => hasFlag(permissions.global.epics, id)"
          :inherited="id => isGlobalEpicsInherited(id)"
          @change="id => toggleGlobalEpics(id)"/>

        <!-- Issues row -->
        <LnbPermissionSectionRow
          title="Issues"
          :columns="GLOBAL_PERMS"
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
          <LnbPermissionSectionTitle title="Children Access" :column-names="GLOBAL_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            title="Epics"
            :columns="GLOBAL_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.epics, id)"
            :inherited="id => isSpaceEpicsInherited(permission.id, id)"
            @change="id => toggleSpaceEpicsAccess(permission.id, id)"/>
          <LnbPermissionSectionRow
            title="Issues"
            :columns="GLOBAL_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.issues, id)"
            :inherited="id => isSpaceIssuesInherited(permission.id, id)"
            @change="id => toggleSpaceIssuesAccess(permission.id, id)" />

          <!-- Direct Epics -->
          <LnbPermissionSectionTitle title="Direct Epics Access" :column-names="CHILD_AND_SELF_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            v-for="e in permission.epics"
            :key="e.id"
            :title="e.name + (e.isDefault ? ' (default)' : '')"
            :color="e.color"
            :columns="CHILD_AND_SELF_PERMS"
            :disabled="(id, type) => e.isDefault && type === SELF_TYPE && disabledForDefaultEntity(id)"
            :checked="(id, type) => hasDirectEpicPermission(permission.id, e.id) && isSpaceEpicChecked(permission.id, e.id, id, type!)"
            :inherited="(id, type) => isSpaceEpicInherited(permission.id, e.id, id, type!)"
            @change="(id, type) => toggleSpaceEpicAccess(permission.id, e.id, id, type!)"/>
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