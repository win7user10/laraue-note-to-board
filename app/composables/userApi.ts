import {useUserClient} from "~/composables/userClient";

export enum EpicSortOrder {
    LastUpdated = 0,
    Alphabetical = 1,
}

export interface UserPreferencesDto {
    epicSortOrder: EpicSortOrder;
}

export interface UserDto {
    username?: string;
    languageCode: string;
    color: string;
    photoUrl?: string;
    firstName?: string;
    lastName?: string;
    initials?: string;
    palette: string[];
    preferences: UserPreferencesDto;
}

export const useUserApi = () => {
    const client = useUserClient();

    const loadUser = () => {
        return client<UserDto>('/user', {
            method: 'GET'
        });
    }

    const updateEpicSortOrder = (newOrder: EpicSortOrder) => {
        return client('/user/settings/epic-sort-order/' + newOrder, {
            method: 'PUT'
        });
    }

    return {
        loadUser,
        updateEpicSortOrder,
    }
}