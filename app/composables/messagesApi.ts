export interface MessageListDto {
    id: number;
    time: string;
    sender?: string;
    senderInitial?: string;
    text: string;
    categoryId: number;
    statusId: number;
}

export const useMessagesApi = () => {
    const client = useMessagesClient()

    const loadMessages = (categoryId: number) => {
        return client<MessageListDto[]>('/messages', {
            method: 'GET',
            query: {
                categoryId: categoryId
            }
        });
    }

    const loadBacklogMessages = () => {
        return client<MessageListDto[]>('/messages/backlog', {
            method: 'GET'
        });
    }

    return {
        loadMessages,
        loadBacklogMessages,
    }
}