import {useAuthApi} from "~/composables/authApi";

export const useUserClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}