// Protótipos ENSPACE — Nuxt 4 + Nuxt UI 4, mesmo tema do en-docs.
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: 'latest',
  devtools: { enabled: true },

  // Protótipo nasce em tema claro. Escuro é estado a testar de propósito,
  // não o padrão em que a tela aparece na primeira vez.
  colorMode: { preference: 'light', fallback: 'light' },

  // baseURL vem do ambiente para o build do GitHub Pages
  // (lá o site mora em /<nome-do-repo>/, não na raiz).
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  nitro: { prerender: { crawlLinks: true, routes: ['/'] } },
})
