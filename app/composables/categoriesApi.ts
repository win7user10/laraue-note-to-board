import {useCategoriesClient} from "~/composables/categoriesClient";

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

    return {
        loadCategories,
        createCategory,
        loadCategory,
        reorderStatuses,
    }
}