import { useAppState } from "~/composables/appState";
import {useLocalStorageUtils} from "~/composables/localStorageUtils";

export const useOrganizationAuthApi = () => {

    const { addLoadingKey, removeLoadingKey, showToast } = useAppState();
    const { getOrganizationToken } = useLocalStorageUtils();

    const createClient = (baseURL: string) => $fetch.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${getOrganizationToken()}`
        },
        retry: false,
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
        onRequestError: (context) => {
            const loadingKey = (context as any).context?.loadingKey;
            if (loadingKey)
                removeLoadingKey(loadingKey);
            showToast("Request error", "danger", loadingKey)
        },
        onResponseError: (context) => {
            const loadingKey = (context as any).context?.loadingKey;
            if (loadingKey)
                removeLoadingKey(loadingKey);
            showToast("Request error", "danger", loadingKey)
        }
    })

    return {
        createClient,
    }
}