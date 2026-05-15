import {useOrganizationAuthApi} from "~/composables/organizationAuthApi";

export const useStatusesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useOrganizationAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}