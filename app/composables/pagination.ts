export interface PaginationData {
    page: number;
    perPage: number;
}

export interface FullPaginatedResult<T> extends ShortPaginatedResult<T>{
    total: number;
    lastPage: number;
}

export interface ShortPaginatedResult<T> {
    page: number;
    perPage: number;
    data: T[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage: number;
    total: number;
}