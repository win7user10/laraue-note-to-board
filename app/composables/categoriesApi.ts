import {useCategoriesClient} from "~/composables/categoriesClient";

export interface CategoryCountDto {
    id: number;
    name: string;
    color: string;
    count: number;
}

export interface CreateCategoryRequest {
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

    const createCategory = (request: CreateCategoryRequest) => {
        return client<number>('/categories', {
            method: 'POST',
            body: request
        });
    }

    return {
        loadCategories,
        createCategory,
    }
}