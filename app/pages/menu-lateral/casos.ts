/**
 * CASOS DE USO (rodada 18): os "modelos" do ENSPACE.
 *
 *   "os botoes de importar e modelos tambem sao importantes pro enspace,
 *    afinal temos importaçao e exportaçao, alem dos nossos casos de uso
 *    (modelos)." (Mikaela)
 *
 * No ENSPACE, um caso de uso é um pacote de estrutura: menus com telas e as
 * categorias que eles usam. É o que a tela Configurações > Interface > Casos
 * de Uso importa e exporta hoje (protótipo `migracao-de-workspace`). Aqui ele
 * ganha a Central do ClickUp: vitrine, filtros, detalhe, usar e guardar.
 *
 * A diferença entre os dois botões do ClickUp, conferida na central de ajuda
 * deles ("Add a template to your library" e "Use Folder templates"):
 *
 *   USAR             aplica agora: os menus e as categorias entram no menu;
 *   ADICIONAR AO     guarda uma cópia na biblioteca do workspace, para
 *   WORKSPACE        renomear e ajustar antes de usar. O menu NÃO muda.
 *
 * Foi por isso que o menu dela não mudou quando ela adicionou o "Event
 * Marketing" no ClickUp: ele foi para "Modelos baseados em seu espaço de
 * trabalho", não para a barra.
 *
 * Os casos e os números são do protótipo, inventados.
 */

import { useMenuDoWorkspace } from './estado'
import { useJanelasDaTrilha } from './trilha'
import { categoriasNormais, type Categoria, type NoDoMenu } from './mocks'

export type Complexidade = 'iniciante' | 'intermediario' | 'avancado'
/** O que o caso traz: um workspace inteiro, um menu, uma categoria ou uma tela. */
export type TipoDeCaso = 'workspace' | 'menu' | 'categoria' | 'tela'

export interface TelaDoCaso { rotulo: string, icone: string, tipoDeTela: string }
export interface MenuDoCaso { rotulo: string, icone: string, telas: TelaDoCaso[] }
export interface CategoriaDoCaso { nome: string, icone: string, campos: string[] }

export interface CasoDeUso {
  id: string
  nome: string
  icone: string
  area: string
  tipo: TipoDeCaso
  complexidade: Complexidade
  descricao: string
  destaque?: boolean
  /** Do ENSPACE (verificado) ou feito no próprio workspace. */
  origem: 'enspace' | 'workspace'
  criadoEm: string
  usos: number
  menus: MenuDoCaso[]
  categorias: CategoriaDoCaso[]
  /** Status que as telas de triagem usam. */
  status: string[]
}

export const AREAS = ['Jurídico', 'Comercial', 'Financeiro', 'Pessoas', 'Compras', 'Atendimento', 'TI', 'Operações'] as const

const t = (rotulo: string, icone: string, tipoDeTela = 'consultas'): TelaDoCaso => ({ rotulo, icone, tipoDeTela })

export const casosDoEnspace: CasoDeUso[] = [
  {
    id: 'cu-contratos', nome: 'Gestão de contratos', icone: 'i-lucide-file-signature', area: 'Jurídico', tipo: 'workspace',
    complexidade: 'intermediario', destaque: true, origem: 'enspace', criadoEm: '2025-03-12', usos: 4120,
    descricao: 'Do pedido à assinatura e ao vencimento. Traz a fila de aprovação, o painel do que vence em 30 dias e os aditivos ligados ao contrato.',
    menus: [
      { rotulo: 'Contratos', icone: 'i-lucide-file-signature', telas: [t('Contratos ativos', 'i-lucide-list'), t('Vencendo em 30 dias', 'i-lucide-calendar-clock'), t('Para aprovar', 'i-lucide-circle-check-big', 'triagem')] },
      { rotulo: 'Painel jurídico', icone: 'i-lucide-chart-column', telas: [t('Visão geral', 'i-lucide-chart-pie', 'paineis')] },
    ],
    categorias: [
      { nome: 'Contratos', icone: 'i-lucide-file-signature', campos: ['Contraparte', 'Valor', 'Início', 'Vencimento', 'Responsável', 'Renovação automática'] },
      { nome: 'Aditivos', icone: 'i-lucide-file-plus', campos: ['Contrato de origem', 'Motivo', 'Novo valor'] },
    ],
    status: ['Rascunho', 'Em aprovação', 'Assinado', 'Vencido'],
  },
  {
    id: 'cu-contencioso', nome: 'Contencioso', icone: 'i-lucide-scale', area: 'Jurídico', tipo: 'menu',
    complexidade: 'avancado', origem: 'enspace', criadoEm: '2025-06-02', usos: 870,
    descricao: 'Processos, prazos e audiências num menu só, com a pauta da semana e os prazos que vencem.',
    menus: [{ rotulo: 'Contencioso', icone: 'i-lucide-scale', telas: [t('Processos', 'i-lucide-folder-open'), t('Prazos da semana', 'i-lucide-alarm-clock', 'tarefas'), t('Audiências', 'i-lucide-calendar-days')] }],
    categorias: [{ nome: 'Processos', icone: 'i-lucide-gavel', campos: ['Número', 'Vara', 'Parte contrária', 'Valor da causa', 'Fase'] }],
    status: ['Inicial', 'Instrução', 'Sentença', 'Recurso', 'Encerrado'],
  },
  {
    id: 'cu-funil', nome: 'Funil de vendas', icone: 'i-lucide-filter', area: 'Comercial', tipo: 'workspace',
    complexidade: 'iniciante', destaque: true, origem: 'enspace', criadoEm: '2024-11-20', usos: 9850,
    descricao: 'Oportunidades em etapas, do primeiro contato ao fechamento, com metas do mês e o painel de conversão.',
    menus: [{ rotulo: 'Vendas', icone: 'i-lucide-trending-up', telas: [t('Funil', 'i-lucide-kanban'), t('Minhas oportunidades', 'i-lucide-user', 'meus-itens'), t('Conversão', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Oportunidades', icone: 'i-lucide-target', campos: ['Cliente', 'Valor', 'Etapa', 'Previsão de fechamento', 'Origem'] }],
    status: ['Prospecção', 'Proposta', 'Negociação', 'Ganho', 'Perdido'],
  },
  {
    id: 'cu-propostas', nome: 'Propostas comerciais', icone: 'i-lucide-file-text', area: 'Comercial', tipo: 'categoria',
    complexidade: 'iniciante', origem: 'enspace', criadoEm: '2025-01-08', usos: 2310,
    descricao: 'Uma categoria pronta para propostas, com versão, desconto e aprovação de margem.',
    menus: [],
    categorias: [{ nome: 'Propostas', icone: 'i-lucide-file-text', campos: ['Oportunidade', 'Versão', 'Desconto', 'Margem', 'Validade'] }],
    status: ['Em elaboração', 'Enviada', 'Aceita', 'Recusada'],
  },
  {
    id: 'cu-pagar', nome: 'Contas a pagar', icone: 'i-lucide-wallet', area: 'Financeiro', tipo: 'workspace',
    complexidade: 'intermediario', destaque: true, origem: 'enspace', criadoEm: '2025-02-17', usos: 5630,
    descricao: 'Lançamento, aprovação e pagamento, com a agenda da semana e o que está atrasado.',
    menus: [{ rotulo: 'Financeiro', icone: 'i-lucide-wallet', telas: [t('Lançamentos', 'i-lucide-list'), t('Aprovar pagamento', 'i-lucide-circle-check-big', 'triagem'), t('Agenda de pagamentos', 'i-lucide-calendar-days')] }],
    categorias: [
      { nome: 'Contas a pagar', icone: 'i-lucide-receipt', campos: ['Fornecedor', 'Valor', 'Vencimento', 'Centro de custo', 'Nota fiscal'] },
      { nome: 'Fornecedores', icone: 'i-lucide-truck', campos: ['CNPJ', 'Contato', 'Banco'] },
    ],
    status: ['Lançada', 'Aprovada', 'Paga', 'Atrasada'],
  },
  {
    id: 'cu-reembolso', nome: 'Reembolsos', icone: 'i-lucide-hand-coins', area: 'Financeiro', tipo: 'menu',
    complexidade: 'iniciante', origem: 'enspace', criadoEm: '2025-04-30', usos: 3140,
    descricao: 'Quem pede anexa o comprovante; quem aprova vê a fila; o financeiro paga.',
    menus: [{ rotulo: 'Reembolsos', icone: 'i-lucide-hand-coins', telas: [t('Minhas solicitações', 'i-lucide-user', 'minhas-requisicoes'), t('Fila de aprovação', 'i-lucide-inbox', 'triagem')] }],
    categorias: [{ nome: 'Reembolsos', icone: 'i-lucide-hand-coins', campos: ['Valor', 'Data da despesa', 'Comprovante', 'Projeto'] }],
    status: ['Enviado', 'Aprovado', 'Pago', 'Recusado'],
  },
  {
    id: 'cu-admissao', nome: 'Admissão de colaboradores', icone: 'i-lucide-user-plus', area: 'Pessoas', tipo: 'workspace',
    complexidade: 'intermediario', destaque: true, origem: 'enspace', criadoEm: '2025-05-14', usos: 2780,
    descricao: 'Da vaga aprovada ao primeiro dia: documentos, equipamentos e acessos, cada um com responsável.',
    menus: [{ rotulo: 'Admissões', icone: 'i-lucide-user-plus', telas: [t('Em andamento', 'i-lucide-list'), t('Checklist do primeiro dia', 'i-lucide-list-checks', 'tarefas')] }],
    categorias: [{ nome: 'Admissões', icone: 'i-lucide-user-plus', campos: ['Nome', 'Cargo', 'Data de início', 'Gestor', 'Documentos'] }],
    status: ['Documentos', 'Equipamento', 'Acessos', 'Concluída'],
  },
  {
    id: 'cu-ferias', nome: 'Férias e ausências', icone: 'i-lucide-palmtree', area: 'Pessoas', tipo: 'tela',
    complexidade: 'iniciante', origem: 'enspace', criadoEm: '2025-07-21', usos: 1960,
    descricao: 'Uma tela de calendário da equipe com quem está fora e quando volta.',
    menus: [{ rotulo: 'Pessoas', icone: 'i-lucide-users-round', telas: [t('Calendário da equipe', 'i-lucide-calendar-days', 'personalizada')] }],
    categorias: [],
    status: [],
  },
  {
    id: 'cu-compras', nome: 'Solicitações de compra', icone: 'i-lucide-shopping-cart', area: 'Compras', tipo: 'workspace',
    complexidade: 'iniciante', destaque: true, origem: 'enspace', criadoEm: '2024-12-03', usos: 6410,
    descricao: 'Pedido, cotação e aprovação por alçada. Quem pede acompanha sem precisar perguntar.',
    menus: [{ rotulo: 'Compras', icone: 'i-lucide-shopping-cart', telas: [t('Minhas solicitações', 'i-lucide-user', 'minhas-requisicoes'), t('Cotações', 'i-lucide-list'), t('Aprovar por alçada', 'i-lucide-circle-check-big', 'triagem')] }],
    categorias: [{ nome: 'Solicitações de compra', icone: 'i-lucide-shopping-cart', campos: ['Item', 'Quantidade', 'Valor estimado', 'Centro de custo', 'Urgência'] }],
    status: ['Solicitada', 'Em cotação', 'Aprovada', 'Comprada'],
  },
  {
    id: 'cu-chamados', nome: 'Central de chamados', icone: 'i-lucide-life-buoy', area: 'Atendimento', tipo: 'workspace',
    complexidade: 'intermediario', destaque: true, origem: 'enspace', criadoEm: '2025-03-28', usos: 7220,
    descricao: 'Chamados com prazo de atendimento, fila por equipe e o painel do que está estourando.',
    menus: [{ rotulo: 'Atendimento', icone: 'i-lucide-life-buoy', telas: [t('Fila da equipe', 'i-lucide-inbox', 'triagem'), t('Meus chamados', 'i-lucide-user', 'meus-itens'), t('Prazos', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Chamados', icone: 'i-lucide-life-buoy', campos: ['Solicitante', 'Assunto', 'Prioridade', 'Prazo', 'Equipe'] }],
    status: ['Aberto', 'Em atendimento', 'Aguardando', 'Resolvido'],
  },
  {
    id: 'cu-acessos', nome: 'Gestão de acessos', icone: 'i-lucide-key-round', area: 'TI', tipo: 'menu',
    complexidade: 'avancado', origem: 'enspace', criadoEm: '2025-08-09', usos: 640,
    descricao: 'Pedidos de acesso a sistemas com dono do sistema aprovando e revisão a cada trimestre.',
    menus: [{ rotulo: 'Acessos', icone: 'i-lucide-key-round', telas: [t('Pedidos', 'i-lucide-list'), t('Revisão trimestral', 'i-lucide-refresh-cw', 'tarefas')] }],
    categorias: [{ nome: 'Pedidos de acesso', icone: 'i-lucide-key-round', campos: ['Sistema', 'Perfil', 'Justificativa', 'Validade'] }],
    status: ['Pedido', 'Aprovado', 'Concedido', 'Revogado'],
  },
  {
    id: 'cu-ocorrencias', nome: 'Ocorrências de operação', icone: 'i-lucide-siren', area: 'Operações', tipo: 'categoria',
    complexidade: 'intermediario', origem: 'enspace', criadoEm: '2025-09-02', usos: 1180,
    descricao: 'Registro de ocorrência com causa, ação tomada e prazo da ação corretiva.',
    menus: [],
    categorias: [{ nome: 'Ocorrências', icone: 'i-lucide-siren', campos: ['Local', 'Gravidade', 'Causa', 'Ação corretiva', 'Prazo'] }],
    status: ['Registrada', 'Em análise', 'Corrigida'],
  },
]

/* ================================ o estado ================================ */

export type ModoDeAplicar = 'somar' | 'substituir'

/** Os casos guardados no workspace: "Adicionar ao workspace" e "Criar caso de uso". */
export function useCasosDoWorkspace() {
  return useState<CasoDeUso[]>('casos-do-workspace', () => [])
}

/** As janelas desta rodada. */
export function useJanelasDeCasos() {
  return {
    central: useState<boolean>('casos-central', () => false),
    /** O caso que está sendo usado (abre a janela de usar). */
    usando: useState<CasoDeUso | null>('casos-usando', () => null),
    importando: useState<boolean>('casos-importando', () => false),
    criando: useState<boolean>('casos-criando', () => false),
  }
}

function novoId(prefixo: string) {
  return `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Aplicar um caso no menu. É a regra de importação do protótipo
 * `migracao-de-workspace`, reduzida às duas escolhas que ela pediu aqui:
 *
 *   SOMAR       o que vem entra ao lado do que existe;
 *   SUBSTITUIR  os menus que o WORKSPACE criou saem, e os do caso entram.
 *               Os nativos ficam: substituir não apaga Início, Tarefas e
 *               companhia, que não são do workspace.
 *
 * Os menus entram no rascunho e acendem o Salvar, como todo menu criado; as
 * categorias entram na lista na hora, como as do "Criar categoria".
 */
export function useAplicarCaso() {
  const menu = useMenuDoWorkspace()
  const { categoriasCriadas } = useJanelasDaTrilha()

  /** O que sai se substituir: os menus que o workspace criou. */
  const saemSeSubstituir = computed(() =>
    menu.rascunho.value.filter(n => n.tipo === 'secao' && menu.origemDe(n) === 'workspace'),
  )

  function aplicar(caso: CasoDeUso, modo: ModoDeAplicar, lugar: 'inicio' | 'trilha' = 'inicio') {
    if (modo === 'substituir') {
      for (const s of saemSeSubstituir.value) {
        const i = menu.rascunho.value.findIndex(n => n.id === s.id)
        if (i >= 0) menu.rascunho.value.splice(i, 1)
        menu.marcarTocado(s.id)
      }
    }
    const idsNovos: string[] = []
    for (const m of caso.menus) {
      const id = novoId('s')
      idsNovos.push(id)
      const no: NoDoMenu = {
        id,
        tipo: 'secao',
        origem: 'workspace',
        rotulo: m.rotulo,
        icone: m.icone,
        lugar: lugar === 'trilha' ? 'trilha' : 'painel',
        painel: 'trabalho',
        escopo: [],
        filhos: m.telas.map(tela => ({ id: novoId('t'), tipo: 'tela' as const, origem: 'workspace' as const, rotulo: tela.rotulo, icone: tela.icone, tipoDeTela: tela.tipoDeTela })),
      }
      menu.adicionarSecao(no)
    }
    // No Início, os menus do caso entram no topo das seções.
    if (lugar === 'inicio' && idsNovos.length) {
      menu.aplicarPrefs((p) => { p.ordemDasSecoes = [...idsNovos, ...p.ordemDasSecoes] })
    }
    const base = categoriasNormais[0]!
    const existentes = new Set(categoriasCriadas.value.map(c => c.name))
    const novas: Categoria[] = caso.categorias
      .filter(c => !existentes.has(c.nome))
      .map((c, i) => ({
        ...base,
        id: Date.now() + i,
        name: c.nome,
        slug: c.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'),
        icon: c.icone,
        description: '',
        favorita: false,
        // Recém-chegada sobe para o topo de "Mais usadas", como a criada à mão.
        aberturas: 9999,
      }))
    categoriasCriadas.value = [...categoriasCriadas.value, ...novas]
    return { menus: idsNovos.length, categorias: novas.length }
  }

  return { aplicar, saemSeSubstituir }
}

/* ============================ exportar e importar ============================ */

/** O arquivo que o "Exportar" baixa e o "Importar" lê. Estrutura, sem dado de item. */
export interface ArquivoDeCaso {
  formato: 'enspace-caso-de-uso'
  versao: 1
  workspace: string
  exportadoEm: string
  caso: CasoDeUso
}

/** Monta um caso a partir dos menus que o workspace criou. */
export function casoDoMenuAtual(nome: string, menus: NoDoMenu[], rotuloDe: (n: NoDoMenu) => string, extra: Partial<CasoDeUso> = {}): CasoDeUso {
  return {
    id: novoId('cu'),
    nome,
    icone: extra.icone ?? 'i-lucide-package',
    area: extra.area ?? 'Operações',
    tipo: menus.length > 1 ? 'workspace' : 'menu',
    complexidade: extra.complexidade ?? 'iniciante',
    descricao: extra.descricao ?? '',
    origem: 'workspace',
    criadoEm: new Date().toISOString().slice(0, 10),
    usos: 0,
    menus: menus.map(m => ({
      rotulo: rotuloDe(m),
      icone: m.icone,
      telas: (m.filhos ?? []).map(f => ({ rotulo: rotuloDe(f), icone: f.icone, tipoDeTela: f.tipoDeTela ?? 'personalizada' })),
    })),
    categorias: [],
    status: [],
  }
}

/** Baixa o arquivo pelo próprio navegador: nada sai pela rede. */
export function baixarArquivo(arquivo: ArquivoDeCaso) {
  const blob = new Blob([JSON.stringify(arquivo, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `caso-de-uso-${arquivo.caso.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function lerArquivo(texto: string): ArquivoDeCaso | null {
  try {
    const dado = JSON.parse(texto)
    if (dado?.formato !== 'enspace-caso-de-uso' || !dado.caso?.nome) return null
    return dado as ArquivoDeCaso
  }
  catch {
    return null
  }
}

/** O arquivo de exemplo, para a demonstração não depender de ter um arquivo à mão. */
export const arquivoDeExemplo: ArquivoDeCaso = {
  formato: 'enspace-caso-de-uso',
  versao: 1,
  workspace: 'Construtora Horizonte',
  exportadoEm: '2026-09-30',
  caso: {
    ...casosDoEnspace.find(c => c.id === 'cu-compras')!,
    id: 'cu-importado',
    nome: 'Compras da obra',
    origem: 'workspace',
    menus: [
      { rotulo: 'Compras da obra', icone: 'i-lucide-hard-hat', telas: [t('Pedidos de material', 'i-lucide-list'), t('Aprovar por alçada', 'i-lucide-circle-check-big', 'triagem'), t('Entregas da semana', 'i-lucide-truck')] },
    ],
    categorias: [{ nome: 'Pedidos de material', icone: 'i-lucide-package', campos: ['Material', 'Quantidade', 'Obra', 'Prazo de entrega'] }],
  },
}
