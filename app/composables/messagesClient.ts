import {useOrganizationAuthApi} from "~/composables/organizationAuthApi";

export const useMessagesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useOrganizationAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}