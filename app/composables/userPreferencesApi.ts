import {useUserPreferencesClient} from "~/composables/userPreferencesClient";

export interface UserPreferencesDto {
    epicSortOrder: EpicSortOrder;
    spaceId: number;
}

export enum EpicSortOrder {
    LastUpdated = 0,
    Alphabetical = 1,
}

export const useUserPreferencesApi = () => {
    const client = useUserPreferencesClient();

    const loadPreferences = () => {
        return client<UserPreferencesDto>('/user-preferences', {
            method: 'GET'
        });
    }

    const updateEpicSortOrder = (newOrder: EpicSortOrder) => {
        return client('/user-preferences/epic-sort-order/' + newOrder, {
            method: 'PUT'
        });
    }

    const updateSpace = (spaceId: number) => {
        return client('/user-preferences/space/' + spaceId, {
            method: 'PUT'
        });
    }

    return {
        loadPreferences,
        updateEpicSortOrder,
        updateSpace,
    }
}