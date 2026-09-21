// Mapeamento de cores copiado do en-docs (somente leitura de lá — nunca editar aquele repo).
// Se divergir, releia o original e traga a correção para cá.
//
// Nada local entra aqui: quem recopiar do en-docs apagaria sem ver. A correção
// de contraste dos selos mora em `app/tema-contraste.ts`, entregue ao Nuxt pelo
// `nuxt.config.ts`.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'fuchsia',
      secondary: 'cyan',
      success: 'teal',
      info: 'cyan',
      warning: 'yellow',
      error: 'red',
      neutral: 'space',
    },
  },
})
