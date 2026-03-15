import {useCategoriesClient} from "~/composables/categoriesClient";
import type {EditStatusRequest} from "~/composables/statusesApi";

export interface CategoryCountDto {
    id: number;
    name: string;
    color: string;
    count: number;
    statusesCount: number;
}

export interface CreateCategoryRequest {
    name: string;
    color: string;
}

export interface CategoryDto {
    name: string;
    color: string;
    statuses: StatusDto[];
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

    const loadCategories = () => {
        return client<CategoryCountDto[]>('/categories/categories-with-count', {
            method: 'GET'
        });
    }

    const loadCategory = (id: number) => {
        return client<CategoryDto>('/categories/' + id, {
            method: 'GET'
        });
    }

    const createCategory = (request: CreateCategoryRequest) => {
        return client<number>('/categories', {
            method: 'POST',
            body: request
        });
    }

    const reorderStatuses = (id: number, sortOrderByStatus: { [id: number]: number }) => {
        return client<number>('/categories/' + id + '/reorder-statuses', {
            method: 'POST',
            body: sortOrderByStatus
        });
    }

    const editCategory = (id: number, request: EditCategoryRequest) => {
        return client('/categories/' + id, {
            method: 'PUT',
            body: request
        });
    }

    return {
        loadCategories,
        createCategory,
        loadCategory,
        reorderStatuses,
        editCategory,
    }
}