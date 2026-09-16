// Protótipos ENSPACE — Nuxt 4 + Nuxt UI 4, mesmo tema do en-docs.
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { biblioteca } from './app/pages/tela-de-workspaces/icones'

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
    .map(arquivo => arquivo.replace(/\\/g, '/'))
    // `_Componente.vue` é peça de protótipo, não página — mesma regra do
    // `pages.pattern` abaixo. As duas listas têm que concordar.
    .filter(arquivo => arquivo.endsWith('.vue') && !arquivo.split('/').pop()!.startsWith('_'))
    .map((arquivo) => {
      const rota = arquivo
        .replace(/\\/g, '/')
        .replace(/\.vue$/, '')
        .replace(/(^|\/)index$/, '')
      return `/${rota}`.replace(/\/$/, '') || '/'
    })
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    // Componentes do ENSPACE, construídos sobre o mesmo Nuxt UI 4.
    // O módulo de dados (`@be-enlighten/enspace-sdk-vue/nuxt`) NÃO entra:
    // ele liga a data layer /query e o Keycloak, e protótipo aqui é
    // 100% front-end. Só os componentes base (dumb) são usados.
    '@be-enlighten/enspace-sdk-ui/nuxt',
  ],

  enspaceUi: {
    // Sem o módulo de dados de propósito — cala o aviso de build.
    dataModuleCheck: false,
  },

  // O site é estático: não existe servidor para servir ícone sob demanda.
  // Então a biblioteca inteira do Lucide vai embutida no bundle do cliente,
  // que é o que permite o seletor de ícones funcionar offline.
  icon: {
    clientBundle: {
      icons: biblioteca.map(([nome]) => `lucide:${nome}`),
      scan: true,
      sizeLimitKb: 2048,
    },
  },
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
  //
  // `_Nome.vue` fica de fora: é como um protótipo tem componentes próprios
  // sem sair da sua pasta e sem virar rota.
  pages: { pattern: ['**/*.vue', '!**/_*.vue'] },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: rotasDasPaginas(),
      // Protótipo quebrado derruba o build, em vez de virar site pela metade.
      failOnError: true,
    },
  },
})
