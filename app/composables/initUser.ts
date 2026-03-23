import {useAppState} from "~/composables/appState";

export const useInitUser = () => {

    const setAppUser = async (bearerToken: string) => {
        const { setUser } = useAppState()
        const { setLocale } = useI18n()
        localStorage.setItem('bearer', bearerToken)

        const { loadUser } = useUserApi();
        const user = await loadUser();
        setUser(user);

        // @ts-ignore
        await setLocale(user.languageCode);
    }

    return {
        setAppUser,
    }
}