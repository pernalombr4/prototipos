// Estado da tela — só memória, como manda a regra 4. Recarregar zera tudo.
//
// Este arquivo existe para responder à S3-F1 (alteração perdida em silêncio ao
// trocar de aba): o formulário vive FORA do componente da aba, e a pendência é
// derivada de um diff contra o último estado salvo. Trocar de aba não desmonta
// nada, e a barra de rodapé sabe sozinha se há o que gravar.

import { computed, reactive, ref } from 'vue'
import {
  comportamento as comportamentoBase,
  modulos as modulosBase,
  identidade as identidadeBase,
  padroes as padroesBase,
  diasUteisPadrao,
  feriadosImportados,
  ocorrencias as ocorrenciasBase,
  regrasSpaceflow,
  regrasAgendadas,
  chavesDeTraducao,
  type Feriado,
  type Ocorrencia,
  type RegraDeAviso,
} from './mocks'

export type Aba = 'basicas' | 'calendario' | 'notificacoes' | 'dicionarios' | 'cobranca'

export const abas: { chave: Aba, rotulo: string, resumo: string, icone: string }[] = [
  {
    chave: 'basicas',
    rotulo: 'Informações Básicas',
    resumo: 'Identidade, padrões, comportamento da interface, módulos e exclusão do workspace.',
    icone: 'i-lucide-id-card',
  },
  {
    chave: 'calendario',
    rotulo: 'Calendário',
    resumo: 'Quais dias contam como úteis: é daqui que saem os prazos e o SLA das tarefas.',
    icone: 'i-lucide-calendar-days',
  },
  {
    chave: 'notificacoes',
    rotulo: 'Notificações',
    resumo: 'Quando o ENSPACE avisa por e-mail sobre tarefa com prazo.',
    icone: 'i-lucide-bell',
  },
  {
    chave: 'dicionarios',
    rotulo: 'Dicionários',
    resumo: 'Tradução dos textos que você criou: categorias, campos e formulários.',
    icone: 'i-lucide-languages',
  },
  {
    chave: 'cobranca',
    rotulo: 'Cobrança',
    resumo: 'Sua carteira de en-credits neste workspace, o consumo e os pedidos de recarga.',
    icone: 'i-lucide-wallet',
  },
]

function clonar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T
}

export const form = reactive({
  identidade: clonar(identidadeBase),
  padroes: clonar(padroesBase),
  comportamento: Object.fromEntries(comportamentoBase.map(a => [a.chave, a.valor])) as Record<string, boolean>,
  modulos: Object.fromEntries(modulosBase.map(a => [a.chave, a.valor])) as Record<string, boolean>,
  calendario: {
    diasUteis: [...diasUteisPadrao],
    ocorrenciasHabilitadas: true,
    feriados: clonar(feriadosImportados) as Feriado[],
    ocorrencias: clonar(ocorrenciasBase) as Ocorrencia[],
  },
  notificacoes: {
    spaceflowPersonalizado: true,
    agendadasPersonalizado: true,
    regrasSpaceflow: clonar(regrasSpaceflow) as RegraDeAviso[],
    regrasAgendadas: clonar(regrasAgendadas) as RegraDeAviso[],
  },
  dicionarios: {
    idioma: 'en',
    traducoes: Object.fromEntries(chavesDeTraducao.map(c => [c.id, c.traducao])) as Record<string, string>,
  },
})

/** Qual fatia do formulário pertence a cada aba. Cobrança não edita nada. */
const fatia: Record<Exclude<Aba, 'cobranca'>, () => unknown> = {
  basicas: () => ({ i: form.identidade, p: form.padroes, c: form.comportamento, m: form.modulos }),
  calendario: () => form.calendario,
  notificacoes: () => form.notificacoes,
  dicionarios: () => form.dicionarios.traducoes,
}

function instantaneo(aba: Exclude<Aba, 'cobranca'>) {
  return JSON.stringify(fatia[aba]())
}

const salvo = reactive<Record<string, string>>({
  basicas: instantaneo('basicas'),
  calendario: instantaneo('calendario'),
  notificacoes: instantaneo('notificacoes'),
  dicionarios: instantaneo('dicionarios'),
})

export function pendente(aba: Aba) {
  if (aba === 'cobranca') return false
  return instantaneo(aba) !== salvo[aba]
}

export const abasPendentes = computed(() =>
  (['basicas', 'calendario', 'notificacoes', 'dicionarios'] as const).filter(a => pendente(a)),
)

export function marcarSalvo(aba: Aba) {
  if (aba === 'cobranca') return
  salvo[aba] = instantaneo(aba)
}

export function descartar(aba: Aba) {
  if (aba === 'cobranca') return
  const anterior = JSON.parse(salvo[aba]!)
  if (aba === 'basicas') {
    Object.assign(form.identidade, anterior.i)
    Object.assign(form.padroes, anterior.p)
    Object.assign(form.comportamento, anterior.c)
    Object.assign(form.modulos, anterior.m)
  }
  else if (aba === 'dicionarios') {
    Object.assign(form.dicionarios.traducoes, anterior)
  }
  else {
    Object.assign(form[aba], anterior)
  }
}

/* ------------------------------------------------------------------ *
 * Busca de configuração — atravessa as cinco abas.
 * É a resposta ao "não consigo me encontrar": em vez de adivinhar a aba,
 * digita-se o nome da coisa. O padrão vem do Notion (PESQUISA.md §1):
 * a busca leva à seção certa e a destaca por um instante.
 * ------------------------------------------------------------------ */

export interface ItemDeBusca {
  aba: Aba
  secao: string
  rotulo: string
  /** Como as pessoas chamam a coisa quando não sabem o nome dela na tela. */
  sinonimos: string[]
}

export const indiceDeBusca: ItemDeBusca[] = [
  { aba: 'basicas', secao: 'identidade', rotulo: 'Nome do workspace', sinonimos: ['renomear', 'título', 'como aparece'] },
  { aba: 'basicas', secao: 'identidade', rotulo: 'Referência', sinonimos: ['slug', 'url', 'endereço', 'identificador'] },
  { aba: 'basicas', secao: 'identidade', rotulo: 'Logo do workspace', sinonimos: ['ícone', 'marca', 'imagem', 'avatar', 'símbolo'] },
  { aba: 'basicas', secao: 'padroes', rotulo: 'Idioma padrão', sinonimos: ['linguagem', 'português', 'inglês', 'tradução', 'idioma'] },
  { aba: 'basicas', secao: 'padroes', rotulo: 'Fuso horário', sinonimos: ['hora', 'timezone', 'gmt', 'horário de verão'] },
  { aba: 'basicas', secao: 'padroes', rotulo: 'Moeda', sinonimos: ['real', 'dólar', 'euro', 'currency', 'valor'] },
  { aba: 'basicas', secao: 'comportamento', rotulo: 'Mostrar categorias', sinonimos: ['tela de início', 'home'] },
  { aba: 'basicas', secao: 'comportamento', rotulo: 'Ignorar permissões para membros full', sinonimos: ['permissão', 'cargo', 'acesso irrestrito'] },
  { aba: 'basicas', secao: 'comportamento', rotulo: 'Ocultar botão de criar', sinonimos: ['criar item', 'botão novo'] },
  { aba: 'basicas', secao: 'comportamento', rotulo: 'Mostrar URL de integração', sinonimos: ['integração', 'api', 'webhook'] },
  { aba: 'basicas', secao: 'comportamento', rotulo: 'Carimbo personalizado', sinonimos: ['chancela', 'assinatura', 'documento'] },
  { aba: 'basicas', secao: 'modulos', rotulo: 'Correção monetária', sinonimos: ['ipca', 'igpm', 'índice', 'reajuste', 'valor'] },
  { aba: 'basicas', secao: 'modulos', rotulo: 'Comparações', sinonimos: ['comparar itens'] },
  { aba: 'basicas', secao: 'modulos', rotulo: 'Jurídico', sinonimos: ['processo', 'prazo judicial'] },
  { aba: 'basicas', secao: 'exclusao', rotulo: 'Excluir workspace', sinonimos: ['apagar', 'deletar', 'zona de perigo', 'encerrar'] },
  { aba: 'calendario', secao: 'dias-uteis', rotulo: 'Dias úteis da semana', sinonimos: ['expediente', 'sábado', 'domingo', 'sla', 'prazo'] },
  { aba: 'calendario', secao: 'feriados', rotulo: 'Feriados', sinonimos: ['importar', 'sincronizar', 'ponto facultativo', 'país'] },
  { aba: 'calendario', secao: 'ocorrencias', rotulo: 'Ocorrências', sinonimos: ['recesso', 'evento interno', 'data especial'] },
  { aba: 'notificacoes', secao: 'nativas', rotulo: 'Avisos automáticos de prazo', sinonimos: ['e-mail padrão', 'nativo', 'tarefa atrasada'] },
  { aba: 'notificacoes', secao: 'spaceflow', rotulo: 'Avisos das tarefas rápidas', sinonimos: ['spaceflow', 'tarefa rápida'] },
  { aba: 'notificacoes', secao: 'agendadas', rotulo: 'Avisos das tarefas agendadas', sinonimos: ['fluxo de categoria', 'tarefa agendada'] },
  { aba: 'dicionarios', secao: 'traducoes', rotulo: 'Traduzir campos e formulários', sinonimos: ['idioma', 'inglês', 'espanhol', 'chave', 'label'] },
  { aba: 'cobranca', secao: 'carteira', rotulo: 'Saldo de en-credits', sinonimos: ['crédito', 'saldo', 'consumo', 'ia', 'quanto falta'] },
  { aba: 'cobranca', secao: 'solicitacoes', rotulo: 'Pedir recarga', sinonimos: ['comprar crédito', 'solicitar', 'recarga'] },
  { aba: 'cobranca', secao: 'extrato', rotulo: 'Extrato de consumo', sinonimos: ['histórico', 'transação', 'gasto', 'no que foi'] },
]

/** Seção que a busca mandou destacar. Some sozinha — é pisca, não seleção. */
export const destaque = ref<string | null>(null)

let relogio: ReturnType<typeof setTimeout> | undefined

export function destacar(secao: string) {
  destaque.value = secao
  clearTimeout(relogio)
  relogio = setTimeout(() => (destaque.value = null), 2400)
}
