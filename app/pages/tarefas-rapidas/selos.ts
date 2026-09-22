/**
 * O MAPA DOS SELOS: o que é cada peça do cartão e do painel, e de qual campo
 * da tarefa ela sai.
 *
 * ⚠️ ISTO É ANDAIME, não proposta. Nada aqui vai para o produto: é a legenda
 * que o dev lê para saber de onde tirar cada coisa. Por isso o texto está só
 * em português, como o resto do andaime (a barra de estados, "Por trás"). O
 * nome do campo em si sai do dicionário e acompanha o idioma.
 *
 * A coluna `origem` é a que decide trabalho de back:
 *
 *   nativo    vem direto do `GET /tasks`, no próprio objeto da tarefa
 *   derivado  o front calcula a partir de um campo nativo (atraso, contador)
 *   relacao   precisa de outra chamada: pessoas, etiquetas, registro de origem
 *   novo      NÃO EXISTE no payload de hoje, e está no DECISOES como pedido
 */

export type OrigemDoSelo = 'nativo' | 'derivado' | 'relacao' | 'novo'

export interface Selo {
  /**
   * Único, e é por ele que o mapa filtra. Nem sempre igual à chave: o prazo
   * entra duas vezes, uma no estado normal e outra no atrasado, e os dois
   * apontam o mesmo elemento da tela.
   */
  id: string
  /** O número que aparece no balão e na legenda. Sai da ordem da lista. */
  numero: number
  /** Casa com o `data-selo` do elemento na tela. */
  chave: string
  onde: 'cartao' | 'painel'
  /** Como a peça se chama, para quem está olhando a tela. */
  rotulo: string
  /** O campo da tarefa, escrito como está no payload. */
  campo: string
  origem: OrigemDoSelo
  /** O que a peça faz na tela: quando aparece, quando some, o que muda nela. */
  comportamento: string
  /** De que lado do alvo o balão fica. */
  lado: 'esquerda' | 'direita'
  /**
   * Em qual quadro do mapa a peça é apontada. Dezessete balões em volta de um
   * cartão de 300 px viram um novelo de setas: a cabeça do cartão e o rodapé
   * dele são apontados em dois quadros separados.
   */
  quadro?: 'cabeca' | 'rodape' | 'pessoas'
}

export const origens: Record<OrigemDoSelo, { rotulo: string, cor: 'success' | 'info' | 'warning' | 'error' }> = {
  nativo: { rotulo: 'Campo da tarefa', cor: 'success' },
  derivado: { rotulo: 'Calculado no front', cor: 'info' },
  relacao: { rotulo: 'Outra chamada', cor: 'warning' },
  novo: { rotulo: 'Não existe hoje', cor: 'error' },
}

/* ------------------------------------------------------------------ *
 * O cartão fechado, de cima para baixo.                               *
 * ------------------------------------------------------------------ */
type SeloSemNumero = Omit<Selo, 'numero'>

/**
 * O número sai da POSIÇÃO na lista, nunca escrito à mão.
 *
 * Na rodada 21 saiu uma peça do meio (o ícone de "pede formulário", que
 * repetia o ícone do tipo) e, com número escrito à mão, a legenda teria ficado
 * pulando do 11 para o 13. Assim, tirar ou acrescentar peça é mexer numa lista
 * e mais nada.
 */
function numerar(lista: SeloSemNumero[], inicio: number): Selo[] {
  return lista.map((selo, i) => ({ ...selo, numero: inicio + i }))
}

const pecasDoCartao: SeloSemNumero[] = [
  {
    id: 'tipo',
    chave: 'tipo',
    onde: 'cartao',
    rotulo: 'Ícone do tipo',
    campo: 'type',
    origem: 'nativo',
    comportamento: 'Ícone sem rótulo, um por tipo: aprovação, formulário, CRUD, início e genérica. Fica no rodapé, com a referência, e não acima do título: o Jira põe tipo e chave na camada de detalhe, embaixo, e deixa o resumo sempre no topo. O nome por extenso está no tooltip.',
    lado: 'esquerda',
    quadro: 'rodape',
  },
  {
    id: 'referencia',
    chave: 'referencia',
    onde: 'cartao',
    rotulo: 'Referência curta',
    campo: 'reference',
    origem: 'nativo',
    comportamento: 'Os seis primeiros caracteres dos 32. Desceu para o rodapé na rodada 19: Trello, monday e Notion nem mostram identificador no cartão, e o do Linear, que mostra, é legível e curto. O nosso é um hash, que serve para copiar e colar em conversa, não para ler de relance. A referência inteira fica no tooltip e no painel, com botão de copiar.',
    lado: 'esquerda',
    quadro: 'rodape',
  },
  {
    id: 'prazoAtrasado',
    chave: 'prazo',
    onde: 'cartao',
    rotulo: 'O mesmo prazo, atrasado',
    campo: 'due_date + status',
    origem: 'derivado',
    comportamento: 'Não é outra peça: é o campo Prazo em vermelho, com o ícone de alarme no lugar do calendário. Até a rodada 18 era um selo separado no topo do cartão, e o prazo sumia quando ele aparecia. O mercado resolve pela cor: no Trello a etiqueta de data fica amarela perto do vencimento e vermelha depois, e no ClickUp a data fica laranja hoje e vermelha atrasada. Quantos dias de atraso, o tooltip diz.',
    lado: 'direita',
  },
  {
    id: 'titulo',
    chave: 'titulo',
    onde: 'cartao',
    rotulo: 'Título',
    campo: 'name',
    origem: 'nativo',
    comportamento: 'Corta em 1, 2 ou 3 linhas conforme o tamanho do cartão. É o link que abre o painel, e ele cobre o cartão inteiro.',
    lado: 'esquerda',
    quadro: 'cabeca',
  },
  {
    id: 'descricao',
    chave: 'descricao',
    onde: 'cartao',
    rotulo: 'Prévia da descrição',
    campo: 'description',
    origem: 'nativo',
    comportamento: 'O HTML vira texto puro e corta em 1, 2 ou 4 linhas. Cartão nunca cresce com o texto: quem tem descrição gigante corta igual.',
    lado: 'esquerda',
    quadro: 'cabeca',
  },
  {
    id: 'item',
    chave: 'item',
    onde: 'cartao',
    rotulo: 'Registro de origem',
    campo: 'item',
    origem: 'relacao',
    comportamento: 'Código e título do registro que gerou a tarefa. O id sozinho não serve: precisa do registro para mostrar o código.',
    lado: 'esquerda',
    quadro: 'cabeca',
  },
  {
    id: 'etiquetas',
    chave: 'etiquetas',
    onde: 'cartao',
    rotulo: 'Etiquetas',
    campo: 'tag_ids',
    origem: 'relacao',
    comportamento: 'As duas primeiras, com a cor que a etiqueta tem. O payload traz só os ids.',
    lado: 'direita',
    quadro: 'cabeca',
  },
  {
    id: 'maisEtiquetas',
    chave: 'maisEtiquetas',
    onde: 'cartao',
    rotulo: 'Contador de etiquetas',
    campo: 'tag_ids',
    origem: 'derivado',
    comportamento: 'O que não coube vira "+1", só o número, para caber na mesma linha das etiquetas. O tooltip lista os nomes que ficaram de fora.',
    lado: 'direita',
    quadro: 'cabeca',
  },
  {
    id: 'prioridade',
    chave: 'prioridade',
    onde: 'cartao',
    rotulo: 'Selo de prioridade',
    campo: 'priority',
    origem: 'nativo',
    comportamento: 'Só aparece fora do normal, com cor e ícone por nível. Normal em todo cartão é ruído: seria um selo cinza em 70% do quadro.',
    lado: 'esquerda',
    quadro: 'rodape',
  },
  {
    id: 'prazo',
    chave: 'prazo',
    onde: 'cartao',
    rotulo: 'Prazo',
    campo: 'due_date',
    origem: 'nativo',
    comportamento: 'Sempre a data, no formato curto (21/09), nunca uma frase: é o que Trello, Jira, Linear, Notion e monday fazem. Âmbar quando vence hoje ou amanhã, vermelho quando passou, neutro no resto. O relativo ("Vence hoje", "Atrasada 2 dias") fica no tooltip e no painel, que é onde há espaço para ele. O quadro de hoje mostra created_at neste lugar, e é por isso que tarefa vencida parece recém-chegada.',
    lado: 'esquerda',
    quadro: 'rodape',
  },
  {
    id: 'pontos',
    chave: 'pontos',
    onde: 'cartao',
    rotulo: 'Pontos',
    campo: 'points',
    origem: 'nativo',
    comportamento: 'Zero não aparece. É um dos campos que o totalizador da raia soma.',
    lado: 'direita',
    quadro: 'rodape',
  },
  {
    id: 'tempo',
    chave: 'tempo',
    onde: 'cartao',
    rotulo: 'Tempo apontado',
    campo: 'sem campo no payload',
    origem: 'novo',
    comportamento: 'Total apontado na tarefa. Quando o cronômetro está correndo nela, o selo fica vermelho e conta na tela.',
    lado: 'direita',
    quadro: 'rodape',
  },
  {
    id: 'iconeDescricao',
    chave: 'iconeDescricao',
    onde: 'cartao',
    rotulo: 'Tem mais texto',
    campo: 'description',
    origem: 'derivado',
    comportamento: 'Aparece quando a descrição está desligada na barra ou quando ela é muito maior que o corte. É o que o Trello faz.',
    lado: 'direita',
    quadro: 'rodape',
  },
  {
    id: 'criador',
    chave: 'criador',
    onde: 'cartao',
    rotulo: 'Quem criou',
    campo: 'creator',
    origem: 'relacao',
    comportamento: 'Caneta e avatar. Some no cartão pequeno. Num quadro alimentado por spaceflow, quase sempre é o robô.',
    lado: 'esquerda',
    quadro: 'pessoas',
  },
  {
    id: 'colaboradores',
    chave: 'colaboradores',
    onde: 'cartao',
    rotulo: 'Quem colabora',
    campo: 'collaborators',
    origem: 'relacao',
    comportamento: 'Ícone de pessoas e no máximo dois avatares. Do terceiro em diante entra o contador "+8", que é o caso comum quando o spaceflow avisa um time inteiro: dez avatares empurrariam o responsável para fora da linha. O tooltip mostra quatro nomes e conta o resto. Some no cartão pequeno.',
    lado: 'direita',
    quadro: 'pessoas',
  },
  {
    id: 'responsavel',
    chave: 'responsavel',
    onde: 'cartao',
    rotulo: 'Quem responde',
    campo: 'assigned_to',
    origem: 'relacao',
    comportamento: 'Avatar maior, sempre por último, encostado na direita. Sem responsável vira um círculo tracejado, que é o convite para atribuir.',
    lado: 'direita',
    quadro: 'pessoas',
  },
  {
    id: 'menu',
    chave: 'menu',
    onde: 'cartao',
    rotulo: 'Ações da tarefa',
    campo: 'ações',
    origem: 'derivado',
    comportamento: 'Aparece no hover e no foco do teclado. É onde moram abrir, iniciar o cronômetro, copiar a referência, mover de raia e arquivar.',
    lado: 'direita',
    quadro: 'cabeca',
  },
  {
    id: 'borda',
    chave: 'borda',
    onde: 'cartao',
    rotulo: 'Filete de atraso',
    campo: 'due_date + status',
    origem: 'derivado',
    comportamento: 'Dois pixels vermelhos na borda esquerda. É o único aviso de atraso que sobrevive ao cartão pequeno, quando os selos somem.',
    lado: 'esquerda',
  },
  {
    id: 'cartao',
    chave: 'cartao',
    onde: 'cartao',
    rotulo: 'A situação não está no cartão',
    campo: 'status',
    origem: 'nativo',
    comportamento: 'De propósito. Quem diz a situação é a raia onde o cartão está. Repetir dentro do cartão gasta a linha do rodapé com o que a coluna já disse. Quando o agrupamento muda, o selo que falta passa a ser outro.',
    lado: 'esquerda',
    quadro: 'cabeca',
  },
]

/* ------------------------------------------------------------------ *
 * O painel lateral, de cima para baixo.                               *
 * ------------------------------------------------------------------ */
export const selosDoCartao: Selo[] = numerar(pecasDoCartao, 1)

const pecasDoPainel: SeloSemNumero[] = [
  {
    id: 'painelIcone',
    chave: 'painelIcone',
    onde: 'painel',
    rotulo: 'Ícone do tipo',
    campo: 'type',
    origem: 'nativo',
    comportamento: 'O mesmo ícone do tipo que abre o rodapé do cartão, aqui em tamanho de identidade.',
    lado: 'esquerda',
  },
  {
    id: 'painelTitulo',
    chave: 'painelTitulo',
    onde: 'painel',
    rotulo: 'Título editável',
    campo: 'name',
    origem: 'nativo',
    comportamento: 'Clicar abre a edição ali mesmo. Enter guarda, Esc desiste. O lápis só aparece no hover.',
    lado: 'esquerda',
  },
  {
    id: 'painelReferencia',
    chave: 'painelReferencia',
    onde: 'painel',
    rotulo: 'Referência',
    campo: 'reference',
    origem: 'nativo',
    comportamento: 'Curta embaixo do título, inteira no bloco Dados técnicos, com botão de copiar.',
    lado: 'esquerda',
  },
  {
    id: 'painelSelos',
    chave: 'painelSelos',
    onde: 'painel',
    rotulo: 'Selos da identidade',
    campo: 'status, priority, notification_task',
    origem: 'nativo',
    comportamento: 'Situação sempre. Prioridade só fora do normal, como no cartão. Notificação só quando a tarefa é de aviso.',
    lado: 'esquerda',
  },
  {
    id: 'painelDetalhes',
    chave: 'painelDetalhes',
    onde: 'painel',
    rotulo: 'Lista DETALHES',
    campo: '15 campos, em três blocos',
    origem: 'nativo',
    comportamento: 'Primeiro o que se mexe, depois o que classifica, e os dados técnicos recolhidos no pé (rodada 16). Responsável, prazo e prioridade são controle, não texto: editam daqui.',
    lado: 'esquerda',
  },
  {
    id: 'painelTempo',
    chave: 'painelTempo',
    onde: 'painel',
    rotulo: 'Campo de tempo',
    campo: 'sem campo no payload',
    origem: 'novo',
    comportamento: 'Campo pequeno que abre popover, como no ClickUp: cronômetro, progresso contra a estimativa, apontamento manual e a lista, onde clicar num apontamento abre a edição dele.',
    lado: 'esquerda',
  },
  {
    id: 'painelAbas',
    chave: 'painelAbas',
    onde: 'painel',
    rotulo: 'Abas',
    campo: 'comentários e auditoria',
    origem: 'relacao',
    comportamento: 'As três do produto: Tarefa, Comentários e Histórico. Comentário e log são outra chamada, não vêm no objeto da tarefa.',
    lado: 'esquerda',
  },
  {
    id: 'painelDescricao',
    chave: 'painelDescricao',
    onde: 'painel',
    rotulo: 'Descrição',
    campo: 'description',
    origem: 'nativo',
    comportamento: 'Inteira, mas recolhida quando passa de 600 caracteres, com cortina e "mostrar tudo". No painel ela não pode empurrar o formulário e os botões para fora da vista.',
    lado: 'esquerda',
  },
  {
    id: 'painelFormulario',
    chave: 'painelFormulario',
    onde: 'painel',
    rotulo: 'Formulário da tarefa',
    campo: 'meta.form',
    origem: 'nativo',
    comportamento: 'Os campos que o spaceflow mandou, com as condicionais do payload funcionando. Quando meta.form é texto, é referência a um formulário de outra tela.',
    lado: 'esquerda',
  },
  {
    id: 'painelResultado',
    chave: 'painelResultado',
    onde: 'painel',
    rotulo: 'O que foi respondido',
    campo: 'meta.form_result',
    origem: 'nativo',
    comportamento: 'Só existe depois de concluída. É o mesmo dado que o totalizador da raia consegue somar, e é por isso que a soma de resposta só cobre as tarefas fechadas.',
    lado: 'esquerda',
  },
  {
    id: 'painelRodape',
    chave: 'painelRodape',
    onde: 'painel',
    rotulo: 'Guardar e concluir',
    campo: 'status, completed_at, completed_by',
    origem: 'nativo',
    comportamento: 'Concluir fica bloqueado enquanto faltar resposta obrigatória, e o rodapé diz o que falta. Concluída, o botão vira reabrir.',
    lado: 'esquerda',
  },
  {
    id: 'painelHistorico',
    chave: 'painelHistorico',
    onde: 'painel',
    rotulo: 'Histórico',
    campo: 'creator, created_at, completed_by',
    origem: 'nativo',
    comportamento: 'A linha do tempo que o produto já tem. Com o quadro vindo de spaceflow, é aqui que se vê que quem criou foi a automação.',
    lado: 'esquerda',
  },
]

export const selosDoPainel: Selo[] = numerar(pecasDoPainel, selosDoCartao.length + 1)

export const todosOsSelos: Selo[] = [...selosDoCartao, ...selosDoPainel]
