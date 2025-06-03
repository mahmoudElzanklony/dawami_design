import {useAuthStore} from "~/stores/Auth/AuthStore.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = useCookie('authToken')
    if (to.path !== '/login' && !token.value) {
        return navigateTo('/login')
    }

    if (to.path === '/login' && token.value) {
        return navigateTo('/users')
    }

    if (to.path === '/') {
        return navigateTo('/users')
    }
})
