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
