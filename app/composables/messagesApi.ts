export interface MessageListDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    content: string;
    categoryId: number;
    statusId: number;
    color: string;
    senderColor: string;
}

export interface MessageDetailDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    content: string;
    categoryName?: string;
    statusName?: string;
    color: string;
    senderColor: string;
}

export interface CreateCardRequest {
    content: string;
    categoryId: number;
    statusId: number;
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

export const useMessagesApi = () => {
    const client = useMessagesClient()

    const loadMessages = (
        statusId: number | null,
        skip: number,
        take: number) => {
        return client<BatchResult<MessageListDto>>('/messages', {
            method: 'GET',
            query: {
                statusId: statusId ?? undefined,
                skip: skip,
                take: take,
            }
        });
    }

    const loadBoard = (
        categoryId: number | null,
        take: number) => {
        return client<ColumnMessages[]>('/messages/board', {
            method: 'GET',
            query: {
                categoryId: categoryId ?? undefined,
                take: take,
            }
        });
    }

    const updateStatus = (messageId: number, statusId: number | null) => {
        return client('/messages/' + messageId + '/status/' + statusId, {
            method: 'PUT'
        });
    }

    const updateCategory = (messageId: number, categoryId: number) => {
        return client('/messages/' + messageId + '/category/' + categoryId, {
            method: 'PUT'
        });
    }

    const deleteMessage = (id: number) => {
        return client('/messages/' + id, {
            method: 'DELETE'
        });
    }

    const createMessage = (request: CreateCardRequest) => {
        return client<number>('/messages', {
            method: 'POST',
            body: request
        });
    }

    const editMessage = (id: number, request: EditCardRequest) => {
        return client('/messages/' + id, {
            method: 'PUT',
            body: request
        });
    }

    const searchMessages = (request: SearchRequest) => {
        return client<FullPaginatedResult<MessageListDto>>('/messages/search', {
            method: 'GET',
            query: request
        });
    }

    const getMessage = (id: number) => {
        return client<MessageDetailDto>('/messages/' + id, {
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
        getMessage
    }
}