export interface MessageListDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    text: string;
    categoryId: number;
    statusId: number;
    color: string;
    senderColor: string;
}

export interface CreateCardRequest {
    text: string;
    sender?: string;
    categoryId: number;
}

export const useMessagesApi = () => {
    const client = useMessagesClient()

    const loadMessages = (categoryId: number | null) => {
        return client<MessageListDto[]>('/messages', {
            method: 'GET',
            query: {
                categoryId: categoryId ?? undefined
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

    return {
        loadMessages,
        updateStatus,
        updateCategory,
        deleteMessage,
        createMessage,
    }
}