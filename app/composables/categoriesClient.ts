import {useAuthApi} from "~/composables/authApi";

export const useCategoriesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}