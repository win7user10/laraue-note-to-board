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

const CHILD_PERMS = [
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
const SELF_PERMS = [
  {
    id: EntityAccessLevel.Read,
    name: 'RS',
  },
  {
    id: EntityAccessLevel.Update,
    name: 'US',
  },
  {
    id: EntityAccessLevel.Delete,
    name: 'DS',
  }
];


const CHILDREN_TYPE = 'children';
const SELF_TYPE = 'self';
const CHILD_AND_SELF_PERMS = [
    ...CHILD_PERMS.map(x => { return { id: x.id, name: x.name, type: CHILDREN_TYPE } }),
    ...SELF_PERMS.map(x => { return { id: x.id, name: x.name, type: SELF_TYPE } })];

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
  const value = permissions.value.direct[spaceId]!.self;
  if (level === EntityAccessLevel.Read)
    return shouldAddReadForEntity(value);
  return false;
}

const isSpaceEpicsInherited = (spaceId: number, level: ChildrenAccessLevel) => {
  if (isValueInherited(permissions.value.direct[spaceId]!.epics, level) || isSpaceIssuesInherited(spaceId, level))
    return true;
  return level === ChildrenAccessLevel.Read && hasFlag(permissions.value.direct[spaceId]!.issues, level);
}
const isSpaceIssuesInherited = (spaceId: number, level: ChildrenAccessLevel) => isValueInherited(permissions.value.direct[spaceId]!.issues, level);

const isSpaceEpicChecked = (spaceId: number, epicId: number, level: number, type: string) => {
  return type == CHILDREN_TYPE
      ? hasFlag(permissions.value.direct[spaceId]!.directEpics[epicId]!.issues, level)
      : hasFlag(permissions.value.direct[spaceId]!.directEpics[epicId]!.self, level)
}

const isSpaceEpicInherited = (spaceId: number, epicId: number, level: number, type: string) => {
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
        <LnbPermissionSectionTitle title="Children Access" :column-names="CHILD_PERMS.map(x => x.name)" />

        <!-- Spaces row -->
        <div class="perm-row">
          <div class="perm-row-label perm-indent-1" style="flex:1">
            <div class="perm-row-name dim" style="font-size:12px">Spaces</div>
          </div>
          <div v-for="k in CHILD_PERMS" :key="k.id" class="checkbox-column">
            <input type="checkbox" class="perm-check"
              :checked="hasFlag(permissions.global.spaces, k.id) || isGlobalSpacesInherited(k.id)"
              :disabled="isGlobalSpacesInherited(k.id)"
              :title="isGlobalSpacesInherited(k.id) ? 'Added automatically' : ''"
              @click="toggleGlobalSpaces(k.id)"/>
          </div>
        </div>

        <!-- Epics row -->
        <div class="perm-row">
          <div class="perm-row-label perm-indent-1" style="flex:1">
            <div class="perm-row-name dim" style="font-size:12px">Epics</div>
          </div>
          <div v-for="k in CHILD_PERMS" :key="k.id" class="checkbox-column">
            <input type="checkbox" class="perm-check"
              :checked="hasFlag(permissions.global.epics, k.id) || isGlobalEpicsInherited(k.id)"
              :disabled="isGlobalEpicsInherited(k.id)"
              :title="isGlobalEpicsInherited(k.id) ? 'Added automatically' : ''"
              @change="toggleGlobalEpics(k.id)"/>
          </div>
        </div>

        <!-- Issues row -->
        <div class="perm-row">
          <div class="perm-row-label perm-indent-1" style="flex:1">
            <div class="perm-row-name dim" style="font-size:12px">Issues</div>
          </div>
          <div v-for="k in CHILD_PERMS" :key="k.id" class="checkbox-column">
            <input type="checkbox" class="perm-check"
              :checked="hasFlag(permissions.global.issues, k.id) || isGlobalIssuesInherited(k.id)"
              :disabled="isGlobalIssuesInherited(k.id)"
              :title="isGlobalIssuesInherited(k.id) ? 'Added automatically' : ''"
              @click="toggleGlobalIssues(k.id)"/>
          </div>
        </div>
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
            <div style="width:9px;height:9px;border-radius:50%;background:#2f81f7;flex-shrink:0"></div>
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
            :inherited="id => hasDirectSpacePermission(permission.id) && isSpaceSelfAccessInherited(permission.id, id)"
            @change="id => toggleSpaceSelfAccess(permission.id, id)"/>

          <!-- Global Children in Space -->
          <LnbPermissionSectionTitle title="Children Access" :column-names="CHILD_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            title="Epics"
            :columns="CHILD_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.epics, id)"
            :inherited="id => hasDirectSpacePermission(permission.id) && isSpaceEpicsInherited(permission.id, id)"
            @change="id => toggleSpaceEpicsAccess(permission.id, id)"/>
          <LnbPermissionSectionRow
            title="Issues"
            :columns="CHILD_PERMS"
            :checked="id => hasDirectSpacePermission(permission.id) && hasFlag(permissions.direct[permission.id]!.issues, id)"
            :inherited="id => hasDirectSpacePermission(permission.id) && isSpaceIssuesInherited(permission.id, id)"
            @change="id => toggleSpaceIssuesAccess(permission.id, id)" />

          <!-- Direct Epics -->
          <LnbPermissionSectionTitle title="Direct Epics Access" :column-names="CHILD_AND_SELF_PERMS.map(x => x.name)" />
          <LnbPermissionSectionRow
            v-for="e in permission.epics"
            :key="e.id"
            :title="e.name"
            :color="e.color"
            :columns="CHILD_AND_SELF_PERMS"
            :checked="(id, type) => hasDirectEpicPermission(permission.id, e.id) && isSpaceEpicChecked(permission.id, e.id, id, type!)"
            :inherited="(id, type) => hasDirectEpicPermission(permission.id, e.id) && isSpaceEpicInherited(permission.id, e.id, id, type!)"
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
.perm-row{display:flex;align-items:center;gap:6px;padding:9px 10px;border-bottom:1px solid var(--border);transition:background 0.12s}
.perm-row:last-child{border-bottom:none}
.perm-row.inherited{opacity:0.6}
.perm-row-label{flex:1;min-width:0;display:flex;align-items:center;gap:5px}
.perm-row-name{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.perm-row-name.dim{color:var(--text3);font-weight:500}
.perm-row-name.accent{color:var(--accent)}
.perm-indent-1{padding-left:0}
.perm-indent-2{padding-left:14px}
.perm-indent-3{padding-left:28px}
.perm-indent-4{padding-left:42px}
.perm-checks{display:flex;gap:8px;flex-shrink:0}
.perm-col{width:34px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px}
.perm-col-label{font-size:8px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.4px}
.perm-check{width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0}
.perm-check:disabled{opacity:0.35;cursor:not-allowed}
.perm-inherited-chip{font-size:9px;font-weight:700;color:var(--accent);background:var(--accent-glow);border:1px solid var(--accent);border-radius:10px;padding:1px 7px;white-space:nowrap;flex-shrink:0}
.perm-expand-btn{display:flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:var(--text3);cursor:pointer;padding:2px 6px;border-radius:10px;border:1px solid var(--border);background:var(--surface3);transition:all 0.12s;flex-shrink:0;-webkit-tap-highlight-color:transparent}
.perm-expand-btn:hover{border-color:var(--accent);color:var(--accent)}
.perm-expand-btn svg{width:9px;height:9px;transition:transform 0.15s}
.perm-expand-btn.open svg{transform:rotate(90deg)}
.perm-hint{font-size:10px;color:var(--text3);font-style:italic;padding:4px 10px 6px;border-top:1px solid var(--border);background:var(--surface3)}
.perm-hint.accent{color:var(--accent)}
.perm-global-hint{font-size:10px;color:var(--accent);background:var(--accent-glow);border:1px solid var(--accent);border-radius:6px;padding:4px 8px;margin:4px 0;display:inline-flex;align-items:center;gap:4px}
.perm-check{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}
.perm-check:disabled{opacity:0.4;cursor:not-allowed}
.perm-inherited{color:var(--accent);font-size:11px;opacity:0.6}

.perm-check.inherited{opacity:0.6}

.org-panel-tab{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;color:var(--text3);transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.org-panel-tab.active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}
.checkbox-column{width:32px;display:flex;justify-content:center}
</style>