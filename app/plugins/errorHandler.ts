export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (error, instance, info) => {

        if (error instanceof ApiError){
            const { showToast } = useAppState()
            showToast("Request error", "danger", error!.toString())
        }
        else
            console.error('[vue:error hook]', error)
    })
})