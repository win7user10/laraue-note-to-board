export enum AdminAccessLevel {
    None = 0,
    Manage = 1,
    UpdateOrganization = 2,
    DeleteOrganization = 4,
}

export enum ChildrenAccessLevel {
    None = 0,
    Read = 1,
    Create = 2,
    Update = 4,
    Delete = 8,
}

export enum EntityAccessLevel {
    None = 0,
    Read = 1,
    Update = 4,
    Delete = 8,
}