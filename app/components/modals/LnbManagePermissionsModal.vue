<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";
import type {PermittableSpace} from "~/composables/organizationsApi";

const { getRoleKey } = useUtils()
const { getUserPermissions } = useOrganizationsApi()
const emit = defineEmits<{
  (e: 'close'): void,
}>()

const props = defineProps<{
  member: OrganizationMember,
  permittableEntities: PermittableSpace[],
}>()

const PERMS = [
  {
    id: AccessLevel.None,
    name: 'None',
  },
  {
    id: AccessLevel.Read,
    name: 'Read',
  },
  {
    id: AccessLevel.Create,
    name: 'Create',
  },
  {
    id: AccessLevel.Update,
    name: 'Update',
  },
  {
    id: AccessLevel.Delete,
    name: 'Delete',
  },
  {
    id: AccessLevel.Manage,
    name: 'Manage',
  },
];
const ORG_ROWS = [
  { type: 'organization', label: 'Organization', level: 1, parent: undefined, id: undefined },
  { type: 'spaces', label: 'Spaces (all)',  level: 2, parent: 'organization', id: undefined },
];

const permissions = ref(await getUserPermissions(props.member.organizationUserId))
const permittedRows = computed<{id: number | undefined, type: string, label: string, level: number, parent: string | undefined}[]>(() => {
  const rows = []
  rows.push(...ORG_ROWS)

  props.permittableEntities.forEach(s => {
    rows.push({ type: 'space', id: s.id, label: s.name, level: 3, parent: 'spaces'})
    for (const id of Object.keys(s.epics)) {
      const numberId = Number(id)
      const label = s.epics[numberId];
      rows.push({ type: 'epic', id: numberId, label: label, level: 4, parent: id})
    }
  })

  return rows
})

const togglePerm = (type: string, id: number | undefined, p: AccessLevel) => {
  // TODO - I Should use here flags. User can manage item, but be not allowed to edit smth. And new permissions can appear

  if (type === 'organization')
    permissions.value.organizationAccessLevel = p;

  if (type === 'spaces')
    permissions.value.spacesAccessLevels.accessLevel = p;

  if (type === 'space') {
    permissions.value.spacesAccessLevels.directAccess ??= {}
    permissions.value.spacesAccessLevels.directAccess[id!] = p
  }

  if (type === 'epic') {
    permissions.value.epicsAccessLevels.directAccess ??= {}
    permissions.value.epicsAccessLevels.directAccess[id!] = p
  }

  console.log(permissions.value)
}

const getCheckboxValue = (type: string, id: number | undefined, p: AccessLevel) => {
  if (type === 'organization')
    return permissions.value.organizationAccessLevel >= p;
  if (type === 'spaces')
    return (permissions.value.spacesAccessLevels?.accessLevel ?? AccessLevel.None) >= p;

  const directAccess = type == 'space'
    ? permissions.value.spacesAccessLevels?.directAccess
    : permissions.value.epicsAccessLevels?.directAccess

  let accessLevel = directAccess ? directAccess[id!] : AccessLevel.None;
  accessLevel ??= AccessLevel.None;
  return accessLevel >= p;
}

</script>

<template>
  <LnbModal
    title="Edit Permissions"
    @close="emit('close')"
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
    <div style="font-size:11px;color:var(--text3);background:var(--surface3);border-radius:8px;padding:8px 10px;margin-bottom:12px;line-height:1.5">
      ✦ Top-level grants override lower levels — disabled checkboxes are inherited.
      <br>✦ <strong style="color:var(--text2)">Spaces / Epics</strong> rows apply to all children.
    </div>

    <table class="perm-table">
      <thead>
      <tr>
        <th>Entity</th>
        <th v-for="p in PERMS" :key="p.id">
          {{ p.name }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in permittedRows" :key="row.id">
        <td>
          <span class="perm-entity" :class="'level-'+row.level">{{row.label}}</span>
        </td>
        <td v-for="p in PERMS" :key="p.id">
          <input
            type="radio"
            class="perm-check"
            :checked="getCheckboxValue(row.type, row.id, p.id)"
            @click="togglePerm(row.type, row.id, p.id)" />
        </td>
      </tr>
      </tbody>
    </table>
  </LnbModal>
</template>

<style scoped>
/* Permissions table */
.perm-table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:12px}
.perm-table th{text-align:center;padding:6px 4px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid var(--border)}
.perm-table th:first-child{text-align:left}
.perm-table td{padding:8px 4px;border-bottom:1px solid var(--border);vertical-align:middle;text-align:center}
.perm-table td:first-child{text-align:left}
.perm-table tr:last-child td{border-bottom:none}
.perm-entity{font-weight:600;color:var(--text);font-size:12px}
.perm-entity.level-1{padding-left:0}
.perm-entity.level-2{padding-left:16px;font-weight:500;color:var(--text2)}
.perm-entity.level-3{padding-left:32px;font-weight:400;color:var(--text3);font-size:11px}
.perm-entity.level-4{padding-left:48px;font-weight:300;color:var(--text3);font-size:11px}
.perm-check{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}
.perm-check:disabled{opacity:0.4;cursor:not-allowed}
.perm-inherited{color:var(--accent);font-size:11px;opacity:0.6}
</style>