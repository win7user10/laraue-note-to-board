export interface GetOrganizationsResponse {
    personalOrganizationSpacesCount?: number;
    organizations: OrganizationDto[];
}

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
    const client = useOrganizationsClient()

    const getOrganizations = () => {
        return client<GetOrganizationsResponse>('/organizations', {
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

    return {
        getOrganizations,
        createOrganization,
        editOrganization,
        deleteOrganization,
    }
}