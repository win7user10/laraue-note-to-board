export enum AdminAccessLevel {
    None = 0,
    ManagePermissions = 1,
    UpdateOrganization = 2,
    DeleteOrganization = 4,
    All = ManagePermissions | DeleteOrganization | UpdateOrganization,
}

export enum ChildrenAccessLevel {
    None = 0,
    Read = 1,
    Create = 2,
    Update = 4,
    Delete = 8,
    All = Read | Create | Update | Delete
}

export enum EntityAccessLevel {
    None = 0,
    Read = 1,
    Update = 4,
    Delete = 8,
    All = Read | Update | Delete
}