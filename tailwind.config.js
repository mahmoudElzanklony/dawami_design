// tailwind.config.js
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#aaa', // Custom primary color
                secondary: '#10B981', // Custom secondary color
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Custom font
            },
        },
    },
    plugins: [],
};