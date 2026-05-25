export default defineNuxtRouteMiddleware(() => {
    const { appState } = useAppState()
    if (appState.value.user)
        return navigateTo(`/organizations`)
    return true
})