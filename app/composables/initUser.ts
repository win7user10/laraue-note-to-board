export const useInitUser = () => {
    const appState = useAppState()
    const { setLocale } = useI18n()

    const setAppUser = async (bearerToken: string) => {
        const { setUserToken } = useLocalStorageUtils()
        await setUserToken(bearerToken)

        const { loadUser } = useUserApi();

        const user = await loadUser();
        await setUser(user);
    }

    const tryAuthWithStoredBearer = async () => {
        const { getUserToken } = useLocalStorageUtils()
        const bearer = getUserToken()
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

    const setUser = async (user: UserDto) => {
        appState.setUser(user);

        const { loadPreferences } = useUserPreferencesApi()
        const preferences = await loadPreferences();
        appState.setPreferences(preferences);

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