import {useCategoriesClient} from "~/composables/categoriesClient";

export interface CreateCategoryRequest {
    name: string;
    color: string;
    spaceId: number;
}

export interface EpicDto {
    name: string;
    color: string;
    statuses: StatusDto[];
    canViewIssues: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

export interface StatusDto {
    id: number;
    name: string;
    color: string;
    sortOrder: number;
}

export interface EditCategoryRequest {
    name: string;
    color: string;
}

export const useCategoriesApi = () => {
    const client = useCategoriesClient()

    const loadCategory = (id: number) => {
        return client<EpicDto>('/epics/' + id, {
            method: 'GET'
        });
    }

    const createCategory = (request: CreateCategoryRequest) => {
        return client<number>('/epics', {
            method: 'POST',
            body: request
        });
    }

    const reorderStatuses = (id: number, sortOrderByStatus: { [id: number]: number }) => {
        return client<number>('/epics/' + id + '/reorder-statuses', {
            method: 'POST',
            body: sortOrderByStatus
        });
    }

    const editCategory = (id: number, request: EditCategoryRequest) => {
        return client('/epics/' + id, {
            method: 'PUT',
            body: request
        });
    }

    const deleteCategory = (id: number) => {
        return client('/epics/' + id, {
            method: 'DELETE'
        });
    }

    return {
        createCategory,
        loadCategory,
        reorderStatuses,
        editCategory,
        deleteCategory,
    }
}