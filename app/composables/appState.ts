export const useAppState = () => {

    const appState = useState('appState', () => ({
        categoryId: null as null | number,
        palette: [
            '#2f81f7', '#3fb950', '#a371f7', '#d29922',
            '#ff7b72', '#79c0ff', '#56d364', '#ffa657',
            '#f778ba', '#39d353', '#e3b341', '#58a6ff',
        ],
        dragState: {
            cardId: null as number | null,
            overStatus: null as number | null,
        }
    }))

    const setCategory = (id: number) => {
        appState.value.categoryId = id
    }

    const getRandomColor = () => {
        return appState.value.palette[Math.floor(Math.random() * appState.value.palette.length)]!;
    }

    const setDragStateCardId = (cardId: null | number) => {
        appState.value.dragState.cardId = cardId;
    }

    const setDragStateOverStatus = (statusId: null | number) => {
        appState.value.dragState.overStatus = statusId;
    }

    return {
        appState: readonly(appState),
        setCategory,
        getRandomColor,
        setDragStateCardId,
        setDragStateOverStatus,
    }
}