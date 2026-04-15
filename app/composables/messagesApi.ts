export interface MessageListDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    content?: string;
    categoryId: number;
    statusId: number;
    color: string;
    senderColor: string;
    media: MediaInfo[];
}

export interface MediaInfo {
    previewFileId?: string;
    originalFileId?: string;
    type: MediaType
}

export enum MediaType {
    Image,
    Video,
}

export interface MessageDetailDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    content: string;
    categoryName?: string;
    categoryColor?: string;
    statusName?: string;
    statusColor?: string;
    color: string;
    senderColor: string;
}

export interface CreateCardRequest {
    content: string;
    categoryId: number;
    statusId: number;
    spaceId: number;
}

export interface EditCardRequest {
    content: string;
}

export interface SearchRequest {
    searchString: string;
    page: number;
    perPage: number;
    categoryId: number | null;
}

export interface ColumnMessages {
    statusId: number;
    items: InitialBatchResult<MessageListDto>
}

export interface ColumnSummary{
    id: number;
    name: string;
    color: string;
    count: number;
    sortOrder: number;
}

export interface CategorySummary {
    id: number;
    name: string;
    color: string;
    columns: ColumnSummary[]
}

export const useMessagesApi = () => {
    const client = useMessagesClient()

    const loadMessages = (
        spaceId: number,
        statusId: number | null,
        skip: number,
        take: number,
        searchString: string) => {
        return client<BatchResult<MessageListDto>>('/issues', {
            method: 'GET',
            query: {
                spaceId: spaceId,
                statusId: statusId ?? undefined,
                skip: skip,
                take: take,
                searchString: searchString,
            }
        });
    }

    const loadBoard = (
        spaceId: number,
        categoryId: number,
        take: number,
        searchString: string) => {
        return client<ColumnMessages[]>('/issues/board', {
            method: 'GET',
            query: {
                categoryId: categoryId ?? undefined,
                take: take,
                searchString: searchString,
                spaceId: spaceId,
            }
        });
    }

    const updateStatus = (messageId: number, statusId: number | null) => {
        return client('/issues/' + messageId + '/status/' + statusId, {
            method: 'PUT'
        });
    }

    const updateCategory = (messageId: number, categoryId: number) => {
        return client('/issues/' + messageId + '/epic/' + categoryId, {
            method: 'PUT'
        });
    }

    const deleteMessage = (id: number) => {
        return client('/issues/' + id, {
            method: 'DELETE'
        });
    }

    const createMessage = (request: CreateCardRequest) => {
        return client<number>('/issues', {
            method: 'POST',
            body: request
        });
    }

    const editMessage = (id: number, request: EditCardRequest) => {
        return client('/issues/' + id, {
            method: 'PUT',
            body: request
        });
    }

    const searchMessages = (request: SearchRequest) => {
        return client<FullPaginatedResult<MessageListDto>>('/issues/search', {
            method: 'GET',
            query: request
        });
    }

    const getMessage = (id: number) => {
        return client<MessageDetailDto>('/issues/' + id, {
            method: 'GET'
        });
    }

    const getBoardSummary = () => {
        return client<CategorySummary[]>('/issues/summary', {
            method: 'GET'
        });
    }

    return {
        loadMessages,
        updateStatus,
        updateCategory,
        deleteMessage,
        createMessage,
        editMessage,
        searchMessages,
        loadBoard,
        getMessage,
        getBoardSummary,
    }
}