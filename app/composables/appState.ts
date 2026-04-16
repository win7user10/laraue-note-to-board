export interface Toast {
    id: number;
    title: string;
    subTitle: string;
    type: string;
}

export const useAppState = () => {
    const appState = useState('appState', () => ({
        user: null as UserDto | null,
        userPreferences: null as UserPreferencesDto | null,
        isAppInitialized: false,
        isInMiniApp: false,
        isLoading: false,
        loadingKeys: [] as string[],
        toasts: [] as Toast[],
    }))

    const palette = computed(() => appState.value.user?.palette ?? []);
    const getRandomColor = () => {
        return palette.value[Math.floor(Math.random() * palette.value.length)]!;
    }

    const setUser = (user: UserDto | null) => {
        appState.value.user = user;
    }

    const setIsAppInitialized = (state: boolean) => {
        appState.value.isAppInitialized = state;
    }

    const setIsInMiniApp = (state: boolean) => {
        appState.value.isInMiniApp = state;
    }

    const addLoadingKey = (key: string) => {
        appState.value.loadingKeys.push(key)
        appState.value.isLoading = true;
    }

    const removeLoadingKey = (key: string) => {
        const index = appState.value.loadingKeys.indexOf(key);
        if (index !== -1)
            appState.value.loadingKeys.splice(index, 1);
        if (appState.value.loadingKeys.length === 0)
            appState.value.isLoading = false;
    }

    const showToast = (
        title: string,
        type: 'danger' | 'success' | 'default',
        subtitle?: string) => {
        const id = Date.now() + Math.random();
        appState.value.toasts.push({ id, title, subTitle: subtitle ||'', type });
        setTimeout(() => {
            appState.value.toasts = appState.value.toasts.filter(t => t.id !== id);
        }, 1200);
    }

    const setPreferences = (preferences: UserPreferencesDto) => {
        appState.value.userPreferences = preferences;
    }

    const updateCategoriesOrdering = (sortOrder: EpicSortOrder) => {
        appState.value.userPreferences!.epicSortOrder = sortOrder;
    }

    const updateSpaceId = (spaceId: number) => {
        appState.value.userPreferences!.spaceId = spaceId;
    }

    return {
        appState: readonly(appState),
        getRandomColor,
        setUser,
        addLoadingKey,
        removeLoadingKey,
        showToast,
        setIsAppInitialized,
        setIsInMiniApp,
        palette,
        setPreferences,
        updateCategoriesOrdering,
        updateSpaceId,
    }
}