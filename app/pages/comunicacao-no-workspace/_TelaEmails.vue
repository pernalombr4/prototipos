<script setup lang="ts">
/**
 * PROPOSTA. A central "E-mails", na seção Membro do menu (rodada 7: hipótese A
 * da pesquisa de mercado, aprovada pela redatora em 24/11/2026). O e-mail vem
 * sempre ligado e tudo fica aqui, em abas que seguem a permissão de hoje:
 * Mensagens (todo perfil), Modelos e Caixas de E-mail (quem administra) e
 * Configurações (a conta de cada um; o resto, quem administra).
 * Configurações › E-mails passa a abrir estas abas.
 *
 * Rodada 8: os e-mails enviados pelo sistema (tarefa ou fluxo, a tela E-mails
 * Enviados de hoje) entram em Mensagens, com o filtro rápido "Do sistema", a
 * coluna Status e "Reenviar e-mail". Só quem tem a permissão de ver os
 * enviados vê essas linhas. A tabela é o `_TabelaDoEnspace.vue`, cópia da
 * tabela do develop. Sem nenhum e-mail, a tabela mostra o próximo passo
 * (workspace novo ou primeiro uso, no controle Dados do andaime).
 *
 * A aba Mensagens:
 *
 * Parte do que já existe escondido: a tela nativa "Emails Recebidos"
 * (`/itemEmails`), que hoje só se acha no editor de menus (pesquisa de UX,
 * S2-F1), com os e-mails que chegaram na Mail Box dos itens.
 *
 * Refeita no padrão das telas novas do develop (Logs de Auditoria, Itens,
 * Relatórios), lido no código em 17/11/2026:
 *  - barra (`TablesPartsDataToolbar`): busca, período, "Limpar filtros", Colunas
 *    e o botão que mostra a linha de filtros rápidos;
 *  - tabela (`EntityRendererManyTable`): as mesmas classes, cabeçalho fixo,
 *    ordenação e funil em cada coluna (`useTableHeaders` e os filtros
 *    `EntitySharedFilters*`, em `_FiltroDeColuna.vue`);
 *  - linha: o clique abre a gaveta à direita; a coluna Ações vem primeiro
 *    (menu ⋮), e o clique direito traz o mesmo menu;
 *  - paginador (`EntityRendererPaginator`).
 * O `EnTable` do SDK não tem slot de cabeçalho; por isso a tabela é o `UTable`
 * com as classes do develop, como em meus-relatorios.
 *
 * Fase 1: Recebidos e Enviados com item (os que o ENSPACE já grava).
 * Fase 2: também os enviados sem item, com "Vincular a um item", e Encaminhar.
 * Fase 3: a coluna Tarefa.
 */
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Email, caixas, itemPorId, itens, membroPorId, tarefas } from './mocks'
import { type AbaDaCentral, ABAS_DE_ADMIN, type Rapido, contatosDoItem, useComunicacao, useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'
import BuscaDeItem from './_BuscaDeItem.vue'
import AbasDaCentral from './_AbasDaCentral.vue'
import TabelaDoEnspace from './_TabelaDoEnspace.vue'
import Paginador from './_Paginador.vue'
import FiltroDeColuna, { type Filtros } from './_FiltroDeColuna.vue'

const props = defineProps<{ t: Textos }>()

const { emails, config, fase, registrado, abrirCompositor, abrirItem, abaDaCentral, ehAdmin, rapidosDaCentral, dados, outlookIntegrado } = useComunicacao()
const { abrirApp } = useAppExterno()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const te = computed(() => props.t.emails)

/* ---------- abas da central ---------- */

const ICONE_DA_ABA: Record<AbaDaCentral, string> = {
  mensagens: 'i-lucide-inbox', modelos: 'i-lucide-file-text', caixas: 'i-lucide-mailbox', configuracoes: 'i-lucide-settings',
}
const abas = computed(() => (Object.keys(ICONE_DA_ABA) as AbaDaCentral[])
  .filter(a => ehAdmin.value || !ABAS_DE_ADMIN.includes(a))
  .map(a => ({ value: a, label: props.t.central.abas[a], icon: ICONE_DA_ABA[a] })))

/** O texto do "i" de cada aba. */
function dicaDaAba(a: AbaDaCentral) {
  if (a !== 'mensagens') return props.t.central.dicas[a]
  const base = fase.value >= 2 ? props.t.emails.descricaoFase2 : props.t.emails.descricaoFase1
  return ehAdmin.value ? `${base} ${props.t.emails.descricaoDoSistema}` : base
}

/* ---------- barra ---------- */

const busca = ref('')
type Periodo = 'todos' | 'hoje' | 'semana' | 'mes'
const periodo = ref<Periodo>('todos')
const filtros = ref<Filtros>({})
const mostrarRapidos = ref(true)

/** No estado, para Configurações › E-mails › E-mails Enviados abrir com "Do sistema". */
const rapidos = computed<Set<Rapido>>({
  get: () => new Set(rapidosDaCentral.value),
  set: (s) => { rapidosDaCentral.value = [...s] },
})
/** "Sistema" no filtro de "Enviado por" liga o filtro rápido "Do sistema" (RF953). */
watch(filtros, (f) => {
  const marcouSistema = Object.entries(f).some(([k, v]) => k.startsWith('enviadoPor_') && Array.isArray(v) && v.includes('sistema'))
  if (marcouSistema && !rapidos.value.has('sistema')) rapidos.value = new Set([...rapidos.value, 'sistema'])
}, { deep: true })

const COR_DO_RAPIDO: Record<Rapido, 'info' | 'success' | 'primary' | 'neutral' | 'warning' | 'secondary'> = {
  recebidos: 'info', enviados: 'success', sistema: 'secondary', naoLidos: 'primary', comAnexo: 'neutral', semItem: 'warning',
}
const ICONE_DO_RAPIDO: Record<Rapido, string> = {
  recebidos: 'i-lucide-inbox', enviados: 'i-lucide-send', sistema: 'i-lucide-workflow', naoLidos: 'i-lucide-mail', comAnexo: 'i-lucide-paperclip', semItem: 'i-lucide-unlink',
}
const rapidosDaFase = computed<Rapido[]>(() => [
  'recebidos', 'enviados', ...(ehAdmin.value ? ['sistema' as const] : []), 'naoLidos', 'comAnexo', ...(fase.value >= 2 ? ['semItem' as const] : []),
])
function alternarRapido(r: Rapido) {
  const s = new Set(rapidos.value)
  if (s.has(r)) s.delete(r)
  else s.add(r)
  rapidos.value = s
}
watch(fase, (f) => {
  if (f < 2 && rapidos.value.has('semItem')) alternarRapido('semItem')
  if (f < 3) filtros.value = Object.fromEntries(Object.entries(filtros.value).filter(([k]) => !k.startsWith('tarefa_')))
})

const qtdDeFiltros = computed(() => Object.keys(filtros.value).length + rapidos.value.size + (periodo.value !== 'todos' ? 1 : 0))
const temFiltro = computed(() => qtdDeFiltros.value > 0 || !!busca.value.trim())
function limparFiltros() {
  filtros.value = {}
  rapidos.value = new Set()
  periodo.value = 'todos'
  busca.value = ''
}

const opcoesDePeriodo = computed(() => (Object.keys(te.value.periodo) as Periodo[]).map(p => ({ value: p, label: te.value.periodo[p] })))

/* ---------- dados ---------- */

const agora = new Date()
function dentroDoPeriodo(d: Date) {
  const dias = { todos: Infinity, hoje: 0, semana: 7, mes: 30 }[periodo.value]
  if (dias === Infinity) return true
  if (dias === 0) return d.toDateString() === agora.toDateString()
  return +agora - +d <= dias * 864e5
}

function tarefaRef(id: number | null | undefined) {
  return id ? tarefas.find(x => x.id === id)?.reference ?? null : null
}
function autorDe(e: Email) {
  if (e.direcao !== 'enviado') return null
  if (e.sistema) return te.value.sistema
  return membroPorId(e.autor)?.nome ?? null
}

const COR_DO_STATUS = { enviado: 'success', processando: 'info', falhou: 'error' } as const

/** O valor de cada coluna, usado no filtro, na ordem e na busca. */
function valor(e: Email, campo: string): string {
  switch (campo) {
    case 'tipo': return e.direcao
    case 'de': return e.de
    case 'para': return e.para.join(', ')
    case 'assunto': return e.assunto
    case 'item': return itemPorId(e.itemId)?.reference ?? ''
    case 'tarefa': return tarefaRef(e.tarefaId) ?? ''
    case 'enviadoPor': return e.sistema ? 'sistema' : e.autor ? String(e.autor) : ''
    default: return ''
  }
}

function passa(e: Email, chave: string, alvo: string | string[]) {
  const i = chave.lastIndexOf('_')
  const campo = chave.slice(0, i)
  const op = chave.slice(i + 1)
  const v = valor(e, campo)
  if (Array.isArray(alvo)) return alvo.includes(campo === 'item' && !v ? '__sem__' : v)
  const a = v.toLowerCase()
  const b = alvo.toLowerCase()
  switch (op) {
    case 'eq': return a === b
    case 'ne': return a !== b
    case 'contains': return a.includes(b)
    case 'ncontains': return !a.includes(b)
    case 'containss': return v.includes(alvo)
    case 'ncontainss': return !v.includes(alvo)
    default: return true
  }
}

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  const r = rapidos.value
  return emails.value
    .filter(registrado)
    // Fase 1: os e-mails do sistema e os dos itens vêm de 2 telas de hoje, e "Do sistema" troca a fonte
    // (RF952). A lista única, com os 2 juntos, é da fase 2 (épico "E-mail sem item e lista por permissão").
    .filter(e => !e.sistema || (ehAdmin.value && (fase.value >= 2 || r.has('sistema'))))
    .filter(e => dentroDoPeriodo(e.data))
    .filter(e => !(r.has('recebidos') && !r.has('enviados')) || e.direcao === 'recebido')
    .filter(e => !(r.has('enviados') && !r.has('recebidos')) || e.direcao === 'enviado')
    .filter(e => !r.has('sistema') || !!e.sistema)
    .filter(e => !r.has('naoLidos') || (e.direcao === 'recebido' && !e.lido))
    .filter(e => !r.has('comAnexo') || e.anexos.length > 0)
    .filter(e => !r.has('semItem') || !e.itemId)
    .filter(e => Object.entries(filtros.value).every(([k, v]) => passa(e, k, v)))
    .filter(e => !q || `${e.assunto} ${e.de} ${e.para.join(' ')} ${valor(e, 'item')} ${autorDe(e) ?? ''}`.toLowerCase().includes(q))
})

/* ---------- ordem e página ---------- */

type Ordenavel = 'de' | 'para' | 'assunto' | 'item' | 'data'
const ordem = ref<{ campo: Ordenavel, direcao: 'asc' | 'desc' }>({ campo: 'data', direcao: 'desc' })
function ordenar(c: Ordenavel) {
  if (ordem.value.campo !== c) ordem.value = { campo: c, direcao: c === 'data' ? 'desc' : 'asc' }
  else ordem.value = { campo: c, direcao: ordem.value.direcao === 'asc' ? 'desc' : 'asc' }
}

const ordenados = computed(() => {
  const d = ordem.value.direcao === 'asc' ? 1 : -1
  const c = ordem.value.campo
  return [...filtrados.value].sort((a, b) => {
    if (c === 'data') return (+a.data - +b.data) * d
    return valor(a, c).localeCompare(valor(b, c), idioma.value) * d
  })
})

const pagina = ref(1)
const porPagina = ref(25)
watch([filtrados, porPagina], () => { pagina.value = 1 })
const daPagina = computed(() => ordenados.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

/* ---------- colunas ---------- */

type Coluna = 'tipo' | 'de' | 'para' | 'assunto' | 'item' | 'tarefa' | 'enviadoPor' | 'status' | 'data'
/** A coluna Ações (117 px, primeira) vem do `_TabelaDoEnspace.vue`. */
const LARGURA: Record<Coluna, number> = {
  tipo: 120, de: 210, para: 210, assunto: 300, item: 130, tarefa: 110, enviadoPor: 170, status: 150, data: 150,
}
const OCULTAVEIS: Coluna[] = ['tipo', 'de', 'para', 'item', 'tarefa', 'enviadoPor', 'status']
const visiveis = ref<Record<string, boolean>>({})

const colunasDaFase = computed<Coluna[]>(() => (Object.keys(LARGURA) as Coluna[])
  .filter(c => c !== 'tarefa' || fase.value >= 3)
  .filter(c => c !== 'status' || ehAdmin.value))
const colunas = computed<TableColumn<Linha>[]>(() => colunasDaFase.value.map(id => ({
  id,
  accessorKey: id,
  meta: { style: { th: { width: `${LARGURA[id]}px` }, td: { width: `${LARGURA[id]}px` } } },
})))

const menuDeColunas = computed<DropdownMenuItem[]>(() => OCULTAVEIS.filter(c => colunasDaFase.value.includes(c)).map(c => ({
  label: te.value.col[c],
  type: 'checkbox' as const,
  checked: visiveis.value[c] !== false,
  onUpdateChecked: (v: boolean) => { visiveis.value = { ...visiveis.value, [c]: v } },
  onSelect: (e: Event) => e.preventDefault(),
})))

interface Linha extends Record<string, unknown> { id: number, email: Email }
const linhas = computed<Linha[]>(() => daPagina.value.map(e => ({ id: e.id, email: e })))

const opcoesDeTipo = computed(() => (['recebido', 'enviado'] as const).map(v => ({
  value: v, label: te.value.tipo[v], icon: v === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send',
})))
const opcoesDeItem = computed(() => {
  const refs = [...new Set(emails.value.filter(registrado).map(e => valor(e, 'item')).filter(Boolean))].sort()
  return [
    ...(fase.value >= 2 ? [{ value: '__sem__', label: te.value.semItem, icon: 'i-lucide-unlink' }] : []),
    ...refs.map(r => ({ value: r, label: r })),
  ]
})
const opcoesDeAutor = computed(() => [
  ...(ehAdmin.value ? [{ value: 'sistema', label: te.value.sistema, icon: 'i-lucide-workflow' }] : []),
  ...[...new Set(emails.value.filter(registrado).map(e => e.autor).filter(Boolean))]
    .map(id => ({ value: String(id), label: membroPorId(id)?.nome ?? String(id) })),
])
const opcoesDeTarefa = computed(() => [...new Set(emails.value.filter(registrado).map(e => tarefaRef(e.tarefaId)).filter(Boolean) as string[])]
  .map(r => ({ value: r, label: r })))

function iconeDaOrdem(c: Ordenavel) {
  if (ordem.value.campo !== c) return 'i-lucide-arrow-down-up'
  return ordem.value.direcao === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'
}

const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

/* ---------- gaveta e ações ---------- */

const aberto = ref<Email | null>(null)
const gaveta = computed({ get: () => !!aberto.value, set: (v) => { if (!v) aberto.value = null } })
const vinculando = ref(false)

function abrir(e: Email, vincularAgora = false) {
  aberto.value = e
  vinculando.value = vincularAgora
  if (!e.lido) emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: true } : x)
}

function marcarNaoLido(e: Email) {
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: false } : x)
  aberto.value = null
}

/** Sugestão pelo destinatário: itens em que esse endereço é contato (Pipedrive, HubSpot e monday sugerem antes da busca). */
const sugestoes = computed(() => {
  const e = aberto.value
  if (!e || e.itemId) return []
  const enderecos = new Set((e.direcao === 'recebido' ? [e.de] : e.para).map(x => x.toLowerCase()))
  return itens
    .filter(i => !i.semAcesso && contatosDoItem(i, config.value).some(c => c.email && enderecos.has(c.email.toLowerCase())))
    .slice(0, 3)
})

function vincular(id: number) {
  const e = aberto.value
  if (!e) return
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, itemId: id } : x)
  aberto.value = { ...e, itemId: id }
  vinculando.value = false
  toast.add({ title: te.value.vinculadoTitulo, description: te.value.vinculadoDescricao(itemPorId(id)!.reference), icon: 'i-lucide-link-2', color: 'success' })
}

function responder(e: Email, encaminhar = false) {
  aberto.value = null
  abrirCompositor({
    itemId: e.itemId,
    tarefaId: fase.value >= 3 ? e.tarefaId ?? null : null,
    para: encaminhar ? [] : [e.direcao === 'recebido' ? e.de : e.para[0]!],
    assunto: `${encaminhar ? 'Enc:' : 'Re:'} ${e.assunto.replace(/^(Re|Enc):\s*/i, '')}`,
    corpo: `<p></p><blockquote>${e.corpo}</blockquote>`,
    anexos: encaminhar ? [...e.anexos] : [],
    origem: encaminhar ? 'encaminhar' : 'responder',
  })
}

function reenviar(e: Email) {
  emails.value = emails.value.map(x => x.id === e.id && x.sistema ? { ...x, sistema: { ...x.sistema, status: 'processando' as const } } : x)
  if (aberto.value?.id === e.id) aberto.value = emails.value.find(x => x.id === e.id) ?? null
  toast.add({ title: props.t.central.reenviado, icon: 'i-lucide-send', color: 'success' })
}

function acoesDe(e: Email): DropdownMenuItem[][] {
  const a = te.value.acoes
  if (e.sistema) {
    return [
      [
        { label: a.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrir(e) },
        { label: props.t.central.reenviar, icon: 'i-lucide-send', disabled: e.sistema.status === 'processando', onSelect: () => reenviar(e) },
      ],
      e.itemId ? [{ label: a.verItem, icon: 'i-lucide-file-symlink', onSelect: () => abrirItem(e.itemId!, 'visao') }] : [],
    ]
  }
  return [
    [
      { label: a.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrir(e) },
      { label: a.responder, icon: 'i-lucide-reply', onSelect: () => responder(e) },
      ...(fase.value >= 2 ? [{ label: a.encaminhar, icon: 'i-lucide-forward', onSelect: () => responder(e, true) }] : []),
    ],
    [
      ...(e.direcao === 'recebido' && e.lido ? [{ label: a.marcarNaoLido, icon: 'i-lucide-mail', onSelect: () => marcarNaoLido(e) }] : []),
      e.itemId
        ? { label: a.verItem, icon: 'i-lucide-file-symlink', onSelect: () => abrirItem(e.itemId!, 'mailbox') }
        : { label: a.vincular, icon: 'i-lucide-link-2', onSelect: () => abrir(e, true) },
    ],
  ]
}

/** O estado vazio sem filtro: workspace novo (nada configurado) ou primeiro uso. */
const semNenhumEmail = computed(() => !emails.value.some(e => registrado(e) && (!e.sistema || ehAdmin.value)))
const acoesDoVazio = computed(() => {
  const v = te.value.vazio
  if (!outlookIntegrado.value) {
    return [
      { label: v.integrar, icon: 'i-lucide-plug', onClick: () => abrirApp({ tipo: 'outlook', url: 'https://app.enspace.io/profile?tab=integrations' }) },
      ...(ehAdmin.value && dados.value === 'novo'
        ? [
            { label: v.criarModelo, icon: 'i-lucide-file-text', color: 'neutral' as const, variant: 'outline' as const, onClick: () => { abaDaCentral.value = 'modelos' } },
            { label: v.criarCaixa, icon: 'i-lucide-mailbox', color: 'neutral' as const, variant: 'outline' as const, onClick: () => { abaDaCentral.value = 'caixas' } },
          ]
        : []),
    ]
  }
  return [{ label: v.escrever, icon: 'i-lucide-mail-plus', onClick: () => abrirCompositor({ origem: 'emails' }) }]
})

function nomeDaCaixa(endereco: string) {
  return caixas.find(c => c.email === endereco)?.nome ?? null
}
</script>

<template>
  <div class="flex min-h-0 flex-col">
    <!-- Título -->
    <div class="flex flex-wrap items-center gap-3 px-4 pb-2 pt-4 sm:px-6">
      <h1 class="min-w-0 text-xl font-semibold text-highlighted">
        {{ te.titulo }}
      </h1>
      <UButton :label="t.casca.novoEmail" icon="i-lucide-mail-plus" class="ml-auto" @click="abrirCompositor({ origem: 'emails' })" />
    </div>

    <!-- Abas da central -->
    <UTabs
      v-model="abaDaCentral"
      :items="abas"
      :content="false"
      variant="link"
      size="sm"
      class="shrink-0 px-4 sm:px-6"
      :class="marca"
      :ui="{ list: 'border-b border-default' }"
    >
      <!-- O que a aba guarda: no "i", não num texto solto na barra (pedido da rodada 8) -->
      <template #trailing="{ item }">
        <UTooltip :text="dicaDaAba(item.value as AbaDaCentral)" :content="{ side: 'bottom' }">
          <span role="img" :aria-label="dicaDaAba(item.value as AbaDaCentral)" class="inline-flex">
            <UIcon name="i-lucide-info" class="size-3.5 text-dimmed" />
          </span>
        </UTooltip>
      </template>
    </UTabs>

    <AbasDaCentral v-if="abaDaCentral !== 'mensagens'" :t="t" :aba="abaDaCentral" />

    <template v-else>

    <!-- Barra: TablesPartsDataToolbar -->
    <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4" :class="marca">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="te.pesquisar" icon="i-lucide-search" size="sm" variant="soft" class="w-48" :aria-label="te.pesquisar">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" class="p-0" :aria-label="te.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <USelectMenu
        v-model="periodo"
        :items="opcoesDePeriodo"
        value-key="value"
        :search-input="false"
        icon="i-lucide-calendar"
        size="sm"
        variant="soft"
        class="w-44"
        :aria-label="te.periodoRotulo"
      />
      <UTooltip :text="te.limparFiltros">
        <UButton
          icon="i-lucide-filter-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :class="temFiltro ? 'text-error' : ''"
          :disabled="!temFiltro"
          :aria-label="te.limparFiltros"
          @click="limparFiltros"
        />
      </UTooltip>

      <div class="ml-auto flex items-center gap-1.5">
        <UDropdownMenu :items="menuDeColunas" :content="{ align: 'end' }">
          <UButton :label="te.colunas" icon="i-lucide-columns-3" color="neutral" variant="outline" size="sm" />
        </UDropdownMenu>
        <UTooltip :text="mostrarRapidos ? te.recolherFiltros : te.expandirFiltros">
          <UChip :show="rapidos.size > 0" :text="rapidos.size" color="primary" size="xl">
            <UButton
              :icon="mostrarRapidos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="mostrarRapidos ? te.recolherFiltros : te.expandirFiltros"
              :aria-expanded="mostrarRapidos"
              @click="mostrarRapidos = !mostrarRapidos"
            />
          </UChip>
        </UTooltip>
      </div>
    </div>

    <!-- Filtros rápidos -->
    <div v-if="mostrarRapidos" class="flex shrink-0 flex-wrap items-center gap-2 border-b border-default px-3 py-1.5 sm:px-4">
      <UButton
        v-for="r in rapidosDaFase"
        :key="r"
        :label="te.rapidos[r]"
        :icon="ICONE_DO_RAPIDO[r]"
        :color="rapidos.has(r) ? COR_DO_RAPIDO[r] : 'neutral'"
        :variant="rapidos.has(r) ? 'subtle' : 'soft'"
        size="sm"
        :aria-pressed="rapidos.has(r)"
        @click="alternarRapido(r)"
      />
    </div>

    <!-- Tabela: EntityRendererManyTable (cópia em _TabelaDoEnspace.vue) -->
    <div class="min-h-0 flex-1 animate-[entrada_.25s_ease-out] overflow-auto">
      <TabelaDoEnspace
        v-model:column-visibility="visiveis"
        :data="linhas"
        :columns="colunas"
        :acoes="(l: Linha) => acoesDe(l.email)"
        :rotulo-acoes="te.col.acoes"
        :get-row-id="(r: Linha) => String(r.id)"
        @select="(l: Linha) => abrir(l.email)"
      >
          <!-- ===== cabeçalhos: ordem, rótulo, funil ===== -->
          <template v-for="c in (['de', 'para', 'assunto', 'item', 'data'] as const)" :key="c" #[`${c}-header`]>
            <div class="flex w-full items-center justify-start gap-1">
              <UButton
                :icon="iconeDaOrdem(c)"
                color="neutral"
                variant="link"
                size="xs"
                class="p-0"
                :class="ordem.campo === c ? 'text-primary' : 'text-dimmed hover:text-primary'"
                :aria-label="te.ordenar(te.col[c])"
                @click.stop="ordenar(c)"
              />
              <span class="truncate">{{ te.col[c] }}</span>
              <FiltroDeColuna
                v-if="c === 'item'"
                v-model="filtros"
                class="ml-2"
                :t="t"
                campo="item"
                :rotulo="te.col.item"
                tipo="selecao"
                :opcoes="opcoesDeItem"
              />
              <FiltroDeColuna
                v-else-if="c !== 'data'"
                v-model="filtros"
                class="ml-2"
                :t="t"
                :campo="c"
                :rotulo="te.col[c]"
                tipo="texto"
              />
            </div>
          </template>
          <template #tipo-header>
            <div class="flex w-full items-center justify-start gap-1">
              <span class="truncate">{{ te.col.tipo }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="tipo" :rotulo="te.col.tipo" tipo="selecao" :opcoes="opcoesDeTipo" />
            </div>
          </template>
          <template #enviadoPor-header>
            <div class="flex w-full items-center justify-start gap-1">
              <span class="truncate">{{ te.col.enviadoPor }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="enviadoPor" :rotulo="te.col.enviadoPor" tipo="selecao" :opcoes="opcoesDeAutor" />
            </div>
          </template>
          <template #tarefa-header>
            <div class="flex w-full items-center justify-start gap-1" :class="marca">
              <span class="truncate">{{ te.col.tarefa }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="tarefa" :rotulo="te.col.tarefa" tipo="selecao" :opcoes="opcoesDeTarefa" />
            </div>
          </template>
          <template #status-header>
            <span class="truncate">{{ te.col.status }}</span>
          </template>

          <!-- ===== células ===== -->
          <template #tipo-cell="{ row }">
            <UBadge
              :label="te.tipo[row.original.email.direcao]"
              :icon="row.original.email.direcao === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send'"
              :color="row.original.email.direcao === 'recebido' ? 'info' : 'success'"
              variant="subtle"
              size="sm"
            />
          </template>
          <template #de-cell="{ row }">
            <span class="flex min-w-0 items-center gap-2">
              <span v-if="!row.original.email.lido" role="img" class="size-2 shrink-0 rounded-full bg-primary" :aria-label="te.naoLido" />
              <span class="truncate" :class="row.original.email.lido ? 'text-default' : 'font-semibold text-highlighted'" :title="row.original.email.de">
                {{ nomeDaCaixa(row.original.email.de) ?? row.original.email.de }}
              </span>
            </span>
          </template>
          <template #para-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.email.para.join(', ')">{{ row.original.email.para.join(', ') }}</span>
          </template>
          <template #assunto-cell="{ row }">
            <span class="flex min-w-0 items-center gap-1.5">
              <span class="truncate" :class="row.original.email.lido ? 'text-default' : 'font-semibold text-highlighted'">{{ row.original.email.assunto }}</span>
              <UIcon v-if="row.original.email.anexos.length" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" :aria-label="te.comAnexo" />
            </span>
          </template>
          <template #item-cell="{ row }">
            <UButton
              v-if="itemPorId(row.original.email.itemId)"
              :label="itemPorId(row.original.email.itemId)!.reference"
              icon="i-lucide-file"
              color="neutral"
              variant="outline"
              size="xs"
              class="font-mono"
              @click.stop="abrirItem(row.original.email.itemId!, row.original.email.sistema ? 'visao' : 'mailbox')"
            />
            <UButton
              v-else
              :label="te.vincular"
              icon="i-lucide-link-2"
              color="warning"
              variant="soft"
              size="xs"
              :class="marca"
              @click.stop="abrir(row.original.email, true)"
            />
          </template>
          <template #tarefa-cell="{ row }">
            <UBadge v-if="tarefaRef(row.original.email.tarefaId)" :label="tarefaRef(row.original.email.tarefaId)!" icon="i-lucide-square-check-big" color="neutral" variant="subtle" size="sm" class="font-mono" />
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #enviadoPor-cell="{ row }">
            <span v-if="row.original.email.sistema" class="flex min-w-0 items-center gap-1.5 text-default">
              <UIcon name="i-lucide-workflow" class="size-3.5 shrink-0 text-muted" />
              <span class="truncate">{{ te.sistema }}<template v-if="row.original.email.sistema.tarefa"> · <span class="font-mono">{{ row.original.email.sistema.tarefa }}</span></template></span>
            </span>
            <span v-else-if="autorDe(row.original.email)" class="block truncate text-default">{{ autorDe(row.original.email) }}</span>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #data-cell="{ row }">
            <span class="whitespace-nowrap text-muted">{{ formato.format(row.original.email.data) }}</span>
          </template>
          <template #status-cell="{ row }">
            <UBadge v-if="row.original.email.sistema" :label="t.central.status[row.original.email.sistema.status]" :color="COR_DO_STATUS[row.original.email.sistema.status]" variant="subtle" size="sm" />
            <span v-else class="text-dimmed">-</span>
          </template>

          <template #empty>
            <div v-if="temFiltro || !semNenhumEmail" class="flex flex-col items-center justify-center py-12 text-center">
              <UIcon name="i-lucide-inbox" class="mb-3 h-12 w-12 text-dimmed" />
              <p class="text-sm text-muted">
                {{ temFiltro ? te.vazioFiltrado : te.vazioDescricao }}
              </p>
              <UButton v-if="temFiltro" :label="te.limparFiltros" icon="i-lucide-filter-x" color="neutral" variant="outline" size="sm" class="mt-3" @click="limparFiltros" />
            </div>
            <!-- PROPOSTA (rodada 8): sem nenhum e-mail, o próximo passo -->
            <UEmpty
              v-else
              variant="naked"
              icon="i-lucide-inbox"
              :title="outlookIntegrado ? te.vazio.primeiroTitulo : te.vazio.novoTitulo"
              :description="outlookIntegrado ? te.vazio.primeiroDescricao : ehAdmin && dados === 'novo' ? te.vazio.novoDescricao : te.vazio.novoMembroDescricao"
              :actions="acoesDoVazio"
              class="py-12"
              :class="marca"
            />
          </template>
      </TabelaDoEnspace>
    </div>

    <!-- Paginador: EntityRendererPaginator -->
    <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="ordenados.length" />

    </template>

    <!-- Gaveta à direita: SharedResizableDrawer -->
    <USlideover v-model:open="gaveta" :title="aberto?.assunto" :description="aberto ? formato.format(aberto.data) : undefined" :ui="{ content: 'sm:max-w-[700px]' }">
      <template #body>
        <div v-if="aberto" class="flex flex-col gap-4">
          <dl class="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1.5 text-sm">
            <dt class="text-muted">
              {{ te.col.tipo }}
            </dt>
            <dd>
              <UBadge :label="te.tipo[aberto.direcao]" :icon="aberto.direcao === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send'" :color="aberto.direcao === 'recebido' ? 'info' : 'success'" variant="subtle" size="sm" />
            </dd>
            <dt class="text-muted">
              {{ te.col.de }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.de }}<span v-if="nomeDaCaixa(aberto.de)" class="text-muted"> ({{ nomeDaCaixa(aberto.de) }})</span>
            </dd>
            <dt class="text-muted">
              {{ te.col.para }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.para.join(', ') }}
            </dd>
            <template v-if="aberto.cc.length">
              <dt class="text-muted">
                {{ t.compositor.cc }}
              </dt>
              <dd class="break-all text-highlighted">
                {{ aberto.cc.join(', ') }}
              </dd>
            </template>
            <template v-if="autorDe(aberto)">
              <dt class="text-muted">
                {{ te.col.enviadoPor }}
              </dt>
              <dd class="text-highlighted">
                {{ autorDe(aberto) }}
              </dd>
            </template>
            <template v-if="aberto.sistema">
              <dt class="text-muted">
                {{ te.col.status }}
              </dt>
              <dd>
                <UBadge :label="t.central.status[aberto.sistema.status]" :color="COR_DO_STATUS[aberto.sistema.status]" variant="subtle" size="sm" />
              </dd>
              <template v-if="aberto.sistema.tarefa">
                <dt class="text-muted">
                  {{ te.col.tarefa }}
                </dt>
                <dd class="font-mono text-highlighted">
                  {{ aberto.sistema.tarefa }}
                </dd>
              </template>
            </template>
            <template v-if="fase >= 3 && tarefaRef(aberto.tarefaId)">
              <dt class="text-muted">
                {{ te.col.tarefa }}
              </dt>
              <dd class="font-mono text-highlighted">
                {{ tarefaRef(aberto.tarefaId) }}
              </dd>
            </template>
          </dl>

          <!-- O item -->
          <div class="rounded-lg border p-3" :class="aberto.itemId && !vinculando ? 'border-default' : ['border-warning/40 bg-warning/5', marca]">
            <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-link-2" class="size-4 text-muted" />{{ te.col.item }}
            </p>
            <div v-if="itemPorId(aberto.itemId) && !vinculando" class="mt-2 flex flex-wrap items-center gap-2">
              <UButton
                :label="`${itemPorId(aberto.itemId)!.reference} · ${itemPorId(aberto.itemId)!.titulo}`"
                icon="i-lucide-file"
                color="neutral"
                variant="outline"
                size="sm"
                class="min-w-0"
                :ui="{ label: 'truncate' }"
                @click="abrirItem(aberto.itemId!, 'mailbox'); aberto = null"
              />
              <UButton v-if="fase >= 2 && !aberto.sistema" :label="t.compositor.trocar" color="neutral" variant="ghost" size="xs" @click="vinculando = true" />
            </div>
            <div v-else class="mt-2">
              <p class="mb-2 text-xs text-muted">
                {{ te.vincularDepois }}
              </p>
              <div v-if="sugestoes.length" class="mb-2 flex flex-wrap items-center gap-1.5">
                <span class="text-xs text-muted">{{ te.sugestoesPeloRemetente }}</span>
                <UButton
                  v-for="sug in sugestoes"
                  :key="sug.id"
                  :label="`${sug.reference} · ${sug.titulo}`"
                  icon="i-lucide-sparkles"
                  color="primary"
                  variant="soft"
                  size="xs"
                  class="max-w-64"
                  :ui="{ label: 'truncate' }"
                  @click="vincular(sug.id)"
                />
              </div>
              <BuscaDeItem :t="t" @escolher="vincular" />
            </div>
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="rounded-lg border border-default p-4 text-sm text-default [&_blockquote]:border-l-2 [&_blockquote]:border-default [&_blockquote]:pl-3 [&_p]:my-1.5" v-html="aberto.corpo" />
          <div v-if="aberto.anexos.length" class="flex flex-wrap gap-1.5">
            <UBadge v-for="a in aberto.anexos" :key="a" :label="a" icon="i-lucide-paperclip" color="neutral" variant="outline" />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberto?.sistema" class="flex flex-wrap gap-2">
          <UButton :label="t.central.reenviar" icon="i-lucide-send" :disabled="aberto.sistema.status === 'processando'" @click="reenviar(aberto)" />
        </div>
        <div v-else-if="aberto" class="flex flex-wrap gap-2">
          <UButton :label="te.acoes.responder" icon="i-lucide-reply" @click="responder(aberto)" />
          <UButton v-if="fase >= 2" :label="te.acoes.encaminhar" icon="i-lucide-forward" color="neutral" variant="outline" :class="marca" @click="responder(aberto, true)" />
          <UButton v-if="aberto.direcao === 'recebido'" :label="te.acoes.marcarNaoLido" icon="i-lucide-mail" color="neutral" variant="ghost" class="ml-auto" @click="marcarNaoLido(aberto)" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
