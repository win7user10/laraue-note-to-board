import {useAuthApi} from "~/composables/authApi";

export const useSpacesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}