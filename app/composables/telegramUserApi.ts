export const useTelegramUserApi = () => {
    const client = useTelegramUserClient()

    const authViaMiniApp = (initData: string) => {
        return client<string>('/user/auth-via-mini-app', {
            method: 'POST',
            body: {
                initData: initData
            }
        });
    }

    const authViaWebApp = (userData: any) => {
        return client<string>('/user/auth', {
            method: 'POST',
            body: userData
        });
    }

    return {
        authViaMiniApp,
        authViaWebApp,
    }
}