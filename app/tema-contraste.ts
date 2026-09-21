/**
 * Contraste dos selos e avisos coloridos.
 *
 * ┌─ POR QUE ISTO NÃO MORA NO `app/app.config.ts` ───────────────────────────┐
 * │ Aquele arquivo é cópia do en-docs, e a spec manda recopiá-lo quando o    │
 * │ tema mudar lá, em vez de corrigir à mão. Um bloco local ali seria        │
 * │ apagado na primeira recópia, em silêncio. Aqui ele sobrevive, e o        │
 * │ app.config.ts continua sendo o que promete ser: só o espelho das cores.  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * O problema, medido na tela de Configurações a 1280 px:
 *
 *   as variantes `subtle` e `soft` do Nuxt UI pintam o texto com a MESMA cor
 *   do fundo, a 10% de opacidade (`bg-warning/10 text-warning`). Com a paleta
 *   do ENSPACE (warning: yellow, success: teal, primary: fuchsia), isso dá
 *
 *     "Aguardando análise" (warning, subtle) ....... 1,80:1
 *     "Carteira ativa" (success, subtle) ........... 2,26:1
 *
 *   contra os 4,5:1 que o WCAG 2.1 AA pede para texto. Selo é texto, e texto
 *   de selo costuma ser o que diz o estado da coisa: "recusada", "suspende o
 *   expediente".
 *
 * A correção mais barata é escurecer só o texto, mantendo fundo e anel: o selo
 * continua o mesmo de longe e passa a ser legível de perto. Os tons saem da
 * mesma paleta, então nenhuma cor nova entra no tema. Depois da correção:
 * 4,65:1 no warning, 4,96:1 no success, 5,52:1 no error; no escuro, de 7,88:1
 * a 12,58:1.
 *
 * As classes estão escritas abertas, uma cor por vez, e este arquivo mora sob
 * `app/` de propósito: o Tailwind 4 varre o código à procura delas, e
 * `text-${cor}-700` montado em tempo de execução não seria gerado.
 */

function legivel(cor: string, classe: string) {
  return [
    { color: cor, variant: 'subtle', class: classe },
    { color: cor, variant: 'soft', class: classe },
  ]
}

export const selosLegiveis = [
  ...legivel('primary', 'text-primary-700 dark:text-primary-300'),
  ...legivel('secondary', 'text-secondary-700 dark:text-secondary-300'),
  ...legivel('success', 'text-success-700 dark:text-success-300'),
  ...legivel('info', 'text-info-700 dark:text-info-300'),
  ...legivel('warning', 'text-warning-700 dark:text-warning-300'),
  ...legivel('error', 'text-error-700 dark:text-error-300'),
]

/**
 * O botão tem o mesmo defeito, e ele escapou porque o `nuxt.config` só ligava
 * selo e aviso. Medido nesta tela, no claro: o botão de idioma ativo
 * (`soft`, `primary`) dava 2,56:1 — pior que qualquer selo que motivou este
 * arquivo. A lista é a mesma porque o remédio é o mesmo: escurecer só o texto.
 *
 * O tema do botão tem slots, mas seus próprios `compoundVariants` passam a
 * classe solta, e nessa forma ela cai no `base`. Por isso aqui não se envolve
 * a classe num objeto, como foi preciso fazer no Alert.
 *
 * Só `soft` e `subtle` entram. O `solid` (texto branco sobre a cor cheia) é
 * outra conversa: mexer nele é decidir sobre a cor da marca, não sobre
 * legibilidade de um texto secundário.
 */
export const botoesLegiveis = selosLegiveis

/** O Alert tem slots: a mesma classe precisa ir no `root`. */
export const avisosLegiveis = selosLegiveis.map(v => ({ ...v, class: { root: v.class } }))
