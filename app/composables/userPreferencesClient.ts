import {useAuthApi} from "~/composables/authApi";

export const useUserPreferencesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}