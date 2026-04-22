import {useOrganizationAuthApi} from "~/composables/organizationAuthApi";

export const useCategoriesClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useOrganizationAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}