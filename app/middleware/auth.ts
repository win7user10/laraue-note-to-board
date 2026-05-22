export default defineNuxtRouteMiddleware((to) => {
    const { requireUserAuth } = useAuth()
    return requireUserAuth(to)
})