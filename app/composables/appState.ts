export const useAppState = () => {

    const appState = useState('appState', () => ({
        categoryId: 0,
        palette: [
            '#2f81f7', '#3fb950', '#a371f7', '#d29922',
            '#ff7b72', '#79c0ff', '#56d364', '#ffa657',
            '#f778ba', '#39d353', '#e3b341', '#58a6ff',
        ],
        user: {} as UserDto,
        isLoading: false,
        loadingKeys: [] as string[],
    }))

    const setCategory = (id: number) => {
        appState.value.categoryId = id
    }

    const getRandomColor = () => {
        return appState.value.palette[Math.floor(Math.random() * appState.value.palette.length)]!;
    }

    const setUser = (user: UserDto) => {
        appState.value.user = user;
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

    return {
        appState: readonly(appState),
        setCategory,
        getRandomColor,
        setUser,
        addLoadingKey,
        removeLoadingKey,
    }
}