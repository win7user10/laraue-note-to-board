export const useAppState = () => {

    const appState = useState('appState', () => ({
        categoryId: 0
    }))

    const setCategory = (id: number) => {
        appState.value.categoryId = id
    }

    return {
        appState: readonly(appState),
        setCategory,
    }
}