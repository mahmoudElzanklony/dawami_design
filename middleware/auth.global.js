import {useAuthStore} from "~/stores/Auth/AuthStore.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = useCookie('authToken');
    const authStore = useAuthStore();
    const publicRoutes = ['/login'];
    const permittedRoutes = authStore.getPermittedRoutes();

    if (publicRoutes.includes(to.path)) {
        if (token.value) {
            return navigateTo(permittedRoutes[0]);
        }
        else return;
    }
    if (!token.value) {
        return navigateTo('/login');
    }

    if (to.path === '/') {
        return navigateTo(permittedRoutes[0]);
    }

    if (!publicRoutes.includes(to.path)) {
        // Check if path starts with a locale pattern
        const localeRegex = /^\/([a-z]{2})(\/.+)$/;
        const localeMatch = to.path.match(localeRegex);

        let hasPermission = authStore.hasRoutePermission(to.path);
        //  path has a locale prefix and no permission with full path,
        // check permission with the path without locale
        if (!hasPermission && localeMatch) {
            const pathWithoutLocale = localeMatch[2]; // e.g., "/questions" from "/en/questions"
            hasPermission = authStore.hasRoutePermission(pathWithoutLocale);
        }

        if (!hasPermission) {
            return navigateTo(permittedRoutes[0]);
        }
    }
})
