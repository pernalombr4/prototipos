<script setup lang="ts">
/**
 * PROPOSTA: um bloco da expressão, desenhado em linha, como uma frase.
 *
 * Cada parte composta (conta, comparação, função) fica numa moldura própria:
 * a moldura é o parêntese. Quem lê vê o agrupamento sem contar parênteses, e o
 * texto gerado põe só os parênteses que a precedência pede.
 *
 * A lacuna é o único lugar onde se escolhe algo novo. Não há arrastar nem
 * canvas: o canvas do develop corta o botão "Adicionar campo" e obriga a escolher
 * a operação antes dos valores (prints develop-03 e develop-01).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { type AcaoData, type Agregacao, type Contexto, type No, type NomeFuncao, type OpCompara, type OpConta, type Tipo, type Unidade, FUNCOES, campoPorRef, lacuna, novoId, percorrer, tipoDoNo } from './arvore'
import { CONSTRUTOR } from './contexto'
import Seletor from './_Seletor.vue'

defineOptions({ name: 'BlocoDaExpressao' })

const props = defineProps<{
  no: No
  contexto: Contexto
  profundidade: number
  /** Tipo que a lacuna deve esperar, quando o vizinho já decidiu (ex.: o 2º lado de uma comparação). */
  espera?: Tipo
}>()

const c = inject(CONSTRUTOR)!
const t = computed(() => c.t.value)
const hoje = computed(() => c.modo.value === 'hoje')

const ICONES = {
  numero: 'i-lucide-hash',
  texto: 'i-lucide-type',
  data: 'i-lucide-calendar',
  logico: 'i-lucide-toggle-left',
  lista: 'i-lucide-rows-3',
  qualquer: 'i-lucide-circle-dashed',
} as const

const tipo = computed(() => tipoDoNo(props.no, c.campos))
const destacado = computed(() => c.destacado.value === props.no.id)

/** Contexto dos filhos: no modo hoje, o que está dentro de uma data não é conta. */
const contextoDosFilhos = computed<Contexto>(() => (props.no.k === 'data' ? 'data' : 'conta'))

/* ---------- edição ---------- */

function mudar(parcial: Record<string, unknown>) {
  c.trocar(props.no.id, { ...props.no, ...parcial } as No)
}

const seletorAberto = ref(false)
const entrada = ref<{ $el?: HTMLElement } | null>(null)
watch(() => c.abrirSeletor.value, (id) => {
  if (id !== props.no.id) return
  c.abrirSeletor.value = null
  // Lacuna abre o seletor; valor fixo recebe o foco para digitar.
  if (props.no.k === 'lacuna') seletorAberto.value = true
  else nextTick(() => entrada.value?.$el?.querySelector('input')?.focus())
}, { immediate: true })

/** Depois de escolher, o próximo passo já fica à mão: foco no valor fixo ou a 1ª lacuna aberta. */
function escolheu(novo: No) {
  c.trocar(props.no.id, novo)
  let proxima: string | null = null
  if (novo.k === 'texto' || novo.k === 'numero') proxima = novo.id
  else percorrer(novo, (n) => { if (!proxima && n.k === 'lacuna') proxima = n.id })
  if (proxima) setTimeout(() => { c.abrirSeletor.value = proxima }, 120)
}

function trocarPorLacuna() {
  const nova = lacuna(tipo.value)
  c.trocar(props.no.id, nova)
  nextTick(() => { c.abrirSeletor.value = nova.id })
}

/** "Usar dentro de": o bloco vira a primeira parte de uma conta, comparação, condição ou função. */
function envolver(como: 'conta' | 'compara' | 'se' | 'funcao', op?: string) {
  const no = props.no
  let novo: No
  if (como === 'conta') novo = { id: novoId(), k: 'conta', op: op as OpConta, a: no, b: lacuna('numero') }
  else if (como === 'compara') novo = { id: novoId(), k: 'compara', op: '==', a: no, b: lacuna(tipo.value) }
  else if (como === 'se') novo = { id: novoId(), k: 'se', cond: lacuna('logico'), entao: no, senao: lacuna(tipo.value) }
  else novo = { id: novoId(), k: 'funcao', nome: op as NomeFuncao, args: op === 'arredondar' ? [no, { id: novoId(), k: 'numero', valor: 2 }] : [no] }
  c.trocar(no.id, novo)
}

const menu = computed<DropdownMenuItem[][]>(() => {
  const b = t.value.blocos
  const dentro: DropdownMenuItem[] = []
  const podeConta = (tipo.value === 'numero' || tipo.value === 'qualquer') && !(hoje.value && props.contexto === 'data')
  if (podeConta) {
    dentro.push({
      label: b.menu.emConta,
      icon: 'i-lucide-calculator',
      children: (['+', '-', '*', '/'] as OpConta[]).map(op => ({ label: `${simbolo(op)}  ${b.contas[op]}`, onSelect: () => envolver('conta', op) })),
    })
    dentro.push({
      label: b.menu.emFuncao,
      icon: 'i-lucide-function-square',
      children: (['arredondar', 'paraBaixo', 'paraCima', 'absoluto'] as NomeFuncao[]).map(f => ({ label: b.funcoes[f], onSelect: () => envolver('funcao', f) })),
    })
  }
  if (!(hoje.value && (tipo.value === 'data' || props.contexto === 'data'))) {
    dentro.push({ label: b.menu.emComparacao, icon: 'i-lucide-equal', onSelect: () => envolver('compara') })
    if (tipo.value !== 'logico') dentro.push({ label: b.menu.emCondicao, icon: 'i-lucide-split', onSelect: () => envolver('se') })
  }
  const grupos: DropdownMenuItem[][] = [[{ label: b.menu.trocar, icon: 'i-lucide-replace', onSelect: trocarPorLacuna }]]
  if (dentro.length) grupos.push([{ type: 'label', label: b.menu.envolver }, ...dentro])
  grupos.push([{ label: b.menu.remover, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => c.remover(props.no.id) }])
  return grupos
})

/* ---------- rótulos ---------- */

function simbolo(op: OpConta) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^', '%': '%' }[op]
}

const opsConta = computed(() => (['+', '-', '*', '/', '^', '%'] as OpConta[]).map(op => ({ label: `${simbolo(op)}  ${t.value.blocos.contas[op]}`, value: op })))
const opsCompara = computed(() => (['==', '!=', '>', '<', '>=', '<='] as OpCompara[]).map(op => ({ label: t.value.blocos.compara[op], value: op })))
const opsLogica = computed(() => [{ label: t.value.blocos.e.toUpperCase(), value: 'and' }, { label: t.value.blocos.ou.toUpperCase(), value: 'or' }])
const unidades = computed(() => (['day', 'week', 'month', 'year'] as Unidade[])
  .filter(u => !(hoje.value && u === 'week' && props.no.k === 'data' && props.no.acao !== 'diferenca'))
  .map(u => ({ label: t.value.blocos.unidades[u], value: u })))
const agregacoes = computed(() => (['somar', 'contar', 'media', 'maior', 'menor'] as Agregacao[])
  .filter(a => !hoje.value || a === 'somar')
  .map(a => ({ label: t.value.blocos.agregacoes[a], value: a })))

const listas = computed(() => c.campos.filter(x => x.tipo === 'lista').map(x => ({ label: x.nome, value: x.ref })))
const colunasDaLista = computed(() => {
  if (props.no.k !== 'lista' && props.no.k !== 'cada') return []
  const l = campoPorRef(c.campos, props.no.lista)
  const so = props.no.k === 'lista' && props.no.ag !== 'contar' ? l?.colunas?.filter(x => x.tipo === 'numero') : l?.colunas
  return (so ?? []).map(x => ({ label: x.nome, value: x.ref }))
})

/** Comparação: o 2º lado espera o tipo do 1º e, se ele é lista de seleção, oferece as opções. */
const ladoA = computed(() => (props.no.k === 'compara' ? props.no.a : null))
const tipoDoLadoA = computed<Tipo | undefined>(() => (ladoA.value && ladoA.value.k !== 'lacuna' ? tipoDoNo(ladoA.value, c.campos) : undefined))
const opcoesDoLadoA = computed(() => (ladoA.value?.k === 'campo' ? campoPorRef(c.campos, ladoA.value.ref)?.opcoes : undefined))

function escolherOpcao(valor: string) {
  if (props.no.k !== 'compara') return
  c.trocar(props.no.b.id, { id: novoId(), k: 'texto', valor })
}

/* ---------- valores fixos ---------- */

const textoDoNumero = ref('')
watch(() => props.no, (n) => {
  if (n.k === 'numero') textoDoNumero.value = n.valor === null ? '' : String(n.valor).replace('.', ',')
}, { immediate: true })

function lerNumero(v: string | number) {
  textoDoNumero.value = String(v)
  const limpo = String(v).replace(/\./g, '').replace(',', '.').trim()
  const n = limpo === '' || limpo === '-' ? null : Number(limpo)
  mudar({ valor: n === null || Number.isNaN(n) ? null : n })
}

const campo = computed(() => (props.no.k === 'campo' ? campoPorRef(c.campos, props.no.ref) : undefined))
const ehPasso = computed(() => props.no.k === 'campo' && !!props.no.passo)

const moldura = computed(() => [
  'inline-flex max-w-full flex-wrap items-center gap-1 rounded-lg border px-1.5 py-1 transition-colors',
  // O menu do bloco só aparece no bloco sob o mouse ou com foco: 1 menu por moldura polui a frase.
  '[&>button:last-child]:opacity-0 [&:hover>button:last-child]:opacity-100 [&:focus-within>button:last-child]:opacity-100',
  props.profundidade % 2 ? 'border-default bg-default' : 'border-default bg-elevated/70',
  destacado.value ? 'ring-2 ring-error ring-offset-1 ring-offset-default' : '',
])

const raiz = ref<HTMLElement | null>(null)
watch(destacado, (d) => {
  if (d) raiz.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})
</script>

<template>
  <!-- Lacuna: o único lugar onde se escolhe algo novo -->
  <Seletor
    v-if="no.k === 'lacuna'"
    v-model:aberto="seletorAberto"
    :t="t"
    :modo="c.modo.value"
    :espera="espera && no.espera === 'qualquer' ? espera : no.espera"
    :contexto="contexto"
    :campos="c.campos"
    :passos="c.passos.value"
    @escolher="escolheu"
  >
    <button
      :id="`bloco-${no.id}`"
      type="button"
      class="inline-flex h-7 items-center gap-1 rounded-md border border-dashed px-2 text-xs font-medium transition-all hover:-translate-y-px hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
      :class="destacado ? 'border-error text-error' : 'border-accented text-muted'"
      :aria-label="`${t.blocos.escolher}: ${t.blocos.lacuna[no.espera]}`"
    >
      <UIcon name="i-lucide-plus" class="size-3.5" />
      {{ t.blocos.lacuna[no.espera] }}
    </button>
  </Seletor>

  <!-- Campo: o nome que a pessoa conhece, com o tipo no ícone -->
  <UPopover v-else-if="no.k === 'campo'" :content="{ align: 'start', sideOffset: 6 }">
    <button
      :id="`bloco-${no.id}`"
      ref="raiz"
      type="button"
      class="inline-flex h-7 max-w-full items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-all hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-primary"
      :class="[ehPasso ? 'bg-secondary/10 text-secondary ring-1 ring-secondary/30' : campo ? 'bg-primary/10 text-primary ring-1 ring-primary/25' : 'bg-error/10 text-error ring-1 ring-error/40', destacado ? 'ring-2 ring-error' : '']"
    >
      <UIcon :name="ehPasso ? 'i-lucide-variable' : ICONES[campo?.tipo ?? 'qualquer']" class="size-3.5 shrink-0" />
      <span class="truncate">{{ ehPasso ? no.ref : campo?.nome ?? no.ref }}</span>
      <span v-if="no.seVazio !== undefined && !ehPasso" class="rounded bg-default/70 px-1 text-[10px] font-normal text-muted">∅ {{ no.seVazio }}</span>
    </button>
    <template #content>
      <div class="flex w-72 flex-col gap-3 p-3">
        <p class="text-xs text-muted">
          <code class="rounded bg-elevated px-1 py-0.5 text-[11px]">{{ ehPasso ? no.ref : `data.${no.ref}` }}</code>
        </p>
        <UFormField v-if="!ehPasso && campo && campo.tipo !== 'data' && campo.tipo !== 'lista'" :label="t.blocos.menu.seVazio" :help="t.blocos.menu.seVazioAjuda" size="sm">
          <USelect
            v-if="campo.tipo === 'logico'"
            :model-value="no.seVazio ?? 'false'"
            :items="[{ label: t.blocos.falso, value: 'false' }, { label: t.blocos.verdadeiro, value: 'true' }]"
            size="sm"
            class="w-full"
            @update:model-value="(v) => mudar({ seVazio: String(v) })"
          />
          <UInput
            v-else
            :model-value="no.seVazio ?? ''"
            size="sm"
            class="w-full"
            @update:model-value="(v) => mudar({ seVazio: String(v) === '' && campo?.tipo === 'texto' ? undefined : String(v) })"
          />
        </UFormField>
        <div class="flex flex-wrap gap-1.5">
          <UButton :label="t.blocos.menu.trocar" icon="i-lucide-replace" size="xs" color="neutral" variant="outline" @click="trocarPorLacuna" />
          <UDropdownMenu :items="menu.slice(1, -1)" :content="{ align: 'start' }">
            <UButton :label="t.blocos.menu.envolver" icon="i-lucide-brackets" trailing-icon="i-lucide-chevron-down" size="xs" color="neutral" variant="outline" />
          </UDropdownMenu>
          <UButton :label="t.blocos.menu.remover" icon="i-lucide-trash-2" size="xs" color="error" variant="outline" @click="c.remover(no.id)" />
        </div>
      </div>
    </template>
  </UPopover>

  <!-- Valores fixos -->
  <span v-else-if="no.k === 'numero' || no.k === 'texto' || no.k === 'logico' || no.k === 'hoje'" :id="`bloco-${no.id}`" ref="raiz" class="inline-flex items-center gap-0.5 [&>button:last-child]:opacity-0 [&:hover>button:last-child]:opacity-100 [&:focus-within>button:last-child]:opacity-100" :class="destacado ? 'rounded-md ring-2 ring-error' : ''">
    <UInput
      v-if="no.k === 'numero'"
      ref="entrada"
      :model-value="textoDoNumero"
      inputmode="decimal"
      size="xs"
      placeholder="0"
      class="w-20"
      :aria-label="t.seletor.itens.numero![0]"
      :ui="{ base: 'font-mono tabular-nums' }"
      @update:model-value="lerNumero"
    />
    <UInput
      v-else-if="no.k === 'texto'"
      ref="entrada"
      :model-value="no.valor"
      size="xs"
      icon="i-lucide-quote"
      class="min-w-28"
      :style="{ width: `${Math.min(Math.max(no.valor.length, 8), 40) + 7}ch` }"
      :aria-label="t.seletor.itens.texto![0]"
      @update:model-value="(v) => mudar({ valor: String(v) })"
    />
    <USelect
      v-else-if="no.k === 'logico'"
      :model-value="no.valor ? 'true' : 'false'"
      :items="[{ label: t.blocos.verdadeiro, value: 'true' }, { label: t.blocos.falso, value: 'false' }]"
      size="xs"
      class="w-28"
      @update:model-value="(v) => mudar({ valor: v === 'true' })"
    />
    <UBadge v-else :label="t.blocos.hoje" icon="i-lucide-calendar-check" color="primary" variant="soft" size="md" />
    <UDropdownMenu :items="menu" :content="{ align: 'start' }">
      <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" class="transition-opacity" :aria-label="t.blocos.menu.trocar" />
    </UDropdownMenu>
  </span>

  <!-- Se, então, senão: bloco de linha inteira -->
  <div
    v-else-if="no.k === 'se'"
    :id="`bloco-${no.id}`"
    ref="raiz"
    class="flex w-full min-w-0 flex-col gap-1.5 rounded-lg border border-default border-l-4 border-l-primary bg-elevated/50 p-2"
    :class="destacado ? 'ring-2 ring-error' : ''"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="w-14 shrink-0 text-xs font-semibold uppercase tracking-wide text-primary">{{ t.blocos.se }}</span>
      <BlocoDaExpressao :no="no.cond" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
      <UDropdownMenu :items="menu" :content="{ align: 'end' }">
        <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" class="ml-auto" :aria-label="t.blocos.menu.trocar" />
      </UDropdownMenu>
    </div>
    <div class="flex flex-wrap items-start gap-1.5">
      <span class="w-14 shrink-0 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.blocos.entao }}</span>
      <BlocoDaExpressao :no="no.entao" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </div>
    <div class="flex flex-wrap items-start gap-1.5">
      <span class="w-14 shrink-0 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.blocos.senao }}</span>
      <BlocoDaExpressao :no="no.senao" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </div>
  </div>

  <!-- Trecho de texto que o construtor não desenha -->
  <span
    v-else-if="no.k === 'trecho'"
    :id="`bloco-${no.id}`"
    ref="raiz"
    class="inline-flex max-w-full items-center gap-1.5 rounded-md border border-dashed border-warning/60 bg-warning/5 px-2 py-1"
    :class="destacado ? 'ring-2 ring-error' : ''"
  >
    <UTooltip :text="t.blocos.trechoMotivo[no.motivo] ?? t.blocos.trechoMotivo.outro">
      <UIcon name="i-lucide-code-xml" class="size-3.5 shrink-0 text-warning" />
    </UTooltip>
    <code class="truncate text-xs text-highlighted">{{ no.texto }}</code>
    <UButton :label="t.blocos.editarNoTexto" size="xs" color="warning" variant="link" @click="c.irParaTexto()" />
  </span>

  <!-- Para cada linha -->
  <div
    v-else-if="no.k === 'cada'"
    :id="`bloco-${no.id}`"
    ref="raiz"
    class="flex w-full flex-col gap-2 rounded-lg border border-default border-l-4 border-l-secondary bg-elevated/50 p-2"
    :class="destacado ? 'ring-2 ring-error' : ''"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <UIcon name="i-lucide-repeat" class="size-4 text-secondary" />
      <span class="text-xs font-semibold text-highlighted">{{ t.blocos.paraCada }}</span>
      <USelect :model-value="no.lista" :items="listas" size="xs" class="w-36" @update:model-value="(v) => mudar({ lista: v })" />
      <UDropdownMenu :items="menu" :content="{ align: 'end' }">
        <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" class="ml-auto" :aria-label="t.blocos.menu.trocar" />
      </UDropdownMenu>
    </div>
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="w-14 shrink-0 text-xs text-muted">{{ t.blocos.mostrar }}</span>
      <UInput :model-value="no.corpo" size="xs" class="min-w-48 flex-1 font-mono" @update:model-value="(v) => mudar({ corpo: String(v) })" />
      <UDropdownMenu :items="[colunasDaLista.map(col => ({ label: col.label, onSelect: () => mudar({ corpo: `${no.k === 'cada' ? no.corpo : ''}{{${col.value}}}` }) }))]">
        <UButton :label="t.blocos.inserirColuna" icon="i-lucide-columns-3" size="xs" color="neutral" variant="outline" />
      </UDropdownMenu>
    </div>
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="w-14 shrink-0 text-xs text-muted">{{ t.blocos.separadasPor }}</span>
      <UInput :model-value="no.separador" size="xs" class="w-24 font-mono" @update:model-value="(v) => mudar({ separador: String(v) })" />
    </div>
  </div>

  <!-- Blocos compostos, em linha, cada um na sua moldura -->
  <span v-else :id="`bloco-${no.id}`" ref="raiz" :class="moldura">
    <template v-if="no.k === 'conta'">
      <BlocoDaExpressao :no="no.a" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
      <USelect
        :model-value="no.op"
        :items="opsConta"
        size="xs"
        variant="soft"
        color="primary"
        class="w-auto"
        :ui="{ base: 'font-semibold', value: 'font-mono text-sm' }"
        :aria-label="t.seletor.grupos.contas"
        @update:model-value="(v) => mudar({ op: v })"
      >
        <template #default="{ modelValue }">
          <span class="font-mono text-sm font-semibold">{{ simbolo(modelValue as OpConta) }}</span>
        </template>
      </USelect>
      <BlocoDaExpressao :no="no.b" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </template>

    <template v-else-if="no.k === 'compara'">
      <BlocoDaExpressao :no="no.a" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
      <USelect :model-value="no.op" :items="opsCompara" size="xs" variant="soft" color="primary" class="w-auto" :aria-label="t.seletor.grupos.comparacao" @update:model-value="(v) => mudar({ op: v })" />
      <USelect
        v-if="opcoesDoLadoA && (no.b.k === 'lacuna' || (no.b.k === 'texto' && opcoesDoLadoA.includes(no.b.valor)))"
        :model-value="no.b.k === 'texto' ? no.b.valor : undefined"
        :items="opcoesDoLadoA"
        :placeholder="t.blocos.escolher"
        size="xs"
        icon="i-lucide-list"
        class="w-40"
        @update:model-value="(v) => escolherOpcao(String(v))"
      />
      <BlocoDaExpressao v-else :no="no.b" :espera="tipoDoLadoA" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </template>

    <template v-else-if="no.k === 'logica'">
      <BlocoDaExpressao :no="no.a" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
      <USelect :model-value="no.op" :items="opsLogica" size="xs" variant="solid" color="primary" class="w-auto" @update:model-value="(v) => mudar({ op: v })" />
      <BlocoDaExpressao :no="no.b" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </template>

    <template v-else-if="no.k === 'nao'">
      <UBadge :label="t.blocos.nao.toUpperCase()" color="primary" variant="solid" size="sm" />
      <BlocoDaExpressao :no="no.a" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
    </template>

    <template v-else-if="no.k === 'funcao'">
      <span class="text-xs font-semibold text-highlighted">{{ t.blocos.funcoes[no.nome] }}</span>
      <template v-for="(arg, i) in no.args" :key="arg.id">
        <span v-if="no.nome === 'arredondar' && i === 1" class="text-xs text-muted">{{ t.blocos.comCasas }}</span>
        <span v-else-if="i > 0" class="text-xs text-muted">,</span>
        <BlocoDaExpressao :no="arg" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
      </template>
      <UButton
        v-if="FUNCOES[no.nome].variadico"
        icon="i-lucide-plus"
        size="xs"
        color="neutral"
        variant="ghost"
        :aria-label="t.blocos.maisUmValor"
        @click="mudar({ args: [...no.args, lacuna(FUNCOES[no.nome].args[0]!.tipo)] })"
      />
    </template>

    <template v-else-if="no.k === 'lista'">
      <USelect :model-value="no.ag" :items="agregacoes" size="xs" variant="ghost" class="w-auto" :ui="{ base: 'font-semibold' }" @update:model-value="(v) => mudar({ ag: v as Agregacao })" />
      <USelect :model-value="no.lista" :items="listas" size="xs" class="w-32" @update:model-value="(v) => mudar({ lista: v })" />
      <template v-if="no.ag !== 'contar'">
        <span class="text-xs text-muted">{{ t.blocos.coluna }}</span>
        <USelect :model-value="no.coluna" :items="colunasDaLista" size="xs" class="w-28" @update:model-value="(v) => mudar({ coluna: v })" />
      </template>
      <template v-if="!hoje">
        <template v-if="no.filtro">
          <span class="text-xs text-muted">{{ t.blocos.onde }}</span>
          <USelect
            :model-value="no.filtro.coluna"
            :items="(campoPorRef(c.campos, no.lista)?.colunas ?? []).map(x => ({ label: x.nome, value: x.ref }))"
            size="xs"
            class="w-28"
            @update:model-value="(v) => no.k === 'lista' && mudar({ filtro: { ...no.filtro!, coluna: v } })"
          />
          <span class="text-xs text-muted">{{ t.blocos.igualA }}</span>
          <BlocoDaExpressao :no="no.filtro.valor" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
          <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.blocos.menu.remover" @click="mudar({ filtro: undefined })" />
        </template>
        <UButton
          v-else
          :label="t.blocos.semFiltro"
          icon="i-lucide-filter"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="mudar({ filtro: { coluna: campoPorRef(c.campos, no.lista)?.colunas?.find(x => x.tipo === 'texto')?.ref ?? '', valor: { id: novoId(), k: 'texto', valor: '' } } })"
        />
      </template>
    </template>

    <template v-else-if="no.k === 'data'">
      <template v-if="no.acao === 'diferenca'">
        <span class="text-xs font-semibold text-highlighted">{{ t.blocos.datas.diferenca }}</span>
        <BlocoDaExpressao :no="no.base" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
        <span class="text-xs text-muted">{{ t.blocos.datas.e }}</span>
        <BlocoDaExpressao :no="no.outra ?? lacuna('data')" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
        <span class="text-xs text-muted">{{ t.blocos.datas.em }}</span>
        <USelect :model-value="no.unidade ?? 'day'" :items="unidades" size="xs" class="w-28" @update:model-value="(v) => mudar({ unidade: v as Unidade })" />
      </template>
      <template v-else-if="no.acao === 'formatar'">
        <BlocoDaExpressao :no="no.base" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
        <span class="text-xs text-muted">{{ t.blocos.datas.formatar }}</span>
        <USelect
          :model-value="no.padrao ?? 'DD/MM/YYYY'"
          :items="['DD/MM/YYYY', 'DD/MM', 'MM/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY HH:mm']"
          size="xs"
          class="w-40 font-mono"
          @update:model-value="(v) => mudar({ padrao: v })"
        />
      </template>
      <template v-else>
        <BlocoDaExpressao :no="no.base" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
        <USelect
          :model-value="no.acao"
          :items="[{ label: t.blocos.datas.somar, value: 'somar' }, { label: t.blocos.datas.subtrair, value: 'subtrair' }]"
          size="xs"
          variant="soft"
          color="primary"
          class="w-auto"
          @update:model-value="(v) => mudar({ acao: v as AcaoData })"
        />
        <BlocoDaExpressao :no="no.qtd ?? lacuna('numero')" :contexto="contextoDosFilhos" :profundidade="profundidade + 1" />
        <USelect :model-value="no.unidade ?? 'day'" :items="unidades" size="xs" class="w-28" @update:model-value="(v) => mudar({ unidade: v as Unidade })" />
      </template>
    </template>

    <UDropdownMenu :items="menu" :content="{ align: 'end' }">
      <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" class="transition-opacity" :aria-label="t.blocos.menu.trocar" />
    </UDropdownMenu>
  </span>
</template>
