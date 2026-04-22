export const useInitUser = () => {
    const appState = useAppState()
    const { setLocale } = useI18n()
    const { setUserToken, deleteUserToken, deleteOrganizationToken } = useLocalStorageUtils()

    const setAppUser = async (bearerToken: string) => {
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

    const tryAuthOrganizationWithStoredBearer = async () => {
        const { getOrganizationToken } = useLocalStorageUtils()
        const bearer = getOrganizationToken()
        if (!bearer)
            return false

        const { getOrganization } = useOrganizationsApi();
        try {
            const organization = await getOrganization();
            await setOrganization(organization);
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

    const setOrganization = async (organization: OrganizationDto) => {
        appState.setOrganization(organization);
    }

    const logout = async () => {
        appState.setUser(null);
        await deleteUserToken();
    }

    const logoutOrganization = async () => {
        appState.setOrganization(null);
        await deleteOrganizationToken();
    }

    return {
        setAppUser,
        tryAuthWithStoredBearer,
        tryAuthOrganizationWithStoredBearer,
        logout,
        logoutOrganization,
    }
}