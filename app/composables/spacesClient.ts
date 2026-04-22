import {useOrganizationAuthApi} from "~/composables/organizationAuthApi";

export const useSpacesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useOrganizationAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}