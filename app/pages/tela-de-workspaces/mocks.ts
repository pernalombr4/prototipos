// Dado do protótipo — 100% fictício.
//
// A ESTRUTURA veio do develop (Fase 2): todo workspace tem nome, referência em
// kebab-case, descrição (quase sempre vazia, aparecendo como "Sem descrição"),
// um papel do usuário e um ícone. Convite pendente é um estado do próprio card.
// Os VALORES são inventados: nenhuma empresa, pessoa ou chamado aqui é real.

export type Papel = 'Proprietário' | 'Full' | 'Membro' | 'Leitor'

export interface Workspace {
  id: string
  nome: string
  referencia: string
  descricao: string
  icone: string
  papel: Papel
  favorito: boolean
  /** Minutos desde o último acesso. null = nunca entrou. */
  ultimoAcessoMin: number | null
  membros: number
  convitePendente?: boolean
  /** Quem convidou — só existe quando convitePendente. */
  convidadoPor?: string
}

export const usuario = {
  nome: 'Mariana Duarte',
  iniciais: 'MD',
  email: 'mariana.duarte@grupoaurora.com.br',
}

export const workspaces: Workspace[] = [
  {
    id: 'w1',
    nome: 'Grupo Aurora',
    referencia: 'grupo-aurora',
    descricao: 'Chamados, RH e jurídico do Grupo Aurora',
    icone: 'i-lucide-building-2',
    papel: 'Membro',
    favorito: true,
    ultimoAcessoMin: 95,
    membros: 340,
  },
  {
    id: 'w2',
    nome: 'Vértice Log',
    referencia: 'vertice-log',
    descricao: 'Processos de logística, frota e expedição',
    icone: 'i-lucide-truck',
    papel: 'Full',
    favorito: true,
    ultimoAcessoMin: 2 * 24 * 60,
    membros: 62,
  },
  {
    id: 'w3',
    nome: 'RH Aurora',
    referencia: 'rh-aurora',
    descricao: '',
    icone: 'i-lucide-users',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: 9 * 24 * 60,
    membros: 28,
  },
  {
    // caso de canto de propósito: nome longo que estoura a linha
    id: 'w4',
    nome: 'Jurídico — Correções Monetárias e Acordos Trabalhistas',
    referencia: 'juridico-correcoes-monetarias',
    descricao: 'Cálculo de correção e acompanhamento de acordos',
    icone: 'i-lucide-scale',
    papel: 'Leitor',
    favorito: false,
    ultimoAcessoMin: 41 * 24 * 60,
    membros: 11,
  },
  {
    id: 'w5',
    nome: 'Aurora Saúde — Homologação',
    referencia: 'aurora-saude-homologacao',
    descricao: '',
    icone: 'i-lucide-cross',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: null,
    membros: 4,
  },
  {
    id: 'w6',
    nome: 'Lumen Contábil',
    referencia: 'lumen-contabil',
    descricao: 'Fechamento contábil e obrigações acessórias',
    icone: 'i-lucide-calculator',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: null,
    membros: 19,
    convitePendente: true,
    convidadoPor: 'Rodrigo Petrone',
  },
  {
    id: 'w7',
    nome: 'Base de teste — migração',
    referencia: 'base-de-teste-migracao',
    descricao: '',
    icone: 'i-lucide-database',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: 6 * 24 * 60,
    membros: 2,
  },
]

/** O caso da demanda: quem só pertence ao workspace da própria empresa. */
export const workspaceUnico: Workspace[] = [workspaces[0]!]

/** O que a pessoa vai fazer lá dentro — usado para explicar o que é um workspace. */
export const exemplosDoQueSeFazDentro = [
  { icone: 'i-lucide-life-buoy', texto: 'Abrir e acompanhar chamados' },
  { icone: 'i-lucide-check-square', texto: 'Ver suas tarefas e prazos' },
  { icone: 'i-lucide-folder-open', texto: 'Consultar dados e documentos' },
]

/** "há 2 horas", "há 9 dias" — texto relativo, calculado do mock. */
export function tempoRelativo(minutos: number | null): string {
  if (minutos === null) return 'Você ainda não entrou aqui'
  if (minutos < 60) return `Você esteve aqui há ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `Você esteve aqui há ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.round(horas / 24)
  if (dias < 30) return `Você esteve aqui há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
  const meses = Math.round(dias / 30)
  return `Você esteve aqui há ${meses} ${meses === 1 ? 'mês' : 'meses'}`
}

export const corDoPapel: Record<Papel, 'primary' | 'secondary' | 'neutral' | 'success'> = {
  'Proprietário': 'primary',
  'Full': 'secondary',
  'Membro': 'neutral',
  'Leitor': 'neutral',
}

/* ------------------------------------------------------------------
   Criação de workspace — estrutura tirada da jornada real do develop
   (percorrida em 16/09/2026, sem finalizar a criação).

   Passo 1 "Dados Gerais": Nome*, Referência* (preenchida a partir do
   nome), Descrição (com contador) e Ícone* — que no produto é uma
   árvore de categorias e, depois de escolhido, mostra o id técnico
   (`carbon:scales`) em vez do nome ou do desenho.
   Passo 2 "Selecionar Template (Opcional)": Localidade (Brasil pt-br,
   Estados Unidos en-us, Global — múltipla escolha) e Templates, que
   em Brasil responde "Não há dados".
------------------------------------------------------------------ */

export interface CategoriaDeIcone {
  nome: string
  icones: { id: string, nome: string }[]
}

/** Mesmas categorias e nomes em português do produto; ícones do Lucide. */
export const categoriasDeIcone: CategoriaDeIcone[] = [
  {
    nome: 'Jurídico',
    icones: [
      { id: 'i-lucide-scale', nome: 'Balança' },
      { id: 'i-lucide-file-check', nome: 'Certidão' },
      { id: 'i-lucide-file-text', nome: 'Documento legal' },
      { id: 'i-lucide-gavel', nome: 'Martelo' },
      { id: 'i-lucide-file-signature', nome: 'Contrato' },
      { id: 'i-lucide-shield-check', nome: 'Escudo verificado' },
    ],
  },
  {
    nome: 'Pessoas',
    icones: [
      { id: 'i-lucide-users', nome: 'Equipe' },
      { id: 'i-lucide-user-plus', nome: 'Admissão' },
      { id: 'i-lucide-id-card', nome: 'Crachá' },
      { id: 'i-lucide-heart-handshake', nome: 'Benefícios' },
    ],
  },
  {
    nome: 'Finanças',
    icones: [
      { id: 'i-lucide-calculator', nome: 'Calculadora' },
      { id: 'i-lucide-banknote', nome: 'Pagamento' },
      { id: 'i-lucide-chart-line', nome: 'Resultado' },
      { id: 'i-lucide-receipt', nome: 'Nota fiscal' },
    ],
  },
  {
    nome: 'Operação',
    icones: [
      { id: 'i-lucide-truck', nome: 'Logística' },
      { id: 'i-lucide-package', nome: 'Estoque' },
      { id: 'i-lucide-factory', nome: 'Produção' },
      { id: 'i-lucide-wrench', nome: 'Manutenção' },
    ],
  },
  {
    nome: 'Tecnologia',
    icones: [
      { id: 'i-lucide-database', nome: 'Dados' },
      { id: 'i-lucide-server', nome: 'Servidor' },
      { id: 'i-lucide-code', nome: 'Desenvolvimento' },
      { id: 'i-lucide-life-buoy', nome: 'Suporte' },
    ],
  },
  {
    nome: 'Saúde',
    icones: [
      { id: 'i-lucide-cross', nome: 'Saúde' },
      { id: 'i-lucide-stethoscope', nome: 'Atendimento' },
      { id: 'i-lucide-pill', nome: 'Medicamento' },
      { id: 'i-lucide-activity', nome: 'Indicador' },
    ],
  },
]

export interface Localidade { id: string, nome: string }

export const localidades: Localidade[] = [
  { id: 'pt-br', nome: 'Brasil' },
  { id: 'en-us', nome: 'Estados Unidos' },
  { id: 'global', nome: 'Global' },
]

export interface Template {
  id: string
  nome: string
  descricao: string
  icone: string
  localidades: string[]
  inclui: string[]
}

/**
 * Templates fictícios. No develop, a Localidade Brasil hoje responde
 * "Não há dados" — o estado vazio é real e está no protótipo como estado.
 * Estes existem para mostrar como o passo se comporta quando houver.
 */
export const templates: Template[] = [
  {
    id: 'chamados',
    nome: 'Central de chamados',
    descricao: 'Abertura, triagem e acompanhamento de pedidos internos.',
    icone: 'i-lucide-life-buoy',
    localidades: ['pt-br', 'global'],
    inclui: ['Categoria de chamados', 'Formulário de abertura', 'Fluxo de triagem', 'Painel de SLA'],
  },
  {
    id: 'rh',
    nome: 'Jornada do colaborador',
    descricao: 'Admissão, férias, benefícios e desligamento num lugar só.',
    icone: 'i-lucide-users',
    localidades: ['pt-br'],
    inclui: ['Categoria de pessoas', 'Fluxo de admissão', 'Solicitação de férias'],
  },
  {
    id: 'juridico',
    nome: 'Contratos e prazos',
    descricao: 'Guarda de contratos com alerta de vencimento e reajuste.',
    icone: 'i-lucide-scale',
    localidades: ['pt-br', 'global'],
    inclui: ['Categoria de contratos', 'Alerta de vencimento', 'Correção monetária'],
  },
]
