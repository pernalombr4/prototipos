/**
 * O catálogo de widgets da Home, os limites de tamanho e o arranjo padrão.
 *
 * Rodada 5: as lâminas do Painel de tarefas viram widgets da Home, uma por
 * uma, como a Home de develop já faz (en-space@develop be2a5d850,
 * `src/utils/workspaceHome.ts`, sobre o catálogo do SDK,
 * en-sdk@develop 58a81c6 `packages/ui/src/components/tasks/insights/catalog.ts`).
 * O `painel` de cada lâmina é o id do painel no SDK; `naHomeDeDevelop` diz se
 * a Home de develop já oferece a lâmina ou se ela só existe no Painel de
 * tarefas hoje.
 *
 * O catálogo é uma árvore: a fonte do dado e, dentro dela, cada widget. Em
 * Tarefas, os widgets se dividem em Números, Listas e Gráficos.
 *
 * Rodada 6, a pedido da redatora ("a categorização com 'Navegação e agenda'
 * ficou nonsense... a sensação é de que somente a seção de tarefas tá bem
 * alimentada"): 5 grupos, cada um pela coisa que a pessoa procura.
 * - Tarefas: as 15 de antes;
 * - Agenda: o dia, a semana e o mês (NOVOS os 2 últimos), das mesmas fontes
 *   da tela Agenda (compromisso do calendário, prazo de tarefa, data de item);
 * - Itens e categorias: o atalho das categorias e 3 NOVOS sobre itens (os que
 *   criei, os mais novos, a contagem por categoria);
 * - Telas e atalhos: atalhos, recentes e o gráfico de um painel;
 * - BENI e equipe: o BENI, o comunicado e o bloco de notas.
 *
 * Saíram na rodada 5, a pedido da redatora: "Itens de uma visualização" e
 * "Número de uma visualização".
 *
 * Todo widget lê dado que o ENSPACE já tem; o que não existe no produto hoje
 * está marcado como NOVO no comentário.
 *
 * Rodada 8, a pedido da redatora: saem Prazos de itens (o item não tem prazo:
 * a data é um campo que cada categoria cria), Revisões por IA, Créditos de IA
 * e Falhas dos agentes. "Meus itens" passa a ser o que a pessoa criou.
 *
 * Rodada 8, o MVP: `mvp` marca o widget que se faz só no front, com dado e
 * componente que o develop já tem (leitura de 2026-11-24 pela skill
 * investigar-codigo; tabela no BRIEFING.md). O motivo de cada um fora do MVP
 * está no comentário da linha.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'

export type TipoDeWidget =
  // Tarefas: números (cartões de KPI do SDK)
  | 'kpiAbertas'
  | 'kpiConcluidas'
  | 'kpiCriadas'
  | 'kpiVencidas'
  | 'kpiVencem7'
  // Tarefas: listas
  | 'vencidas'
  | 'vencemEmBreve'
  | 'minhasTarefas'
  | 'tarefasDelegadas'
  // Tarefas: gráficos
  | 'status'
  | 'prioridade'
  | 'carga'
  | 'atividade'
  | 'saudeDosPrazos'
  | 'entradaESaida'
  // Agenda
  | 'agenda'
  | 'agendaSemana'
  | 'agendaMes'
  // Itens e categorias
  | 'categorias'
  | 'meusItens'
  | 'ultimosItens'
  | 'itensPorCategoria'
  // Telas e atalhos
  | 'atalhos'
  | 'recentes'
  | 'graficoDePainel'
  // IA
  | 'beni'
  | 'agentesIa'
  // Spaceflow
  | 'execucoesFluxos'
  | 'falhasFluxos'
  | 'fluxosAndamento'
  // Equipe e notas
  | 'comunicado'
  | 'notas'

/** As lâminas do Painel de tarefas que o `_WLamina.vue` desenha. */
export const LAMINAS = ['kpiAbertas', 'kpiConcluidas', 'kpiCriadas', 'kpiVencidas', 'kpiVencem7', 'vencidas', 'vencemEmBreve', 'status', 'prioridade', 'carga', 'atividade', 'entradaESaida'] as const satisfies readonly TipoDeWidget[]
export type LaminaDeTarefas = typeof LAMINAS[number]

/** O 1º nível do catálogo: de onde vem o dado. */
export type GrupoDoCatalogo = 'tarefas' | 'agenda' | 'itens' | 'ia' | 'spaceflow' | 'atalhos' | 'equipe'

/** As seções de Tarefas no 2º nível. */
export type SecaoDeTarefas = 'numeros' | 'listas' | 'graficos'

export interface ConfigDoWidget {
  /** Categorias escolhidas (widget `categorias`), na ordem; vazio = todas as que a pessoa acessa, na ordem do workspace. */
  categorias?: string[]
}

export interface Widget {
  id: string
  tipo: TipoDeWidget
  config: ConfigDoWidget
  /** O administrador acrescentou à Home padrão depois que a pessoa personalizou. */
  novo?: boolean
}

export interface DefinicaoDoWidget {
  tipo: TipoDeWidget
  icone: string
  grupo: GrupoDoCatalogo
  secao?: SecaoDeTarefas
  limites: LimitesDoPainel
  tamanho: { w: number, h: number }
  /** Só o administrador vê no catálogo. */
  soAdmin?: boolean
  /** Id do painel no catálogo de tarefas do SDK. */
  painel?: string
  /** A Home de develop já oferece esta lâmina (no padrão ou no "Adicionar painel"). */
  naHomeDeDevelop?: boolean
  /** Segue o "Minhas tarefas · Workspace" do topo da Home. */
  segueEscopo?: boolean
  /** Rodada 8: entra no MVP (só front, com o que o develop já tem). */
  mvp?: boolean
  /** Rodada 9: pede a permissão Fluxos do papel (`usePermissions.ts`); sem ela, o widget fica sem acesso. */
  permissao?: 'fluxos'
}

const KPI = { minW: 2, maxW: 6, minH: 3, maxH: 4, wCelular: 1 as const }

export const CATALOGO: DefinicaoDoWidget[] = [
  // Tarefas > Números
  { tipo: 'kpiAbertas', mvp: true, icone: 'i-lucide-inbox', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-open', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiConcluidas', mvp: true, icone: 'i-lucide-circle-check', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-completed', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiCriadas', mvp: true, icone: 'i-lucide-circle-plus', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-created', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiVencidas', mvp: true, icone: 'i-lucide-alarm-clock', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-overdue', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiVencem7', mvp: true, icone: 'i-lucide-calendar-clock', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-dueSoon', segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  // Tarefas > Listas
  { tipo: 'vencidas', mvp: true, icone: 'i-lucide-alarm-clock', grupo: 'tarefas', secao: 'listas', painel: 'dueList', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'vencemEmBreve', mvp: true, icone: 'i-lucide-hourglass', grupo: 'tarefas', secao: 'listas', painel: 'dueList', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'minhasTarefas', mvp: true, icone: 'i-lucide-list-checks', grupo: 'tarefas', secao: 'listas', tamanho: { w: 6, h: 8 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 14 } },
  // Fora do MVP: a tarefa agendada não guarda quem a delegou (só o e-mail no task_log); a rápida pede filtro novo.
  { tipo: 'tarefasDelegadas', icone: 'i-lucide-send', grupo: 'tarefas', secao: 'listas', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  // Tarefas > Gráficos
  { tipo: 'status', mvp: true, icone: 'i-lucide-chart-pie', grupo: 'tarefas', secao: 'graficos', painel: 'status', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 8, minH: 5, maxH: 10 } },
  { tipo: 'prioridade', mvp: true, icone: 'i-lucide-flag', grupo: 'tarefas', secao: 'graficos', painel: 'breakdown', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 10 } },
  { tipo: 'carga', mvp: true, icone: 'i-lucide-users', grupo: 'tarefas', secao: 'graficos', painel: 'workload', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'atividade', mvp: true, icone: 'i-lucide-calendar-check', grupo: 'tarefas', secao: 'graficos', painel: 'activity', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 8, h: 5 }, limites: { minW: 5, maxW: 12, minH: 4, maxH: 8 } },
  { tipo: 'saudeDosPrazos', mvp: true, icone: 'i-lucide-heart-pulse', grupo: 'tarefas', secao: 'graficos', painel: 'dueHealth', segueEscopo: true, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 7 } },
  { tipo: 'entradaESaida', mvp: true, icone: 'i-lucide-arrow-left-right', grupo: 'tarefas', secao: 'graficos', painel: 'throughput', segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 10 } },
  // Agenda
  { tipo: 'agenda', mvp: true, icone: 'i-lucide-calendar-days', grupo: 'agenda', tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  // NOVO: os 7 dias a partir de hoje, em colunas.
  // Fora do MVP: a tela Agenda já mostra a semana; o widget repete a tela.
  { tipo: 'agendaSemana', icone: 'i-lucide-calendar-range', grupo: 'agenda', tamanho: { w: 8, h: 6 }, limites: { minW: 6, maxW: 12, minH: 5, maxH: 10 } },
  // NOVO: o mês em miniatura, com o dia escolhido embaixo.
  // Fora do MVP: a tela Agenda já mostra o mês; o widget repete a tela.
  { tipo: 'agendaMes', icone: 'i-lucide-calendar', grupo: 'agenda', tamanho: { w: 4, h: 9 }, limites: { minW: 3, maxW: 8, minH: 8, maxH: 12 } },
  // Itens e categorias
  { tipo: 'categorias', mvp: true, icone: 'i-lucide-layout-grid', grupo: 'itens', painel: 'categories', naHomeDeDevelop: true, tamanho: { w: 12, h: 3 }, limites: { minW: 4, maxW: 12, minH: 3, maxH: 10 } },
  // NOVO, os 3: leem o que o item já guarda (quem criou, quando, a categoria). Rodada 8: o item não tem responsável nem prazo.
  { tipo: 'meusItens', mvp: true, icone: 'i-lucide-file-user', grupo: 'itens', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'ultimosItens', mvp: true, icone: 'i-lucide-file-clock', grupo: 'itens', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  // Fora do MVP: não há contagem agregada: seria 1 chamada a items/count por categoria.
  { tipo: 'itensPorCategoria', icone: 'i-lucide-chart-bar', grupo: 'itens', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 10 } },
  // Telas e atalhos
  { tipo: 'atalhos', mvp: true, icone: 'i-lucide-bookmark', grupo: 'atalhos', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 9 } },
  { tipo: 'recentes', mvp: true, icone: 'i-lucide-history', grupo: 'atalhos', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  // Fora do MVP: o painel está preso a uma tela (c_screen); escolher tela e painel é configuração nova.
  { tipo: 'graficoDePainel', icone: 'i-lucide-chart-column', grupo: 'atalhos', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 10 } },
  // IA (rodada 7). Cada um lê o que o back já guarda; ver o mocks.ts.
  // Fora do MVP: o resumo do BENI não tem rota (getTaskSummary é ferramenta do agente); a conversa flutuante já está no topo.
  { tipo: 'beni', icone: 'i-lucide-sparkles', grupo: 'ia', tamanho: { w: 8, h: 5 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 9 } },
  // NOVO: os agentes que a pessoa pode usar; o clique abre a conversa com o agente.
  { tipo: 'agentesIa', mvp: true, icone: 'i-lucide-bot', grupo: 'ia', tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 10 } },
  // Spaceflow (rodada 9). Leem `workflow_executions` e `node_executions`; ver o mocks.ts.
  // NOVO: as execuções dos últimos 7 dias por status (`GET /workflows/metrics`).
  { tipo: 'execucoesFluxos', mvp: true, permissao: 'fluxos', icone: 'i-lucide-activity', grupo: 'spaceflow', tamanho: { w: 6, h: 4 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 6 } },
  // NOVO: a execução que parou com erro, o passo, a mensagem e Repetir (`PUT /workflows/nodes/:id/retry`).
  { tipo: 'falhasFluxos', mvp: true, permissao: 'fluxos', icone: 'i-lucide-triangle-alert', grupo: 'spaceflow', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  // NOVO: a execução em andamento, a mais antiga primeiro, com o passo em que espera.
  { tipo: 'fluxosAndamento', mvp: true, permissao: 'fluxos', icone: 'i-lucide-loader', grupo: 'spaceflow', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  // Equipe e notas
  // Fora do MVP: pede modelo e rota novos.
  { tipo: 'comunicado', icone: 'i-lucide-megaphone', grupo: 'equipe', soAdmin: true, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 6 } },
  // Fora do MVP: pede modelo e rota novos (c-item-notes é nota de item).
  { tipo: 'notas', icone: 'i-lucide-notebook-pen', grupo: 'equipe', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 3, maxH: 9 } },
]

export const GRUPOS: { grupo: GrupoDoCatalogo, icone: string }[] = [
  { grupo: 'tarefas', icone: 'i-lucide-list-checks' },
  { grupo: 'agenda', icone: 'i-lucide-calendar-days' },
  { grupo: 'itens', icone: 'i-lucide-layout-grid' },
  { grupo: 'ia', icone: 'i-lucide-sparkles' },
  { grupo: 'spaceflow', icone: 'i-lucide-workflow' },
  { grupo: 'atalhos', icone: 'i-lucide-bookmark' },
  { grupo: 'equipe', icone: 'i-lucide-users' },
]

export const SECOES: SecaoDeTarefas[] = ['numeros', 'listas', 'graficos']

export function definicao(tipo: TipoDeWidget) {
  return CATALOGO.find(d => d.tipo === tipo)!
}

/**
 * O arranjo padrão do workspace, o que o administrador entrega a todos.
 * Começa como a Home de develop (4 números, Vencidas, Vencem em breve e
 * Categorias) e soma os widgets da proposta.
 *
 * Rodada 6, a pedido da redatora: Categorias abre a Home ("o atalho de
 * categorias deve ser por padrão o widget do topo, o primeiro de todos") e o
 * BENI entra no padrão, também no workspace vazio ("pra induzir o user a usar
 * IA"), ao lado dos Compromissos do dia.
 */
export const PADRAO_WIDGETS: Widget[] = [
  { id: 'w-categorias', tipo: 'categorias', config: { categorias: [] } },
  { id: 'w-abertas', tipo: 'kpiAbertas', config: {} },
  { id: 'w-concluidas', tipo: 'kpiConcluidas', config: {} },
  { id: 'w-criadas', tipo: 'kpiCriadas', config: {} },
  { id: 'w-kpi-vencidas', tipo: 'kpiVencidas', config: {} },
  { id: 'w-beni', tipo: 'beni', config: {} },
  { id: 'w-agenda', tipo: 'agenda', config: {} },
  { id: 'w-vencidas', tipo: 'vencidas', config: {} },
  { id: 'w-vencem', tipo: 'vencemEmBreve', config: {} },
  { id: 'w-tarefas', tipo: 'minhasTarefas', config: {} },
  { id: 'w-grafico', tipo: 'graficoDePainel', config: {} },
  { id: 'w-comunicado', tipo: 'comunicado', config: {} },
  { id: 'w-atalhos', tipo: 'atalhos', config: {} },
  { id: 'w-recentes', tipo: 'recentes', config: {} },
]

export const PADRAO_LAYOUT: ItemDaGrade[] = [
  { id: 'w-categorias', w: 12, h: 3 },
  { id: 'w-abertas', w: 3, h: 3 },
  { id: 'w-concluidas', w: 3, h: 3 },
  { id: 'w-criadas', w: 3, h: 3 },
  { id: 'w-kpi-vencidas', w: 3, h: 3 },
  { id: 'w-beni', w: 8, h: 5 },
  { id: 'w-agenda', w: 4, h: 5 },
  { id: 'w-vencidas', w: 6, h: 6 },
  { id: 'w-vencem', w: 6, h: 6 },
  { id: 'w-tarefas', w: 6, h: 8 },
  { id: 'w-grafico', w: 6, h: 8 },
  { id: 'w-comunicado', w: 4, h: 5 },
  { id: 'w-atalhos', w: 4, h: 5 },
  { id: 'w-recentes', w: 4, h: 5 },
]

/**
 * Rodada 8: a Home padrão do MVP. É a Home de develop de hoje (Categorias, os
 * 4 números, Vencidas e Vencem em breve) mais os widgets do MVP que mais
 * poupam caminho: Minhas tarefas, Compromissos do dia, Meus itens, Agentes de
 * IA, Atalhos e Recentes. No MVP não há Home padrão montada pelo
 * administrador: cada pessoa arruma a própria, guardada no navegador, como
 * develop já faz (`useDashboardLayout`, en-sdk@develop 2dbd22c
 * `packages/ui/src/composables/useDashboardLayout.ts:25`).
 */
export const MVP_WIDGETS: Widget[] = [
  { id: 'w-categorias', tipo: 'categorias', config: { categorias: [] } },
  { id: 'w-abertas', tipo: 'kpiAbertas', config: {} },
  { id: 'w-concluidas', tipo: 'kpiConcluidas', config: {} },
  { id: 'w-criadas', tipo: 'kpiCriadas', config: {} },
  { id: 'w-kpi-vencidas', tipo: 'kpiVencidas', config: {} },
  { id: 'w-vencidas', tipo: 'vencidas', config: {} },
  { id: 'w-vencem', tipo: 'vencemEmBreve', config: {} },
  { id: 'w-tarefas', tipo: 'minhasTarefas', config: {} },
  { id: 'w-agenda', tipo: 'agenda', config: {} },
  { id: 'w-meus-itens', tipo: 'meusItens', config: {} },
  { id: 'w-agentes', tipo: 'agentesIa', config: {} },
  { id: 'w-atalhos', tipo: 'atalhos', config: {} },
  { id: 'w-recentes', tipo: 'recentes', config: {} },
]

export const MVP_LAYOUT: ItemDaGrade[] = [
  { id: 'w-categorias', w: 12, h: 3 },
  { id: 'w-abertas', w: 3, h: 3 },
  { id: 'w-concluidas', w: 3, h: 3 },
  { id: 'w-criadas', w: 3, h: 3 },
  { id: 'w-kpi-vencidas', w: 3, h: 3 },
  { id: 'w-vencidas', w: 6, h: 6 },
  { id: 'w-vencem', w: 6, h: 6 },
  { id: 'w-tarefas', w: 8, h: 8 },
  { id: 'w-agenda', w: 4, h: 8 },
  { id: 'w-meus-itens', w: 6, h: 6 },
  { id: 'w-agentes', w: 6, h: 6 },
  { id: 'w-atalhos', w: 6, h: 5 },
  { id: 'w-recentes', w: 6, h: 5 },
]
