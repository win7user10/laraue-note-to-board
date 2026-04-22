export const useLocalStorageUtils = () => {

    const getUserToken = () => {
        return localStorage.getItem('bearer')
    }

    const setUserToken = async (bearerToken: string) => {
        localStorage.setItem('bearer', bearerToken)
    }

    const getOrganizationToken = () => {
        return localStorage.getItem('organization_bearer')
    }

    const setOrganizationToken = async (bearerToken: string) => {
        localStorage.setItem('organization_bearer', bearerToken)
    }

    return {
        getUserToken,
        setUserToken,
        getOrganizationToken,
        setOrganizationToken,
    }
}