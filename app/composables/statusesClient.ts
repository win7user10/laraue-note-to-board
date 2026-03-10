import {useAuthApi} from "~/composables/authApi";

export const useStatusesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}