import {useStatusesClient} from "~/composables/statusesClient";

export interface CreateStatusRequest {
    name: string;
    color: string;
    categoryId: number;
}

export interface EditStatusRequest {
    name: string;
    color: string;
}

export const useStatusesApi = () => {
    const client = useStatusesClient()

    const createStatus = (request: CreateStatusRequest) => {
        return client<number>('/statuses', {
            method: 'POST',
            body: request
        });
    }

    const deleteStatus = (id: number) => {
        return client('/statuses/' + id, {
            method: 'DELETE'
        });
    }

    const editStatus = (id: number, request: EditStatusRequest) => {
        return client('/statuses/' + id, {
            method: 'PUT',
            body: request
        });
    }

    return {
        createStatus,
        deleteStatus,
        editStatus,
    }
}