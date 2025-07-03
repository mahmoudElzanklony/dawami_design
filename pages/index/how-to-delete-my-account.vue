<template>
    <div dir="rtl" class="min-h-screen flex flex-col justify-between">
        <div>
            <header class="shadow-md mb-12">
                <UContainer>
                    <div class="flex justify-center gap-6 p-3">
                        <div class="w-20">
                            <img src="/images/logo-sm.png" />
                        </div>
                    </div>
                </UContainer>
            </header>
            <UContainer>
                <div class="px-8 py-8 bg-gray-50 mb-12 rounded-lg">
                    <div class="text-xl text-gray-600">
                        <h1 class="text-3xl font-medium mb-4">
                            كيفية مسح حسابي من التطبيق
                        </h1>
                        <div class="mb-10">


                            إذا كنت ترغب في حذف حسابك من تطبيق "Dwamee"، يمكنك اتباع الخطوات التالية:
                            <ol>
                                <li>   افتح تطبيق "Dwamee" على جهازك.</li>
                                <li>  انتقل إلى قسم "الاعدادت".</li>
                                <li>انقر على خيار "حذف الحساب".</li>
                            </ol>

                            يرجى العلم أن حذف الحساب سيؤدي إلى إزالة جميع بياناتك المحفوظة في التطبيق بشكل دائم، ولن يكون بإمكانك استعادتها بعد الحذف.

                            إذا كانت لديك أي استفسارات حول حذف الحساب، يرجى التواصل مع دعم العملاء عبر [+20 10 09676973].
                        </div>


                    </div>
                </div>
            </UContainer>
        </div>

        <footer
            dir="ltr"
            class="py-8 text-xs text-slate-800 bg-gray-50 w-full px-2"
        >
            <UContainer>
                <div class="w-full flex justify-between items-center">
                    <a class="duration-300 hover:text-primary" href="#">
                        iLearn
                    </a>
                    <p>
                        © All rights reserved - {{ new Date().getFullYear() }}
                    </p>
                </div>
            </UContainer>
        </footer>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: false,
})
</script>
