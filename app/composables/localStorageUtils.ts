export const useLocalStorageUtils = () => {
    const userTokenKey = 'bearer'
    const organizationTokenKey = 'organization_bearer'

    const getUserToken = () => {
        return localStorage.getItem(userTokenKey)
    }

    const setUserToken = async (bearerToken: string) => {
        localStorage.setItem(userTokenKey, bearerToken)
    }

    const deleteUserToken = async () => {
        localStorage.removeItem(organizationTokenKey)
        localStorage.removeItem(userTokenKey)
    }

    const getOrganizationToken = () => {
        return localStorage.getItem(organizationTokenKey)
    }

    const setOrganizationToken = async (bearerToken: string) => {
        localStorage.setItem(organizationTokenKey, bearerToken)
    }

    const deleteOrganizationToken = async () => {
        localStorage.removeItem(organizationTokenKey)
    }

    return {
        getUserToken,
        setUserToken,
        getOrganizationToken,
        setOrganizationToken,
        deleteUserToken,
        deleteOrganizationToken,
    }
}