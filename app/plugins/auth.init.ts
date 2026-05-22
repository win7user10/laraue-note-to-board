export default defineNuxtPlugin(async () => {
    const { setIsAppInitialized, setIsInMiniApp } = useAppState();
    const { initUserWithBearer, tryAuthWithStoredBearer, tryAuthOrganizationWithStoredBearer } = useAuth();
    const configuration = useRuntimeConfig();
    const testUserToken = configuration.public.testUserToken;

    try {
        const WebApp = (await import('@twa-dev/sdk')).default;
        const isInMiniApp = WebApp.initData !== '';
        if (isInMiniApp)
            setIsInMiniApp(true);

        // Auth logic from your original onMounted
        if (await tryAuthWithStoredBearer()) {
            console.log("Auth with existing Bearer");
            await tryAuthOrganizationWithStoredBearer();
        } else if (isInMiniApp || testUserToken) {
            let token = '';
            if (isInMiniApp) {
                token = WebApp.initData;
                console.log("Mini app launch");
            }
            else if (testUserToken) {
                token = testUserToken;
                console.log("Dev web-app launch");
            }

            const { authViaMiniApp } = useTelegramUserApi();
            const bearer = await authViaMiniApp(token);
            await initUserWithBearer(bearer);
        }
    } catch (err) {
        // Store error in a composable state so app.vue can show it
        const { setInitError } = useAppState();
        setInitError(err);
    } finally {
        setIsAppInitialized(true);
    }
});