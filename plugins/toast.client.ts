import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
        const options = {
            position: "top-right",
            timeout: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            icon: true,
            transition: "Vue-Toastification__fade",
        };

        nuxtApp.vueApp.use(Toast, options);
    }
});
