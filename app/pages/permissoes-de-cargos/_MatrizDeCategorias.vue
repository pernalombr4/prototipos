<script setup lang="ts">
/**
 * A proposta para o pedaço que cresce com o workspace.
 *
 * Hoje: cada categoria abre 4 ações, e Criar, Ver e Atualizar abrem a lista
 * inteira de campos cada uma. Com 120 categorias são milhares de caixas.
 *
 * Aqui:
 * - rodada 6: o padrão vale só para categoria nova e mora no bloco
 *   "Padrão para novas categorias", fora da tabela. Cada categoria guarda o
 *   seu valor; a caixa do cabeçalho muda a coluna inteira da lista filtrada;
 * - uma linha por categoria, com as 4 ações em colunas fixas (Directus, Twenty);
 * - rodada 6: 1 porta só. O nome ou a seta da categoria abre, na mesma grade,
 *   as sublinhas de cada formulário, Quais itens e Campos (Strapi, Appsmith).
 *   A coluna Restrições só resume o que a categoria limita, e o clique abre a
 *   categoria. A barra lateral fica só para o campo a campo (Twenty, Salesforce).
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import CaixaDePermissao from './_CaixaDePermissao.vue'
import PadraoParaNovas from './_PadraoParaNovas.vue'
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
  type OutraDeItem,
  exigeDaOutra,
  outrasDeItem,
} from './mocks'
import {
  type EstadoDoCargo,
  type MapaDeAcoes,
  acoesDaCategoria,
  ajustarOrigens,
  camposPadraoDeResponsavel,
  comDependencia,
  definirNaOrigem,
  definirRegra,
  itensDaCategoria,
  liberadoNaOrigem,
  liberarEmTodas,
  outraLiberada,
  resumoDeOutras,
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
}>()

/** Abre a barra lateral do campo a campo. */
const emit = defineEmits<{ campos: [categoria: CategoriaMock] }>()

const toast = useToast()

type Filtro = 'todas' | 'comAcesso' | 'semAcesso' | 'comItens' | 'alteradas'
const busca = ref('')
const filtro = ref<Filtro>('todas')
const abertas = ref<number[]>([])

const alterada = (c: CategoriaMock) =>
  JSON.stringify(props.estado.categorias[c.id]) !== JSON.stringify(props.salvo.categorias[c.id])

function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const passaNoFiltro: Record<Filtro, (c: CategoriaMock) => boolean> = {
  todas: () => true,
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
 * As linhas da grade: categorias e, quando abertas, as sublinhas.
 * ------------------------------------------------------------------ */

type Linha =
  | { tipo: 'categoria', id: string, c: CategoriaMock }
  | { tipo: 'campos', id: string, c: CategoriaMock }
  | { tipo: 'criador', id: string, c: CategoriaMock }
  | { tipo: 'responsavel', id: string, c: CategoriaMock }
  | { tipo: 'formulario', id: string, c: CategoriaMock, f: FormularioMock }
  | { tipo: 'semForm', id: string, c: CategoriaMock }
  | { tipo: 'outras', id: string, c: CategoriaMock }

const linhas = computed<Linha[]>(() => {
  const saida: Linha[] = []
  for (const c of filtradas.value) {
    saida.push({ tipo: 'categoria', id: `c${c.id}`, c })
    if (abertas.value.includes(c.id)) {
      if (temOrigens(c)) {
        c.formularios.forEach(f => saida.push({ tipo: 'formulario', id: `f${f.id}`, c, f }))
        saida.push({ tipo: 'semForm', id: `s${c.id}`, c })
      }
      saida.push({ tipo: 'criador', id: `o${c.id}`, c })
      saida.push({ tipo: 'responsavel', id: `r${c.id}`, c })
      saida.push({ tipo: 'outras', id: `x${c.id}`, c })
      saida.push({ tipo: 'campos', id: `k${c.id}`, c })
    }
  }
  return saida
})

function alternarAberta(c: CategoriaMock) {
  abertas.value = abertas.value.includes(c.id) ? abertas.value.filter(x => x !== c.id) : [...abertas.value, c.id]
}

/** O resumo da coluna Restrições só abre (não fecha) a categoria. */
function abrir(c: CategoriaMock) {
  if (!abertas.value.includes(c.id))
    abertas.value = [...abertas.value, c.id]
}

/* ------------------------------------------------------------------ *
 * Escrever. Atualizar e Excluir exigem Ver.
 * ------------------------------------------------------------------ */

function definirAcao(c: CategoriaMock, acao: Acao, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = comDependencia({ ...acoesDaCategoria(props.estado, c.id), [acao]: valor })
  e.proprio = novo
  // Marcar a categoria marca todas as origens; desmarcar tira de todas.
  delete e.origens[acao]
  ajustarOrigens(props.estado, c)
}

function definirLinha(c: CategoriaMock, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = { criar: valor, ver: valor, atualizar: valor, excluir: valor }
  e.proprio = novo
  e.origens = {}
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
    emit('campos', c)
    return
  }
  definirAcao(c, acao, valor)
}

function travadaPor(m: MapaDeAcoes, acao: Acao) {
  const quem = acao === 'ver' ? verExigidoPor(m) : null
  return quem ? props.t.exigidoPor(props.t.acoes[quem]) : null
}

/** Ícone e dica da regra de itens na caixa (criador, responsável ou os 2). */
function regraDaCelula(c: CategoriaMock, acao: Acao) {
  if (!(acoesDeAlcance as Acao[]).includes(acao))
    return null
  const ligada = acoesDaCategoria(props.estado, c.id)[acao]
  const r = itensDaCategoria(props.estado, c.id)[acao as AcaoDeAlcance]
  if (!ligada || !r || !(r.criador || r.responsavel))
    return null
  const nome = props.t.acoes[acao]
  if (r.criador && r.responsavel)
    return { icone: 'i-lucide-users', dica: props.t.soAmbos(nome) }
  return r.criador ? { icone: 'i-lucide-user-round', dica: props.t.soOsSeus(nome) } : { icone: 'i-lucide-user-check', dica: props.t.soResponsavel(nome) }
}

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

/** Rodada 6: os campos Pessoa que contam como responsável se escolhem na própria sublinha. */
function camposDoResponsavel(c: CategoriaMock) {
  return props.estado.categorias[c.id]?.itens?.campos ?? camposPadraoDeResponsavel(c)
}

function definirCamposDoResponsavel(c: CategoriaMock, campos: string[]) {
  const ec = props.estado.categorias[c.id]!
  ec.itens = { regras: ec.itens?.regras ?? {}, campos }
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

/** A coluna Restrições: o que a categoria limita, em até 3 resumos. */
function restricoes(c: CategoriaMock) {
  const saida: { rotulo: string, icone: string, dica: string }[] = []
  const o = resumoDeOrigens(props.estado, c)
  if (o) {
    // Conta só os formulários: "Itens sem formulário" aparece na dica, não no número.
    const forms = o.alcancadas.filter(x => x !== SEM_FORMULARIO).length
    const total = c.formularios.length
    saida.push({ rotulo: forms < total ? props.t.formulariosDe(forms, total) : props.t.formulariosEmParte, icone: 'i-lucide-split', dica: dicaDeOrigens(c) })
  }
  const k = resumoDeCampos(props.estado, c)
  if (k)
    saida.push({ rotulo: props.t.camposDeTotal(k.liberados, k.total), icone: 'i-lucide-eye-off', dica: props.t.restricaoDica })
  const x = resumoDeOutras(props.estado, c)
  if (x)
    saida.push({ rotulo: props.t.outrasDeTotal(x.n, x.total), icone: 'i-lucide-ellipsis', dica: props.t.restricaoDica })
  if (temRegraDeItens(props.estado, c)) {
    const dica = acoesDeAlcance.map(a => regraDaCelula(c, a)?.dica).filter(Boolean).join(' ')
    saida.push({ rotulo: props.t.filtros.comItens, icone: 'i-lucide-user-round-check', dica })
  }
  return saida
}

/** Rodada 7: Exportar, Ver histórico, Comentar e Excluir definitivamente, por categoria. */
const outraMarcada = (c: CategoriaMock, o: OutraDeItem) => outraLiberada(props.estado, c, o) && props.estado.categorias[c.id]!.outras.includes(o)

function definirOutra(c: CategoriaMock, o: OutraDeItem, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  e.outras = valor ? [...new Set([...e.outras, o])] : e.outras.filter(x => x !== o)
}

const valorNaOrigem = (c: CategoriaMock, a: Acao, o: number) =>
  acoesDaCategoria(props.estado, c.id)[a] && liberadoNaOrigem(props.estado, c, a, o)

const colunas = computed<TableColumn<Linha>[]>(() => [
  { id: 'nome', header: props.t.colunaCategoria, meta: { class: { th: 'w-auto', td: 'w-auto' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-20 px-0', td: 'text-center w-20 px-0' } } })),
  { id: 'restricoes', header: props.t.colunaRestricoes, meta: { class: { th: 'w-96', td: 'w-96' } } },
])

const meta = {
  class: {
    tr: (row: { original: Linha }) => {
      const l = row.original
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

    <!-- Rodada 6: o padrão vale só para categoria nova e fica fora da tabela. -->
    <PadraoParaNovas :t="t" :estado="estado" :salvo="salvo" :somente-leitura="somenteLeitura" />

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
        <!-- Categoria: a seta e o nome abrem as sublinhas (a única porta). -->
        <span v-if="row.original.tipo === 'categoria'" class="flex min-w-0 items-center gap-2">
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
          <button
            type="button"
            class="group flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-primary"
            :aria-expanded="abertas.includes(row.original.c.id)"
            :aria-label="t.expandir(row.original.c.name)"
            @click="alternarAberta(row.original.c)"
          >
            <UIcon :name="row.original.c.icon ?? 'i-lucide-file'" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span class="flex min-w-0 items-center gap-2">
                <span class="truncate text-sm font-medium text-default transition-colors group-hover:text-highlighted" :title="row.original.c.name">{{ row.original.c.name }}</span>
                <span v-if="alterada(row.original.c)" class="size-1.5 shrink-0 rounded-full bg-warning" :title="t.alterada" />
              </span>
              <span class="block truncate text-xs text-muted">{{ t.meta(row.original.c.campos.length, row.original.c.formularios.length) }}</span>
            </span>
          </button>
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

        <!-- Sublinha: outras ações de item (rodada 7) -->
        <span v-else-if="row.original.tipo === 'outras'" class="flex min-w-0 items-center gap-2 pl-16">
          <UIcon name="i-lucide-ellipsis" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0">
            <span class="block text-sm text-default">{{ t.subOutras }}</span>
            <span class="block truncate text-xs text-muted">{{ t.subOutrasDesc }}</span>
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
        <!-- Categoria: marcada, vazia ou parcial com traço. -->
        <CaixaDePermissao
          v-if="row.original.tipo === 'categoria'"
          :valor="valorDaCelula(row.original.c, a)"
          :rotulo="`${t.acoes[a]}: ${row.original.c.name}`"
          :travada-por="parcial(row.original.c, a) || parcialPorOrigem(estado, row.original.c, a) ? null : travadaPor(acoesDaCategoria(estado, row.original.c.id), a)"
          :dica="dicaDaCelula(row.original.c, a)"
          :desabilitada="somenteLeitura"
          :regra="regraDaCelula(row.original.c, a)"
          @alterar="v => clicarCelula(row.original.c, a, v)"
        />

        <!-- Campos: todos, parte ou nenhum, por ação. O clique abre o campo a campo. -->
        <template v-else-if="row.original.tipo === 'campos'">
          <UCheckbox
            v-if="(acoesDeCampo as Acao[]).includes(a)"
            :model-value="valorDeCampos(row.original.c, a as AcaoDeCampo)"
            :disabled="somenteLeitura || !acoesDaCategoria(estado, row.original.c.id)[a]"
            :aria-label="`${t.subCampos}: ${t.acoes[a]}`"
            class="inline-flex"
            @update:model-value="emit('campos', row.original.c)"
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
            :dica="acoesDaCategoria(estado, row.original.c.id)[a] ? '' : t.acaoDesligada(t.acoes[a])"
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
        <span v-else-if="row.original.tipo === 'outras'" class="text-dimmed" aria-hidden="true">·</span>
      </template>

      <!-- ───────── Restrições: só o resumo; o clique abre a categoria. ───────── -->
      <template #restricoes-cell="{ row }">
        <template v-if="row.original.tipo === 'categoria'">
          <span v-if="!temAcesso(estado, row.original.c.id)" class="text-xs text-dimmed">{{ t.filtros.semAcesso }}</span>
          <span v-else-if="!restricoes(row.original.c).length" class="text-xs text-muted">{{ t.semRestricao }}</span>
          <span v-else class="flex flex-wrap gap-1.5">
            <UTooltip v-for="r in restricoes(row.original.c)" :key="r.rotulo" :text="r.dica || t.restricaoDica">
              <UButton
                :label="r.rotulo"
                :icon="r.icone"
                color="warning"
                variant="outline"
                size="xs"
                :aria-label="`${r.rotulo}: ${t.expandir(row.original.c.name)}`"
                @click="abrir(row.original.c)"
              />
            </UTooltip>
          </span>
        </template>
        <!-- Os campos Pessoa que contam como responsável (antes no editor de Quais itens). -->
        <template v-else-if="row.original.tipo === 'responsavel'">
          <USelectMenu
            v-if="camposPessoa(row.original.c).length"
            :model-value="camposDoResponsavel(row.original.c)"
            :items="camposPessoa(row.original.c).map(f => ({ label: f.label ?? f.name, value: f.name }))"
            value-key="value"
            multiple
            size="xs"
            icon="i-lucide-user-check"
            :placeholder="t.campoPessoaPlaceholder"
            :aria-label="t.campoPessoa"
            :disabled="somenteLeitura"
            class="w-full max-w-80"
            @update:model-value="(v: string[]) => definirCamposDoResponsavel(row.original.c, v)"
          />
        </template>
        <!-- Outras ações: cada uma exige uma ação da categoria (Exportar exige Ver). -->
        <span v-else-if="row.original.tipo === 'outras'" class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <UTooltip
            v-for="o in outrasDeItem"
            :key="o"
            :text="outraLiberada(estado, row.original.c, o) ? '' : t.outraExige(t.acoes[exigeDaOutra[o]])"
            :disabled="outraLiberada(estado, row.original.c, o)"
          >
            <UCheckbox
              :model-value="outraMarcada(row.original.c, o)"
              :label="t.outras[o]"
              :disabled="somenteLeitura || !outraLiberada(estado, row.original.c, o)"
              size="sm"
              @update:model-value="v => definirOutra(row.original.c, o, v === true)"
            />
          </UTooltip>
        </span>
        <!-- O que vale para o formulário criado depois, ao lado da última origem. -->
        <p v-else-if="row.original.tipo === 'semForm'" class="flex items-start gap-1.5 whitespace-normal text-xs text-muted">
          <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
          {{ t.formNovoAviso }}
        </p>
        <UButton
          v-else-if="row.original.tipo === 'campos'"
          :label="t.escolherCampos"
          icon="i-lucide-sliders-horizontal"
          size="xs"
          variant="outline"
          color="neutral"
          @click="emit('campos', row.original.c)"
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
  </section>
</template>
