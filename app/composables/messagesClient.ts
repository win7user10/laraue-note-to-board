import {useAuthApi} from "~/composables/authApi";

export const useMessagesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}