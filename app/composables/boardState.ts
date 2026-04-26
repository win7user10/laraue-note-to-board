import { DefaultPagination } from "~/composables/pagination";
import {ref} from "vue";
import type {EditStatusRequest} from "~/composables/statusesApi";
const { showToast, appState, updateSpaceId } = useAppState()

export const useBoard = () => {
    const { t } = useI18n()
    const { now } = useUtils();

    const state = useState('boardState', () => ({
        messages: [] as ColumnMessages[],
        categories: [] as CategoryCountDto[],
        spaces: [] as SpaceDto[],
        noSpaceEpicsCount: 0,
        categoryId: 0,
        currentCategory: undefined as CategoryDto | undefined,
        searchString: '',
        openedMedia: [] as MediaInfo[],
        openedMediaIndex: 0,
    }))

    const spaces = computed(() => {
        return state.value.spaces.sort((a, b) => a.name.localeCompare(b.name));
    })

    const spaceId = computed(() => {
        let val = appState.value.userPreferences?.spaceId;
        const spaces = state.value.spaces;
        const space = spaces.find((space) => space.id === val);
        if (space)
            return space.id;

        const firstSpace = spaces[0];
        if (!firstSpace)
            throw new Error("SpaceId excepted")

        return firstSpace.id;
    })

    const currentSpace = computed(() => {
        return spaces.value.find(x => x.id === spaceId.value) ?? spaces.value[0]
    })

    const setCategory = (id: number) => {
        state.value.searchString = ''
        state.value.categoryId = id
    }

    const search = async(searchString: string) => {
        state.value.searchString = searchString;
        await reloadBoard(false);
    }

    const reloadBoard = async (clearPreviousImmediately: boolean) => {
        const messagesApi = useMessagesApi()
        if (clearPreviousImmediately)
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
            spaceId.value,
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
        const data = await categoriesApi.loadCategories({
            spaceId: spaceId.value
        })
        state.value.categories = data.categories;
        state.value.categoryId = state.value.categories[0]!.id;
    }

    const categories = computed(() => {
        const categoryOrder = appState.value.userPreferences!.epicSortOrder
        let data = [...state.value.categories];
        if (categoryOrder === EpicSortOrder.Alphabetical)
            data.sort((a, b) => a.name.localeCompare(b.name));
        else if (categoryOrder === EpicSortOrder.LastUpdated)
            data.sort((a, b) => b.touchedAt.localeCompare(a.touchedAt));

        return data
    })

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
        const messageCategory = state.value.categories.find(c => c.id === state.value.categoryId)
        if (messageCategory) {
            messageCategory.count++;
            messageCategory.touchedAt = now();
        }

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
                spaceId.value,
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
            touchedAt: now(),
            isDefault: false,
        })
        showToast(t('boardCreated'), 'success', value.name);
        return id;
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

        const category = state.value.categories.find(c => c.id === card?.categoryId)
        if (category)
            category.touchedAt = now();

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
        category.touchedAt = now();

        state.value.currentCategory!.color = request.color;
        state.value.currentCategory!.name = request.name;
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

    const moveCard = async (cardId: number, spaceId: number, categoryId: number, statusId: number) => {
        const card = allCards.value.find(m => m.id === cardId);
        if (!card) return;

        const messagesApi = useMessagesApi()
        await messagesApi.move(card.id, statusId);

        // update old column data
        const oldColumnMessages = getMessagesByStatusId(card!.statusId)!
        oldColumnMessages.items.data.splice(oldColumnMessages.items.data.indexOf(card), 1)
        oldColumnMessages.items.offset -= 1;
        oldColumnMessages.items.totalCount -= 1;

        // update new column data
        const newColumnMessages = getMessagesByStatusId(statusId)
        if (newColumnMessages) {
            newColumnMessages.items.data.push(card)
            newColumnMessages.items.totalCount += 1;
            await reloadColumn(statusId, newColumnMessages.items.offset + 1)
        }

        // update epics
        const newCategory = state.value.categories.find(c => c.id === categoryId)
        if (newCategory) {
            newCategory.count += 1;
            newCategory.touchedAt = now();
        }

        const oldCategory = state.value.categories.find(c => c.id === card.categoryId)
        if (oldCategory)
            oldCategory.count -= 1;

        // update card properties
        card.categoryId = categoryId!;
        card.statusId = statusId;

        // raise notification
        showToast(t('cardMoved'), 'default')
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

    const reloadSpaces = async () => {
        const spacesApi = useSpacesApi()
        state.value.spaces = await spacesApi.getSpaces()
    }

    const createSpace = async (request: CreateSpaceRequest) => {
        const spacesApi = useSpacesApi()
        const spaceId = await spacesApi.createSpace(request)
        state.value.spaces.push({
            id: spaceId,
            name: request.name,
            color: request.color,
            epicsCount: 0,
        })
        showToast(t('spaceCreated'), 'success', request.name)
    }

    const editSpace = async (id: number, request: EditSpaceRequest) => {
        const api = useSpacesApi()
        await api.editSpace(id, request)
        const space = state.value.spaces.find(c => c.id === id)
        if (space) {
            space.color = request.color;
            space.name = request.name;
        }

        showToast(t('spaceEdited'), 'success', request.name);
    }

    const deleteSpace = async (id: number) => {
        const api = useSpacesApi()
        await api.deleteSpace(id)

        // Update views if that space was opened
        if (id === currentSpace.value!.id)
        {
            updateSpaceId(0)
            state.value.categoryId = 0;
            await reloadBoard(false)
            await reloadCategories()

            // Update preferences
            const { updateSpace } = useUserPreferencesApi()
            await updateSpace(0)
        }

        const index = state.value.spaces.findIndex(c => c.id === id)
        state.value.spaces.splice(index, 1);
        showToast(t('spaceDeleted'), 'danger');
    }

    return {
        state: readonly(state),
        reloadBoard,
        reloadCategories,
        reloadCategory,
        createCategory,
        setCategory,
        editCategory,
        deleteCategory,
        categories,
        createCard,
        editCard,
        deleteCard,
        loadNextCards,
        isColumnLoading,
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
        search,
        isLoading,
        spaces,
        currentSpace,
        reloadSpaces,
        createSpace,
        editSpace,
        deleteSpace,
    }
}