export const useTelegramUserApi = () => {
    const client = useTelegramUserClient()

    const validate = (initData: string) => {
        return client<string>('/user/validate', {
            method: 'POST',
            body: {
                initData: initData
            }
        });
    }

    return {
        validate,
    }
}