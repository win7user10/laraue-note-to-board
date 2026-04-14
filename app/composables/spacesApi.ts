export interface CreateSpaceRequest {
    name: string;
    color: string;
}

export interface EditSpaceRequest {
    name: string;
    color: string;
}

export interface SpaceDto {
    id: number;
    name: string;
    color: string;
}

export const useSpacesApi = () => {
    const client = useSpacesClient()

    const getSpaces = () => {
        return client<SpaceDto[]>('/spaces', {
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

    return {
        createSpace,
        deleteSpace,
        editSpace,
        getSpaces,
    }
}