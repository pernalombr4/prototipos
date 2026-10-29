/**
 * Dado do protótipo da Agenda.
 *
 * Estrutura: o que a Agenda do develop lê hoje (tarefas, tarefas rápidas, itens de categoria com um campo de data e
 * eventos do Outlook), vista em 28/10/2026 no workspace de exploração, e os schemas do
 * @be-enlighten/enspace-sdk-schemas. Valores: todos inventados, com e-mails no domínio reservado `.example`.
 * Nenhum dado de cliente real entra aqui (regras 9 e 13).
 *
 * O que não existe no produto e é invenção do protótipo vai marcado com PROTÓTIPO:
 *  - o vínculo de reunião do Outlook com item (`itemId`) e a sugestão pelo domínio do e-mail;
 *  - o bloco de trabalho (tempo reservado para uma tarefa, sem mexer no prazo);
 *  - o campo de fim nas categorias (hoje a Agenda lê 1 data por fonte);
 *  - rodada 2: a permissão da pessoa por categoria e por item, o fluxo ligado a um campo de data, o organizador e o
 *    evento particular do Outlook, a tarefa que pede aprovação ou formulário e o bloco que vai ao Outlook.
 */
import type { Item, ItemType, Member, Task, Workspace } from '@be-enlighten/enspace-sdk-schemas'
import { HOJE, somarDias } from './datas'

export const workspace: Pick<Workspace, 'id' | 'name' | 'reference'> = { id: 412, name: 'Aurora Serviços', reference: 'aurora-servicos' }

/* ------------------------------------------------------------------ *
 * Pessoas (recorte do `Member`: id e e-mail; o nome vem do `User`)
 * ------------------------------------------------------------------ */
export interface Pessoa extends Pick<Member, 'id' | 'email'> {
  nome: string
  /** Derivado do nome, não vem da API. */
  iniciais: string
  cargo: string
}

const pessoa = (id: number, nome: string, email: string, cargo: string): Pessoa =>
  ({ id, nome, email, cargo, iniciais: nome.split(' ').map(p => p[0]).slice(0, 2).join('') })

export const pessoas: Pessoa[] = [
  pessoa(1, 'Lia Moreira', 'lia.moreira@aurora.example', 'Jurídico'),
  pessoa(2, 'Tomás Arantes', 'tomas.arantes@aurora.example', 'Comercial'),
  pessoa(3, 'Renata Okabe', 'renata.okabe@aurora.example', 'Financeiro'),
  pessoa(4, 'Diego Salles', 'diego.salles@aurora.example', 'Operações'),
  pessoa(5, 'Nina Carvalhal', 'nina.carvalhal@aurora.example', 'Atendimento'),
  pessoa(6, 'Paulo Brandão', 'paulo.brandao@aurora.example', 'Diretoria'),
]
/** Quem está usando o protótipo. */
export const EU = pessoas[0]!
export const pessoaPorId = (id: number | null | undefined) => pessoas.find(p => p.id === id) ?? null

/* ------------------------------------------------------------------ *
 * Categorias e os campos que a Agenda pode ler
 * ------------------------------------------------------------------ */
export type Cor = 'primary' | 'info' | 'success' | 'warning' | 'neutral'
export type SlugDaCategoria = 'contratos' | 'processos' | 'clientes' | 'chamados'

export interface CampoDaCategoria {
  chave: string
  rotulo: string
  tipo: 'data' | 'hora' | 'email' | 'texto'
  obrigatorio?: boolean
}

/** PROTÓTIPO: o que a pessoa logada pode fazer na categoria. Ver é pressuposto: sem ver, a categoria nem chega. */
export interface Permissao { criar: boolean, editar: boolean }

/** PROTÓTIPO: um fluxo do Spaceflow com gatilho "campo alterado" num campo de data. */
export interface FluxoNoCampo { campo: string, nome: string, efeito: string }

export interface Categoria extends Pick<ItemType, 'id' | 'name' | 'icon'> {
  slug: SlugDaCategoria
  campos: CampoDaCategoria[]
  permissao: Permissao
  fluxo?: FluxoNoCampo
}

const criadoEm: CampoDaCategoria = { chave: 'created_at', rotulo: 'Criado em', tipo: 'data' }

export const categorias: Categoria[] = [
  {
    id: 1314,
    name: 'Contratos',
    slug: 'contratos',
    icon: 'i-lucide-file-signature',
    campos: [
      criadoEm,
      { chave: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true },
      { chave: 'contato', rotulo: 'E-mail do contato', tipo: 'email', obrigatorio: true },
      { chave: 'inicio_vigencia', rotulo: 'Início da vigência', tipo: 'data', obrigatorio: true },
      { chave: 'fim_vigencia', rotulo: 'Fim da vigência', tipo: 'data', obrigatorio: true },
      { chave: 'assinatura', rotulo: 'Data de assinatura', tipo: 'data' },
      { chave: 'valor', rotulo: 'Valor mensal', tipo: 'texto' },
    ],
    permissao: { criar: true, editar: true },
    fluxo: { campo: 'fim_vigencia', nome: 'Aviso de renovação', efeito: 'Envia e-mail ao contato do contrato e cria a tarefa Revisar renovação.' },
  },
  {
    id: 1320,
    name: 'Processos',
    slug: 'processos',
    icon: 'i-lucide-gavel',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true }, { chave: 'audiencia', rotulo: 'Data da audiência', tipo: 'data' }, { chave: 'audiencia_inicio', rotulo: 'Início da audiência', tipo: 'hora' }, { chave: 'audiencia_fim', rotulo: 'Fim da audiência', tipo: 'hora' }, { chave: 'prazo_fatal', rotulo: 'Prazo fatal', tipo: 'data' }],
    /** A pessoa edita os processos, mas quem abre processo é o cadastro do Jurídico. */
    permissao: { criar: false, editar: true },
  },
  {
    id: 1322,
    name: 'Clientes',
    slug: 'clientes',
    icon: 'i-lucide-building-2',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Nome', tipo: 'texto', obrigatorio: true }, { chave: 'proxima_visita', rotulo: 'Próxima visita', tipo: 'data' }, { chave: 'contato', rotulo: 'E-mail de contato', tipo: 'email' }],
    permissao: { criar: true, editar: true },
  },
  {
    id: 1330,
    name: 'Chamados',
    slug: 'chamados',
    icon: 'i-lucide-life-buoy',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true }],
    permissao: { criar: false, editar: false },
  },
]
export const categoriaPorSlug = (s: string) => categorias.find(c => c.slug === s)!

/* ------------------------------------------------------------------ *
 * Itens
 * ------------------------------------------------------------------ */
export interface ItemDaAgenda extends Pick<Item, 'id' | 'reference'> {
  categoria: SlugDaCategoria
  titulo: string
  responsavel: number
  /** Os valores do formulário, como em `Item.data`. Datas em AAAA-MM-DD, horas em minutos do dia. */
  data: Record<string, string | number>
  /** PROTÓTIPO: o domínio do e-mail do contato, usado para sugerir o vínculo da reunião. */
  dominio?: string
  /** PROTÓTIPO: o item foi compartilhado com a pessoa só para leitura. */
  somenteLeitura?: boolean
}

const item = (id: number, reference: string, categoria: SlugDaCategoria, titulo: string, responsavel: number, data: Record<string, string | number>, dominio?: string, somenteLeitura?: boolean): ItemDaAgenda =>
  ({ id, reference, categoria, titulo, responsavel, data: { titulo, created_at: '2026-09-14', ...data }, dominio, somenteLeitura })

export const itens: ItemDaAgenda[] = [
  item(47231, 'CT-2041', 'contratos', 'Ondas Telecom · Link dedicado 2026', 1, { fim_vigencia: '2026-10-30', inicio_vigencia: '2025-10-31', contato: 'ana.lopes@ondastelecom.example' }, 'ondastelecom.example'),
  item(47232, 'CT-2044', 'contratos', 'Vértice Engenharia · Manutenção predial', 1, { fim_vigencia: '2026-11-05', inicio_vigencia: '2025-11-06', contato: 'compras@vertice.example' }, 'vertice.example'),
  item(47233, 'CT-2047', 'contratos', 'Grupo Solaris · Licenciamento de software com reajuste anual pelo IPCA e multa rescisória', 1, { fim_vigencia: '2026-11-12', inicio_vigencia: '2024-11-13', contato: 'marcos.teles@solaris.example' }, 'solaris.example'),
  item(47234, 'CT-2050', 'contratos', 'Gráfica Ponto Final · Impressos', 3, { fim_vigencia: '2026-10-26', inicio_vigencia: '2025-10-27', contato: 'pedidos@pontofinal.example' }, 'pontofinal.example'),
  item(52088, 'PR-0318', 'processos', 'Ação de cobrança · Grupo Solaris', 1, { audiencia: '2026-10-29', audiencia_inicio: 840, audiencia_fim: 930, prazo_fatal: '2026-11-06' }, 'pradolima.example'),
  item(52091, 'PR-0322', 'processos', 'Reclamação trabalhista · ex-colaborador da manutenção', 1, { audiencia: '2026-11-04', audiencia_inicio: 570, audiencia_fim: 630, prazo_fatal: '2026-11-03' }),
  item(52094, 'PR-0325', 'processos', 'Revisão contratual · Vértice Engenharia', 4, { audiencia: '2026-11-10', audiencia_inicio: 960, audiencia_fim: 1020 }, 'vertice.example', true),
  item(61118, 'CL-118', 'clientes', 'Ondas Telecom', 2, { proxima_visita: '2026-11-09', contato: 'ana.lopes@ondastelecom.example' }, 'ondastelecom.example'),
  item(61121, 'CL-121', 'clientes', 'Vértice Engenharia', 2, { proxima_visita: '2026-11-18', contato: 'compras@vertice.example' }, 'vertice.example'),
  item(61124, 'CL-124', 'clientes', 'Grupo Solaris', 2, { contato: 'marcos.teles@solaris.example' }, 'solaris.example'),
  item(70310, 'CH-0310', 'chamados', 'Acesso ao portal de contratos', 5, {}),
]
export const itemPorId = (id: number | null | undefined) => itens.find(i => i.id === id) ?? null

/* ------------------------------------------------------------------ *
 * Tarefas (schema `Task`)
 * ------------------------------------------------------------------ */
export interface TarefaDaAgenda extends Task {
  /**
   * PROTÓTIPO: de onde a tarefa vem. No produto são 2 rotas: Tarefas (as do fluxo da categoria, com SLA) e
   * Tarefas Rápidas (sem SLA). É o que decide o arrastar: a de SLA ganha bloco; a rápida muda de data.
   */
  origem: 'fluxo' | 'rapida'
  /** PROTÓTIPO: a tarefa do fluxo que não conclui com 1 clique (aprovação, ou formulário a preencher). */
  acao?: 'aprovar' | 'formulario'
}

const quando = (dia: string, h: string) => new Date(`${dia}T${h}:00Z`)

function tarefa(id: number, origem: TarefaDaAgenda['origem'], name: string, status: Task['status'], due: Date | null, assigned_to: number, itemId: number | null, extra: Partial<TarefaDaAgenda> = {}): TarefaDaAgenda {
  return {
    id,
    created_at: quando('2026-10-14', '09:00'),
    updated_at: quando('2026-10-27', '17:00'),
    deleted_at: null,
    reference: `#${id}`,
    name,
    description: null,
    workspace: workspace.reference,
    type: 'generic',
    status,
    priority: 'normal',
    due_date: due,
    points: 0,
    meta: {},
    creator: 6,
    assigned_to,
    completed_by: status === 'completed' ? assigned_to : null,
    completed_at: status === 'completed' ? quando('2026-10-27', '11:20') : null,
    node_execution: null,
    item: itemId,
    notification_task: false,
    archived: false,
    collaborators: [],
    external_task: null,
    permissions: [],
    tag_ids: [],
    origem,
    ...extra,
  }
}

export const tarefasIniciais = (): TarefaDaAgenda[] => [
  tarefa(273512, 'fluxo', 'Executar pedido', 'working', quando('2026-10-28', '18:00'), 1, 47231),
  tarefa(273530, 'fluxo', 'Revisar minuta do aditivo', 'pending', quando('2026-10-30', '12:00'), 1, 47232),
  tarefa(273541, 'fluxo', 'Aprovar orçamento de impressos', 'pending', quando('2026-10-26', '18:00'), 1, 47234, { acao: 'aprovar' }),
  tarefa(273555, 'fluxo', 'Protocolar contestação', 'pending', quando('2026-10-29', '18:00'), 1, 52091, { acao: 'formulario' }),
  tarefa(273560, 'fluxo', 'Conferir o cálculo de reajuste pelo IPCA antes da renovação do contrato de licenciamento', 'pending', quando('2026-11-03', '18:00'), 1, 47233),
  tarefa(273566, 'fluxo', 'Enviar notificação de não renovação', 'completed', quando('2026-10-27', '12:00'), 1, 47234),
  tarefa(273570, 'fluxo', 'Preparar memoriais da audiência', 'working', quando('2026-10-29', '12:00'), 1, 52088),
  tarefa(273575, 'fluxo', 'Validar procuração do escritório parceiro', 'pending', quando('2026-10-22', '18:00'), 1, 52088),
  tarefa(273580, 'fluxo', 'Responder notificação do cliente', 'pending', quando('2026-11-05', '18:00'), 1, 61121),
  tarefa(273584, 'fluxo', 'Atualizar dados de faturamento', 'pending', quando('2026-10-29', '18:00'), 2, 47231),
  tarefa(273588, 'fluxo', 'Emitir boleto da parcela 3', 'working', quando('2026-10-28', '17:00'), 3, 47232),
  tarefa(273590, 'fluxo', 'Checar documentos do fornecedor novo', 'pending', null, 1, 61124),
  tarefa(8841, 'rapida', 'Ligar para o cartório', 'pending', quando('2026-10-28', '15:00'), 1, 52088),
  tarefa(8842, 'rapida', 'Separar documentos para o arquivo', 'pending', null, 1, null),
  tarefa(8843, 'rapida', 'Pedir acesso ao portal do tribunal', 'pending', null, 1, 52091),
  tarefa(8844, 'rapida', 'Comprar o certificado digital novo', 'pending', quando('2026-10-23', '18:00'), 1, null),
  tarefa(8845, 'rapida', 'Organizar a pasta de contratos assinados', 'pending', quando('2026-11-03', '18:00'), 1, null),
  tarefa(8846, 'rapida', 'Revisar e-mails de cobrança', 'completed', quando('2026-10-29', '10:00'), 1, null),
  tarefa(8847, 'rapida', 'Mandar o resumo da semana para a diretoria', 'pending', quando('2026-10-30', '17:00'), 4, null),
]

/* ------------------------------------------------------------------ *
 * Reuniões do Outlook (não há schema no SDK: vêm da integração)
 * ------------------------------------------------------------------ */
export interface Participante { nome: string, email: string, resposta: 'sim' | 'nao' | 'talvez' | 'pendente' }

export interface Reuniao {
  id: string
  titulo: string
  dia: string
  /** Minutos do dia. Sem início, é de dia inteiro. */
  inicio?: number
  fim?: number
  calendario: 'meu' | 'juridico'
  teams: boolean
  local?: string
  participantes: Participante[]
  /** PROTÓTIPO: o item a que a reunião está ligada. */
  itemId: number | null
  /** PROTÓTIPO: a pessoa recusou a sugestão de vínculo; ela não volta. */
  sugestaoRecusada?: boolean
  /** E-mail de quem organizou. Só o organizador muda o horário no Outlook (`isOrganizer` do Graph). */
  organizador: string
  /** Marcado como particular no Outlook (`sensitivity = private`): não se liga a item. */
  particular?: boolean
}

const eu = (r: Participante['resposta'] = 'sim'): Participante => ({ nome: EU.nome, email: EU.email!, resposta: r })
const interno = (id: number, r: Participante['resposta'] = 'sim'): Participante => ({ nome: pessoaPorId(id)!.nome, email: pessoaPorId(id)!.email!, resposta: r })
const externo = (nome: string, email: string, r: Participante['resposta'] = 'pendente'): Participante => ({ nome, email, resposta: r })

/** A daily do Jurídico, de segunda a sexta, de 19/10 a 13/11, menos o feriado de 02/11. */
function dailies(): Reuniao[] {
  const lista: Reuniao[] = []
  for (let i = -9; i <= 16; i++) {
    const dia = somarDias(HOJE, i)
    const semana = new Date(`${dia}T00:00:00Z`).getUTCDay()
    if (semana === 0 || semana === 6 || dia === '2026-11-02') continue
    lista.push({ id: `daily-${dia}`, titulo: 'Daily do Jurídico', dia, inicio: 540, fim: 555, calendario: 'juridico', teams: true, participantes: [eu(), interno(4), interno(5)], itemId: null, organizador: pessoaPorId(4)!.email! })
  }
  return lista
}

export const reunioesIniciais = (): Reuniao[] => [
  ...dailies(),
  { id: 'r-ondas-1', titulo: 'Primeira conversa com a Ondas Telecom', dia: '2026-10-20', inicio: 600, fim: 660, calendario: 'meu', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim')], itemId: 61118, organizador: EU.email! },
  { id: 'r-solaris-0', titulo: 'Proposta comercial do Grupo Solaris', dia: '2026-10-22', inicio: 840, fim: 900, calendario: 'meu', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example', 'sim')], itemId: 47233, organizador: EU.email! },
  { id: 'r-prep', titulo: 'Preparação da audiência de cobrança', dia: '2026-10-26', inicio: 900, fim: 960, calendario: 'meu', teams: false, local: 'Sala Ipê', participantes: [eu(), interno(6)], itemId: 52088, organizador: EU.email! },
  { id: 'r-1a1', titulo: '1:1 com o Paulo', dia: '2026-10-27', inicio: 660, fim: 720, calendario: 'meu', teams: true, participantes: [eu(), interno(6)], itemId: null, organizador: EU.email! },
  { id: 'r-ondas-2', titulo: 'Alinhamento do link dedicado com a Ondas Telecom', dia: '2026-10-27', inicio: 840, fim: 900, calendario: 'meu', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim'), externo('Caio Ventura', 'caio.ventura@ondastelecom.example', 'talvez')], itemId: null, organizador: EU.email! },
  { id: 'r-solaris-1', titulo: 'Revisão das cláusulas de reajuste com o Grupo Solaris', dia: '2026-10-28', inicio: 600, fim: 660, calendario: 'meu', teams: true, participantes: [eu(), interno(3), externo('Marcos Teles', 'marcos.teles@solaris.example', 'sim')], itemId: 47233, organizador: EU.email! },
  { id: 'r-riscos', titulo: 'Comitê de riscos', dia: '2026-10-28', inicio: 630, fim: 690, calendario: 'juridico', teams: false, local: 'Sala Jacarandá', participantes: [eu('talvez'), interno(6), interno(3), interno(4)], itemId: null, organizador: pessoaPorId(6)!.email! },
  { id: 'r-fin', titulo: 'Ligação rápida com o financeiro', dia: '2026-10-28', inicio: 630, fim: 660, calendario: 'meu', teams: true, participantes: [eu(), interno(3)], itemId: null, organizador: EU.email! },
  {
    id: 'r-vertice',
    titulo: 'Kick-off da manutenção predial com a Vértice Engenharia',
    dia: '2026-10-28',
    inicio: 960,
    fim: 1020,
    calendario: 'meu',
    teams: true,
    participantes: [eu(), interno(2), interno(4), interno(5), externo('Rui Campos', 'rui.campos@vertice.example', 'sim'), externo('Bia Torres', 'bia.torres@vertice.example', 'sim'), externo('Ivo Lemos', 'ivo.lemos@vertice.example'), externo('Sara Duarte', 'sara.duarte@vertice.example'), externo('Leo Faria', 'leo.faria@vertice.example', 'nao'), externo('Compras Vértice', 'compras@vertice.example'), externo('Otto Reis', 'otto.reis@vertice.example', 'talvez'), interno(6, 'pendente')],
    itemId: null, organizador: pessoaPorId(2)!.email!,
  },
  { id: 'r-prado', titulo: 'Café com o escritório Prado e Lima', dia: '2026-10-29', inicio: 450, fim: 480, calendario: 'meu', teams: false, local: 'Café da esquina', participantes: [eu(), externo('Helena Prado', 'helena.prado@pradolima.example', 'sim')], itemId: 52088, organizador: EU.email! },
  { id: 'r-particular', titulo: 'Consulta médica', dia: '2026-10-29', inicio: 720, fim: 780, calendario: 'meu', teams: false, participantes: [eu()], itemId: null, organizador: EU.email!, particular: true },
  { id: 'r-lgpd', titulo: 'Treinamento de LGPD', dia: '2026-10-30', calendario: 'juridico', teams: true, participantes: [eu(), interno(4), interno(5), interno(3)], itemId: null, organizador: pessoaPorId(3)!.email! },
  { id: 'r-ondas-3', titulo: 'Negociação da renovação com a Ondas Telecom', dia: '2026-10-30', inicio: 900, fim: 990, calendario: 'meu', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim')], itemId: 47231, organizador: EU.email! },
  { id: 'r-vertice-2', titulo: 'Assinatura do aditivo com a Vértice', dia: '2026-11-03', inicio: 600, fim: 660, calendario: 'meu', teams: true, participantes: [eu(), externo('Rui Campos', 'rui.campos@vertice.example', 'sim')], itemId: 47232, organizador: EU.email! },
  { id: 'r-solaris-2', titulo: 'Reunião mensal com o Grupo Solaris', dia: '2026-11-04', inicio: 840, fim: 900, calendario: 'meu', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example')], itemId: null, organizador: 'marcos.teles@solaris.example' },
  { id: 'r-workshop', titulo: 'Workshop de contratos padrão', dia: '2026-11-06', inicio: 540, fim: 720, calendario: 'juridico', teams: false, local: 'Auditório', participantes: [eu(), interno(2), interno(3), interno(4), interno(5), interno(6)], itemId: null, organizador: pessoaPorId(2)!.email! },
]

/* ------------------------------------------------------------------ *
 * PROTÓTIPO: blocos de trabalho (tempo reservado para uma tarefa)
 * ------------------------------------------------------------------ */
export interface Bloco {
  id: string
  tarefaId: number
  dia: string
  inicio: number
  fim: number
  /** PROTÓTIPO: o bloco também está no Outlook, como "ocupado", para quem marca reunião ver o horário tomado. */
  outlook?: boolean
}

export const blocosIniciais = (): Bloco[] => [
  { id: 'b-1', tarefaId: 273512, dia: '2026-10-28', inicio: 480, fim: 570, outlook: true },
  { id: 'b-2', tarefaId: 273570, dia: '2026-10-28', inicio: 840, fim: 930 },
  { id: 'b-3', tarefaId: 273530, dia: '2026-10-29', inicio: 570, fim: 660 },
]

/* ------------------------------------------------------------------ *
 * Calendário do sistema: dias não úteis (feriados nacionais de 2026)
 * ------------------------------------------------------------------ */
export const feriados = ['2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25']
/** Horário de trabalho do Calendário do sistema: 08:00 a 18:00. */
export const HORARIO = { inicio: 480, fim: 1080 }
