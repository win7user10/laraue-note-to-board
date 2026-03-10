export const useTelegramUserClient = () => {
    const configuration = useRuntimeConfig();
    return $fetch.create({
        baseURL: configuration.public.messagesBaseAddress,
    })
}