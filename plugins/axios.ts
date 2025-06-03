// plugins/axios.ts
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { getCookie } from 'h3'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const instance = axios.create({
        baseURL: config.public.apiBaseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    instance.interceptors.request.use((request) => {
        console.log(request)
        let token: string | undefined
        let organizationId: string | undefined
        let locale: string | undefined

        if (import.meta.env.SSR) {
            const event = nuxtApp.ssrContext?.event
            if (event) {
                token = getCookie(event, 'authToken')
                organizationId = getCookie(event, 'organizationId')
                locale = getCookie(event, 'i18n_locale') || 'ar'
            }
        } else {
            token = useCookie('authToken').value
            organizationId = useCookie('organizationId').value
            locale = useCookie('i18n_locale').value || 'ar'
        }

        if (token) {
            request.headers.Authorization = `Bearer ${token}`
        }
        if (organizationId) {
            request.headers['organization_id'] = organizationId
        }
        request.headers['lang'] = locale

        return request
    })

    instance.interceptors.response.use(
        (response) => {
            if (process.client) {
                const toast = useToast()
                const message = response?.data?.data?.message || response?.data?.message

                if (Array.isArray(message)) {
                    message.forEach((msg) => {
                        toast(msg, { type: 'success' })
                    })
                } else if (message) {
                    toast(message, { type: 'success' })
                }
            }

            if (response.data?.data?.token) {
                const token = response.data.data.token
                const authTokenCookie = useCookie('authToken')
                authTokenCookie.value = token

                if (process.client) {
                    localStorage.setItem('authToken', token)
                    document.cookie = `authToken=${token}; path=/; SameSite=Lax; Secure`
                }

                instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }

            return response
        },
        (error) => {
            if (process.client) {
                const toast = useToast()

                if (error.response && error.response.status === 401) {
                    const authTokenCookie = useCookie('authToken')
                    authTokenCookie.value = null

                    localStorage.removeItem('authToken')

                    navigateTo('/auth/login')
                }

                const errorMessage = error.response?.data?.message || error.response?.data?.errors
                if (Array.isArray(errorMessage)) {
                    errorMessage.forEach((msg) => {
                        toast(msg, { type: 'error' })
                    })
                } else if (errorMessage) {
                    toast(errorMessage, { type: 'error' })
                }
            }

            return Promise.reject(error)
        }
    )

    return {
        provide: {
            axios: instance,
        },
    }
})
