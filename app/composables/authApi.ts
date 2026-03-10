export const useAuthApi = () => {
    const configuration = useRuntimeConfig();

    const createClient = (baseURL: string) => $fetch.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('bearer')}`
        }
    })

    return {
        createClient,
    }
}