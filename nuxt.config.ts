export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  vite: {
    server: {
      allowedHosts: true
    }
  },

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap'
        }
      ],
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    },
    baseURL: '/msgboard-app/'
  },

  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: "en.json" },
      { code: 'ru', name: 'Русский', language: 'ru-RU', file: "ru.json" },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: false
  },
  runtimeConfig: {
    public: {
      messagesBaseAddress: process.env.NUXT_PUBLIC_MESSAGES_BASE_ADDRESS || 'https://laraue.com/api/notes-board/',
      testUserToken: process.env.NUXT_PUBLIC_TEST_USER_TOKEN,
    },
  },

  modules: ['@nuxtjs/i18n', '@vueuse/nuxt']
})