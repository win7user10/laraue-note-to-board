import {useUserClient} from "~/composables/userClient";

export interface UserDto {
    username?: string;
    languageCode: string;
    color: string;
    photoUrl?: string;
    firstName?: string;
    lastName?: string;
    initials?: string;
}

export const useUserApi = () => {
    const client = useUserClient();

    const loadUser = () => {
        return client<UserDto>('/user', {
            method: 'GET'
        });
    }

    return {
        loadUser,
    }
}