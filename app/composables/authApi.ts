import {useAppState} from "~/composables/appState";

export const useAuthApi = () => {

    const { addLoadingKey, removeLoadingKey } = useAppState();

    const createClient = (baseURL: string) => $fetch.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('bearer')}`
        },
        onRequest: (context) => {
            const requestPath = context.request.toString();
            const loadingKey = `${context.options.method} ${requestPath}`;

            addLoadingKey(loadingKey);
            (context as any).context = { loadingKey };
        },
        onResponse: (context) => {
            const loadingKey = (context as any).context?.loadingKey;
            if (loadingKey)
                removeLoadingKey(loadingKey);
        },
        onResponseError: (context) => {
            const loadingKey = (context as any).context?.loadingKey;
            if (loadingKey)
                removeLoadingKey(loadingKey);
        }
    })

    return {
        createClient,
    }
}