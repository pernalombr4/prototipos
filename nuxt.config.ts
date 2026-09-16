// Protótipos ENSPACE — Nuxt 4 + Nuxt UI 4, mesmo tema do en-docs.
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * As rotas a prerenderizar, lidas dos arquivos em app/pages.
 *
 * Não usamos o crawler do Nitro: com `baseURL`, ele segue os links já
 * prefixados (`/prototipos/...`), tenta renderizá-los como rota e quebra o
 * build. Derivar da pasta é determinístico e se mantém sozinho — protótipo
 * novo entra na lista só de existir.
 */
function rotasDasPaginas(): string[] {
  const dir = fileURLToPath(new URL('./app/pages', import.meta.url))
  return readdirSync(dir, { recursive: true })
    .map(String)
    .filter(arquivo => arquivo.endsWith('.vue'))
    .map((arquivo) => {
      const rota = arquivo
        .replace(/\\/g, '/')
        .replace(/\.vue$/, '')
        .replace(/(^|\/)index$/, '')
      return `/${rota}`.replace(/\/$/, '') || '/'
    })
}

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

  // Só .vue vira rota. Sem isso, um `mocks.ts` dentro da pasta do protótipo é
  // tratado como página, o Nuxt tenta usá-lo como componente, o prerender
  // aborta — e o site publica só a home, sem ninguém avisar.
  pages: { pattern: ['**/*.vue'] },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: rotasDasPaginas(),
      // Protótipo quebrado derruba o build, em vez de virar site pela metade.
      failOnError: true,
    },
  },
})
