import {useUserOrganizationPreferencesApi} from "~/composables/userOrganizationPreferencesApi";
import {useOrganizationsApi} from "~/composables/organizationsApi";

export const useAuth = () => {
    const appState = useAppState()
    const { setLocale } = useI18n()
    const { setUserToken, deleteUserToken, deleteOrganizationToken, setOrganizationToken } = useLocalStorageUtils()

    const initUserWithBearer = async (bearerToken: string) => {
        await setUserToken(bearerToken)

        const { loadUser } = useUserApi();

        const user = await loadUser();
        await initUserWithUserData(user);
    }

    const tryAuthWithStoredBearer = async () => {
        const { getUserToken } = useLocalStorageUtils()
        const bearer = getUserToken()
        if (!bearer)
            return false

        const { loadUser } = useUserApi();
        try {
            const user = await loadUser();
            await initUserWithUserData(user);
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
            await initOrganizationWithOrganizationData(organization);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    const initUserWithUserData = async (user: UserDto) => {
        appState.setUser(user);

        const { loadPreferences } = useUserPreferencesApi()
        const preferences = await loadPreferences();
        appState.setPreferences(preferences);

        // @ts-ignore
        return setLocale(user.languageCode);
    }

    const initOrganizationWithBearer = async (bearer: string) => {
        await setOrganizationToken(bearer)

        const { getOrganization } = useOrganizationsApi()
        const organization = await getOrganization()
        await initOrganizationWithOrganizationData(organization)
    }

    const initOrganizationWithOrganizationData = async (organization: OrganizationDto) => {
        appState.setOrganization(organization);

        const { loadPreferences } = useUserOrganizationPreferencesApi()
        const preferences = await loadPreferences();
        appState.setUserOrganizationPreferences(preferences);
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
        initUserWithBearer,
        tryAuthWithStoredBearer,
        tryAuthOrganizationWithStoredBearer,
        initUserWithUserData,
        initOrganizationWithOrganizationData,
        logout,
        logoutOrganization,
        initOrganizationWithBearer,
    }
}