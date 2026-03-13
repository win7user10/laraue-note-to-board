import {useStatusesClient} from "~/composables/statusesClient";

export interface CreateStatusRequest {
    name: string;
    color: string;
    categoryId: number;
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

    return {
        createStatus,
        deleteStatus,
    }
}