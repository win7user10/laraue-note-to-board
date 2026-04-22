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

export const useOrganizationsApi = () => {
    const client = useOrganizationsUserClient()

    const getOrganizations = () => {
        return client<OrganizationDto[]>('/organizations', {
            method: 'GET'
        });
    }

    const getOrganization = () => {
        const organizationsClient = useOrganizationsOrganizationClient()
        return organizationsClient<OrganizationDto>('/organizations/current', {
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

    return {
        getOrganizations,
        createOrganization,
        editOrganization,
        deleteOrganization,
        login,
        getOrganization,
    }
}