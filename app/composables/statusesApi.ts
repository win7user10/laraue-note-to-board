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

    return {
        createStatus,
    }
}