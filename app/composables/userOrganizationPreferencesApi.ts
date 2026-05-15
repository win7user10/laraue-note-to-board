import { useUserOrganizationPreferencesClient } from "~/composables/userOrganizationPreferencesClient";

export interface UserOrganizationPreferencesDto {
    selectedSpaceId?: number;
}

export const useUserOrganizationPreferencesApi = () => {
    const client = useUserOrganizationPreferencesClient();

    const loadPreferences = () => {
        return client<UserOrganizationPreferencesDto>('/user-organization-preferences', {
            method: 'GET'
        });
    }

    const updateSpace = (spaceId: number) => {
        return client('/user-organization-preferences/space/' + spaceId, {
            method: 'PUT'
        });
    }

    return {
        loadPreferences,
        updateSpace,
    }
}