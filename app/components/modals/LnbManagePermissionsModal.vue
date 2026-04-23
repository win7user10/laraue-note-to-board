<script setup lang="ts">
import LnbModal from "~/components/modals/LnbModal.vue";

const { getRoleKey } = useUtils()
const { getUserPermissions } = useOrganizationsApi()
const emit = defineEmits<{
  (e: 'close'): void,
}>()

const props = defineProps<{
  member: OrganizationMember,
  permittableEntities: PermittableEntities,
}>()

const PERMS = ['manage','create','read','update','delete'];
const ORG_ROWS = [
  { id: 'org',         label: 'Organization',  level: 1, parent: null },
  { id: 'spacesGroup', label: 'Spaces (all)',  level: 2, parent: 'org' },
];

const EPIC_ROWS = [
  { id: 'epicsGroup',  label: 'Epics (all)',   level: 2, parent: 'org' },
];

const permissions = ref(await getUserPermissions(props.member.organizationUserId))
const permittedRows = computed<{id: any, label: string, level: number, parent: string | null}[]>(() => {
  const rows = []
  rows.push(...ORG_ROWS)

  for (const id of Object.keys(props.permittableEntities.spaces)) {
    const numberId = Number(id)
    const label = props.permittableEntities.spaces[numberId];
    rows.push({ id: id, label: label, level: 3, parent: 'spacesGroup'})
  }

  rows.push(...EPIC_ROWS)
  for (const id of Object.keys(props.permittableEntities.epics)) {
    const numberId = Number(id)
    const label = props.permittableEntities.epics[numberId];
    rows.push({ id: numberId, label: label, level: 3, parent: 'epicsGroup'})
  }

  return rows
})

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
        <th v-for="p in PERMS" :key="p">
          {{p[0]!.toUpperCase() + p.slice(1)}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in permittedRows" :key="row">
        <td>
          <span class="perm-entity" :class="'level-'+row.level">{{row.label}}</span>
        </td>
        <td v-for="p in PERMS" :key="p">
          <input
              type="checkbox"
              class="perm-check"
          />
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
.perm-check{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}
.perm-check:disabled{opacity:0.4;cursor:not-allowed}
.perm-inherited{color:var(--accent);font-size:11px;opacity:0.6}
</style>