/**
 * O dado do protótipo. Fictício, tipado pelo enspace-sdk-schemas, sem API.
 *
 * Estrutura tirada do develop em 08/10/2026:
 * - o item é o `Item` do schema; os valores dos campos moram em `item.data`;
 * - o campo Editor de Documentos é do tipo `EnOnlyoffice` e guarda um arquivo,
 *   com a forma do `UploadFile` (name, ext, mime, size, url, hash, provider).
 *
 * O que o schema NÃO tem e o protótipo precisou inventar está marcado com
 * "INVENTADO" e diz de onde viria:
 * - `versoes`: o develop mostra "Versão 1, Versão 2" num select; aqui cada
 *   versão ganha autor, data e origem, que é a proposta;
 * - `sessao`: quem está com o documento aberto, e em qual editor. É o que o
 *   ENSPACE precisaria guardar para avisar "aberto no Word por Bruno".
 *
 * Empresas e pessoas são inventadas. Nenhum dado de cliente.
 */
import type { Item, UploadFile } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------- pessoas -------------------------------- */

export interface Pessoa {
  id: number
  nome: string
  iniciais: string
}

export const pessoas: Pessoa[] = [
  { id: 1, nome: 'Carla Menezes', iniciais: 'CM' },
  { id: 2, nome: 'Ana Souza', iniciais: 'AS' },
  { id: 3, nome: 'Bruno Lima', iniciais: 'BL' },
  { id: 4, nome: 'Diego Ramos', iniciais: 'DR' },
  { id: 5, nome: 'Fernanda Alves Vasconcellos de Albuquerque', iniciais: 'FA' },
]

/** Quem está usando o protótipo. */
export const EU = pessoas[0]!

export function pessoa(id: number): Pessoa {
  return pessoas.find(p => p.id === id) ?? EU
}

/* ------------------------------ o workspace ----------------------------- */

export const workspace = { nome: 'Jurídico Aurora', slug: 'juridico-aurora' }

export const categoria = {
  nome: 'Contratos',
  slug: 'contratos',
  formularios: ['Novo contrato', 'Aditivo'],
}

/** O campo Editor de Documentos desta categoria. */
export const campoDoDocumento = {
  refId: 'minuta_do_contrato',
  rotulo: 'Minuta do contrato',
  type: 'EnOnlyoffice' as const,
}

/* ----------------------------- os editores ------------------------------ */

/** Onde o documento abre. `word-web` e `word-desktop` passam pelo suplemento. */
export type Editor = 'onlyoffice' | 'word-desktop' | 'word-web'

/* ------------------------------ as versões ------------------------------ */

/** De onde a versão veio. INVENTADO: o develop não registra a origem. */
export type OrigemDaVersao = 'modelo' | 'branco' | 'envio' | 'onlyoffice' | 'word' | 'restauracao'

export interface Versao {
  numero: number
  autor: number
  em: Date
  origem: OrigemDaVersao
  /** Para restauração: de qual versão veio. */
  deVersao?: number
}

/**
 * O valor do campo. A base é o `UploadFile` do schema; `versoes` e `sessao`
 * são INVENTADOS (ver o comentário do topo).
 */
export interface DocumentoDoCampo extends UploadFile {
  versoes: Versao[]
  /** Quem está com o documento aberto agora. Sem sessão, ninguém. */
  sessao?: { editor: Editor, pessoa: number, desde: Date }
}

/* ------------------------------- os itens ------------------------------- */

export type StatusDoContrato = 'rascunho' | 'em-revisao' | 'aguardando-assinatura' | 'assinado'

export interface DadosDoContrato {
  status: StatusDoContrato
  contratante: string
  objeto: string
  valor: number
  vigencia_meses: number
  responsavel: number
  minuta_do_contrato: DocumentoDoCampo | null
}

const agora = Date.now()
const MIN = 60_000
const HORA = 60 * MIN
const DIA = 24 * HORA

function ha(ms: number) {
  return new Date(agora - ms)
}

let proximoArquivo = 900

function arquivo(nome: string, ext: '.docx' | '.pdf', size: number, versoes: Versao[], sessao?: DocumentoDoCampo['sessao']): DocumentoDoCampo {
  proximoArquivo += 1
  const ultima = versoes[versoes.length - 1]!
  return {
    id: proximoArquivo,
    created_at: versoes[0]!.em,
    updated_at: ultima.em,
    name: nome,
    hash: `minuta_${proximoArquivo}`,
    ext,
    mime: ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size,
    url: '#',
    provider: 'local',
    user: ultima.autor,
    versoes,
    sessao,
  }
}

function item(id: number, reference: string, dados: DadosDoContrato, criado: Date): Item & { data: DadosDoContrato } {
  return {
    id,
    reference,
    created_at: criado,
    updated_at: dados.minuta_do_contrato?.updated_at ?? criado,
    deleted_at: null,
    data: dados,
    stage_status: null,
    status: 'active',
    form: 1,
  }
}

export type ItemDoContrato = ReturnType<typeof item>

export const itens: ItemDoContrato[] = [
  item(142, 'CTR-0142', {
    status: 'em-revisao',
    contratante: 'Aurora Logística Ltda.',
    objeto: 'Consultoria em roteirização de frota',
    valor: 184500,
    vigencia_meses: 12,
    responsavel: 2,
    minuta_do_contrato: arquivo('Minuta Aurora Logística.docx', '.docx', 48_200, [
      { numero: 1, autor: 1, em: ha(6 * DIA), origem: 'modelo' },
      { numero: 2, autor: 2, em: ha(5 * DIA + 3 * HORA), origem: 'onlyoffice' },
      { numero: 3, autor: 4, em: ha(2 * DIA), origem: 'word' },
      { numero: 4, autor: 2, em: ha(2 * HORA), origem: 'onlyoffice' },
    ]),
  }, ha(6 * DIA)),
  item(141, 'CTR-0141', {
    status: 'rascunho',
    contratante: 'Vale Verde Alimentos S.A.',
    objeto: 'Fornecimento de embalagens recicláveis',
    valor: 62000,
    vigencia_meses: 24,
    responsavel: 1,
    minuta_do_contrato: null,
  }, ha(3 * HORA)),
  item(139, 'CTR-0139', {
    status: 'em-revisao',
    contratante: 'Ponto Norte Engenharia',
    objeto: 'Manutenção predial preventiva',
    valor: 97300,
    vigencia_meses: 12,
    responsavel: 3,
    minuta_do_contrato: arquivo('Contrato de manutenção Ponto Norte.docx', '.docx', 71_900, [
      { numero: 1, autor: 3, em: ha(9 * DIA), origem: 'envio' },
      { numero: 2, autor: 3, em: ha(1 * DIA), origem: 'word' },
    ], { editor: 'word-desktop', pessoa: 3, desde: ha(40 * MIN) }),
  }, ha(9 * DIA)),
  item(137, 'CTR-0137', {
    status: 'assinado',
    contratante: 'Casa Brava Móveis',
    objeto: 'Locação de galpão em Contagem',
    valor: 240000,
    vigencia_meses: 36,
    responsavel: 4,
    minuta_do_contrato: arquivo('Contrato assinado Casa Brava.pdf', '.pdf', 312_400, [
      { numero: 1, autor: 4, em: ha(21 * DIA), origem: 'envio' },
    ]),
  }, ha(30 * DIA)),
  item(135, 'CTR-0135', {
    status: 'em-revisao',
    contratante: 'Grupo Sereno de Hotelaria',
    objeto: 'Licenciamento de software de reservas',
    valor: 58900,
    vigencia_meses: 12,
    responsavel: 2,
    minuta_do_contrato: arquivo('Licenciamento Grupo Sereno.docx', '.docx', 39_800, [
      { numero: 1, autor: 2, em: ha(4 * DIA), origem: 'modelo' },
      { numero: 2, autor: 2, em: ha(1 * DIA), origem: 'onlyoffice' },
    ], { editor: 'onlyoffice', pessoa: 2, desde: ha(8 * MIN) }),
  }, ha(4 * DIA)),
  item(133, 'CTR-0133', {
    status: 'aguardando-assinatura',
    contratante: 'Cooperativa Agrícola Serra Alta do Sul de Minas Gerais',
    objeto: 'Assessoria contábil e fiscal',
    valor: 36000,
    vigencia_meses: 12,
    responsavel: 5,
    minuta_do_contrato: arquivo('Assessoria contábil Serra Alta, versão final revisada pelo jurídico e pela diretoria.docx', '.docx', 55_100, [
      { numero: 1, autor: 5, em: ha(15 * DIA), origem: 'modelo' },
      { numero: 2, autor: 2, em: ha(12 * DIA), origem: 'onlyoffice' },
      { numero: 3, autor: 5, em: ha(11 * DIA), origem: 'word' },
      { numero: 4, autor: 3, em: ha(10 * DIA), origem: 'word' },
      { numero: 5, autor: 2, em: ha(9 * DIA), origem: 'onlyoffice' },
      { numero: 6, autor: 5, em: ha(8 * DIA), origem: 'restauracao', deVersao: 4 },
      { numero: 7, autor: 4, em: ha(7 * DIA), origem: 'onlyoffice' },
    ]),
  }, ha(15 * DIA)),
  item(131, 'CTR-0131', {
    status: 'rascunho',
    contratante: 'Lume Energia Solar',
    objeto: 'Instalação de usinas em telhado',
    valor: 412000,
    vigencia_meses: 18,
    responsavel: 3,
    minuta_do_contrato: null,
  }, ha(1 * DIA)),
  item(128, 'CTR-0128', {
    status: 'assinado',
    contratante: 'Maré Alta Pescados',
    objeto: 'Transporte refrigerado',
    valor: 128700,
    vigencia_meses: 12,
    responsavel: 4,
    minuta_do_contrato: arquivo('Transporte refrigerado Maré Alta.docx', '.docx', 44_300, [
      { numero: 1, autor: 4, em: ha(40 * DIA), origem: 'modelo' },
      { numero: 2, autor: 1, em: ha(38 * DIA), origem: 'word' },
    ]),
  }, ha(40 * DIA)),
  item(126, 'CTR-0126', {
    status: 'em-revisao',
    contratante: 'Instituto Raiz de Educação',
    objeto: 'Plataforma de ensino a distância',
    valor: 75400,
    vigencia_meses: 24,
    responsavel: 1,
    minuta_do_contrato: arquivo('Minuta Instituto Raiz.docx', '.docx', 41_000, [
      { numero: 1, autor: 1, em: ha(3 * DIA), origem: 'branco' },
      { numero: 2, autor: 1, em: ha(2 * DIA + 4 * HORA), origem: 'onlyoffice' },
    ]),
  }, ha(3 * DIA)),
]

/* ------------------------------- modelos -------------------------------- */

/**
 * Os templates de documento da categoria (Configurações › Categorias ›
 * Templates de Documento). O develop de exploração não tinha nenhum; estes
 * são inventados, com as variáveis no formato real `{{data.<refId>}}`.
 */
export interface ModeloDeDocumento {
  id: number
  nome: string
  variaveis: (keyof DadosDoContrato)[]
  atualizado: Date
}

export const modelos: ModeloDeDocumento[] = [
  { id: 11, nome: 'Contrato de prestação de serviços', variaveis: ['contratante', 'objeto', 'valor', 'vigencia_meses'], atualizado: ha(20 * DIA) },
  { id: 12, nome: 'Contrato de fornecimento', variaveis: ['contratante', 'objeto', 'valor'], atualizado: ha(45 * DIA) },
  { id: 13, nome: 'Acordo de confidencialidade (NDA)', variaveis: ['contratante'], atualizado: ha(90 * DIA) },
  { id: 14, nome: 'Termo aditivo de prazo', variaveis: ['contratante', 'vigencia_meses'], atualizado: ha(12 * DIA) },
]

/* ------------------------- o texto do documento ------------------------- */

/**
 * O corpo da minuta, montado com os dados do item. Serve para a miniatura
 * do cartão, para a área do editor e para a janela do Word. Texto fictício.
 */
export function corpoDaMinuta(d: DadosDoContrato, idioma: string): { titulo: string, paragrafos: string[] } {
  const doc = d.minuta_do_contrato
  if (doc && doc.versoes.length === 1 && doc.versoes[0]!.origem === 'branco') return { titulo: '', paragrafos: [''] }
  const valor = new Intl.NumberFormat(idioma, { style: 'currency', currency: 'BRL' }).format(d.valor)
  return {
    titulo: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS',
    paragrafos: [
      `CONTRATANTE: ${d.contratante}, pessoa jurídica de direito privado, doravante denominada CONTRATANTE.`,
      'CONTRATADA: Jurídico Aurora Serviços Empresariais Ltda., doravante denominada CONTRATADA.',
      `CLÁUSULA 1. OBJETO. O presente contrato tem por objeto: ${d.objeto.toLowerCase()}.`,
      `CLÁUSULA 2. PREÇO. Pelos serviços, a CONTRATANTE pagará o valor total de ${valor}, em parcelas mensais iguais.`,
      `CLÁUSULA 3. VIGÊNCIA. Este contrato vigora por ${d.vigencia_meses} meses a partir da assinatura, renovável por igual período mediante termo aditivo.`,
      'CLÁUSULA 4. CONFIDENCIALIDADE. As partes manterão sigilo sobre as informações trocadas durante a execução deste contrato.',
      'CLÁUSULA 5. FORO. Fica eleito o foro da comarca de Belo Horizonte para dirimir questões oriundas deste contrato.',
    ],
  }
}
