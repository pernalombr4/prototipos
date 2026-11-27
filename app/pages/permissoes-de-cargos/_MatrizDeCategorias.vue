<script setup lang="ts">
/**
 * A proposta para o pedaço que cresce com o workspace.
 *
 * Hoje: cada categoria abre 4 ações, e Criar, Ver e Atualizar abrem a lista
 * inteira de campos cada uma. Com 120 categorias são milhares de caixas.
 *
 * Aqui:
 * - um padrão de 4 caixas vale para toda categoria sem regra própria,
 *   inclusive as que forem criadas depois. Na rodada 2 ele virou a primeira
 *   linha da tabela (Strapi, Retool); o cartão da rodada 1 continua no andaime;
 * - uma linha por categoria, com as 4 ações em colunas fixas e ícone no
 *   cabeçalho (Directus, Twenty);
 * - a seta da categoria abre, na mesma grade, as sublinhas Campos, Quais itens
 *   e cada formulário (Appsmith, Retool). O campo a campo fica em "Ajustar";
 * - a caixa do cabeçalho marca a coluna inteira da lista filtrada.
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import CaixaDePermissao from './_CaixaDePermissao.vue'
import QuaisItens from './_QuaisItens.vue'
import {
  type Acao,
  type AcaoDeAlcance,
  type AcaoDeCampo,
  type CategoriaMock,
  type FormularioMock,
  type RegraDeItens,
  acoes,
  acoesDeAlcance,
  acoesDeCampo,
  camposPessoa,
  SEM_FORMULARIO,
} from './mocks'
import {
  type EstadoDoCargo,
  type MapaDeAcoes,
  acoesDaCategoria,
  ajustarOrigens,
  comDependencia,
  definirNaOrigem,
  definirRegra,
  itensDaCategoria,
  liberadoNaOrigem,
  liberarEmTodas,
  parcialPorOrigem,
  resumoDeOrigens,
  temOrigens,
  verTravadoNaOrigem,
  resumoDeCampos,
  temAcesso,
  temRegraDeItens,
  verExigidoPor,
} from './estado'

const props = defineProps<{
  t: Textos
  lista: CategoriaMock[]
  estado: EstadoDoCargo
  salvo: EstadoDoCargo
  somenteLeitura: boolean
  carregando: boolean
  /** Rodada 2: primeira linha da tabela. Rodada 1: cartão em cima. */
  formaDoPadrao: 'linha' | 'cartao'
}>()

const emit = defineEmits<{ ajustar: [categoria: CategoriaMock, aba?: 'campos' | 'formularios' | 'itens' | 'acesso'] }>()

const toast = useToast()

type Filtro = 'todas' | 'proprias' | 'comAcesso' | 'semAcesso' | 'comItens' | 'alteradas'
const busca = ref('')
const filtro = ref<Filtro>('todas')
const abertas = ref<number[]>([])

const alterada = (c: CategoriaMock) =>
  JSON.stringify(props.estado.categorias[c.id]) !== JSON.stringify(props.salvo.categorias[c.id])
  || (!props.estado.categorias[c.id]?.proprio && JSON.stringify(props.estado.padrao) !== JSON.stringify(props.salvo.padrao))
  || (!props.estado.categorias[c.id]?.itens && JSON.stringify(props.estado.padraoItens) !== JSON.stringify(props.salvo.padraoItens))

const propria = (c: CategoriaMock) => !!props.estado.categorias[c.id]?.proprio || Object.keys(props.estado.categorias[c.id]?.origens ?? {}).length > 0

function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const passaNoFiltro: Record<Filtro, (c: CategoriaMock) => boolean> = {
  todas: () => true,
  proprias: propria,
  comAcesso: c => temAcesso(props.estado, c.id),
  semAcesso: c => !temAcesso(props.estado, c.id),
  comItens: c => temRegraDeItens(props.estado, c),
  alteradas: alterada,
}

const filtradas = computed(() => {
  const termo = normalizar(busca.value.trim())
  return props.lista.filter(c => passaNoFiltro[filtro.value](c) && (!termo || normalizar(c.name).includes(termo)))
})

const itensDeFiltro = computed(() => (Object.keys(passaNoFiltro) as Filtro[]).map(f => ({
  label: props.t.filtros[f],
  value: f,
  badge: f === 'todas' ? undefined : { label: String(props.lista.filter(passaNoFiltro[f]).length), color: 'neutral' as const, variant: 'subtle' as const, size: 'sm' as const },
})))

/* ------------------------------------------------------------------ *
 * As linhas da grade: padrão, categorias e, quando abertas, as sublinhas.
 * ------------------------------------------------------------------ */

type Linha =
  | { tipo: 'padrao', id: string }
  | { tipo: 'categoria', id: string, c: CategoriaMock }
  | { tipo: 'campos', id: string, c: CategoriaMock }
  | { tipo: 'criador', id: string, c: CategoriaMock }
  | { tipo: 'responsavel', id: string, c: CategoriaMock }
  | { tipo: 'formulario', id: string, c: CategoriaMock, f: FormularioMock }
  | { tipo: 'semForm', id: string, c: CategoriaMock }

const linhas = computed<Linha[]>(() => {
  const saida: Linha[] = []
  if (props.formaDoPadrao === 'linha')
    saida.push({ tipo: 'padrao', id: 'padrao' })
  for (const c of filtradas.value) {
    saida.push({ tipo: 'categoria', id: `c${c.id}`, c })
    if (abertas.value.includes(c.id)) {
      saida.push({ tipo: 'campos', id: `k${c.id}`, c })
      saida.push({ tipo: 'criador', id: `o${c.id}`, c })
      saida.push({ tipo: 'responsavel', id: `r${c.id}`, c })
      if (temOrigens(c)) {
        c.formularios.forEach(f => saida.push({ tipo: 'formulario', id: `f${f.id}`, c, f }))
        saida.push({ tipo: 'semForm', id: `s${c.id}`, c })
      }
    }
  }
  return saida
})

function alternarAberta(c: CategoriaMock) {
  abertas.value = abertas.value.includes(c.id) ? abertas.value.filter(x => x !== c.id) : [...abertas.value, c.id]
}

/* ------------------------------------------------------------------ *
 * Escrever: uma regra igual ao padrão não é regra própria, e a linha
 * volta a seguir o padrão. Assim "Regra própria" quer dizer "diferente".
 * Atualizar e Excluir exigem Ver.
 * ------------------------------------------------------------------ */

function igualAoPadrao(m: MapaDeAcoes) {
  return acoes.every(a => m[a] === props.estado.padrao[a])
}

function definirAcao(c: CategoriaMock, acao: Acao, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = comDependencia({ ...acoesDaCategoria(props.estado, c.id), [acao]: valor })
  e.proprio = igualAoPadrao(novo) ? null : novo
  // Marcar a categoria marca todas as origens; desmarcar tira de todas.
  delete e.origens[acao]
  ajustarOrigens(props.estado, c)
}

function definirLinha(c: CategoriaMock, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = { criar: valor, ver: valor, atualizar: valor, excluir: valor }
  e.proprio = igualAoPadrao(novo) ? null : novo
  e.origens = {}
}

function voltarAoPadrao(c: CategoriaMock) {
  props.estado.categorias[c.id]!.proprio = null
  props.estado.categorias[c.id]!.origens = {}
  ajustarOrigens(props.estado, c)
}

function definirPadrao(acao: Acao, valor: boolean) {
  props.estado.padrao = comDependencia({ ...props.estado.padrao, [acao]: valor })
  for (const c of props.lista) {
    const p = props.estado.categorias[c.id]!.proprio
    if (p && igualAoPadrao(p))
      props.estado.categorias[c.id]!.proprio = null
  }
}

type Valor = boolean | 'indeterminate'

function estadoDaColuna(acao: Acao): Valor {
  const n = filtradas.value.filter(c => acoesDaCategoria(props.estado, c.id)[acao]).length
  if (!n)
    return false
  return n === filtradas.value.length ? true : 'indeterminate'
}

function definirColuna(acao: Acao, valor: boolean) {
  const alvo = filtradas.value
  // A caixa de coluna mexe em muitas categorias de uma vez: o aviso oferece desfazer.
  const antes = new Map(alvo.map(c => [c.id, { proprio: props.estado.categorias[c.id]!.proprio, origens: { ...props.estado.categorias[c.id]!.origens } }]))
  alvo.forEach(c => definirAcao(c, acao, valor))
  toast.add({
    title: props.t.toastColuna(props.t.acoes[acao], alvo.length, valor),
    icon: valor ? 'i-lucide-check-check' : 'i-lucide-square-dashed',
    color: 'neutral',
    duration: 6000,
    actions: [{
      label: props.t.desfazer,
      icon: 'i-lucide-undo-2',
      color: 'neutral',
      variant: 'outline',
      onClick: () => antes.forEach((p, id) => {
        props.estado.categorias[id]!.proprio = p.proprio
        props.estado.categorias[id]!.origens = p.origens
      }),
    }],
  })
}

function estadoDaLinha(c: CategoriaMock): Valor {
  const m = acoesDaCategoria(props.estado, c.id)
  const n = acoes.filter(a => m[a]).length
  if (!n)
    return false
  return n === 4 ? true : 'indeterminate'
}

/** A célula foge do padrão: cor cheia e desfazer ao lado (Twenty). */
function difere(c: CategoriaMock, acao: Acao) {
  const p = props.estado.categorias[c.id]?.proprio
  return !!p && p[acao] !== props.estado.padrao[acao]
}

/** Ação liberada só em parte dos campos: a célula fica parcial (Directus, Strapi). */
function parcial(c: CategoriaMock, acao: Acao) {
  if (!(acoesDeCampo as Acao[]).includes(acao) || !acoesDaCategoria(props.estado, c.id)[acao])
    return null
  const lista = props.estado.categorias[c.id]?.campos?.[acao as AcaoDeCampo]
  if (!lista)
    return null
  const n = c.campos.filter(f => lista.includes(f.name)).length
  return n < c.campos.length ? { n, total: c.campos.length } : null
}

function valorDaCelula(c: CategoriaMock, acao: Acao): Valor {
  return parcial(c, acao) || parcialPorOrigem(props.estado, c, acao) ? 'indeterminate' : acoesDaCategoria(props.estado, c.id)[acao]
}

/** Os nomes das origens, na ordem da categoria. */
function nomesDasOrigens(c: CategoriaMock, lista: number[]) {
  return lista.map(o => o === SEM_FORMULARIO ? props.t.semFormulario : c.formularios.find(f => f.id === o)?.nome ?? '').join(', ')
}

/** "1 de 4" quando alguma origem fica sem ação nenhuma; "Em parte" quando só algumas ações se limitam. */
function rotuloDeOrigens(c: CategoriaMock) {
  const r = resumoDeOrigens(props.estado, c)!
  return r.n < r.total ? props.t.origensDe(r.n, r.total) : props.t.origensEmParte
}

/** Uma linha por ação limitada: "Criar em 12 de 13". Com 1 a 3 origens, os nomes. */
function dicaDeOrigens(c: CategoriaMock) {
  const r = resumoDeOrigens(props.estado, c)!
  return r.parciais.map((a) => {
    const p = parcialPorOrigem(props.estado, c, a)!
    return p.n <= 3 ? `${props.t.acoes[a]}: ${nomesDasOrigens(c, p.lista)}` : props.t.acaoEmOrigens(props.t.acoes[a], p.n, p.total)
  }).join(' · ')
}

function dicaDaCelula(c: CategoriaMock, acao: Acao) {
  const o = parcialPorOrigem(props.estado, c, acao)
  if (o)
    return props.t.parcialOrigemDica(props.t.acoes[acao], nomesDasOrigens(c, o.lista))
  const p = parcial(c, acao)
  return p ? props.t.parcialDica(props.t.acoes[acao], p.n, p.total) : ''
}

function clicarCelula(c: CategoriaMock, acao: Acao, valor: boolean) {
  // Traço por formulário: o clique libera em todos (a regra da caixa pai e filha).
  if (parcialPorOrigem(props.estado, c, acao)) {
    liberarEmTodas(props.estado, c, acao)
    return
  }
  // Traço por campo: o clique leva ao ajuste dos campos, sem apagar a escolha feita lá.
  if (parcial(c, acao)) {
    emit('ajustar', c, 'campos')
    return
  }
  definirAcao(c, acao, valor)
}

function travadaPor(m: MapaDeAcoes, acao: Acao) {
  const quem = acao === 'ver' ? verExigidoPor(m) : null
  return quem ? props.t.exigidoPor(props.t.acoes[quem]) : null
}

/** Ícone e dica da regra de itens na caixa (criador, responsável ou os 2). `c` nulo = padrão. */
function regraDaCelula(c: CategoriaMock | null, acao: Acao) {
  if (!(acoesDeAlcance as Acao[]).includes(acao))
    return null
  const ligada = c ? acoesDaCategoria(props.estado, c.id)[acao] : props.estado.padrao[acao]
  const r = (c ? itensDaCategoria(props.estado, c.id) : props.estado.padraoItens)[acao as AcaoDeAlcance]
  if (!ligada || !r || !(r.criador || r.responsavel))
    return null
  const nome = props.t.acoes[acao]
  if (r.criador && r.responsavel)
    return { icone: 'i-lucide-users', dica: props.t.soAmbos(nome) }
  return r.criador ? { icone: 'i-lucide-user-round', dica: props.t.soOsSeus(nome) } : { icone: 'i-lucide-user-check', dica: props.t.soResponsavel(nome) }
}

/** Quantas categorias fogem do padrão nesta ação (o "Revoked for N" do Twenty). */
const excecoes = (acao: Acao) =>
  props.lista.filter(c => acoesDaCategoria(props.estado, c.id)[acao] !== props.estado.padrao[acao]).length

const rotuloExcecao = (a: Acao) =>
  props.estado.padrao[a] ? props.t.tiradoEm(excecoes(a)) : props.t.liberadoEm(excecoes(a))

/* ------------------------------------------------------------------ *
 * Sublinhas
 * ------------------------------------------------------------------ */

/** Estado dos campos numa ação: todos, parte ou nenhum. */
function valorDeCampos(c: CategoriaMock, acao: AcaoDeCampo): Valor {
  if (!acoesDaCategoria(props.estado, c.id)[acao])
    return false
  return parcial(c, acao) ? 'indeterminate' : true
}

function regraMarcada(c: CategoriaMock, acao: AcaoDeAlcance, tipo: keyof RegraDeItens) {
  return !!itensDaCategoria(props.estado, c.id)[acao]?.[tipo]
}

function nomesDosResponsaveis(c: CategoriaMock) {
  const campos = props.estado.categorias[c.id]?.itens?.campos
  const pessoas = camposPessoa(c)
  const escolhidos = campos ? pessoas.filter(f => campos.includes(f.name)) : pessoas
  return escolhidos.map(f => f.label ?? f.name).join(', ')
}

/** Ver travado na sublinha porque Atualizar ou Excluir valem nesta origem. */
function travadaNaOrigem(c: CategoriaMock, a: Acao, o: number) {
  if (a !== 'ver' || !liberadoNaOrigem(props.estado, c, 'ver', o) || !acoesDaCategoria(props.estado, c.id).ver)
    return null
  const quem = verTravadoNaOrigem(props.estado, c, o)
  return quem ? props.t.exigidoPor(props.t.acoes[quem]) : null
}

const valorNaOrigem = (c: CategoriaMock, a: Acao, o: number) =>
  acoesDaCategoria(props.estado, c.id)[a] && liberadoNaOrigem(props.estado, c, a, o)

const colunas = computed<TableColumn<Linha>[]>(() => [
  { id: 'nome', header: props.t.colunaCategoria, meta: { class: { th: 'w-auto', td: 'w-auto' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-20 px-0', td: 'text-center w-20 px-0' } } })),
  { id: 'itens', header: props.t.colunaItens, meta: { class: { th: 'w-48', td: 'w-48' } } },
  { id: 'campos', header: props.t.colunaCampos, meta: { class: { th: 'w-28', td: 'w-28' } } },
  { id: 'formularios', header: props.t.colunaFormularios, meta: { class: { th: 'w-44', td: 'w-44' } } },
  { id: 'ajustar', header: '', meta: { class: { th: 'w-32 pl-0', td: 'w-32 pl-0 text-right' } } },
])

const meta = {
  class: {
    tr: (row: { original: Linha }) => {
      const l = row.original
      if (l.tipo === 'padrao')
        return 'bg-primary/5'
      if (l.tipo !== 'categoria')
        return 'bg-elevated/50'
      return alterada(l.c) ? 'bg-warning/5' : ''
    },
  },
}
</script>

<template>
  <section class="space-y-4">
    <header>
      <h3 class="text-sm font-semibold text-highlighted">{{ t.categorias }}</h3>
      <p class="text-sm text-muted">{{ t.categoriasDesc }}</p>
    </header>

    <!-- Rodada 1: o padrão num cartão em cima da tabela. -->
    <div v-if="formaDoPadrao === 'cartao'" class="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 animate-[entrada_.3s_ease-out_both]">
      <div class="flex min-w-60 flex-1 items-start gap-3">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <UIcon name="i-lucide-layers" class="size-4" />
        </span>
        <span>
          <span class="block text-sm font-semibold text-highlighted">{{ t.padraoLinha }}</span>
          <span class="block text-xs text-muted">{{ t.padraoLinhaDesc }}</span>
        </span>
      </div>
      <div class="flex flex-wrap gap-6">
        <div v-for="a in acoes" :key="a" class="flex flex-col items-start gap-0.5">
          <span class="flex items-center gap-1.5">
            <CaixaDePermissao
              :valor="estado.padrao[a]"
              :rotulo="`${t.padraoLinha}: ${t.acoes[a]}`"
              :travada-por="travadaPor(estado.padrao, a)"
              :dica="t.dicas[a]"
              :desabilitada="somenteLeitura"
              @alterar="v => definirPadrao(a, v)"
            />
            <span class="text-sm text-default">{{ t.acoes[a] }}</span>
          </span>
          <UButton v-if="excecoes(a)" :label="rotuloExcecao(a)" size="xs" variant="link" color="neutral" class="-ml-1 px-1 text-xs" @click="filtro = 'proprias'" />
        </div>
        <div class="flex flex-col items-start gap-0.5">
          <span class="text-xs text-muted">{{ t.colunaItens }}</span>
          <QuaisItens :t="t" :estado="estado" :categoria="null" :somente-leitura="somenteLeitura" />
        </div>
      </div>
    </div>

    <!-- Busca, filtro e contagem. -->
    <div class="flex flex-wrap items-center gap-3">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.buscar" class="w-full sm:w-64" :aria-label="t.buscar">
        <template v-if="busca" #trailing>
          <UButton icon="i-lucide-x" size="xs" variant="link" color="neutral" :aria-label="t.limparBusca" @click="busca = ''" />
        </template>
      </UInput>
      <UTabs v-model="filtro" :items="itensDeFiltro" :content="false" size="xs" variant="pill" color="neutral" />
      <span class="ml-auto text-xs text-muted" aria-live="polite">{{ t.mostrando(filtradas.length, lista.length) }}</span>
    </div>

    <!-- Carregando -->
    <div v-if="carregando" class="space-y-2 rounded-lg border border-default p-4">
      <USkeleton v-for="i in 8" :key="i" class="h-8 w-full" />
    </div>

    <UTable
      v-else
      :data="linhas"
      :columns="colunas"
      :meta="meta"
      :get-row-id="(l: Linha) => l.id"
      sticky
      class="max-h-[62dvh] rounded-lg border border-default"
      :ui="{ base: 'w-full min-w-[66rem] table-fixed', th: 'py-2 text-xs align-top bg-elevated text-highlighted', td: 'py-2' }"
    >
      <!-- Cabeçalho: ícone e dica da ação; a caixa marca a coluna da lista filtrada. -->
      <template v-for="a in acoes" :key="a" #[`${a}-header`]>
        <span class="inline-flex flex-col items-center gap-1">
          <UTooltip :text="t.dicas[a]">
            <span>{{ t.acoes[a] }}</span>
          </UTooltip>
          <UTooltip :text="estadoDaColuna(a) === true ? t.desmarcarColuna(t.acoes[a], filtradas.length) : t.marcarColuna(t.acoes[a], filtradas.length)">
            <UCheckbox
              :model-value="estadoDaColuna(a)"
              :disabled="somenteLeitura || !filtradas.length"
              :aria-label="t.marcarColuna(t.acoes[a], filtradas.length)"
              @update:model-value="v => definirColuna(a, v === true)"
            />
          </UTooltip>
        </span>
      </template>

      <!-- ───────── Coluna do nome ───────── -->
      <template #nome-cell="{ row }">
        <!-- Padrão -->
        <span v-if="row.original.tipo === 'padrao'" class="flex min-w-0 items-center gap-2.5 pl-7">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
            <UIcon name="i-lucide-layers" class="size-3.5" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-highlighted">{{ t.padraoLinha }}</span>
            <span class="block truncate text-xs text-muted">{{ t.padraoLinhaDesc }}</span>
          </span>
        </span>

        <!-- Categoria -->
        <span v-else-if="row.original.tipo === 'categoria'" class="flex min-w-0 items-center gap-2">
          <UButton
            icon="i-lucide-chevron-right"
            size="xs"
            variant="ghost"
            color="neutral"
            class="shrink-0 transition-transform"
            :class="abertas.includes(row.original.c.id) ? 'rotate-90' : ''"
            :aria-expanded="abertas.includes(row.original.c.id)"
            :aria-label="t.expandir(row.original.c.name)"
            @click="alternarAberta(row.original.c)"
          />
          <UCheckbox
            :model-value="estadoDaLinha(row.original.c)"
            :disabled="somenteLeitura"
            :aria-label="t.marcarLinha(row.original.c.name)"
            @update:model-value="v => definirLinha(row.original.c, v === true)"
          />
          <UIcon :name="row.original.c.icon ?? 'i-lucide-file'" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="flex min-w-0 items-center gap-2">
              <span class="truncate text-sm font-medium text-default" :title="row.original.c.name">{{ row.original.c.name }}</span>
              <UBadge v-if="propria(row.original.c)" :label="t.regraPropria" color="primary" variant="subtle" size="sm" class="shrink-0" />
              <UTooltip v-if="propria(row.original.c) && !somenteLeitura" :text="t.voltarAoPadrao">
                <UButton icon="i-lucide-undo-2" size="xs" variant="ghost" color="warning" class="shrink-0" :aria-label="`${t.voltarAoPadrao}: ${row.original.c.name}`" @click="voltarAoPadrao(row.original.c)" />
              </UTooltip>
              <span v-if="alterada(row.original.c)" class="size-1.5 shrink-0 rounded-full bg-warning" :title="t.alterada" />
            </span>
            <span class="block truncate text-xs text-muted">
              {{ propria(row.original.c) ? t.meta(row.original.c.campos.length, row.original.c.formularios.length) : `${t.seguePadrao} · ${t.meta(row.original.c.campos.length, row.original.c.formularios.length)}` }}
            </span>
          </span>
        </span>

        <!-- Sublinha: campos -->
        <span v-else-if="row.original.tipo === 'campos'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-text-cursor-input" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0">
            <span class="block text-sm text-default">{{ t.subCampos }}</span>
            <span class="block truncate text-xs text-muted">
              {{ resumoDeCampos(estado, row.original.c) ? t.subCamposEscolhidos(resumoDeCampos(estado, row.original.c)!.liberados, row.original.c.campos.length) : t.subCamposTodos(row.original.c.campos.length) }}
            </span>
          </span>
        </span>

        <!-- Sublinha: só se for o criador (is_owner) -->
        <span v-else-if="row.original.tipo === 'criador'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-user-round" class="size-4 shrink-0 text-info" />
          <span class="min-w-0">
            <span class="block text-sm text-default">{{ t.subAlcance }}</span>
            <span class="block truncate text-xs text-muted">{{ t.subAlcanceDesc }}</span>
          </span>
        </span>

        <!-- Sublinha: só se for o responsável -->
        <span v-else-if="row.original.tipo === 'responsavel'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-user-check" class="size-4 shrink-0 text-info" />
          <span class="min-w-0">
            <span class="block text-sm text-default">{{ t.subResponsavel }}</span>
            <span class="block truncate text-xs text-muted">
              {{ camposPessoa(row.original.c).length ? t.subResponsavelDesc(nomesDosResponsaveis(row.original.c)) : t.semCampoPessoa }}
            </span>
          </span>
        </span>

        <!-- Sublinha: formulário -->
        <span v-else-if="row.original.tipo === 'formulario'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-file-text" class="size-4 shrink-0 text-muted" />
          <span class="truncate text-sm text-default">{{ row.original.f.nome }}</span>
        </span>

        <!-- Sublinha: itens sem formulário (API, importação, Spaceflow, agente de IA) -->
        <span v-else-if="row.original.tipo === 'semForm'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-bot" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0">
            <span class="block truncate text-sm text-default">{{ t.semFormulario }}</span>
            <span class="block truncate text-xs text-muted" :title="t.semFormularioDesc">{{ t.semFormularioDesc }}</span>
          </span>
        </span>
      </template>

      <!-- ───────── Colunas das ações ───────── -->
      <template v-for="a in acoes" :key="a" #[`${a}-cell`]="{ row }">
        <!-- Padrão -->
        <span v-if="row.original.tipo === 'padrao'" class="inline-flex flex-col items-center gap-0.5">
          <CaixaDePermissao
            :valor="estado.padrao[a]"
            :rotulo="`${t.padraoLinha}: ${t.acoes[a]}`"
            :travada-por="travadaPor(estado.padrao, a)"
            :dica="t.padraoColunaDica"
            :desabilitada="somenteLeitura"
            :regra="regraDaCelula(null, a)"
            @alterar="v => definirPadrao(a, v)"
          />
          <UTooltip v-if="excecoes(a)" :text="rotuloExcecao(a)">
            <UButton
              :label="estado.padrao[a] ? t.tiradoCurto(excecoes(a)) : t.liberadoCurto(excecoes(a))"
              size="xs"
              variant="link"
              color="neutral"
              class="px-0 text-xs"
              @click="filtro = 'proprias'"
            />
          </UTooltip>
        </span>

        <!-- Categoria: herdada clara, diferente cheia com desfazer, parcial com traço. -->
        <CaixaDePermissao
          v-else-if="row.original.tipo === 'categoria'"
          :valor="valorDaCelula(row.original.c, a)"
          :rotulo="`${t.acoes[a]}: ${row.original.c.name}`"
          herdada
          :difere="difere(row.original.c, a)"
          :travada-por="parcial(row.original.c, a) || parcialPorOrigem(estado, row.original.c, a) ? null : travadaPor(acoesDaCategoria(estado, row.original.c.id), a)"
          :dica="dicaDaCelula(row.original.c, a)"
          :desabilitada="somenteLeitura"
          :rotulo-desfazer="t.voltarAcao(t.acoes[a], row.original.c.name)"
          :regra="regraDaCelula(row.original.c, a)"
          @alterar="v => clicarCelula(row.original.c, a, v)"
          @desfazer="definirAcao(row.original.c, a, estado.padrao[a])"
        />

        <!-- Campos: todos, parte ou nenhum, por ação. O clique abre o Ajustar. -->
        <template v-else-if="row.original.tipo === 'campos'">
          <UCheckbox
            v-if="(acoesDeCampo as Acao[]).includes(a)"
            :model-value="valorDeCampos(row.original.c, a as AcaoDeCampo)"
            :disabled="somenteLeitura || !acoesDaCategoria(estado, row.original.c.id)[a]"
            :aria-label="`${t.subCampos}: ${t.acoes[a]}`"
            class="inline-flex"
            @update:model-value="emit('ajustar', row.original.c, 'campos')"
          />
          <span v-else class="text-dimmed" aria-hidden="true">·</span>
        </template>

        <!--
          Só se for o criador (is_owner) e só se for o responsável: uma caixa por
          ação. Criar não tem: quem cria é sempre o criador.
        -->
        <template v-else-if="row.original.tipo === 'criador' || row.original.tipo === 'responsavel'">
          <CaixaDePermissao
            v-if="(acoesDeAlcance as Acao[]).includes(a)"
            :valor="regraMarcada(row.original.c, a as AcaoDeAlcance, row.original.tipo)"
            :rotulo="`${row.original.tipo === 'criador' ? t.subAlcance : t.subResponsavel}: ${t.acoes[a]} (${row.original.c.name})`"
            herdada
            :difere="!!estado.categorias[row.original.c.id]?.itens"
            :dica="acoesDaCategoria(estado, row.original.c.id)[a] ? '' : t.acaoBloqueada(t.acoes[a])"
            :desabilitada="somenteLeitura || !acoesDaCategoria(estado, row.original.c.id)[a] || (row.original.tipo === 'responsavel' && !camposPessoa(row.original.c).length)"
            @alterar="v => definirRegra(estado, row.original.c, a as AcaoDeAlcance, row.original.tipo as keyof RegraDeItens, v)"
          />
          <span v-else class="text-dimmed" aria-hidden="true">·</span>
        </template>

        <!--
          Formulário e itens sem formulário: marcar libera nesta origem e deixa a
          categoria com traço; marcar todas volta a categoria a marcada.
        -->
        <CaixaDePermissao
          v-else-if="row.original.tipo === 'formulario' || row.original.tipo === 'semForm'"
          :valor="valorNaOrigem(row.original.c, a, row.original.tipo === 'formulario' ? row.original.f.id : SEM_FORMULARIO)"
          :rotulo="`${t.acoes[a]}: ${row.original.tipo === 'formulario' ? row.original.f.nome : t.semFormulario} (${row.original.c.name})`"
          :travada-por="travadaNaOrigem(row.original.c, a, row.original.tipo === 'formulario' ? row.original.f.id : SEM_FORMULARIO)"
          :desabilitada="somenteLeitura"
          @alterar="v => definirNaOrigem(estado, row.original.c, a, row.original.tipo === 'formulario' ? row.original.f.id : SEM_FORMULARIO, v)"
        />
      </template>

      <!-- ───────── Quais itens (criador e responsável) ───────── -->
      <template #itens-cell="{ row }">
        <QuaisItens
          v-if="row.original.tipo === 'padrao' || row.original.tipo === 'categoria'"
          :t="t"
          :estado="estado"
          :categoria="row.original.tipo === 'categoria' ? row.original.c : null"
          :somente-leitura="somenteLeitura"
        />
      </template>

      <!-- ───────── Campos ───────── -->
      <template #campos-cell="{ row }">
        <template v-if="row.original.tipo === 'padrao'">
          <span class="text-xs text-muted">{{ t.camposTodos }}</span>
        </template>
        <template v-else-if="row.original.tipo === 'categoria'">
          <span v-if="!temAcesso(estado, row.original.c.id)" class="text-xs text-dimmed">{{ t.camposNenhum }}</span>
          <UBadge
            v-else-if="resumoDeCampos(estado, row.original.c)"
            :label="t.camposDe(resumoDeCampos(estado, row.original.c)!.liberados, resumoDeCampos(estado, row.original.c)!.total)"
            icon="i-lucide-eye-off"
            color="warning"
            variant="subtle"
            size="sm"
          />
          <span v-else class="text-xs text-muted">{{ t.camposTodos }}</span>
        </template>
      </template>

      <!-- ───────── Formulários ───────── -->
      <template #formularios-cell="{ row }">
        <template v-if="row.original.tipo === 'padrao'">
          <span class="text-xs text-muted">{{ t.origensTodas }}</span>
        </template>
        <template v-else-if="row.original.tipo === 'categoria'">
          <span v-if="!temAcesso(estado, row.original.c.id)" class="text-xs text-dimmed">{{ t.camposNenhum }}</span>
          <span v-else-if="!temOrigens(row.original.c)" class="text-xs text-muted">{{ t.semFormularios }}</span>
          <UTooltip
            v-else-if="resumoDeOrigens(estado, row.original.c)"
            :text="dicaDeOrigens(row.original.c)"
          >
            <UButton
              :label="rotuloDeOrigens(row.original.c)"
              icon="i-lucide-split"
              color="warning"
              variant="subtle"
              size="xs"
              @click="emit('ajustar', row.original.c, 'formularios')"
            />
          </UTooltip>
          <span v-else class="text-xs text-muted">{{ t.origensTodas }}</span>
        </template>
      </template>

      <!-- ───────── Ajustar ───────── -->
      <template #ajustar-cell="{ row }">
        <UButton
          v-if="row.original.tipo === 'categoria'"
          :label="t.ajustar"
          icon="i-lucide-sliders-horizontal"
          size="xs"
          variant="ghost"
          color="neutral"
          :aria-label="t.ajustarAria(row.original.c.name)"
          @click="emit('ajustar', row.original.c)"
        />
        <UButton
          v-else-if="row.original.tipo === 'campos'"
          :label="t.escolherCampos"
          size="xs"
          variant="link"
          color="neutral"
          @click="emit('ajustar', row.original.c, 'campos')"
        />
      </template>

      <template #empty>
        <UEmpty
          v-if="!lista.length"
          icon="i-lucide-layout-grid"
          :title="t.vazioWsTitulo"
          :description="t.vazioWsDesc"
          variant="naked"
        />
        <UEmpty
          v-else-if="busca"
          icon="i-lucide-search-x"
          :title="t.vazioBuscaTitulo"
          :description="t.vazioBuscaDesc"
          :actions="[{ label: t.limparBusca, color: 'neutral', variant: 'subtle', onClick: () => { busca = '' } }]"
          variant="naked"
        />
        <UEmpty
          v-else
          icon="i-lucide-filter-x"
          :title="t.vazioFiltroTitulo"
          :description="t.vazioFiltroDesc"
          :actions="[{ label: t.verTodas, color: 'neutral', variant: 'subtle', onClick: () => { filtro = 'todas' } }]"
          variant="naked"
        />
      </template>
    </UTable>

    <!-- Com o padrão em linha, a tabela nunca fica vazia: o aviso vem embaixo. -->
    <p v-if="!carregando && formaDoPadrao === 'linha' && !filtradas.length" class="rounded-lg border border-dashed border-default px-4 py-6 text-center text-sm text-muted">
      {{ !lista.length ? `${t.vazioWsTitulo}. ${t.vazioWsDesc}` : busca ? `${t.vazioBuscaTitulo}. ${t.vazioBuscaDesc}` : `${t.vazioFiltroTitulo}. ${t.vazioFiltroDesc}` }}
    </p>
  </section>
</template>
