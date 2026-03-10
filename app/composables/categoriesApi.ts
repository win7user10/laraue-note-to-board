import {useCategoriesClient} from "~/composables/categoriesClient";

export interface CategoryCountDto {
    id: number;
    name: string;
    color: string;
    count: number;
}

export const useCategoriesApi = () => {
    const client = useCategoriesClient()

    const loadCategories = () => {
        return client<CategoryCountDto[]>('/categories/categories-with-count', {
            method: 'GET'
        });
    }

    return {
        loadCategories,
    }
}