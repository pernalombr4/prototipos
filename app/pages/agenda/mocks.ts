/**
 * Dado do protótipo da Agenda.
 *
 * Estrutura: o que a Agenda do develop lê hoje (tarefas, tarefas rápidas, itens de categoria com um campo de data e
 * eventos do Outlook), vista em 28/10/2026 no workspace de exploração, e os schemas do
 * @be-enlighten/enspace-sdk-schemas. Valores: todos inventados, com e-mails no domínio reservado `.example`.
 * Nenhum dado de cliente real entra aqui (regras 9 e 13).
 *
 * O que não existe no produto e é invenção do protótipo vai marcado com PROTÓTIPO:
 *  - o vínculo de reunião do Outlook com item ou com tarefa (`Vinculo`) e a sugestão pelo domínio do e-mail;
 *  - o bloco de trabalho (tempo reservado para uma tarefa, sem mexer no prazo);
 *  - o campo de fim nas categorias (hoje a Agenda lê 1 data por fonte);
 *  - rodada 2: a permissão da pessoa por categoria e por item, o fluxo ligado a um campo de data, o organizador e o
 *    evento particular do Outlook, a tarefa que pede aprovação ou formulário e o bloco que vai ao Outlook;
 *  - modelagem da rodada 2 (29/10/2026): o vínculo como entidade compartilhada no workspace, a série, o fuso, o
 *    evento de vários dias, a reunião cancelada, o dono do bloco e o bloco oferecido, o campo de pessoa como
 *    responsável da fonte e a categoria que a pessoa não vê.
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
  /** `pessoa`: um membro do workspace (o id). É o campo que a fonte usa como responsável do item. */
  tipo: 'data' | 'hora' | 'email' | 'texto' | 'pessoa'
  obrigatorio?: boolean
}

/** PROTÓTIPO: o que a pessoa logada pode fazer na categoria. Ver é pressuposto: sem ver, a categoria nem chega. */
/** `ver`: sem ela, o item não aparece para a pessoa, nem ligado a uma reunião (só a contagem "1 item sem acesso"). */
export interface Permissao { ver: boolean, criar: boolean, editar: boolean }

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
      { chave: 'responsavel', rotulo: 'Responsável', tipo: 'pessoa' },
      { chave: 'inicio_vigencia', rotulo: 'Início da vigência', tipo: 'data', obrigatorio: true },
      { chave: 'fim_vigencia', rotulo: 'Fim da vigência', tipo: 'data', obrigatorio: true },
      { chave: 'assinatura', rotulo: 'Data de assinatura', tipo: 'data' },
      { chave: 'valor', rotulo: 'Valor mensal', tipo: 'texto' },
    ],
    permissao: { ver: true, criar: true, editar: true },
    fluxo: { campo: 'fim_vigencia', nome: 'Aviso de renovação', efeito: 'Envia e-mail ao contato do contrato e cria a tarefa Revisar renovação.' },
  },
  {
    id: 1320,
    name: 'Processos',
    slug: 'processos',
    icon: 'i-lucide-gavel',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true }, { chave: 'audiencia', rotulo: 'Data da audiência', tipo: 'data' }, { chave: 'audiencia_inicio', rotulo: 'Início da audiência', tipo: 'hora' }, { chave: 'audiencia_fim', rotulo: 'Fim da audiência', tipo: 'hora' }, { chave: 'prazo_fatal', rotulo: 'Prazo fatal', tipo: 'data' }, { chave: 'responsavel', rotulo: 'Advogado responsável', tipo: 'pessoa' }, { chave: 'email_escritorio', rotulo: 'E-mail do escritório parceiro', tipo: 'email' }],
    /** A pessoa edita os processos, mas quem abre processo é o cadastro do Jurídico. */
    permissao: { ver: true, criar: false, editar: true },
  },
  {
    id: 1322,
    name: 'Clientes',
    slug: 'clientes',
    icon: 'i-lucide-building-2',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Nome', tipo: 'texto', obrigatorio: true }, { chave: 'proxima_visita', rotulo: 'Próxima visita', tipo: 'data' }, { chave: 'fim_visita', rotulo: 'Fim da visita', tipo: 'data' }, { chave: 'contato', rotulo: 'E-mail de contato', tipo: 'email' }, { chave: 'gestor', rotulo: 'Gestor da conta', tipo: 'pessoa' }],
    permissao: { ver: true, criar: true, editar: true },
  },
  {
    id: 1330,
    name: 'Chamados',
    slug: 'chamados',
    icon: 'i-lucide-life-buoy',
    campos: [criadoEm, { chave: 'titulo', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true }],
    /** A pessoa não vê os chamados: são do Atendimento. */
    permissao: { ver: false, criar: false, editar: false },
  },
]
export const categoriaPorSlug = (s: string) => categorias.find(c => c.slug === s)!

/* ------------------------------------------------------------------ *
 * Itens
 * ------------------------------------------------------------------ */
export interface ItemDaAgenda extends Pick<Item, 'id' | 'reference'> {
  categoria: SlugDaCategoria
  titulo: string
  /** Quem criou o item (`Item.user`). O responsável que a Agenda filtra é um campo de pessoa do formulário, escolhido na fonte. */
  criador: number
  /**
   * Os valores do formulário, como em `Item.data`. Datas em AAAA-MM-DD, horas em minutos do dia, pessoa pelo id. A
   * sugestão de vínculo lê o domínio dos campos de e-mail daqui (não há campo de domínio).
   */
  data: Record<string, string | number>
  /** PROTÓTIPO: o item foi compartilhado com a pessoa só para leitura. */
  somenteLeitura?: boolean
}

const item = (id: number, reference: string, categoria: SlugDaCategoria, titulo: string, responsavel: number, data: Record<string, string | number>, somenteLeitura?: boolean): ItemDaAgenda =>
  ({ id, reference, categoria, titulo, criador: 6, data: { titulo, created_at: '2026-09-14', [categoria === 'clientes' ? 'gestor' : 'responsavel']: responsavel, ...data }, somenteLeitura })

export const itens: ItemDaAgenda[] = [
  item(47231, 'CT-2041', 'contratos', 'Ondas Telecom · Link dedicado 2026', 1, { fim_vigencia: '2026-10-30', inicio_vigencia: '2025-10-31', contato: 'ana.lopes@ondastelecom.example' }),
  item(47232, 'CT-2044', 'contratos', 'Vértice Engenharia · Manutenção predial', 1, { fim_vigencia: '2026-11-05', inicio_vigencia: '2025-11-06', assinatura: '2026-11-03', contato: 'compras@vertice.example' }),
  item(47233, 'CT-2047', 'contratos', 'Grupo Solaris · Licenciamento de software com reajuste anual pelo IPCA e multa rescisória', 1, { fim_vigencia: '2026-11-12', inicio_vigencia: '2024-11-13', assinatura: '2026-11-13', contato: 'marcos.teles@solaris.example' }),
  item(47234, 'CT-2050', 'contratos', 'Gráfica Ponto Final · Impressos', 3, { fim_vigencia: '2026-10-26', inicio_vigencia: '2025-10-27', contato: 'pedidos@pontofinal.example' }),
  item(52088, 'PR-0318', 'processos', 'Ação de cobrança · Grupo Solaris', 1, { audiencia: '2026-10-29', audiencia_inicio: 840, audiencia_fim: 930, prazo_fatal: '2026-11-06', email_escritorio: 'helena.prado@pradolima.example' }),
  item(52091, 'PR-0322', 'processos', 'Reclamação trabalhista · ex-colaborador da manutenção', 1, { audiencia: '2026-11-04', audiencia_inicio: 570, audiencia_fim: 630, prazo_fatal: '2026-11-03' }),
  item(52094, 'PR-0325', 'processos', 'Revisão contratual · Vértice Engenharia', 4, { audiencia: '2026-11-10', audiencia_inicio: 960, audiencia_fim: 1020, email_escritorio: 'juridico@vertice.example' }, true),
  item(61118, 'CL-118', 'clientes', 'Ondas Telecom', 2, { proxima_visita: '2026-11-09', fim_visita: '2026-11-10', contato: 'ana.lopes@ondastelecom.example' }),
  item(61121, 'CL-121', 'clientes', 'Vértice Engenharia', 2, { proxima_visita: '2026-11-18', contato: 'compras@vertice.example' }),
  item(61124, 'CL-124', 'clientes', 'Grupo Solaris', 2, { contato: 'marcos.teles@solaris.example' }),
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
  // A tarefa do fluxo sempre tem item: o fluxo roda sobre um item da categoria. Só a tarefa rápida pode não ter.
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
  // Atribuída à Lia agora há pouco: o Diego tinha reservado um horário, que fica oferecido a ela (b-4).
  tarefa(273592, 'fluxo', 'Revisar o termo de confidencialidade da Vértice', 'pending', quando('2026-11-03', '18:00'), 1, 47232),
  // Do Tomás, com a Lia como colaboradora: aparece na Agenda dela, e cada um reserva o próprio horário.
  tarefa(273594, 'fluxo', 'Revisar o parecer do escritório parceiro', 'pending', quando('2026-10-30', '18:00'), 2, 52088, { collaborators: [1] }),
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

/** Os calendários de fora que a Agenda lê. O Google Agenda tem o lugar pronto e fica desligado até a integração. */
export type Provedor = 'outlook' | 'google'

/** Um calendário que a conexão traz: o da pessoa e os compartilhados com ela. */
export interface Calendario { id: IdDoCalendario, provedor: Provedor, cor: 'info' | 'neutral', compartilhado: boolean }
export const calendarios: Calendario[] = [
  { id: 'meu', provedor: 'outlook', cor: 'info', compartilhado: false },
  { id: 'juridico', provedor: 'outlook', cor: 'neutral', compartilhado: true },
]

export interface Reuniao {
  id: string
  titulo: string
  dia: string
  /** Minutos do dia. Sem início, é de dia inteiro. */
  inicio?: number
  fim?: number
  /**
   * O `iCalUId` do Outlook: o mesmo em todas as caixas de quem participa (o `id` muda de caixa para caixa). É a chave
   * do vínculo, que por isso vale para o workspace inteiro: quem liga, liga para todos.
   */
  uid: string
  /** PROTÓTIPO: a série da reunião recorrente (`seriesMasterId` do Graph). Ligar a série liga todas as ocorrências. */
  serie?: string
  /** Sem calendário: a reunião não está em nenhum calendário da pessoa e só aparece pelo vínculo, no retrato guardado. */
  calendario?: IdDoCalendario
  /** PROTÓTIPO: de onde a reunião vem. Só o Outlook está ligado; o Google Agenda vem em breve. */
  provedor: Provedor
  /** Último dia do evento de vários dias (de dia inteiro). */
  diaFim?: string
  /** O fuso de quem organizou, quando não é o de Brasília. A grade mostra no fuso da pessoa; o popover, nos 2. */
  fuso?: string
  /** Cancelada no Outlook: sai da grade e fica no histórico do item, riscada. */
  cancelada?: boolean
  teams: boolean
  local?: string
  participantes: Participante[]
  /** E-mail de quem organizou. Só o organizador muda o horário no Outlook (`isOrganizer` do Graph). */
  organizador: string
  /**
   * Marcado como particular no Outlook (`sensitivity = private`): não se liga a item. Se fica particular depois de
   * ligado, o vínculo continua, e quem não participa vê só "Evento particular", sem o título.
   */
  particular?: boolean
}

export type IdDoCalendario = 'meu' | 'juridico'

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
    lista.push({ id: `daily-${dia}`, uid: `uid-daily-${dia}`, serie: 'serie-daily', titulo: 'Daily do Jurídico', dia, inicio: 540, fim: 555, calendario: 'juridico', provedor: 'outlook', teams: true, participantes: [eu(), interno(4), interno(5)], organizador: pessoaPorId(4)!.email! })
  }
  return lista
}

const comUid = (r: Omit<Reuniao, 'uid'> & { uid?: string }): Reuniao => ({ ...r, uid: r.uid ?? `uid-${r.id}` })

export const reunioesIniciais = (): Reuniao[] => [
  ...dailies(),
  comUid({ id: 'r-ondas-1', titulo: 'Primeira conversa com a Ondas Telecom', dia: '2026-10-20', inicio: 600, fim: 660, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-solaris-0', titulo: 'Proposta comercial do Grupo Solaris', dia: '2026-10-22', inicio: 840, fim: 900, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-prep', titulo: 'Preparação da audiência de cobrança', dia: '2026-10-26', inicio: 900, fim: 960, calendario: 'meu', provedor: 'outlook', teams: false, local: 'Sala Ipê', participantes: [eu(), interno(6)], organizador: EU.email! }),
  comUid({ id: 'r-1a1', titulo: '1:1 com o Paulo', dia: '2026-10-27', inicio: 660, fim: 720, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(6)], organizador: EU.email! }),
  comUid({ id: 'r-ondas-2', titulo: 'Alinhamento do link dedicado com a Ondas Telecom', dia: '2026-10-27', inicio: 840, fim: 900, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim'), externo('Caio Ventura', 'caio.ventura@ondastelecom.example', 'talvez')], organizador: EU.email! }),
  comUid({ id: 'r-solaris-1', titulo: 'Revisão das cláusulas de reajuste com o Grupo Solaris', dia: '2026-10-28', inicio: 600, fim: 660, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(3), externo('Marcos Teles', 'marcos.teles@solaris.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-riscos', titulo: 'Comitê de riscos', dia: '2026-10-28', inicio: 630, fim: 690, calendario: 'juridico', provedor: 'outlook', teams: false, local: 'Sala Jacarandá', participantes: [eu('talvez'), interno(6), interno(3), interno(4)], organizador: pessoaPorId(6)!.email! }),
  comUid({ id: 'r-fin', titulo: 'Ligação rápida com o financeiro', dia: '2026-10-28', inicio: 630, fim: 660, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(3)], organizador: EU.email! }),
  comUid({
    id: 'r-vertice',
    titulo: 'Kick-off da manutenção predial com a Vértice Engenharia',
    dia: '2026-10-28',
    inicio: 960,
    fim: 1020,
    calendario: 'meu',
    provedor: 'outlook',
    teams: true,
    participantes: [eu(), interno(2), interno(4), interno(5), externo('Rui Campos', 'rui.campos@vertice.example', 'sim'), externo('Bia Torres', 'bia.torres@vertice.example', 'sim'), externo('Ivo Lemos', 'ivo.lemos@vertice.example'), externo('Sara Duarte', 'sara.duarte@vertice.example'), externo('Leo Faria', 'leo.faria@vertice.example', 'nao'), externo('Compras Vértice', 'compras@vertice.example'), externo('Otto Reis', 'otto.reis@vertice.example', 'talvez'), interno(6, 'pendente')], organizador: pessoaPorId(2)!.email!,
  }),
  comUid({ id: 'r-prado', titulo: 'Café com o escritório Prado e Lima', dia: '2026-10-29', inicio: 450, fim: 480, calendario: 'meu', provedor: 'outlook', teams: false, local: 'Café da esquina', participantes: [eu(), externo('Helena Prado', 'helena.prado@pradolima.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-particular', titulo: 'Consulta médica', dia: '2026-10-29', inicio: 720, fim: 780, calendario: 'meu', provedor: 'outlook', teams: false, participantes: [eu()], organizador: EU.email!, particular: true }),
  comUid({ id: 'r-lgpd', titulo: 'Treinamento de LGPD', dia: '2026-10-30', calendario: 'juridico', provedor: 'outlook', teams: true, participantes: [eu(), interno(4), interno(5), interno(3)], organizador: pessoaPorId(3)!.email! }),
  comUid({ id: 'r-ondas-3', titulo: 'Negociação da renovação com a Ondas Telecom', dia: '2026-10-30', inicio: 900, fim: 990, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Ana Lopes', 'ana.lopes@ondastelecom.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-vertice-2', titulo: 'Assinatura do aditivo com a Vértice', dia: '2026-11-03', inicio: 600, fim: 660, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), externo('Rui Campos', 'rui.campos@vertice.example', 'sim')], organizador: EU.email! }),
  comUid({ id: 'r-solaris-2', serie: 'serie-solaris', titulo: 'Reunião mensal com o Grupo Solaris', dia: '2026-11-04', inicio: 840, fim: 900, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example')], organizador: 'marcos.teles@solaris.example' }),
  comUid({ id: 'r-workshop', titulo: 'Workshop de contratos padrão', dia: '2026-11-06', inicio: 540, fim: 720, calendario: 'juridico', provedor: 'outlook', teams: false, local: 'Auditório', participantes: [eu(), interno(2), interno(3), interno(4), interno(5), interno(6)], organizador: pessoaPorId(2)!.email! }),
  comUid({ id: 'r-solaris-2b', serie: 'serie-solaris', titulo: 'Reunião mensal com o Grupo Solaris', dia: '2026-10-07', inicio: 840, fim: 900, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example', 'sim')], organizador: 'marcos.teles@solaris.example' }),
  comUid({ id: 'r-solaris-2c', serie: 'serie-solaris', titulo: 'Reunião mensal com o Grupo Solaris', dia: '2026-12-02', inicio: 840, fim: 900, calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), interno(2), externo('Marcos Teles', 'marcos.teles@solaris.example')], organizador: 'marcos.teles@solaris.example' }),
  // O workshop está no calendário do Jurídico e na caixa da Lia: o mesmo uid, uma reunião só na grade.
  comUid({ id: 'r-workshop-meu', uid: 'uid-r-workshop', titulo: 'Workshop de contratos padrão', dia: '2026-11-06', inicio: 540, fim: 720, calendario: 'meu', provedor: 'outlook', teams: false, local: 'Auditório', participantes: [eu(), interno(2), interno(3), interno(4), interno(5), interno(6)], organizador: pessoaPorId(2)!.email! }),
  // De vários dias, de dia inteiro.
  comUid({ id: 'r-congresso', titulo: 'Congresso de Direito Contratual', dia: '2026-11-04', diaFim: '2026-11-06', calendario: 'meu', provedor: 'outlook', teams: false, local: 'Centro de Convenções', participantes: [eu()], organizador: EU.email! }),
  // Organizada em Lisboa: 10:00 em Brasília são 13:00 lá.
  comUid({ id: 'r-lisboa', titulo: 'Alinhamento com o escritório de Lisboa', dia: '2026-10-30', inicio: 600, fim: 645, fuso: 'Europe/Lisbon', calendario: 'meu', provedor: 'outlook', teams: true, participantes: [eu(), externo('Rita Sequeira', 'rita.sequeira@lusolex.example', 'sim')], organizador: 'rita.sequeira@lusolex.example' }),
  // Cancelada no Outlook: fica no histórico do CT-2044, riscada.
  comUid({ id: 'r-obra', titulo: 'Visita à obra da Vértice', dia: '2026-10-23', inicio: 900, fim: 1020, calendario: 'meu', provedor: 'outlook', teams: false, local: 'Obra da Vértice', participantes: [eu(), externo('Rui Campos', 'rui.campos@vertice.example', 'sim')], organizador: EU.email!, cancelada: true }),
  // Do Paulo, sem a Lia: ligada ao CT-2044 antes de virar particular. Fora da grade dela; no item, sem o título.
  comUid({ id: 'r-paulo', titulo: 'Conversa reservada sobre a multa da Vértice', dia: '2026-11-02', inicio: 900, fim: 930, provedor: 'outlook', teams: true, participantes: [interno(6), externo('Rui Campos', 'rui.campos@vertice.example', 'sim')], organizador: pessoaPorId(6)!.email!, particular: true }),

]

/* ------------------------------------------------------------------ *
 * PROTÓTIPO: o vínculo da reunião (não existe no produto)
 * ------------------------------------------------------------------ */
export type Alvo = { tipo: 'item' | 'tarefa', id: number }

/**
 * A ligação de uma reunião com um item ou com uma tarefa, guardada no ENSPACE, no workspace, e vista por todos.
 *
 * A reunião agendada para uma tarefa se liga à tarefa, não ao item (correção da redatora em 29/10/2026): o item
 * chega a ela pela tarefa (item → tarefa → reunião). Uma reunião se liga a vários alvos; um alvo, a várias reuniões.
 *
 * `recusado` guarda o "Não é este" da sugestão: a sugestão daquele item não volta para aquela reunião.
 * Apagar o item ou a tarefa apaga os vínculos dele; cancelar a reunião, não (ela fica no histórico).
 */
export interface Vinculo {
  id: string
  /** O `uid` da reunião ou, com `serie`, o id da série. */
  reuniao: string
  /** Toda a série (o padrão ao ligar uma recorrente) ou só esta ocorrência. */
  serie: boolean
  alvo: Alvo
  estado: 'ligado' | 'recusado'
  origem: 'criacao' | 'manual' | 'sugestao'
  /** Quem ligou, e quando. */
  por: number
  em: string
}

const vinculo = (id: string, reuniao: string, alvo: Alvo, por: number, em: string, origem: Vinculo['origem'] = 'manual', extra: Partial<Vinculo> = {}): Vinculo =>
  ({ id, reuniao, serie: false, alvo, estado: 'ligado', origem, por, em, ...extra })
const ao = (id: number): Alvo => ({ tipo: 'item', id })
const aTarefa = (id: number): Alvo => ({ tipo: 'tarefa', id })

export const vinculosIniciais = (): Vinculo[] => [
  vinculo('v-1', 'uid-r-ondas-1', ao(61118), 1, '2026-10-20', 'criacao'),
  vinculo('v-2', 'uid-r-solaris-0', ao(47233), 1, '2026-10-21', 'criacao'),
  vinculo('v-3', 'uid-r-prep', ao(52088), 1, '2026-10-23', 'criacao'),
  vinculo('v-4', 'uid-r-prep', ao(47233), 1, '2026-10-23'),
  // Agendada pela tarefa de conferir o reajuste: o CT-2047 a vê pela tarefa.
  vinculo('v-5', 'uid-r-solaris-1', aTarefa(273560), 1, '2026-10-26', 'criacao'),
  vinculo('v-6', 'uid-r-prado', ao(52088), 1, '2026-10-27', 'sugestao'),
  vinculo('v-7', 'uid-r-ondas-3', ao(47231), 1, '2026-10-27', 'criacao'),
  vinculo('v-8', 'uid-r-ondas-3', ao(61118), 1, '2026-10-27'),
  vinculo('v-9', 'uid-r-vertice-2', ao(47232), 1, '2026-10-27', 'criacao'),
  // Ligado pelo Tomás: vale para a Lia também.
  vinculo('v-10', 'uid-r-vertice', ao(61121), 2, '2026-10-26'),
  // A série inteira, ligada pelo Tomás ao cliente.
  vinculo('v-11', 'serie-solaris', ao(61124), 2, '2026-10-05', 'manual', { serie: true }),
  // Ao chamado, que a Lia não vê: aparece como "1 item sem acesso".
  vinculo('v-12', 'uid-r-fin', ao(70310), 3, '2026-10-27'),
  vinculo('v-13', 'uid-r-obra', ao(47232), 1, '2026-10-16', 'criacao'),
  vinculo('v-14', 'uid-r-paulo', ao(47232), 6, '2026-10-28'),
]

/* ------------------------------------------------------------------ *
 * PROTÓTIPO: blocos de trabalho (tempo reservado para uma tarefa)
 * ------------------------------------------------------------------ */
export interface Bloco {
  id: string
  tarefaId: number
  /** De quem é o horário. O responsável e cada colaborador reservam o próprio. */
  dono: number
  /** A tarefa mudou de responsável: o horário futuro fica oferecido à pessoa nova até ela aceitar ou recusar. */
  oferecidoA?: number
  dia: string
  inicio: number
  fim: number
  /** PROTÓTIPO: o bloco também está no Outlook, como "ocupado", para quem marca reunião ver o horário tomado. */
  outlook?: boolean
  /** O id do evento "ocupado" no Outlook: mover ou apagar o bloco muda o evento junto. */
  eventoExterno?: string
}

export const blocosIniciais = (): Bloco[] => [
  { id: 'b-1', tarefaId: 273512, dono: 1, dia: '2026-10-28', inicio: 480, fim: 570, outlook: true, eventoExterno: 'AAMk-b-1' },
  { id: 'b-2', tarefaId: 273570, dono: 1, dia: '2026-10-28', inicio: 840, fim: 930 },
  { id: 'b-3', tarefaId: 273530, dono: 1, dia: '2026-10-29', inicio: 570, fim: 660 },
  { id: 'b-4', tarefaId: 273592, dono: 4, oferecidoA: 1, dia: '2026-10-30', inicio: 840, fim: 930 },
  { id: 'b-5', tarefaId: 273594, dono: 2, dia: '2026-10-30', inicio: 600, fim: 690 },
]

/* ------------------------------------------------------------------ *
 * Calendário do sistema: dias não úteis (feriados nacionais de 2026)
 * ------------------------------------------------------------------ */
export const feriados = ['2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25']
/** Horário de trabalho do Calendário do sistema: 08:00 a 18:00. */
export const HORARIO = { inicio: 480, fim: 1080 }
