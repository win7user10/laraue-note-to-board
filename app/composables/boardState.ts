import { DefaultPagination } from "~/composables/pagination";
import {ref} from "vue";
import type {EditStatusRequest} from "~/composables/statusesApi";
const { showToast } = useAppState()

export interface MessageChanged {
    id: number;
    oldStatusId: number;
    newStatusId: number;
    oldCategoryId: number;
    newCategoryId: number;
}

export const useBoard = () => {
    const { t } = useI18n()

    const state = useState('boardState', () => ({
        messages: [] as ColumnMessages[],
        categories: [] as CategoryCountDto[],
        categoryId: 0,
        currentCategory: undefined as CategoryDto | undefined,
        searchString: '',
        openedMedia: [] as MediaInfo[],
        openedMediaIndex: 0,
    }))

    const messageChangedHandlers = [] as ((item: MessageChanged) => void)[];
    const addMessageChangedHandler = (handler: (item: MessageChanged) => void) => {
        messageChangedHandlers.push(handler)
    }

    const removeMessageChangedHandler = (handler: (item: MessageChanged) => void) => {
        const index = messageChangedHandlers.indexOf(handler);
        if (index !== -1) messageChangedHandlers.splice(index, 1);
    }

    const raiseMessageChanged = (change: MessageChanged) => {
        messageChangedHandlers.forEach((item) => item(change))
    }

    const setCategory = (id: number) => {
        state.value.searchString = ''
        state.value.categoryId = id
    }

    const search = async(searchString: string) => {
        state.value.searchString = searchString;
        await reloadBoard();
    }

    const reloadBoard = async () => {
        const messagesApi = useMessagesApi()
        state.value.messages = [];
        state.value.messages = await messagesApi.loadBoard(
            state.value.categoryId,
            DefaultPagination.perPage,
            state.value.searchString)

        const menuCategory = state.value.categories.find(c => c.id === state.value.categoryId)
        if (menuCategory)
            menuCategory.count = dbMessagesCount.value
    }

    const openMedia = (media: MediaInfo[], index: number) => {
        state.value.openedMediaIndex = index;
        state.value.openedMedia = media;
    }

    const closeMedia = () => {
        state.value.openedMedia = [];
    }

    const changeOpenedMediaIndex = (index: number) => {
        state.value.openedMediaIndex = index;
    }

    const reloadColumn = async (statusId: number, initialItemsCount: number) => {
        const messages = getMessagesByStatusId(statusId)!;

        // reload all already loaded
        const messagesApi = useMessagesApi()
        const result = await messagesApi.loadMessages(
            statusId,
            0,
            initialItemsCount,
            state.value.searchString)

        messages.items.data = result.data;
        messages.items.offset = result.offset;
        messages.items.hasNext = result.hasNext;
    }

    const reloadCategories = async () => {
        state.value.categories = [];
        const categoriesApi = useCategoriesApi()
        const data = await categoriesApi.loadCategories()
        const result = [{
            id: 0,
            name: t('backlog'),
            color: '#ff0000',
            count: data.backlogCount,
            statusesCount: 0,
        }]
        result.push(...data.categories)
        state.value.categories = result;
    }

    const createCard = async (value: CreateCardRequest) => {
        const messagesApi = useMessagesApi()
        await messagesApi.createMessage(value);

        // Create from the global creation modal
        if (!value.statusId)
            value.statusId = getDefaultStatus()?.id ?? 0

        const messagesByCategory = getMessagesByStatusId(value.statusId);

        // Create category should reload the column. Request the same count that was opened + 1
        const offset = messagesByCategory?.items?.offset;
        await reloadColumn(value.statusId, offset ? offset + 1 : DefaultPagination.perPage);

        // Update top menu counters
        const messageCategory = state.value.categories.find(c => c.id === value.categoryId)
        if (messageCategory)
            messageCategory.count++;

        // Update status counters
        if (messagesByCategory)
            messagesByCategory.items.totalCount++;

        const status = statuses.value.find(x => x.id === value.statusId);
        const subTitle = status ? `${state.value.currentCategory?.name} · ${status?.name}` : undefined;
        showToast(t('cardCreated'), 'success', subTitle);
    }

    const getDefaultStatus = () => {
        return statuses.value[0]
    }

    const loadingCols = ref<number[]>([]);
    const loadNextCards = async (statusId: number) => {
        if (loadingCols.value.includes(statusId))
            return;

        try {
            loadingCols.value.push(statusId);
            const item = getMessagesByStatusId(statusId)!.items;
            const messagesApi = useMessagesApi()
            const newMessages = await messagesApi.loadMessages(
                statusId,
                item.offset,
                DefaultPagination.perPage,
                state.value.searchString);

            item.data.push(...newMessages.data);
            item.offset = newMessages.offset;
            item.hasNext = newMessages.hasNext;
        } finally {
            const index = loadingCols.value.indexOf(statusId);
            loadingCols.value.splice(index, 1);
        }
    }

    const getMessagesByStatusId = (statusId: number) => {
        return state.value.messages.find(s => s.statusId === statusId)
    }

    const isColumnLoading = (statusId: number) => {
        return loadingCols.value.includes(statusId);
    }

    const isLoading = computed(() => {
        return loadingCols.value.length > 0;
    })

    const createCategory = async (value: CreateCategoryRequest) => {
        const categoriesApi = useCategoriesApi()
        const id = await categoriesApi.createCategory(value);
        state.value.categories.push({
            id: id,
            name: value.name,
            color: value.color,
            count: 0,
            statusesCount: 0,
        })
        showToast(t('boardCreated'), 'success', value.name);
        return id;
    }

    const updateCardCategory = async (cardId: number, categoryId: number) => {
        const messagesApi = useMessagesApi()
        await messagesApi.updateCategory(cardId, categoryId)
        const card = allCards.value.find(c => c.id === cardId)!;

        const newCategory = state.value.categories.find(c => c.id === categoryId)
        if (newCategory)
            newCategory.count += 1;

        const oldCategory = state.value.categories.find(c => c.id === card.categoryId)
        if (oldCategory)
            oldCategory.count -= 1;

        card.categoryId = categoryId;
        const messages = getMessagesByCardId(cardId);
        messages.items.totalCount -= 1;

        const index = messages.items.data.findIndex(c => c.id === cardId)
        messages.items.data.splice(index, 1);

        raiseMessageChanged({
            id: cardId,
            oldStatusId: card.statusId,
            newStatusId: card.statusId,
            newCategoryId: categoryId,
            oldCategoryId: oldCategory!.id ,
        })

        showToast(t('cardAssigned'), 'success', newCategory?.name);
    }

    const getMessagesByCardId = (cardId: number) => {
        const card = allCards.value.find(c => c.id === cardId)!;
        return getMessagesByStatusId(card.statusId)!
    }

    const editCard = async (id: number, value: EditCardRequest) => {
        const messagesApi = useMessagesApi()
        await messagesApi.editMessage(id, value);
        const card = allCards.value.find(x => x.id === id)
        if (card)
            card.content = value.content;
        showToast(t('cardEdited'), 'success');
    }

    const deleteCard = async (id: number) => {
        const messagesApi = useMessagesApi()
        await messagesApi.deleteMessage(id)

        const card = allCards.value.find(c => c.id === id)

        // update categories counter
        const cardCategory = state.value.categories.find(c => c.id === card!.categoryId)
        if (cardCategory)
            cardCategory.count--;

        // Drop from the board
        const columnMessages = getMessagesByStatusId(card!.statusId)!
        const cardIndex = columnMessages.items.data.indexOf(card!)
        columnMessages.items.data.splice(cardIndex, 1)

        // Decrease offset for correct future loading
        columnMessages.items.offset -= 1;
        columnMessages.items.totalCount -= 1;

        showToast(t('cardDeleted'), 'danger');
    }

    const editCategory = async (request: EditCategoryRequest) => {
        const categoriesApi = useCategoriesApi()
        await categoriesApi.editCategory(state.value.categoryId, request)
        const category = state.value.categories.find(c => c.id === state.value.categoryId)!
        category.color = request.color;
        category.name = request.name;

        state.value.currentCategory!.color = request.color;
        state.value.currentCategory!.name = request.name;

        showToast(t('boardUpdated'), 'success', request.name);
    }

    const deleteCategory = async () => {
        const categoriesApi = useCategoriesApi()
        await categoriesApi.deleteCategory(state.value.categoryId)
        const index = state.value.categories.findIndex(c => c.id === state.value.categoryId)
        state.value.categories.splice(index, 1);
        state.value.currentCategory = undefined;
        state.value.categoryId = 0;

        showToast(t('boardDeleted'), 'danger');
    }

    const deleteStatus = async (id: number) => {
        const statusApi = useStatusesApi()
        await statusApi.deleteStatus(id);

        const removingStatus = statuses.value.find(c => c.id === id)!;
        const removingStatusName = removingStatus.name;

        // Drop status and save how many items were opened in dropped column
        const removingIndex = state.value.messages.findIndex(c => c.statusId == id)
        const { offset, totalCount } = state.value.messages[removingIndex]!.items;
        state.value.messages.splice(removingIndex, 1)

        // Remove column
        const removeIndex = state.value.currentCategory!.statuses.findIndex(c => c.id === id);
        state.value.currentCategory!.statuses.splice(removeIndex, 1)

        // Reload first column, calculate new offset + total
        const firstStatus = statuses.value[0]!
        console.log(firstStatus)
        const firstColumnMessages = state.value.messages.find(s => s.statusId == firstStatus.id)!;
        firstColumnMessages.items.totalCount += totalCount;
        await reloadColumn(firstColumnMessages.statusId, firstColumnMessages.items.offset + offset);

        showToast(t('columnDeleted'), 'danger', removingStatusName);
    }

    const createStatus = async (value: CreateStatusRequest) => {
        const statusApi = useStatusesApi()
        const id = await statusApi.createStatus(value);
        const statuses = state.value.currentCategory?.statuses;
        if (!statuses)
            return;

        const lastOrder = Math.max(...statuses.map(x => x.sortOrder))
        state.value.currentCategory!.statuses.push({
            id: id,
            name: value.name,
            color: value.color,
            sortOrder: lastOrder + 1,
        })

        state.value.messages.push({
            statusId: id,
            items: {
                totalCount: 0,
                offset: 0,
                hasNext: false,
                data: []
            }
        });

        showToast(t('columnCreated'), 'success', value.name);
    }

    const editStatus = async (id: number, request: EditStatusRequest) => {
        const statusApi = useStatusesApi()
        await statusApi.editStatus(id, request);
        const status = statuses.value.find(c => c.id === id)!;
        status.color = request.color;
        status.name = request.name;
        showToast(t('columnEdited'), 'success', request.name);
    }

    const reloadCategory = async () => {
        state.value.currentCategory = undefined;
        const categoriesApi = useCategoriesApi()
        if (state.value.categoryId)
            state.value.currentCategory = await categoriesApi.loadCategory(state.value.categoryId)
    }

    const statuses = computed(() => {
        return state.value.currentCategory?.statuses
            .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
    })

    const allCards = computed(() => {
        return state.value.messages.flatMap(x => x.items.data)
    })

    const dbMessagesCount = computed(() => {
        return state.value.messages
            .flatMap(x => x.items.totalCount)
            .reduce((acc, x) => acc + x, 0)
    })

    const moveCard = async (cardId: number, categoryId: number, statusId: number) => {
        const card = allCards.value.find(m => m.id === cardId);
        if (!card) return;

        const messagesApi = useMessagesApi()
        await messagesApi.updateStatus(card.id, statusId);

        // update old column data
        const oldColumnMessages = getMessagesByStatusId(card!.statusId)!
        oldColumnMessages.items.data.splice(oldColumnMessages.items.data.indexOf(card), 1)
        oldColumnMessages.items.offset -= 1;
        oldColumnMessages.items.totalCount -= 1;

        // update new column data
        const newColumnMessages = getMessagesByStatusId(statusId)!
        newColumnMessages.items.data.push(card)
        newColumnMessages.items.totalCount += 1;
        await reloadColumn(statusId, newColumnMessages.items.offset + 1)

        // update card properties
        card.categoryId = categoryId!;
        card.statusId = statusId;

        // raise notifications
        const status = statuses.value.find(x => x.id === statusId);
        showToast(t('cardMoved'), 'default', status?.name)
    };

    const changeColumnOrder = async (statusId: number, newSortOrder: number) => {
        const cat = state.value.currentCategory;
        if (!cat) return;

        const idx = cat.statuses.findIndex(s => s.id === statusId);
        if (idx < 0) return;

        if (idx == newSortOrder)
            return;

        const newStatuses = [...cat.statuses];
        const [removed] = newStatuses.splice(idx, 1);
        newStatuses.splice(newSortOrder, 0, removed!);
        newStatuses.forEach((status, i) => {
            status.sortOrder = i;
        })

        const categoriesApi = useCategoriesApi()
        await categoriesApi.reorderStatuses(
            state.value.categoryId,
            Object.fromEntries(newStatuses.map(item => [item.id, item.sortOrder])))

        cat.statuses = newStatuses;
        showToast(t('columnReordered'), 'default')
    };

    return {
        state: readonly(state),
        reloadBoard,
        reloadCategories,
        reloadCategory,
        createCard,
        editCard,
        deleteCard,
        updateCardCategory,
        loadNextCards,
        isColumnLoading,
        createCategory,
        setCategory,
        editCategory,
        deleteCategory,
        createStatus,
        deleteStatus,
        statuses,
        moveCard,
        changeColumnOrder,
        dbMessagesCount,
        editStatus,
        openMedia,
        closeMedia,
        changeOpenedMediaIndex,
        addMessageChangedHandler,
        removeMessageChangedHandler,
        search,
        isLoading,
    }
}