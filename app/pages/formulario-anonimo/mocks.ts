/**
 * O dado do protótipo. Tudo fictício: empresa, pessoas, relatos e protocolos.
 *
 * - Workspace, categoria, item e membro são tipados pelo
 *   `@be-enlighten/enspace-sdk-schemas` 0.17. O que o schema não tem está marcado
 *   com "// PROTÓTIPO:" e diz de onde veio.
 * - Formulário e mensagem do canal NÃO têm schema no SDK 0.17. A forma do
 *   formulário saiu da tela Formulários do develop (Definição, Visual, Avançado),
 *   visitada em 15/10/2026; a mensagem é invenção da proposta.
 * - O item anônimo usa os campos que o schema já tem: `user` aponta para o usuário
 *   genérico "anonymous" e `request_email` não existe. É a lógica dos no-codes
 *   (Airtable "anonymous", Kissflow "Guest", Pipefy "Pipebot").
 */
import type { Item, ItemType, Member, Workspace } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Datas: o protótipo vive em quinta, 15/10/2026.
 * ------------------------------------------------------------------ */

export const HOJE = new Date('2026-10-15T10:20:00-03:00')

/**
 * A hora que o item anônimo grava: a hora cheia, nunca o minuto.
 * Hora exata cruzada com catraca, VPN ou login do SSO aponta quem enviou.
 */
export function horaCheia(d: Date) {
  const c = new Date(d)
  c.setMinutes(0, 0, 0)
  return c
}

export function somarDias(d: Date, dias: number) {
  const c = new Date(d)
  c.setDate(c.getDate() + dias)
  return c
}

function dia(iso: string, hora = 10) {
  return new Date(`${iso}T${String(hora).padStart(2, '0')}:00:00-03:00`)
}

/* ------------------------------------------------------------------ *
 * Workspace, categoria e o usuário genérico
 * ------------------------------------------------------------------ */

export const workspace: Workspace = {
  id: 517,
  created_at: new Date('2025-06-02T12:00:00-03:00'),
  updated_at: new Date('2026-10-10T18:00:00-03:00'),
  name: 'Vela Logística',
  reference: 'vela-logistica',
  status: 'active',
  description: 'Compliance e jurídico da Vela',
  icon: 'carbon:delivery-truck',
  members_count: 14,
}

export const categoria: ItemType = {
  id: 3101,
  created_at: new Date('2026-08-04T09:00:00-03:00'),
  updated_at: new Date('2026-10-14T16:00:00-03:00'),
  name: 'Denúncias',
  slug: 'denuncias',
  description: 'Relatos recebidos pelo canal de denúncia',
  icon: 'i-lucide-shield-alert',
}

/** As outras categorias do menu lateral (só rótulo: a casca). */
export const outrasCategorias = ['Contratos', 'Fornecedores', 'Auditorias internas']

/**
 * PROTÓTIPO: o usuário de sistema que vira o criador de todo envio anônimo.
 * Mesmo id em todo workspace; não é membro, não tem e-mail, não faz login.
 */
export const ANONYMOUS = { id: 1, nome: 'anonymous' } as const

/* ------------------------------------------------------------------ *
 * Membros do comitê (quem trata o caso)
 * ------------------------------------------------------------------ */

export interface MembroDoComite {
  membro: Member
  nome: string
  iniciais: string
}

function membro(id: number, fname: string, lname: string, email: string): MembroDoComite {
  return {
    membro: {
      id,
      created_at: new Date('2025-06-02T12:00:00-03:00'),
      updated_at: new Date('2026-09-01T12:00:00-03:00'),
      user: id + 9000,
      status: 'active',
      type: 'full',
      reference: `m${id}`,
      meta: { fname, lname, email },
    } as Member,
    nome: `${fname} ${lname}`,
    iniciais: `${fname[0]}${lname[0]}`,
  }
}

export const comite: MembroDoComite[] = [
  membro(61, 'Helena', 'Prado', 'helena.prado@example.com'),
  membro(62, 'Otávio', 'Lins', 'otavio.lins@example.com'),
  membro(63, 'Marina', 'Queiroz', 'marina.queiroz@example.com'),
  membro(64, 'Caio', 'Brandão', 'caio.brandao@example.com'),
]
export const EU = comite[0]!

/* ------------------------------------------------------------------ *
 * Campos e formulário
 * ------------------------------------------------------------------ */

/**
 * PROTÓTIPO: o `Field` do SDK é uma união por tipo. Aqui fica só o que a tela
 * usa; o `type` é o nome técnico do develop (Configurações › Campos).
 */
export interface Campo {
  refId: string
  nome: string
  type: 'EnlDropdown' | 'EnTextArea' | 'inputText' | 'EnlCalendar' | 'radioButton' | 'uploadFile'
  obrigatorio: boolean
  opcoes?: string[]
}

export const TIPOS = [
  'Assédio moral',
  'Assédio sexual',
  'Fraude ou corrupção',
  'Conflito de interesses',
  'Discriminação',
  'Segurança do trabalho',
  'Vazamento de dados',
  'Outro',
] as const

export const AREAS = ['Operações', 'Armazém', 'Comercial', 'Financeiro', 'Pessoas', 'Tecnologia', 'Diretoria', 'Não sei'] as const

export const campos: Campo[] = [
  { refId: 'tipo', nome: 'Tipo de ocorrência', type: 'EnlDropdown', obrigatorio: true, opcoes: [...TIPOS] },
  { refId: 'area', nome: 'Onde aconteceu', type: 'EnlDropdown', obrigatorio: true, opcoes: [...AREAS] },
  { refId: 'quando', nome: 'Quando aconteceu', type: 'EnlCalendar', obrigatorio: false },
  { refId: 'envolvidos', nome: 'Pessoas envolvidas', type: 'inputText', obrigatorio: false },
  { refId: 'relato', nome: 'Relato', type: 'EnTextArea', obrigatorio: true },
  { refId: 'testemunhas', nome: 'Alguém mais viu?', type: 'radioButton', obrigatorio: false, opcoes: ['Sim', 'Não', 'Prefiro não dizer'] },
  { refId: 'anexos', nome: 'Anexos', type: 'uploadFile', obrigatorio: false },
]

/**
 * Outros campos da categoria, que o configurador pode pôr no formulário. Os 4
 * identificam quem envia: é o que a verificação de anonimato aponta.
 */
export interface CampoComRisco {
  refId: string
  nome: string
  /** Rótulo técnico do develop, como aparece em "Adicionar campo": "[tipo] - Nome". */
  tipoTecnico: string
  risco: 'email' | 'nome' | 'membro_logado' | 'documento'
}
export const camposComRisco: CampoComRisco[] = [
  { refId: 'email_retorno', nome: 'E-mail para retorno', tipoTecnico: 'email', risco: 'email' },
  { refId: 'seu_nome', nome: 'Seu nome (opcional)', tipoTecnico: 'inputText', risco: 'nome' },
  { refId: 'gestor', nome: 'Gestor responsável', tipoTecnico: 'EnlDropdown', risco: 'membro_logado' },
  { refId: 'matricula', nome: 'Matrícula', tipoTecnico: 'EnlMask', risco: 'documento' },
]

/** Rótulo técnico dos campos do relato, para a lista "Adicionar campo". */
export const tipoTecnico: Record<string, string> = {
  tipo: 'EnlDropdown', area: 'EnlDropdown', quando: 'EnlCalendar', envolvidos: 'inputText',
  relato: 'EnTextArea', testemunhas: 'radioButton', anexos: 'uploadFile',
}

/** PROPOSTA: o modelo "Canal de denúncia", oferecido ao criar um formulário anônimo. */
export const MODELO_DO_CANAL = ['tipo', 'area', 'quando', 'envolvidos', 'relato', 'testemunhas', 'anexos']

/* ------------------------------------------------------------------ *
 * O que a revisão do canal confere fora do formulário
 * ------------------------------------------------------------------ */

export type Severidade = 'bloqueia' | 'atencao'
export interface PontoDaRevisao {
  id: string
  grupo: 'fluxos' | 'notificacoes' | 'modelos' | 'acesso'
  severidade: Severidade
  /** Onde está, como o configurador acha no ENSPACE. */
  onde: string
}
export const pontosForaDoFormulario: PontoDaRevisao[] = [
  { id: 'fluxo-gestor', grupo: 'fluxos', severidade: 'atencao', onde: 'Spaceflow "Aviso ao gestor" › nó E-mail' },
  { id: 'notif-criador', grupo: 'notificacoes', severidade: 'atencao', onde: 'Denúncias › Notificações › "Nova denúncia"' },
  { id: 'modelo-confirmacao', grupo: 'modelos', severidade: 'atencao', onde: 'E-mails › Modelos › "Confirmação de registro"' },
  { id: 'cargo-colaborador', grupo: 'acesso', severidade: 'bloqueia', onde: 'Gestão de Membros › Cargos › "Colaborador"' },
]

export type Visibilidade = 'privado' | 'publico' | 'anonimo'
/** As 6 opções de Tipo do develop (ev-11), na ordem da lista. */
export const TIPOS_DE_FORMULARIO = ['editar', 'criacao', 'geral', 'visualizar', 'criacao_item', 'tarefas'] as const
export type TipoDeFormulario = typeof TIPOS_DE_FORMULARIO[number]
export type Verificacao = 'enspace' | 'turnstile'
export type ApagarEmail = 'ao_concluir' | 'trinta_dias'

/** PROTÓTIPO: forma da tela Formulários do develop + a aba Anonimato (proposta). */
export interface Formulario {
  id: number
  nome: string
  descricao: string
  tipo: TipoDeFormulario
  visibilidade: Visibilidade
  icone: string
  identification: string
  criadoEm: Date
  // Avançado (existe no develop)
  triagem: boolean
  listaTriagem: boolean
  documentosModelo: boolean
  rascunhos: boolean
  // Anonimato (PROPOSTA)
  verificacao: Verificacao
  limitePorHora: number
  limitePorDia: number
  pausarNoPico: boolean
  mensagemDeConfirmacao: string
  prazoDeRetornoDias: 30 | 60 | 90
  oferecerAvisoPorEmail: boolean
  apagarEmail: ApagarEmail
}

export const formularios: Formulario[] = [
  {
    id: 3520,
    nome: 'Canal de denúncia',
    descricao: 'Relato anônimo de conduta, fraude ou assédio',
    tipo: 'criacao',
    visibilidade: 'anonimo',
    icone: 'i-lucide-shield-alert',
    identification: 'Qm7XcT2pLw9RkV4sNa8ZbH3uYe6JdF1g',
    criadoEm: dia('2026-08-04'),
    triagem: false,
    listaTriagem: false,
    documentosModelo: false,
    rascunhos: false,
    verificacao: 'enspace',
    limitePorHora: 30,
    limitePorDia: 200,
    pausarNoPico: true,
    mensagemDeConfirmacao: 'Recebemos sua denúncia. O comitê de ética lê todo relato e responde pela página de acompanhamento. Guarde o protocolo e a senha.',
    prazoDeRetornoDias: 90,
    oferecerAvisoPorEmail: true,
    apagarEmail: 'ao_concluir',
  },
  {
    id: 3521,
    nome: 'Triagem do comitê',
    descricao: 'Classificação interna da denúncia',
    tipo: 'editar',
    visibilidade: 'privado',
    icone: 'i-lucide-list-checks',
    identification: 'Rk2aW8eQz5LmP0vYt7XcN4bU1sJh9GdF',
    criadoEm: dia('2026-08-04', 11),
    triagem: false,
    listaTriagem: false,
    documentosModelo: false,
    rascunhos: true,
    verificacao: 'enspace',
    limitePorHora: 30,
    limitePorDia: 200,
    pausarNoPico: true,
    mensagemDeConfirmacao: '',
    prazoDeRetornoDias: 90,
    oferecerAvisoPorEmail: false,
    apagarEmail: 'ao_concluir',
  },
]

/** O endereço fixo do formulário: o mesmo de hoje, sem o Acesso Externo na frente. */
export function linkDoFormulario(f: Formulario) {
  return `https://app.enspace.io/public/${f.identification}/answer`
}
export const LINK_DE_ACOMPANHAMENTO = 'https://app.enspace.io/public/acompanhar'

/* ------------------------------------------------------------------ *
 * Denúncias (itens) e mensagens do canal
 * ------------------------------------------------------------------ */

export type Situacao = 'nova' | 'em_analise' | 'aguardando' | 'concluida' | 'arquivada'

export interface DadosDaDenuncia {
  protocolo: string
  tipo: typeof TIPOS[number]
  area: typeof AREAS[number]
  quando: string | null
  envolvidos: string
  relato: string
  testemunhas: string | null
  anexos: string[]
  situacao: Situacao
  /** PROTÓTIPO: só o fato, nunca o endereço. O endereço fica no cofre, fora do item. */
  aviso_por_email: boolean
  retorno_ate: string
  responsavel: number | null
}

/** O item do protótipo: o `Item` do SDK com o `data` tipado. */
export interface Denuncia extends Item {
  data: DadosDaDenuncia
  /** PROTÓTIPO: a senha nunca fica no item. Aqui ela só existe para o protótipo deixar entrar no acompanhamento. */
  senhaDoPrototipo: string
  mensagensNovas: number
  /** PROTÓTIPO: envio de teste do configurador; não conta nos limites. */
  teste?: boolean
}

export interface Mensagem {
  id: number
  itemId: number
  autor: 'sistema' | 'denunciante' | 'comite'
  /** Membro que respondeu. O denunciante vê só "Comitê de ética". */
  membro?: number
  texto: string
  quando: Date
  anexos?: string[]
}

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** Protocolo curto para citar numa conversa; não abre nada sozinho. */
export function novoProtocolo(semente = Math.random) {
  const n = () => Math.floor(semente() * 9000 + 1000)
  return `DEN-${n()}-${n()}`
}

/** Senha de 12 caracteres sem letra ambígua (sem I, L, O, 0 e 1). */
export function novaSenha(semente = Math.random) {
  const bloco = () => Array.from({ length: 4 }, () => ALFABETO[Math.floor(semente() * ALFABETO.length)]).join('')
  return `${bloco()}-${bloco()}-${bloco()}`
}

/** Gerador com semente: o mock é o mesmo a cada recarga. */
function sementeFixa(s: number) {
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function referencia(n: number) {
  const r = sementeFixa(n * 7919)
  return `DEN${Array.from({ length: 29 }, () => '0123456789ABCDEF'[Math.floor(r() * 16)]).join('')}`
}

interface Semente {
  tipo: DadosDaDenuncia['tipo']
  area: DadosDaDenuncia['area']
  relato: string
  envolvidos?: string
  quando?: string
  testemunhas?: string
  situacao: Situacao
  recebida: string
  hora: number
  email?: boolean
  anexos?: string[]
  responsavel?: number
}

const sementes: Semente[] = [
  { tipo: 'Assédio moral', area: 'Armazém', situacao: 'nova', recebida: '2026-10-15', hora: 7, email: true, relato: 'O supervisor do turno da noite grita com a equipe na frente de todos quando a meta de expedição não fecha. Na última semana chamou uma colega de incompetente no rádio. Várias pessoas já pediram transferência.', envolvidos: 'Supervisor do turno C', quando: '2026-10-09', testemunhas: 'Sim' },
  { tipo: 'Fraude ou corrupção', area: 'Comercial', situacao: 'nova', recebida: '2026-10-14', hora: 21, relato: 'Um vendedor oferece desconto fora da tabela para dois clientes em troca de presentes. Os pedidos saem com frete grátis sem aprovação.', envolvidos: 'Equipe de vendas Sul', anexos: ['planilha-pedidos.xlsx'] },
  { tipo: 'Segurança do trabalho', area: 'Operações', situacao: 'em_analise', recebida: '2026-10-11', hora: 15, email: true, relato: 'A empilhadeira 4 está sem o alarme de ré há um mês. Já houve dois quase acidentes no corredor C. O pedido de manutenção foi aberto e fechado sem conserto.', quando: '2026-10-08', testemunhas: 'Sim', anexos: ['foto-corredor.jpg'], responsavel: 62 },
  { tipo: 'Conflito de interesses', area: 'Financeiro', situacao: 'aguardando', recebida: '2026-10-06', hora: 10, relato: 'A empresa de limpeza contratada em agosto pertence ao cunhado de uma gerente que participou da escolha. Não houve cotação com outras empresas.', envolvidos: 'Gerência administrativa', responsavel: 61 },
  { tipo: 'Discriminação', area: 'Pessoas', situacao: 'em_analise', recebida: '2026-10-02', hora: 18, email: true, relato: 'Candidatas com filhos pequenos são eliminadas na entrevista. A pergunta sobre quem cuida das crianças aparece no roteiro impresso.', testemunhas: 'Prefiro não dizer', responsavel: 63 },
  { tipo: 'Vazamento de dados', area: 'Tecnologia', situacao: 'concluida', recebida: '2026-09-22', hora: 9, relato: 'A planilha de salários ficou num link aberto da pasta compartilhada. Qualquer pessoa com o link conseguia abrir.', responsavel: 64 },
  { tipo: 'Assédio sexual', area: 'Comercial', situacao: 'em_analise', recebida: '2026-09-30', hora: 20, relato: 'Um gerente manda mensagens de cunho sexual para uma estagiária fora do horário. Ela tem medo de perder a vaga.', envolvidos: 'Gerente regional', responsavel: 61 },
  { tipo: 'Outro', area: 'Não sei', situacao: 'arquivada', recebida: '2026-09-18', hora: 13, relato: 'teste', responsavel: 62 },
  { tipo: 'Fraude ou corrupção', area: 'Armazém', situacao: 'em_analise', recebida: '2026-09-27', hora: 11, email: true, relato: 'Mercadoria avariada é registrada como perda e depois vendida por fora. O caminhão sai no fim do turno de sábado sem nota.', quando: '2026-09-20', testemunhas: 'Não', responsavel: 64 },
  { tipo: 'Assédio moral', area: 'Diretoria', situacao: 'aguardando', recebida: '2026-09-15', hora: 16, relato: 'Reuniões de diretoria terminam com ameaças de demissão para quem discorda. A última foi em 10/09.', responsavel: 61 },
  { tipo: 'Segurança do trabalho', area: 'Armazém', situacao: 'concluida', recebida: '2026-09-03', hora: 8, relato: 'Os extintores do mezanino estão vencidos desde julho.', responsavel: 62 },
  { tipo: 'Conflito de interesses', area: 'Operações', situacao: 'concluida', recebida: '2026-08-28', hora: 14, relato: 'O coordenador de frota indica a oficina do próprio irmão para todos os reparos.', responsavel: 64 },
  { tipo: 'Discriminação', area: 'Operações', situacao: 'nova', recebida: '2026-10-13', hora: 22, relato: 'Colegas fazem piada com o sotaque de quem veio do Nordeste e a liderança ri junto. Isso acontece todos os dias no refeitório e já virou apelido no grupo de mensagens da equipe, que tem mais de quarenta pessoas, inclusive o coordenador da área e dois supervisores que deveriam corrigir isso.', testemunhas: 'Sim' },
  { tipo: 'Fraude ou corrupção', area: 'Financeiro', situacao: 'arquivada', recebida: '2026-08-21', hora: 10, relato: 'Notas de reembolso de viagem com valores repetidos.', responsavel: 63 },
  { tipo: 'Assédio moral', area: 'Tecnologia', situacao: 'concluida', recebida: '2026-08-12', hora: 17, relato: 'O líder técnico humilha quem pergunta em reunião aberta.', responsavel: 63 },
  { tipo: 'Vazamento de dados', area: 'Comercial', situacao: 'em_analise', recebida: '2026-10-08', hora: 12, email: true, relato: 'Lista de clientes com CPF foi enviada para o e-mail pessoal de um vendedor que saiu da empresa.', anexos: ['print-envio.png'], responsavel: 64 },
  { tipo: 'Outro', area: 'Pessoas', situacao: 'concluida', recebida: '2026-08-05', hora: 9, relato: 'Banco de horas não aparece no holerite desde junho.', responsavel: 62 },
  { tipo: 'Segurança do trabalho', area: 'Operações', situacao: 'aguardando', recebida: '2026-09-25', hora: 19, relato: 'Motoristas fazem jornada de 14 horas na rota Norte sem a parada obrigatória.', responsavel: 62 },
]

export const denuncias: Denuncia[] = sementes.map((s, i) => {
  const id = 81200 + i
  // Semente espalhada e 1º valor descartado: ids vizinhos dariam protocolos parecidos.
  const r = sementeFixa(id * 104729 + 7)
  r()
  const recebida = horaCheia(dia(s.recebida, s.hora))
  return {
    id,
    created_at: recebida,
    updated_at: recebida,
    deleted_at: null,
    reference: referencia(id),
    user: ANONYMOUS.id,
    // request_email: não existe no item anônimo
    form: 3520,
    ignore_triggers: false,
    stage_status: null,
    status: 'active',
    isDraft: false,
    data: {
      protocolo: novoProtocolo(r),
      tipo: s.tipo,
      area: s.area,
      quando: s.quando ?? null,
      envolvidos: s.envolvidos ?? '',
      relato: s.relato,
      testemunhas: s.testemunhas ?? null,
      anexos: s.anexos ?? [],
      situacao: s.situacao,
      aviso_por_email: !!s.email,
      retorno_ate: somarDias(recebida, 90).toISOString().slice(0, 10),
      responsavel: s.responsavel ?? null,
    },
    senhaDoPrototipo: novaSenha(r),
    mensagensNovas: s.situacao === 'aguardando' ? 0 : s.situacao === 'em_analise' && i % 3 === 0 ? 1 : 0,
  }
})

/** A denúncia de exemplo das jornadas: a que tem conversa e e-mail de aviso. */
export const EXEMPLO = denuncias[2]!

const CONFIRMACAO = formularios[0]!.mensagemDeConfirmacao

function mensagensDe(d: Denuncia, extra: Omit<Mensagem, 'id' | 'itemId'>[]): Mensagem[] {
  const base: Omit<Mensagem, 'id' | 'itemId'>[] = [{ autor: 'sistema', texto: CONFIRMACAO, quando: d.created_at }]
  return [...base, ...extra].map((m, i) => ({ ...m, id: d.id * 100 + i, itemId: d.id }))
}

export const mensagens: Mensagem[] = denuncias.flatMap((d) => {
  const extra: Omit<Mensagem, 'id' | 'itemId'>[] = []
  if (d.id === EXEMPLO.id) {
    extra.push(
      { autor: 'comite', membro: 62, texto: 'Obrigado pelo relato. Abrimos uma verificação com a manutenção. Você lembra se o pedido de conserto tinha número?', quando: dia('2026-10-13', 11) },
      { autor: 'denunciante', texto: 'Era o chamado MAN-2291. Fecharam dizendo que estava resolvido, mas o alarme continua sem funcionar.', quando: dia('2026-10-14', 8) },
    )
  }
  if (d.data.situacao === 'aguardando') {
    extra.push({ autor: 'comite', membro: d.data.responsavel ?? 61, texto: 'Precisamos de mais detalhes para seguir. Você pode dizer em que semana isso aconteceu e se há algum documento?', quando: somarDias(d.created_at, 3) })
  }
  if (d.data.situacao === 'concluida') {
    extra.push({ autor: 'comite', membro: d.data.responsavel ?? 61, texto: 'Concluímos a apuração e as medidas foram tomadas. Obrigado por ajudar a melhorar a empresa.', quando: somarDias(d.created_at, 20) })
  }
  return mensagensDe(d, extra)
})

/* ------------------------------------------------------------------ *
 * Log de auditoria do item e e-mails automáticos
 * ------------------------------------------------------------------ */

export interface RegistroDeAuditoria {
  id: string
  itemId: number
  /** `anonymous` ou o id do membro. */
  quem: typeof ANONYMOUS.id | number
  acao: 'criou' | 'atualizou'
  quando: Date
  campos?: { campo: string, de: string, para: string }[]
}

export const auditoria: RegistroDeAuditoria[] = denuncias.flatMap((d) => {
  const lista: RegistroDeAuditoria[] = [{ id: `a${d.id}`, itemId: d.id, quem: ANONYMOUS.id, acao: 'criou', quando: d.created_at }]
  if (d.data.responsavel) {
    lista.push({
      id: `b${d.id}`,
      itemId: d.id,
      quem: d.data.responsavel,
      acao: 'atualizou',
      quando: somarDias(d.created_at, 1),
      campos: [{ campo: 'data.situacao', de: 'nova', para: 'em_analise' }, { campo: 'data.responsavel', de: '', para: String(d.data.responsavel) }],
    })
  }
  return lista
})

export interface EmailAutomatico {
  id: number
  itemId: number
  criadoEm: Date
  status: 'enviado' | 'falhou'
  assunto: string
}

/** O aviso ao denunciante aparece aqui sem o endereço. */
export const emailsAutomaticos: EmailAutomatico[] = mensagens
  .filter(m => m.autor !== 'denunciante' && denuncias.find(d => d.id === m.itemId)?.data.aviso_por_email)
  .map((m, i) => ({ id: 7000 + i, itemId: m.itemId, criadoEm: m.quando, status: 'enviado', assunto: m.autor === 'sistema' ? 'Recebemos sua denúncia' : 'Há uma atualização na sua denúncia' }))

/* ------------------------------------------------------------------ *
 * Volume do formulário (painel de proteção)
 * ------------------------------------------------------------------ */

/** Envios por hora nas últimas 24 h: aceitos e barrados. O pico das 3h é robô. */
export const volume24h: { hora: number, aceitos: number, barrados: number }[] = Array.from({ length: 24 }, (_, h) => ({
  hora: h,
  aceitos: [0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0, 2, 1, 0, 0][h]!,
  barrados: h === 3 ? 2870 : h === 4 ? 241 : [0, 2, 0, 0, 0, 1, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 4, 0, 0, 1][h]!,
}))
