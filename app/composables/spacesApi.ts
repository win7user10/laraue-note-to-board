export interface CreateSpaceRequest {
    name: string;
    color: string;
}

export interface EditSpaceRequest {
    name: string;
    color: string;
}

export interface SpaceDto {
    canCreateEpics: boolean;
}

export interface SpaceListDto {
    id: number;
    name: string;
    color: string;
    epicsCount: number;
    canUpdate: boolean;
    canDelete: boolean;
}
export interface EpicCountDto {
    id: number;
    name: string;
    color: string;
    issuesCount: number;
    statusesCount: number;
    touchedAt: string;
    isDefault: boolean;
}

export interface EditSpaceRequest {
    name: string;
    color: string;
}

export const useSpacesApi = () => {
    const client = useSpacesClient()

    const getSpaces = () => {
        return client<SpaceListDto[]>('/spaces', {
            method: 'GET'
        });
    }

    const getSpace = (id: number) => {
        return client<SpaceDto>('/spaces/' + id, {
            method: 'GET'
        });
    }

    const createSpace = (request: CreateSpaceRequest) => {
        return client<number>('/spaces', {
            method: 'POST',
            body: request
        });
    }

    const deleteSpace = (id: number) => {
        return client('/spaces/' + id, {
            method: 'DELETE'
        });
    }

    const editSpace = (id: number, request: EditSpaceRequest) => {
        return client('/spaces/' + id, {
            method: 'PUT',
            body: request
        });
    }

    const loadSpaceEpics = (spaceId: number) => {
        return client<EpicCountDto[]>('/spaces/' + spaceId + '/epics', {
            method: 'GET'
        });
    }

    return {
        createSpace,
        deleteSpace,
        editSpace,
        getSpaces,
        loadSpaceEpics,
        getSpace,
    }
}