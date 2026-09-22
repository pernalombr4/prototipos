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
  /** O número que aparece no balão e na legenda. */
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
export const selosDoCartao: Selo[] = [
  {
    numero: 1,
    chave: 'tipo',
    onde: 'cartao',
    rotulo: 'Ícone do tipo',
    campo: 'type',
    origem: 'nativo',
    comportamento: 'Ícone sem rótulo, um por tipo: aprovação, formulário, CRUD, início e genérica. O nome por extenso está no tooltip.',
    lado: 'esquerda',
  },
  {
    numero: 2,
    chave: 'referencia',
    onde: 'cartao',
    rotulo: 'Referência curta',
    campo: 'reference',
    origem: 'nativo',
    comportamento: 'Os seis primeiros caracteres dos 32. A referência inteira fica no tooltip e no painel, com botão de copiar.',
    lado: 'esquerda',
  },
  {
    numero: 3,
    chave: 'atraso',
    onde: 'cartao',
    rotulo: 'Selo de atraso',
    campo: 'due_date + status',
    origem: 'derivado',
    comportamento: 'Só existe quando o prazo passou e a tarefa não está concluída. Quando ele aparece, o prazo normal (10) some, para não dizer a mesma coisa duas vezes.',
    lado: 'direita',
  },
  {
    numero: 4,
    chave: 'titulo',
    onde: 'cartao',
    rotulo: 'Título',
    campo: 'name',
    origem: 'nativo',
    comportamento: 'Corta em 1, 2 ou 3 linhas conforme o tamanho do cartão. É o link que abre o painel, e ele cobre o cartão inteiro.',
    lado: 'esquerda',
  },
  {
    numero: 5,
    chave: 'descricao',
    onde: 'cartao',
    rotulo: 'Prévia da descrição',
    campo: 'description',
    origem: 'nativo',
    comportamento: 'O HTML vira texto puro e corta em 1, 2 ou 4 linhas. Cartão nunca cresce com o texto: quem tem descrição gigante corta igual.',
    lado: 'esquerda',
  },
  {
    numero: 6,
    chave: 'item',
    onde: 'cartao',
    rotulo: 'Registro de origem',
    campo: 'item',
    origem: 'relacao',
    comportamento: 'Código e título do registro que gerou a tarefa. O id sozinho não serve: precisa do registro para mostrar o código.',
    lado: 'esquerda',
  },
  {
    numero: 7,
    chave: 'etiquetas',
    onde: 'cartao',
    rotulo: 'Etiquetas',
    campo: 'tag_ids',
    origem: 'relacao',
    comportamento: 'As duas primeiras, com a cor que a etiqueta tem. O payload traz só os ids.',
    lado: 'esquerda',
  },
  {
    numero: 8,
    chave: 'maisEtiquetas',
    onde: 'cartao',
    rotulo: 'Contador de etiquetas',
    campo: 'tag_ids',
    origem: 'derivado',
    comportamento: 'O que não coube vira "+2". O tooltip lista os nomes que ficaram de fora.',
    lado: 'esquerda',
  },
  {
    numero: 9,
    chave: 'prioridade',
    onde: 'cartao',
    rotulo: 'Selo de prioridade',
    campo: 'priority',
    origem: 'nativo',
    comportamento: 'Só aparece fora do normal, com cor e ícone por nível. Normal em todo cartão é ruído: seria um selo cinza em 70% do quadro.',
    lado: 'direita',
  },
  {
    numero: 10,
    chave: 'prazo',
    onde: 'cartao',
    rotulo: 'Prazo',
    campo: 'due_date',
    origem: 'nativo',
    comportamento: 'Data em linguagem de gente ("em 3 dias"), amarela quando é hoje ou amanhã. O quadro de hoje mostra created_at neste lugar, e é por isso que tarefa vencida parece recém-chegada.',
    lado: 'direita',
  },
  {
    numero: 11,
    chave: 'pontos',
    onde: 'cartao',
    rotulo: 'Pontos',
    campo: 'points',
    origem: 'nativo',
    comportamento: 'Zero não aparece. É um dos campos que o totalizador da raia soma.',
    lado: 'direita',
  },
  {
    numero: 12,
    chave: 'formulario',
    onde: 'cartao',
    rotulo: 'Tem formulário',
    campo: 'type + meta.form',
    origem: 'derivado',
    comportamento: 'Prancheta: a tarefa pede resposta antes de poder ser concluída. Sem isso, a pessoa só descobre ao abrir.',
    lado: 'direita',
  },
  {
    numero: 13,
    chave: 'tempo',
    onde: 'cartao',
    rotulo: 'Tempo apontado',
    campo: 'sem campo no payload',
    origem: 'novo',
    comportamento: 'Total apontado na tarefa. Quando o cronômetro está correndo nela, o selo fica vermelho e conta na tela.',
    lado: 'direita',
  },
  {
    numero: 14,
    chave: 'iconeDescricao',
    onde: 'cartao',
    rotulo: 'Tem mais texto',
    campo: 'description',
    origem: 'derivado',
    comportamento: 'Aparece quando a descrição está desligada na barra ou quando ela é muito maior que o corte. É o que o Trello faz.',
    lado: 'direita',
  },
  {
    numero: 15,
    chave: 'criador',
    onde: 'cartao',
    rotulo: 'Quem criou',
    campo: 'creator',
    origem: 'relacao',
    comportamento: 'Caneta e avatar. Some no cartão pequeno. Num quadro alimentado por spaceflow, quase sempre é o robô.',
    lado: 'direita',
  },
  {
    numero: 16,
    chave: 'colaboradores',
    onde: 'cartao',
    rotulo: 'Quem colabora',
    campo: 'collaborators',
    origem: 'relacao',
    comportamento: 'Pessoas e um grupo de no máximo dois avatares. Some no cartão pequeno.',
    lado: 'direita',
  },
  {
    numero: 17,
    chave: 'responsavel',
    onde: 'cartao',
    rotulo: 'Quem responde',
    campo: 'assigned_to',
    origem: 'relacao',
    comportamento: 'Avatar maior, sempre por último, encostado na direita. Sem responsável vira um círculo tracejado, que é o convite para atribuir.',
    lado: 'direita',
  },
  {
    numero: 18,
    chave: 'menu',
    onde: 'cartao',
    rotulo: 'Ações da tarefa',
    campo: 'ações',
    origem: 'derivado',
    comportamento: 'Aparece no hover e no foco do teclado. É onde moram abrir, iniciar o cronômetro, copiar a referência, mover de raia e arquivar.',
    lado: 'direita',
  },
  {
    numero: 19,
    chave: 'borda',
    onde: 'cartao',
    rotulo: 'Filete de atraso',
    campo: 'due_date + status',
    origem: 'derivado',
    comportamento: 'Dois pixels vermelhos na borda esquerda. É o único aviso de atraso que sobrevive ao cartão pequeno, quando os selos somem.',
    lado: 'esquerda',
  },
  {
    numero: 20,
    chave: 'cartao',
    onde: 'cartao',
    rotulo: 'A situação não está no cartão',
    campo: 'status',
    origem: 'nativo',
    comportamento: 'De propósito. Quem diz a situação é a raia onde o cartão está. Repetir dentro do cartão gasta a linha do rodapé com o que a coluna já disse. Quando o agrupamento muda, o selo que falta passa a ser outro.',
    lado: 'esquerda',
  },
]

/* ------------------------------------------------------------------ *
 * O painel lateral, de cima para baixo.                               *
 * ------------------------------------------------------------------ */
export const selosDoPainel: Selo[] = [
  {
    numero: 21,
    chave: 'painelIcone',
    onde: 'painel',
    rotulo: 'Ícone do tipo',
    campo: 'type',
    origem: 'nativo',
    comportamento: 'O mesmo ícone do cartão (1), em tamanho de identidade.',
    lado: 'esquerda',
  },
  {
    numero: 22,
    chave: 'painelTitulo',
    onde: 'painel',
    rotulo: 'Título editável',
    campo: 'name',
    origem: 'nativo',
    comportamento: 'Clicar abre a edição ali mesmo. Enter guarda, Esc desiste. O lápis só aparece no hover.',
    lado: 'esquerda',
  },
  {
    numero: 23,
    chave: 'painelReferencia',
    onde: 'painel',
    rotulo: 'Referência',
    campo: 'reference',
    origem: 'nativo',
    comportamento: 'Curta embaixo do título, inteira no bloco Dados técnicos, com botão de copiar.',
    lado: 'esquerda',
  },
  {
    numero: 24,
    chave: 'painelSelos',
    onde: 'painel',
    rotulo: 'Selos da identidade',
    campo: 'status, priority, notification_task',
    origem: 'nativo',
    comportamento: 'Situação sempre. Prioridade só fora do normal, como no cartão. Notificação só quando a tarefa é de aviso.',
    lado: 'esquerda',
  },
  {
    numero: 25,
    chave: 'painelDetalhes',
    onde: 'painel',
    rotulo: 'Lista DETALHES',
    campo: '15 campos, em três blocos',
    origem: 'nativo',
    comportamento: 'Primeiro o que se mexe, depois o que classifica, e os dados técnicos recolhidos no pé (rodada 16). Responsável, prazo e prioridade são controle, não texto: editam daqui.',
    lado: 'esquerda',
  },
  {
    numero: 26,
    chave: 'painelTempo',
    onde: 'painel',
    rotulo: 'Campo de tempo',
    campo: 'sem campo no payload',
    origem: 'novo',
    comportamento: 'Campo pequeno que abre popover, como no ClickUp: cronômetro, progresso contra a estimativa, apontamento manual e a lista, onde clicar num apontamento abre a edição dele.',
    lado: 'esquerda',
  },
  {
    numero: 27,
    chave: 'painelAbas',
    onde: 'painel',
    rotulo: 'Abas',
    campo: 'comentários e auditoria',
    origem: 'relacao',
    comportamento: 'As três do produto: Tarefa, Comentários e Histórico. Comentário e log são outra chamada, não vêm no objeto da tarefa.',
    lado: 'esquerda',
  },
  {
    numero: 28,
    chave: 'painelDescricao',
    onde: 'painel',
    rotulo: 'Descrição',
    campo: 'description',
    origem: 'nativo',
    comportamento: 'Inteira, mas recolhida quando passa de 600 caracteres, com cortina e "mostrar tudo". No painel ela não pode empurrar o formulário e os botões para fora da vista.',
    lado: 'esquerda',
  },
  {
    numero: 29,
    chave: 'painelFormulario',
    onde: 'painel',
    rotulo: 'Formulário da tarefa',
    campo: 'meta.form',
    origem: 'nativo',
    comportamento: 'Os campos que o spaceflow mandou, com as condicionais do payload funcionando. Quando meta.form é texto, é referência a um formulário de outra tela.',
    lado: 'esquerda',
  },
  {
    numero: 30,
    chave: 'painelResultado',
    onde: 'painel',
    rotulo: 'O que foi respondido',
    campo: 'meta.form_result',
    origem: 'nativo',
    comportamento: 'Só existe depois de concluída. É o mesmo dado que o totalizador da raia consegue somar, e é por isso que a soma de resposta só cobre as tarefas fechadas.',
    lado: 'esquerda',
  },
  {
    numero: 31,
    chave: 'painelRodape',
    onde: 'painel',
    rotulo: 'Guardar e concluir',
    campo: 'status, completed_at, completed_by',
    origem: 'nativo',
    comportamento: 'Concluir fica bloqueado enquanto faltar resposta obrigatória, e o rodapé diz o que falta. Concluída, o botão vira reabrir.',
    lado: 'esquerda',
  },
  {
    numero: 32,
    chave: 'painelHistorico',
    onde: 'painel',
    rotulo: 'Histórico',
    campo: 'creator, created_at, completed_by',
    origem: 'nativo',
    comportamento: 'A linha do tempo que o produto já tem. Com o quadro vindo de spaceflow, é aqui que se vê que quem criou foi a automação.',
    lado: 'esquerda',
  },
]

export const todosOsSelos: Selo[] = [...selosDoCartao, ...selosDoPainel]
