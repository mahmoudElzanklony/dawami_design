import {defineStore} from "pinia";
import { useUserDataCleaner } from "~/composables/useUserDataCleaner";

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        loading: false as boolean,
        user: null as null,
        showOrgSelector: false as boolean,
        organizations: [] as any[],
    }),
    actions: {
        async login(data: any = null) {
            const {$axios} = useNuxtApp();
            this.loading = true;
            
            try {
                if (data === null) data = new FormData(event.target)
                let response = await $axios.post('/auth/login', data)
                if (response?.status == 200) {
                    // return response data to retrieve user id and show verification input
                    if(response?.data?.data?.require_verify_device){
                        return response?.data?.data;
                    }
                    // Clean user data before storing
                    const { cleanUserData } = useUserDataCleaner();
                    this.user = cleanUserData(response?.data?.data);
    
                    // Handle organizations
                    if (this.user?.organizations && Array.isArray(this.user.organizations)) {
                        if (this.user.organizations.length === 1) {
                            // Set organization ID directly if there's only one
                            this.setOrganizationId(this.user.organizations[0].organization_id);
                            await navigateTo('/users');
                        } else if (this.user.organizations.length > 1) {
                            // Store organizations and show selector
                            this.organizations = this.user.organizations;
                            this.showOrgSelector = true;
                        } else {
                            // No organizations, navigate to dashboard
                            await navigateTo('/users');
                        }
                    } else {
                        await navigateTo('/users');
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
            } finally {
                this.loading = false;
            }
        },

        setOrganizationId(organizationId: number) {
            const orgCookie = useCookie('organizationId');
            orgCookie.value = organizationId.toString();
            this.showOrgSelector = false;
        },

        async logout() {
            this.loading = true;
            const {$axios} = useNuxtApp();
            
            try {
                await $axios.post('/auth/logout');
                const authCookie = useCookie('authToken');
                const orgCookie = useCookie('organizationId');
                authCookie.value = null;
                orgCookie.value = null;
                if (process.client) {
                    localStorage.removeItem('authToken');
                }
                this.user = null;
                await navigateTo('/login');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.loading = false;
            }
        },
        

        hasRoutePermission(route: string): boolean {
            if (!this.user || !this.user.permissions) return false;


            return this.user.permissions.some((permItem: any) =>
                permItem.route === route && permItem.actions?.read === true
            );
        },
        

        hasActionPermission(route: string, action: string): boolean {
            if (!this.user || !this.user.permissions) return false;

            return this.user.permissions.some((permItem: any) =>
                permItem.route === route && permItem.actions?.[action] === true
            );
        },

        getPermittedRoutes(): string[] {
            if (!this.user || !this.user.permissions) return [];

            return this.user.permissions
                .filter((permItem: any) => permItem.actions?.read === true)
                .map((permItem: any) => permItem.route);
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
        pick: ['user', 'showOrgSelector', 'organizations'],
    },
});