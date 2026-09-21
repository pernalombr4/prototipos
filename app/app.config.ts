// Mapeamento de cores copiado do en-docs (somente leitura de lá — nunca editar aquele repo).
// Se divergir, releia o original e traga a correção para cá.

/*
 * Contraste dos selos e avisos coloridos
 * --------------------------------------
 * As variantes `subtle` e `soft` do Nuxt UI pintam o texto com a MESMA cor do
 * fundo, a 10% de opacidade: `bg-warning/10 text-warning`. Com a paleta do
 * ENSPACE (warning: yellow, success: teal, primary: fuchsia) isso dá, medido
 * na tela de Configurações a 1280 px:
 *
 *   "Aguardando análise" (warning, subtle) ....... 1,80:1
 *   "Carteira ativa" (success, subtle) ........... 2,26:1
 *
 * O mínimo do WCAG 2.1 AA para texto é 4,5:1. Selo é texto, e texto de selo
 * costuma ser o que diz o estado da coisa: "recusada", "suspende o expediente".
 *
 * A correção mais barata é escurecer só o texto, mantendo fundo e anel: o selo
 * continua o mesmo de longe e passa a ser legível de perto. Os tons saem da
 * mesma paleta, então nenhuma cor nova entra no tema.
 *
 * Escrito aberto, uma cor por vez, de propósito: o Tailwind 4 varre o código à
 * procura das classes, e `text-${cor}-700` montado em tempo de execução não
 * seria gerado.
 */
const legivel = (cor: string, classe: string) => [
  { color: cor, variant: 'subtle', class: classe },
  { color: cor, variant: 'soft', class: classe },
]

const selosLegiveis = [
  ...legivel('primary', 'text-primary-700 dark:text-primary-300'),
  ...legivel('secondary', 'text-secondary-700 dark:text-secondary-300'),
  ...legivel('success', 'text-success-700 dark:text-success-300'),
  ...legivel('info', 'text-info-700 dark:text-info-300'),
  ...legivel('warning', 'text-warning-700 dark:text-warning-300'),
  ...legivel('error', 'text-error-700 dark:text-error-300'),
]

/** O Alert tem slots: a mesma classe precisa ir no `root`. */
const avisosLegiveis = selosLegiveis.map(v => ({ ...v, class: { root: v.class } }))

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

    badge: { compoundVariants: selosLegiveis },
    alert: { compoundVariants: avisosLegiveis },
  },
})
