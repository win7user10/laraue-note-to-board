import {useOrganizationAuthApi} from "~/composables/organizationAuthApi";

export const useEpicsClient = () => {
    const configuration = useRuntimeConfig();
    const { createClient } = useOrganizationAuthApi();
    return createClient(configuration.public.messagesBaseAddress);
}