import type { InjectionKey, Ref } from 'vue'

/**
 * A MOLDURA ÚNICA DAS JANELAS (rodada 20).
 *
 * "ha inconsistencias no modelo de modal que aparece ao botar pra personalizar
 *  o menu ou ao botar pra criar seçao ou criar menu/item de menu. unifique a
 *  ideia" (Mikaela, 13/10/2026).
 *
 * Na junção das duas linhas de trabalho havia sete larguras de janela para o
 * mesmo tipo de tarefa (md, lg, xl, 2xl, 3xl, sm) e três jeitos de rodapé.
 * Agora a largura sai do TIPO de janela, e não de quem escreveu cada uma:
 *
 *   formulario  criar, renomear, importar, usar um caso: preencher e confirmar;
 *   camada      ver e arrumar o menu inteiro ou uma lista grande.
 *
 * Três exceções, declaradas no DECISOES.md, porque a moldura serve ao conteúdo:
 * a Central de casos de uso (galeria, ocupa a tela), o menu nativo de hoje
 * (réplica em tamanho real) e a busca (paleta de comandos).
 *
 * As classes ficam escritas por inteiro aqui: o Tailwind lê o código-fonte e
 * não gera classe montada por interpolação.
 */
export const MOLDURA = {
  /*
   * Formulario abre SEMPRE por cima de camada: o editor chama o "Criar menu"
   * por cima de si, a Central chama o "Usar", o Personalizar chama o "Criar
   * secao". Sem a camada propria, quem foi montado antes ficava embaixo, e o
   * formulario aberto pelo editor nascia escondido atras dele.
   */
  formulario: 'max-w-lg z-[60]',
  sobreposicao: 'z-[60]',
  camada: 'max-w-3xl',
} as const

/**
 * A LARGURA DO MENU QUE ABRE DE LADO (rodada 21).
 *
 * "repare que o tamanho do menu que se abre num popover ta muito largo pro
 *  tamanho do texto das opçoes" (Mikaela, 13/10/2026).
 *
 * Era 288px fixos para qualquer conteúdo: a Auditoria, com dois itens curtos,
 * abria uma caixa com metade vazia. Copiado do GitLab, medido em 13/10/2026:
 * a largura acompanha o texto, entre 12rem (192px) e 17rem (272px), e o nome
 * maior que isso quebra em duas linhas, em vez de cortar com reticências. O
 * teto bate com o do Material (280px); o ClickUp e o Notion usam largura fixa,
 * de 242px e 260px. A pesquisa está no PESQUISA.md.
 *
 * Vale para todo menu em LISTA que abre de lado a partir de um ícone: o hover
 * da trilha, os ícones da barra recolhida e o "⋯ Mais" do Início. A grade do
 * "⋯ Mais" da trilha fica de fora: são ícones em 3 colunas, não texto.
 */
export const FLUTUANTE = 'w-max min-w-48 max-w-68'

/**
 * O mesmo, para o `UDropdownMenu` da barra recolhida: o rótulo do item vem com
 * `truncate` do Nuxt UI, e o `!` faz a quebra de linha vencer.
 */
export const FLUTUANTE_DO_DROPDOWN = { content: FLUTUANTE, itemLabel: 'whitespace-normal! break-words' } as const

/**
 * "Estou dentro do menu que abre de lado": o `_PainelDaArea` avisa, e a linha
 * e a seção de dentro dele leem. Com a largura acompanhando o texto, duas
 * coisas mudam lá dentro:
 *
 *   a linha não guarda à direita o lugar do "⋯" e da estrela, que ali não
 *   aparecem (eram 36px vazios em toda linha);
 *   a seção fechada continua ocupando a largura do que tem dentro, e a caixa
 *   não alarga quando a pessoa abre um grupo de nome mais comprido.
 */
export const NO_FLUTUANTE: InjectionKey<Readonly<Ref<boolean>>> = Symbol('no-flutuante')
