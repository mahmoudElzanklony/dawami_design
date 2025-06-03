import {defineStore} from "pinia";

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
            console.log(data);
            console.log($axios);
            console.log($axios.post('/auth/login', data));
            console.log(await $axios.post('/auth/login', data));
            this.loading = true;
            if (data === null) data = new FormData(event.target)
            let response = await $axios.post('/auth/login', data)
            this.loading = false;
            if (response?.status == 200) {
                this.user = response?.data?.data;
                
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
                        // Navigation will happen after selection
                    } else {
                        // No organizations, navigate to dashboard
                        await navigateTo('/users');
                    }
                } else {
                    await navigateTo('/users');
                }
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
            await $axios.post('/auth/logout');
            const authCookie = useCookie('authToken');
            const orgCookie = useCookie('organizationId');
            authCookie.value = null;
            orgCookie.value = null;
            if (process.client) {
                localStorage.removeItem('authToken');
            }
            this.user = null;
            this.loading = false;
            await navigateTo('/login');
        }
    },
    persist: true
})
