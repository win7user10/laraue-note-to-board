export const useInitUser = () => {
    const appState = useAppState()
    const { setLocale } = useI18n()

    const setAppUser = async (bearerToken: string) => {
        localStorage.setItem('bearer', bearerToken)

        const { loadUser } = useUserApi();
        const user = await loadUser();
        await setUser(user);
    }

    const tryAuthWithStoredBearer = async () => {
        const bearer = localStorage.getItem('bearer')
        if (!bearer)
            return false

        const { loadUser } = useUserApi();
        try {
            const user = await loadUser();
            await setUser(user);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    const setUser = (user: UserDto) => {
        appState.setUser(user);
        // @ts-ignore
        return setLocale(user.languageCode);
    }

    const logout = () => {
        appState.setUser(null);
        localStorage.removeItem('bearer');
    }

    return {
        setAppUser,
        tryAuthWithStoredBearer,
        logout,
    }
}