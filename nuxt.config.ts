import tailwindcss from "@tailwindcss/vite";
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import {tr} from "vuetify/locale";

export default defineNuxtConfig({
    ssr: true,
    devtools: {enabled: true},
    nitro: {
        preset: 'node-server',
        port: 5000
    },
    compatibilityDate: '2024-11-01',
    sourcemap: false,
    build: {
        transpile: ['vuetify'], // Transpile Vuetify for Nuxt
    },
    pages: true,
    app: {
        head: {
            meta: [
                {
                    "name": "viewport",
                    "content": "width=device-width, initial-scale=1"
                },
                {
                    "charset": "utf-8"
                }
            ],
            htmlAttrs: {}, // removed hard-coded lang so i18n sets it dynamically
            script: [
                {src: 'https://www.google.com/recaptcha/api.js'}
            ],
            link: [
                {rel: "stylesheet", href: "/fontawesome/css/all.css"},
                {rel: "stylesheet", href: "/fontawesome/css/duotone.css"}
            ]
        },
        pageTransition: {name: 'fade', mode: 'out-in'}
    },

    pinia: {
        autoImports: [
            'defineStore',
        ],
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL, // Expose the base URL to the client
            baseUrl: process.env.BASE_URL,
            fileAssistantBaseUrl: process.env.FILE_ASSISTANT_BASE_URL,

        },
    },
    modules: [
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        '@nuxtjs/leaflet',
        '@nuxtjs/i18n',
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
        //...
    ],
    i18n: {
        lazy: true,
        langDir: 'locales',
        defaultLocale: 'ar',
        strategy: 'prefix_except_default',
        locales: [
            {
                code: 'ar',
                file: 'ar.json',
                name: 'العربية',
                dir: 'rtl'
            },
            {
                code: 'en',
                file: 'en.json',
                name: 'English',
                dir: 'ltr'
            }
        ],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_locale',
            redirectOn: 'root'
        },
        bundle: {
            optimizeTranslationDirective: false,
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/scss/_variables.scss" as *;`
                }
            },
        },
        plugins: [
            tailwindcss(),
        ],
        server: {
            hmr: {
                overlay: false, // Disable CSS HMR reloads
            },
            watch: {
                ignored: ['**/node_modules/**', '**/.nuxt/**', '**/dist/**'],
            },
        },
        optimizeDeps: {
            include: [
                'vuetify', // Optimize Vuetify
                'tailwindcss',
                'lodash-es', // Example of optimizing ES modules
            ],
            exclude: ['@vue/runtime-core'], // Reduce unnecessary processing
        },
        build: {
            minify: false, // Skip minification in development for faster builds
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'vendor'; // Bundle all node_modules into "vendor.js"
                        }
                    }
                }
            }
        },
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    vuetify: {
        vuetifyOptions: {
            // Enable tree-shaking
            blueprint: {
                defaults: {
                    global: {
                        treeShake: true,
                    },
                },
            },
        },
        exclude: ['@vue/runtime-core'], // Avoid unnecessary processing

    },
    css: ["~/assets/css/tailwind.css", "vuetify/styles", "~/assets/scss/main.scss"],

})
