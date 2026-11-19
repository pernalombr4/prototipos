/**
 * O dado do protótipo do módulo de assinaturas. Fictício, sem API.
 *
 * O `@be-enlighten/enspace-sdk-schemas` ainda não publica o envelope de assinatura. Os tipos abaixo espelham o schema do
 * módulo na branch `feat/en-signature` do front (lido em 18/11/2026): status, origem, papéis, status do participante e
 * tipos de evento são os mesmos valores. O membro vem do SDK.
 *
 * Campo marcado com "PROTÓTIPO" não existe no schema: é o que a proposta precisa e o dev decide de onde vem.
 * Nomes, e-mails, empresas e números são inventados. Nenhum dado de cliente.
 */
import type { Member } from '@be-enlighten/enspace-sdk-schemas'

export const HOJE = '2026-11-18T19:30:00-03:00'

export const workspace = { nome: 'Vértice Engenharia', slug: 'vertice-engenharia' }

/* ------------------------------------------------------------------ *
 * Pessoas                                                             *
 * ------------------------------------------------------------------ */

type Pessoa = Pick<Member, 'id'> & { nome: string, email: string, iniciais: string }

export const pessoas: Pessoa[] = [
  { id: 11, nome: 'Ana Ribeiro', email: 'ana.ribeiro@vertice.example', iniciais: 'AR' },
  { id: 12, nome: 'Bruno Tavares', email: 'bruno.tavares@vertice.example', iniciais: 'BT' },
  { id: 13, nome: 'Carla Menezes', email: 'carla.menezes@vertice.example', iniciais: 'CM' },
]
export const pessoaPorId = new Map(pessoas.map(p => [p.id, p]))
/** Quem está usando o protótipo. */
export const EU = 11

/* ------------------------------------------------------------------ *
 * Provedores e credenciais                                            *
 * ------------------------------------------------------------------ */

export type ProvedorId = 'clicksign' | 'certisign' | 'd4sign' | 'docusign' | 'adobesign'

/** Os recursos que o módulo declara por provedor (os mesmos 9 da tela da branch). */
export type Recurso = 'cancela' | 'cancelaSoNoEnspace' | 'consultaStatus' | 'reenvio' | 'links' | 'configurador' | 'cofres' | 'webhookAutomatico' | 'webhookDaConta'

export interface Provedor {
  id: ProvedorId
  nome: string
  /** PROTÓTIPO: a cor do monograma no lugar do logo, que o protótipo não reproduz. */
  cor: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'
  recursos: Recurso[]
  limiteMb: number
  formatos: string[]
  /** Etapas da configuração. O segredo do servidor não é etapa de quem configura (proposta). */
  webhook: 'automatico' | 'conta'
  ambientes: ('sandbox' | 'producao' | 'demo')[]
  tipoDeCredencial: 'jwt' | 'api_key'
  /** PROTÓTIPO: o portal do provedor, para o botão "Abrir <provedor>". */
  portal: string
}

export const provedores: Provedor[] = [
  { id: 'clicksign', nome: 'ClickSign', cor: 'warning', recursos: ['cancela', 'consultaStatus', 'reenvio', 'webhookDaConta'], limiteMb: 20, formatos: ['PDF', 'DOCX'], webhook: 'conta', ambientes: ['sandbox', 'producao'], tipoDeCredencial: 'api_key', portal: 'app.clicksign.example' },
  { id: 'certisign', nome: 'Certisign', cor: 'info', recursos: ['cancelaSoNoEnspace', 'links', 'webhookDaConta'], limiteMb: 20, formatos: ['PDF', 'DOCX'], webhook: 'conta', ambientes: ['sandbox', 'producao'], tipoDeCredencial: 'api_key', portal: 'portaldeassinaturas.example' },
  { id: 'd4sign', nome: 'D4Sign', cor: 'neutral', recursos: ['cancela', 'consultaStatus', 'reenvio', 'cofres', 'webhookAutomatico'], limiteMb: 20, formatos: ['PDF', 'DOCX'], webhook: 'automatico', ambientes: ['sandbox', 'producao'], tipoDeCredencial: 'api_key', portal: 'secure.d4sign.example' },
  { id: 'docusign', nome: 'DocuSign', cor: 'primary', recursos: ['cancela', 'consultaStatus', 'reenvio', 'configurador', 'webhookAutomatico'], limiteMb: 20, formatos: ['PDF', 'DOCX'], webhook: 'automatico', ambientes: ['demo', 'producao'], tipoDeCredencial: 'jwt', portal: 'app.docusign.example' },
  { id: 'adobesign', nome: 'Adobe Acrobat Sign', cor: 'error', recursos: ['cancela', 'consultaStatus', 'reenvio', 'links', 'webhookAutomatico'], limiteMb: 10, formatos: ['PDF', 'DOCX'], webhook: 'automatico', ambientes: ['sandbox', 'producao'], tipoDeCredencial: 'api_key', portal: 'secure.adobesign.example' },
]
export const provedorPorId = new Map(provedores.map(p => [p.id, p]))

export interface Credencial {
  id: number
  provedor: ProvedorId
  nome: string
  ambiente: 'sandbox' | 'producao' | 'demo'
  criadaEm: string
  /** D4Sign: o cofre onde os documentos ficam. */
  cofre?: string | null
}

export const credenciaisIniciais: Credencial[] = [
  { id: 59, provedor: 'clicksign', nome: 'ClickSign Jurídico', ambiente: 'producao', criadaEm: '2026-11-10T10:12:00-03:00' },
  { id: 73, provedor: 'certisign', nome: 'Certisign Contratos', ambiente: 'sandbox', criadaEm: '2026-11-18T15:11:00-03:00' },
  { id: 69, provedor: 'd4sign', nome: 'D4Sign Compras', ambiente: 'producao', criadaEm: '2026-11-04T09:40:00-03:00', cofre: 'Contratos de fornecedores' },
  { id: 70, provedor: 'd4sign', nome: 'D4Sign RH', ambiente: 'producao', criadaEm: '2026-11-12T14:05:00-03:00', cofre: null },
  { id: 58, provedor: 'docusign', nome: 'DocuSign Comercial', ambiente: 'demo', criadaEm: '2026-11-03T16:30:00-03:00' },
  { id: 65, provedor: 'adobesign', nome: 'Adobe Sign Diretoria', ambiente: 'producao', criadaEm: '2026-11-06T11:00:00-03:00' },
  { id: 66, provedor: 'adobesign', nome: 'Adobe Sign Filial Sul', ambiente: 'sandbox', criadaEm: '2026-11-14T08:20:00-03:00' },
]

/* ------------------------------------------------------------------ *
 * Fluxos de onde o envelope vem                                       *
 * ------------------------------------------------------------------ */

export const fluxos = [
  { id: 1980, nome: 'Contrato de fornecedor', etapa: 'Assinatura do contrato' },
  { id: 1978, nome: 'Admissão de colaborador', etapa: 'Assinatura da proposta' },
  { id: 1982, nome: 'Aditivo de obra', etapa: 'Coletar assinaturas' },
]
export const fluxoPorId = new Map(fluxos.map(f => [f.id, f]))

export const categoriasDoFluxo = [
  { id: 1204, nome: 'Contratos de locação' },
  { id: 1210, nome: 'Termos de confidencialidade' },
]

/* ------------------------------------------------------------------ *
 * Envelopes                                                           *
 * ------------------------------------------------------------------ */

export type StatusDoEnvelope = 'draft' | 'sending' | 'configuring' | 'pending' | 'completed' | 'rejected' | 'canceled' | 'expired' | 'error'
export type Papel = 'signer' | 'approver' | 'witness' | 'viewer' | 'configurator'
/** `queued` é PROTÓTIPO (M31): quem ainda não está na vez. O schema tem só pending e sent. */
export type StatusDoParticipante = 'pending' | 'queued' | 'sent' | 'opened' | 'signed' | 'rejected' | 'expired' | 'notSigned'
export type TipoDeEvento = 'created' | 'configuring' | 'sent' | 'opened' | 'signed' | 'rejected' | 'completed' | 'canceled' | 'expired' | 'error' | 'resent'

export interface Participante {
  id: number
  nome: string
  email: string
  papel: Papel
  ordem: number
  status: StatusDoParticipante
  em?: string
  motivo?: string
  /** PROTÓTIPO (M23): o último reenvio de e-mail. */
  ultimoReenvio?: string
  /** PROTÓTIPO (C52): link de assinatura que o pedido da Certisign já guarda. */
  link?: string
}

export interface Evento {
  tipo: TipoDeEvento
  em: string
  /** PROTÓTIPO (M20, C54): quem fez. Pessoa do workspace, o provedor ou o ENSPACE. */
  autor: { tipo: 'pessoa', id: number } | { tipo: 'provedor' } | { tipo: 'enspace' }
  participante?: number
  motivo?: string
  /** PROTÓTIPO (C43): o provedor confirmou o mesmo evento; a trilha mostra 1 linha só. */
  confirmadoPeloProvedor?: string
  /** A etapa que falhou, com nome (C53). */
  etapa?: 'envio' | 'cadastroDoSignatario' | 'cancelamento'
}

export type Origem =
  | { tipo: 'standalone' }
  | { tipo: 'workflow', fluxo: number, execucao: number }
  | { tipo: 'c-flow', categoria: number, item: string, tarefa: number }

export interface Envelope {
  id: number
  reference: string
  title: string
  description?: string
  status: StatusDoEnvelope
  /** Vazio no rascunho criado antes de conectar um provedor. */
  provider?: ProvedorId
  credential?: number
  provider_envelope_id?: string
  documento: { nome: string, tamanhoMb: number }
  assinado?: { nome: string, tamanhoMb: number }
  origem: Origem
  solicitante: number
  created_at: string
  sent_at?: string
  completed_at?: string
  canceled_at?: string
  expires_at?: string
  /** PROTÓTIPO (M13): a última notícia do provedor. */
  ultimoRetorno?: string
  participantes: Participante[]
  eventos: Evento[]
  /** O motivo da falha, já no idioma da tela (C53). Chave do dicionário. */
  erro?: 'tamanho' | 'nomeInvalido'
}

const p = (id: number, nome: string, email: string, papel: Papel, ordem: number, status: StatusDoParticipante, extra: Partial<Participante> = {}): Participante =>
  ({ id, nome, email, papel, ordem, status, ...extra })

const pessoa = (id: number) => ({ tipo: 'pessoa' as const, id })
const PROVEDOR = { tipo: 'provedor' as const }
const ENSPACE = { tipo: 'enspace' as const }

/** Os envelopes que os atalhos do protótipo abrem. Os ids batem com os do documento de testes, para facilitar a conferência. */
export const ENVELOPE = {
  certisignFluxoCancelado: 116,
  certisignAvulsoParado: 117,
  certisignCategoria: 115,
  adobeEmOrdem: 64,
  d4signCategoria: 41,
  d4signCancelado: 120,
  adobeConcluido: 31,
  d4signErro: 57,
  docusignRascunho: 50,
  docusignAssinado: 121,
  docusignRecusado: 122,
  docusignExpirado: 123,
} as const

export const envelopesIniciais: Envelope[] = [
  {
    id: 116, reference: 'DuYfLGqrqEoz49vBwHWs', title: 'Contrato de fornecimento Aço Forte Ltda', status: 'canceled', provider: 'certisign', credential: 73,
    provider_envelope_id: '1051480', documento: { nome: 'contrato-aco-forte.pdf', tamanhoMb: 1.2 },
    origem: { tipo: 'workflow', fluxo: 1980, execucao: 25035 }, solicitante: 12,
    created_at: '2026-11-18T16:16:35-03:00', sent_at: '2026-11-18T16:16:38-03:00', canceled_at: '2026-11-18T16:46:59-03:00',
    participantes: [p(1, 'Rafael Moura', 'rafael.moura@acoforte.example', 'signer', 1, 'notSigned')],
    eventos: [
      { tipo: 'created', em: '2026-11-18T16:16:35-03:00', autor: ENSPACE },
      { tipo: 'sent', em: '2026-11-18T16:16:38-03:00', autor: ENSPACE },
      { tipo: 'canceled', em: '2026-11-18T16:46:59-03:00', autor: pessoa(11), motivo: 'Fornecedor pediu revisão da cláusula de multa.' },
    ],
  },
  {
    id: 117, reference: 'Lm7QpZr2VxTaa0PcKd3e', title: 'Termo de confidencialidade Prisma Consultoria', status: 'pending', provider: 'certisign', credential: 73,
    provider_envelope_id: '1051493', documento: { nome: 'nda-prisma.pdf', tamanhoMb: 0.4 },
    origem: { tipo: 'standalone' }, solicitante: 11,
    created_at: '2026-11-15T09:20:00-03:00', sent_at: '2026-11-15T09:21:00-03:00', ultimoRetorno: '2026-11-15T09:21:00-03:00',
    participantes: [p(1, 'Helena Prado', 'helena.prado@prisma.example', 'signer', 1, 'sent', { link: 'https://portaldeassinaturas.example/assinar/8f2c' })],
    eventos: [
      { tipo: 'created', em: '2026-11-15T09:20:00-03:00', autor: pessoa(11) },
      { tipo: 'sent', em: '2026-11-15T09:21:00-03:00', autor: pessoa(11) },
    ],
  },
  {
    id: 115, reference: 'Qw81NnHt5RkLbZc0aYe2', title: 'Locação sala 304 Edifício Atlântico', status: 'pending', provider: 'certisign', credential: 73,
    provider_envelope_id: '1051477', documento: { nome: 'locacao-sala-304.pdf', tamanhoMb: 0.9 },
    origem: { tipo: 'c-flow', categoria: 1204, item: 'LOC-0187', tarefa: 277702 }, solicitante: 13,
    created_at: '2026-11-18T16:15:10-03:00', sent_at: '2026-11-18T16:15:14-03:00', ultimoRetorno: '2026-11-18T16:15:14-03:00',
    participantes: [
      p(1, 'Marcos Valente', 'marcos.valente@atlantico.example', 'signer', 1, 'sent', { link: 'https://portaldeassinaturas.example/assinar/1a77' }),
      p(2, 'Juliana Costa', 'juliana.costa@vertice.example', 'approver', 1, 'sent', { link: 'https://portaldeassinaturas.example/aprovar/1a78' }),
    ],
    eventos: [
      { tipo: 'created', em: '2026-11-18T16:15:10-03:00', autor: pessoa(13) },
      { tipo: 'sent', em: '2026-11-18T16:15:14-03:00', autor: ENSPACE },
    ],
  },
  {
    id: 64, reference: 'Tg5Hx0PqWm2Rz8LcVn4b', title: 'Aditivo 2 da obra Residencial Ipê', status: 'pending', provider: 'adobesign', credential: 65,
    provider_envelope_id: 'CBJCHBCAABAA66sM8qmR', documento: { nome: 'aditivo-2-ipe.pdf', tamanhoMb: 2.6 },
    origem: { tipo: 'workflow', fluxo: 1982, execucao: 25059 }, solicitante: 12,
    created_at: '2026-11-18T18:40:00-03:00', sent_at: '2026-11-18T18:40:05-03:00', expires_at: '2026-11-25T18:00:00-03:00', ultimoRetorno: '2026-11-18T18:52:00-03:00',
    participantes: [
      p(1, 'Otávio Lins', 'otavio.lins@ipe.example', 'signer', 1, 'opened', { em: '2026-11-18T18:52:00-03:00' }),
      p(2, 'Beatriz Fontes', 'beatriz.fontes@vertice.example', 'signer', 2, 'queued'),
    ],
    eventos: [
      { tipo: 'created', em: '2026-11-18T18:40:00-03:00', autor: ENSPACE },
      { tipo: 'sent', em: '2026-11-18T18:40:05-03:00', autor: ENSPACE, participante: 1 },
      { tipo: 'opened', em: '2026-11-18T18:52:00-03:00', autor: PROVEDOR, participante: 1 },
    ],
  },
  {
    id: 41, reference: 'Fc2Kd8NwQy7Lp3ZtRm1s', title: 'Locação galpão 7 Polo Industrial', status: 'pending', provider: 'd4sign', credential: 69,
    provider_envelope_id: '9b1e-44c2', documento: { nome: 'locacao-galpao-7.pdf', tamanhoMb: 1.8 },
    origem: { tipo: 'c-flow', categoria: 1204, item: 'LOC-0179', tarefa: 277691 }, solicitante: 13,
    created_at: '2026-11-18T13:02:00-03:00', sent_at: '2026-11-18T13:02:06-03:00', ultimoRetorno: '2026-11-18T13:02:06-03:00',
    participantes: [p(1, 'Sérgio Amaral', 'sergio.amaral@polo.example', 'signer', 1, 'sent')],
    eventos: [
      { tipo: 'created', em: '2026-11-18T13:02:00-03:00', autor: pessoa(13) },
      { tipo: 'sent', em: '2026-11-18T13:02:06-03:00', autor: ENSPACE },
    ],
  },
  {
    id: 120, reference: 'Kp4Vn7Bq2Wx9Ty1Hr6Lm', title: 'Distrato Transportes Rota Sul', status: 'canceled', provider: 'd4sign', credential: 69,
    provider_envelope_id: '7c3a-11f0', documento: { nome: 'distrato-rota-sul.pdf', tamanhoMb: 0.6 },
    origem: { tipo: 'standalone' }, solicitante: 11,
    created_at: '2026-11-18T17:12:00-03:00', sent_at: '2026-11-18T17:12:04-03:00', canceled_at: '2026-11-18T17:12:40-03:00',
    participantes: [
      p(1, 'Lúcia Barros', 'lucia.barros@rotasul.example', 'signer', 1, 'notSigned'),
      p(2, 'Ana Ribeiro', 'ana.ribeiro@vertice.example', 'witness', 1, 'notSigned'),
    ],
    eventos: [
      { tipo: 'created', em: '2026-11-18T17:12:00-03:00', autor: pessoa(11) },
      { tipo: 'sent', em: '2026-11-18T17:12:04-03:00', autor: pessoa(11) },
      { tipo: 'canceled', em: '2026-11-18T17:12:40-03:00', autor: pessoa(11), motivo: 'Valor do distrato errado na cláusula 3.', confirmadoPeloProvedor: '2026-11-18T17:12:39-03:00' },
    ],
  },
  {
    id: 31, reference: 'Ab9Lk3Mn5Pq7Rs1Tu2Vw', title: 'Locação loja 12 Shopping Norte', status: 'completed', provider: 'adobesign', credential: 65,
    provider_envelope_id: 'CBJCHBCAABAA77pQ2wEr', documento: { nome: 'locacao-loja-12.pdf', tamanhoMb: 1.1 }, assinado: { nome: 'locacao-loja-12-assinado.pdf', tamanhoMb: 1.3 },
    origem: { tipo: 'c-flow', categoria: 1204, item: 'LOC-0172', tarefa: 277650 }, solicitante: 13,
    created_at: '2026-11-18T12:30:00-03:00', sent_at: '2026-11-18T12:30:05-03:00', completed_at: '2026-11-18T12:38:12-03:00',
    participantes: [p(1, 'Fernanda Rocha', 'fernanda.rocha@norte.example', 'signer', 1, 'signed', { em: '2026-11-18T12:38:05-03:00' })],
    eventos: [
      { tipo: 'created', em: '2026-11-18T12:30:00-03:00', autor: pessoa(13) },
      { tipo: 'sent', em: '2026-11-18T12:30:05-03:00', autor: ENSPACE },
      { tipo: 'signed', em: '2026-11-18T12:38:05-03:00', autor: PROVEDOR, participante: 1 },
      { tipo: 'completed', em: '2026-11-18T12:38:12-03:00', autor: PROVEDOR },
    ],
  },
  {
    id: 57, reference: 'Zx1Cv2Bn3Mm4Ll5Kk6Jj', title: 'Proposta de admissão Diego Nunes', status: 'error', provider: 'd4sign', credential: 69,
    documento: { nome: 'proposta-diego-nunes.pdf', tamanhoMb: 21 },
    origem: { tipo: 'workflow', fluxo: 1978, execucao: 24972 }, solicitante: 12, erro: 'tamanho',
    created_at: '2026-11-18T15:05:00-03:00',
    participantes: [p(1, 'Diego Nunes', 'diego.nunes@email.example', 'signer', 1, 'pending')],
    eventos: [
      { tipo: 'created', em: '2026-11-18T15:05:00-03:00', autor: ENSPACE },
      { tipo: 'error', em: '2026-11-18T15:05:03-03:00', autor: PROVEDOR, etapa: 'envio' },
    ],
  },
  {
    id: 50, reference: 'Rt6Yu7Ii8Oo9Pp0Aa1Ss', title: 'Contrato de prestação Studio Linha', status: 'draft', provider: 'docusign', credential: 58,
    documento: { nome: 'contrato-studio-linha.pdf', tamanhoMb: 0.8 },
    origem: { tipo: 'standalone' }, solicitante: 11,
    created_at: '2026-11-18T19:02:00-03:00',
    participantes: [p(1, 'Gustavo Lemos', 'gustavo.lemos@studiolinha.example', 'signer', 1, 'pending')],
    eventos: [{ tipo: 'created', em: '2026-11-18T19:02:00-03:00', autor: pessoa(11) }],
  },
  /* Os 3 desfechos do nó no Spaceflow que não têm envelope acima: assinado, recusado e expirado. Mesmo fluxo, 3 execuções. */
  {
    id: 121, reference: 'Hs3Jd5Kf7Lg9Mh1Nj2Pk', title: 'Contrato de fornecimento Madeiras Serra Alta', status: 'completed', provider: 'docusign', credential: 58,
    provider_envelope_id: 'a1f3-77d2-90cc', documento: { nome: 'contrato-serra-alta.pdf', tamanhoMb: 1.4 }, assinado: { nome: 'contrato-serra-alta-assinado.pdf', tamanhoMb: 1.6 },
    origem: { tipo: 'workflow', fluxo: 1980, execucao: 25041 }, solicitante: 12,
    created_at: '2026-11-18T10:05:00-03:00', sent_at: '2026-11-18T10:05:04-03:00', completed_at: '2026-11-18T11:42:10-03:00',
    participantes: [p(1, 'Rogério Alves', 'rogerio.alves@serraalta.example', 'signer', 1, 'signed', { em: '2026-11-18T11:42:02-03:00' })],
    eventos: [
      { tipo: 'created', em: '2026-11-18T10:05:00-03:00', autor: ENSPACE },
      { tipo: 'sent', em: '2026-11-18T10:05:04-03:00', autor: ENSPACE },
      { tipo: 'signed', em: '2026-11-18T11:42:02-03:00', autor: PROVEDOR, participante: 1 },
      { tipo: 'completed', em: '2026-11-18T11:42:10-03:00', autor: PROVEDOR },
    ],
  },
  {
    id: 122, reference: 'Wq2Er4Ty6Ui8Op0As2Df', title: 'Contrato de fornecimento Tintas Litoral', status: 'rejected', provider: 'docusign', credential: 58,
    provider_envelope_id: 'b7c1-02e4-11aa', documento: { nome: 'contrato-tintas-litoral.pdf', tamanhoMb: 0.9 },
    origem: { tipo: 'workflow', fluxo: 1980, execucao: 25044 }, solicitante: 12,
    created_at: '2026-11-18T13:20:00-03:00', sent_at: '2026-11-18T13:20:05-03:00',
    participantes: [p(1, 'Patrícia Gomes', 'patricia.gomes@litoral.example', 'signer', 1, 'rejected', { em: '2026-11-18T14:02:00-03:00', motivo: 'O prazo de entrega não é o combinado.' })],
    eventos: [
      { tipo: 'created', em: '2026-11-18T13:20:00-03:00', autor: ENSPACE },
      { tipo: 'sent', em: '2026-11-18T13:20:05-03:00', autor: ENSPACE },
      { tipo: 'rejected', em: '2026-11-18T14:02:00-03:00', autor: PROVEDOR, participante: 1, motivo: 'O prazo de entrega não é o combinado.' },
    ],
  },
  {
    id: 123, reference: 'Gh5Jk7Lz9Xc1Vb3Nm5Qw', title: 'Contrato de fornecimento Vidraçaria Central', status: 'expired', provider: 'docusign', credential: 58,
    provider_envelope_id: 'c9d2-44f1-73bb', documento: { nome: 'contrato-vidracaria.pdf', tamanhoMb: 0.7 },
    origem: { tipo: 'workflow', fluxo: 1980, execucao: 24990 }, solicitante: 12,
    created_at: '2026-11-11T09:00:00-03:00', sent_at: '2026-11-11T09:00:04-03:00', expires_at: '2026-11-18T09:00:00-03:00',
    participantes: [p(1, 'Eduardo Pires', 'eduardo.pires@vidracaria.example', 'signer', 1, 'expired')],
    eventos: [
      { tipo: 'created', em: '2026-11-11T09:00:00-03:00', autor: ENSPACE },
      { tipo: 'sent', em: '2026-11-11T09:00:04-03:00', autor: ENSPACE },
      { tipo: 'expired', em: '2026-11-18T09:00:00-03:00', autor: PROVEDOR },
    ],
  },
  ...gerarVolume(),
]

/** Volume para a lista paginar e os filtros fazerem sentido: 28 envelopes a mais, com estados e provedores variados. */
function gerarVolume(): Envelope[] {
  const titulos = [
    'Contrato de manutenção Elevadores Alfa', 'Termo de entrega de chaves apto 1102', 'Proposta comercial Grupo Laguna', 'Aditivo de prazo obra Vila Verde',
    'Contrato de experiência Paula Seixas', 'Acordo de confidencialidade Nexo Dados', 'Ordem de compra 4471 Cimentos Unidos', 'Termo de vistoria loja 8',
    'Contrato de locação de equipamentos', 'Procuração para registro de imóvel', 'Contrato de parceria Arquitetura Plana', 'Termo aditivo 3 Residencial Ipê',
    'Recibo de sinal apto 704', 'Contrato de consultoria ambiental', 'Política interna de compras 2027', 'Termo de rescisão Marcelo Duarte',
    'Contrato de fornecimento de areia e brita', 'Distrato loja 3 Shopping Norte', 'Proposta de admissão Renata Alves', 'Contrato de seguro garantia',
    'Acordo de nível de serviço TI', 'Contrato de subempreitada elétrica', 'Termo de uso do canteiro', 'Contrato de locação sala 210',
    'Autorização de uso de imagem', 'Ordem de serviço 982 pintura', 'Contrato de compra e venda terreno lote 14', 'Termo de compromisso estágio',
  ]
  const status: StatusDoEnvelope[] = ['completed', 'pending', 'completed', 'pending', 'completed', 'canceled', 'completed', 'expired', 'pending', 'completed', 'rejected', 'completed', 'pending', 'completed']
  const provs: ProvedorId[] = ['docusign', 'adobesign', 'clicksign', 'd4sign', 'adobesign', 'docusign', 'clicksign']
  const cred: Record<ProvedorId, number> = { clicksign: 59, certisign: 73, d4sign: 69, docusign: 58, adobesign: 65 }
  const nomes = ['Paulo Henrique Andrade', 'Mariana Teles', 'Roberto Castilho', 'Isabela Freitas', 'Tiago Monteiro', 'Camila Duarte Albuquerque', 'Vítor Sampaio']
  return titulos.map((title, i) => {
    const id = 200 + i
    const st = status[i % status.length]!
    const prov = provs[i % provs.length]!
    const dia = String(17 - Math.floor(i / 3)).padStart(2, '0')
    const criado = `2026-11-${dia}T${String(8 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00-03:00`
    const enviado = criado.replace(/:00-03:00$/, ':05-03:00')
    const fim = criado.replace(/T(\d\d)/, (_, h) => `T${String(Math.min(Number(h) + 2, 23)).padStart(2, '0')}`)
    const assinados = st === 'completed' ? 2 : st === 'pending' ? i % 2 : 0
    const origem: Origem = i % 4 === 0 ? { tipo: 'workflow', fluxo: fluxos[i % 3]!.id, execucao: 24800 + i } : i % 4 === 1 ? { tipo: 'c-flow', categoria: 1210, item: `NDA-0${100 + i}`, tarefa: 277500 + i } : { tipo: 'standalone' }
    return {
      id, reference: `Vol${id}Xk${(i * 37) % 97}Qp${i}Lm`, title, status: st, provider: prov, credential: cred[prov],
      provider_envelope_id: st === 'draft' ? undefined : `PX-${id}`, documento: { nome: `${title.toLowerCase().replace(/\s+/g, '-').slice(0, 28)}.pdf`, tamanhoMb: 0.5 + (i % 5) * 0.4 },
      assinado: st === 'completed' ? { nome: 'assinado.pdf', tamanhoMb: 1 } : undefined,
      origem, solicitante: pessoas[i % 3]!.id, created_at: criado, sent_at: enviado,
      completed_at: st === 'completed' ? fim : undefined, canceled_at: st === 'canceled' ? fim : undefined,
      expires_at: st === 'expired' ? fim : undefined,
      ultimoRetorno: st === 'pending' ? (i === 3 ? '2026-11-14T10:00:00-03:00' : '2026-11-18T17:40:00-03:00') : undefined,
      participantes: [
        p(1, nomes[i % nomes.length]!, `pessoa${i}@cliente.example`, 'signer', 1, assinados >= 1 ? 'signed' : st === 'rejected' ? 'rejected' : st === 'pending' ? 'sent' : 'notSigned'),
        p(2, nomes[(i + 3) % nomes.length]!, `pessoa${i + 40}@vertice.example`, i % 3 === 0 ? 'witness' : 'signer', i % 2 ? 2 : 1, assinados >= 2 ? 'signed' : st === 'pending' && i % 2 ? 'queued' : st === 'pending' ? 'sent' : 'notSigned'),
      ],
      eventos: [{ tipo: 'created', em: criado, autor: ENSPACE }, { tipo: 'sent', em: enviado, autor: ENSPACE }],
    }
  })
}

/* ------------------------------------------------------------------ *
 * A tarefa Integração do fluxo da categoria                           *
 * ------------------------------------------------------------------ */

export const tarefaIntegracao = {
  id: 277691,
  item: 'LOC-0179',
  envelope: 41,
  criadaEm: '2026-11-18T12:56:43-03:00',
  vencimento: '2026-11-29T12:56:43-03:00',
}
