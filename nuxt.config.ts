// https://nuxt.com/docs/api/configuration/nuxt-config
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
      ]
    },
    baseURL: '/note-board-app/',
    buildAssetsDir: '/note-board-app/_nuxt/'
  },
  runtimeConfig: {
    public: {
      messagesBaseAddress: process.env.NUXT_PUBLIC_MESSAGES_BASE_ADDRESS || 'https://laraue.com/api/notes-board',
      testUserToken: process.env.NUXT_PUBLIC_TEST_USER_TOKEN,
    },
  }
})
