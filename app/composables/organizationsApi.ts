import {useOrganizationsOrganizationClient, useOrganizationsUserClient} from "~/composables/organizationsClient";

export interface OrganizationDto {
    id: number;
    name: string;
    color: string;
    spacesCount?: number;
    accessLevel: AccessLevel;
}

export interface CreateOrganizationRequest {
    name: string;
    color: string;
}

export interface EditOrganizationRequest {
    name: string;
    color: string;
}

export interface OrganizationMember {
    organizationUserId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    color: string;
    initials?: string;
    isOwner: boolean;
    accessLevel: AccessLevel;
}

export interface AccessLevels {
    accessLevel: AccessLevel;
    directAccess?: { [id: number]: AccessLevel };
}

export interface UserPermissions {
    organizationAccessLevel: AccessLevel
    spacesAccessLevels: AccessLevels
    epicsAccessLevels: AccessLevels
}

export interface PermittableSpace {
    id: number;
    name: string;
    epics: { [id: number]: string };
}

export const useOrganizationsApi = () => {
    const client = useOrganizationsUserClient()

    const getOrganizations = () => {
        return client<OrganizationDto[]>('/organizations', {
            method: 'GET'
        });
    }

    const createOrganization = (request: CreateOrganizationRequest) => {
        return client<number>('/organizations', {
            method: 'POST',
            body: request
        });
    }

    const editOrganization = (id: number, request: EditOrganizationRequest) => {
        return client('/organizations/' + id, {
            method: 'PUT',
            body: request
        });
    }

    const deleteOrganization = (id: number) => {
        return client('/organizations/' + id, {
            method: 'DELETE'
        });
    }

    const login = (organizationId: number) => {
        return client<string>('/organizations/login', {
            method: 'POST',
            body: {
                organizationId: organizationId
            }
        });
    }

    const getOrganization = () => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<OrganizationDto>('/organizations/current', {
            method: 'GET'
        });
    }

    const getOrganizationMembers = () => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<OrganizationMember[]>('/organizations/members', {
            method: 'GET'
        });
    }

    const getUserPermissions = (organizationUserId: number) => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<UserPermissions>('/organizations/permissions/' + organizationUserId, {
            method: 'GET'
        });
    }

    const setUserPermissions = (organizationUserId: number, permissions: UserPermissions) => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<UserPermissions>('/organizations/permissions/' + organizationUserId, {
            method: 'POST',
            body: {
                userPermissions: permissions
            }
        });
    }

    const getPermittableEntities = () => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<PermittableSpace[]>('/organizations/permittable-entities', {
            method: 'GET'
        });
    }

    return {
        getOrganizations,
        createOrganization,
        editOrganization,
        deleteOrganization,
        login,
        getOrganization,
        getOrganizationMembers,
        getUserPermissions,
        getPermittableEntities,
        setUserPermissions,
    }
}