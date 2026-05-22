export default defineNuxtRouteMiddleware((to) => {
    const { requireOrganizationAuth } = useAuth()
    return requireOrganizationAuth(to)
})