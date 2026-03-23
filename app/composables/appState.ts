export interface Toast {
    id: number;
    title: string;
    subTitle: string;
    type: string;
}

export const useAppState = () => {
    const appState = useState('appState', () => ({
        palette: [
            '#2f81f7', '#3fb950', '#a371f7', '#d29922',
            '#ff7b72', '#79c0ff', '#56d364', '#ffa657',
            '#f778ba', '#39d353', '#e3b341', '#58a6ff',
        ],
        user: null as UserDto | null,
        isAppInitialized: false,
        isLoading: false,
        loadingKeys: [] as string[],
        toasts: [] as Toast[],
    }))

    const getRandomColor = () => {
        return appState.value.palette[Math.floor(Math.random() * appState.value.palette.length)]!;
    }

    const setUser = (user: UserDto) => {
        appState.value.user = user;
    }

    const setIsAppInitialized = (state: boolean) => {
        appState.value.isAppInitialized = state;
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

    return {
        appState: readonly(appState),
        getRandomColor,
        setUser,
        addLoadingKey,
        removeLoadingKey,
        showToast,
        setIsAppInitialized,
    }
}