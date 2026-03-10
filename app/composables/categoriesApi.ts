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

export interface CategoryDto {
    name: string;
    color: string;
    statuses: StatusDto[];
}

export interface StatusDto {
    id: number;
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

    return {
        loadCategories,
        createCategory,
        loadCategory,
    }
}