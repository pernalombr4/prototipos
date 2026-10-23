<script setup lang="ts">
/**
 * PROPOSTA: o painel "Configurar visualização", à direita da tabela.
 *
 * Substitui o modal de hoje, que cobre a tabela, abre outro modal por filtro e
 * promete um preview que não aparece. Aqui o painel não cobre nada: a tabela
 * encolhe e cada ajuste aparece nela na hora (o preview é a própria tabela).
 *
 * O painel mexe num RASCUNHO da visualização ativa. Salvar grava; Descartar
 * volta ao salvo; fechar o painel mantém o rascunho na tela, com o ponto de
 * "não salva" na pílula, como o filtro mexido pela barra de ferramentas.
 *
 * Na implementação, este é o `inspector` do `EnLayout` (variant
 * `sidebar-right`). Aqui é uma coluna dentro do conteúdo, para o protótipo
 * controlar abrir e fechar.
 */
import type { FiltroDeCampo, Ordenacao, Visualizacao } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, FUNCOES, GRUPOS, ICONE_DO_TIPO, PESSOAS, campoPorPath } from './mocks'

const props = defineProps<{
  t: Textos
  modificada: boolean
  salvando: boolean
  /** Itens (do sistema) não se altera: o caminho é salvar como nova (Polaris e SAP fazem igual). */
  soComoNova: boolean
}>()

const rascunho = defineModel<Visualizacao>({ required: true })

const emit = defineEmits<{
  salvar: []
  descartar: []
  fechar: []
}>()

/** Atualiza o rascunho sem mutar o objeto (o pai compara com o salvo). */
function mudar(fn: (v: Visualizacao) => void) {
  const copia = structuredClone(toRaw(rascunho.value))
  fn(copia)
  rascunho.value = copia
}

/* ---------- nome, ícone e tipo ---------- */

const iconeAberto = ref(false)
const iconeSemPrefixo = computed({
  get: () => (rascunho.value.icon ?? 'i-lucide-table').replace(/^i-lucide-/, ''),
  set: (v: string) => {
    mudar(x => { x.icon = `i-lucide-${v}` })
    iconeAberto.value = false
  },
})

const camposDeAgrupar = computed(() => CAMPOS.filter(c => c.tipo === 'selecao').map(c => ({ label: c.label, value: c.path })))

/* ---------- colunas ---------- */

const visiveis = computed(() => (rascunho.value.config.columns ?? []).map(c => c.path))
const ocultas = computed(() => CAMPOS.filter(c => !visiveis.value.includes(c.path)).map(c => c.path))
const buscaColuna = ref('')
const casaBusca = (path: string) => !buscaColuna.value.trim() || campoPorPath(path)!.label.toLowerCase().includes(buscaColuna.value.trim().toLowerCase())

function alternarColuna(path: string) {
  mudar((x) => {
    const cols = x.config.columns ?? []
    x.config.columns = cols.some(c => c.path === path)
      ? cols.filter(c => c.path !== path)
      : [...cols, { path, label: campoPorPath(path)!.label }]
  })
}

function moverColuna(de: number, para: number) {
  if (para < 0 || para >= visiveis.value.length || de === para) return
  mudar((x) => {
    const cols = [...(x.config.columns ?? [])]
    const [c] = cols.splice(de, 1)
    cols.splice(para, 0, c!)
    x.config.columns = cols
  })
}

/* Arrastar colunas: drag and drop nativo do navegador, com a linha-guia onde a coluna vai cair. */
const arrastandoColuna = ref<number | null>(null)
const alvoColuna = ref<number | null>(null)

function soltarColuna() {
  if (arrastandoColuna.value !== null && alvoColuna.value !== null) {
    const para = alvoColuna.value > arrastandoColuna.value ? alvoColuna.value - 1 : alvoColuna.value
    moverColuna(arrastandoColuna.value, para)
  }
  arrastandoColuna.value = null
  alvoColuna.value = null
}

/* ---------- filtros ---------- */

const rapidos = computed(() => (rascunho.value.filters.quick_filters ?? []).map(q => q.filter))

function alternarRapido(filtro: 'isOwner' | 'inGroups', ligado: boolean) {
  mudar((x) => {
    const lista = (x.filters.quick_filters ?? []).filter(q => q.filter !== filtro)
    x.filters.quick_filters = ligado ? [...lista, { filter: filtro, required: true }] : lista
  })
}

const OPERADORES: Record<string, string[]> = {
  texto: ['contains', 'eq', 'empty', 'not_empty'],
  selecao: ['eq', 'neq', 'empty', 'not_empty'],
  usuario: ['eq', 'empty', 'not_empty'],
  moeda: ['gte', 'lte', 'eq'],
  data: ['next_days', 'gte', 'lte', 'empty'],
}

const camposDeFiltro = computed(() => CAMPOS.map(c => ({ label: c.label, value: c.path, icon: ICONE_DO_TIPO[c.tipo] })))

function operadoresDe(field: string) {
  const tipo = campoPorPath(field)?.tipo ?? 'texto'
  return OPERADORES[tipo]!.map(op => ({ label: props.t.operadores[tipo === 'data' ? `data_${op}` : op] ?? op, value: op }))
}

const semValor = (op: string) => op === 'empty' || op === 'not_empty'

/** O filtro novo nasce num campo de seleção ainda sem filtro: repetir o campo zera a tabela ("Status é Em análise" e "Status é Aprovado"). */
function novoFiltro() {
  const usados = (rascunho.value.filters.field_filters ?? []).map(f => f.field)
  const campo = CAMPOS.find(c => c.tipo === 'selecao' && !usados.includes(c.path)) ?? CAMPOS.find(c => c.tipo === 'texto')!
  mudar((x) => {
    x.filters.field_filters = [...(x.filters.field_filters ?? []), campo.tipo === 'selecao'
      ? { field: campo.path, op: 'eq', value: campo.opcoes![0] }
      : { field: campo.path, op: 'contains', value: '' }]
  })
}

function mudarFiltro(i: number, parte: Partial<FiltroDeCampo>) {
  mudar((x) => {
    const lista = [...(x.filters.field_filters ?? [])]
    const atual = { ...lista[i]!, ...parte }
    if (parte.field) {
      const campo = campoPorPath(parte.field)!
      atual.op = OPERADORES[campo.tipo]![0]!
      atual.value = campo.opcoes?.[0] ?? (campo.tipo === 'moeda' ? 50000 : campo.tipo === 'data' ? 30 : campo.tipo === 'usuario' ? PESSOAS[0]!.id : '')
    }
    if (parte.op && campoPorPath(atual.field)?.tipo === 'data') {
      atual.value = parte.op === 'next_days' ? 30 : '2026-12-31'
    }
    lista[i] = atual
    x.filters.field_filters = lista
  })
}

function tirarFiltro(i: number) {
  mudar((x) => { x.filters.field_filters = (x.filters.field_filters ?? []).filter((_, j) => j !== i) })
}

/* ---------- ordenação ---------- */

const ordenacoes = computed<Ordenacao[]>(() => rascunho.value.config.sorts ?? [])

function novaOrdenacao() {
  const usado = ordenacoes.value.map(o => o.field)
  const campo = CAMPOS.find(c => !usado.includes(c.path))
  if (!campo) return
  mudar((x) => { x.config.sorts = [...(x.config.sorts ?? []), { field: campo.path, direction: 'asc' }] })
}

function mudarOrdenacao(i: number, parte: Partial<Ordenacao>) {
  mudar((x) => {
    const lista = [...(x.config.sorts ?? [])]
    lista[i] = { ...lista[i]!, ...parte }
    x.config.sorts = lista
  })
}

function tirarOrdenacao(i: number) {
  mudar((x) => { x.config.sorts = (x.config.sorts ?? []).filter((_, j) => j !== i) })
}

/* ---------- quem vê ---------- */

const quemVe = computed({
  get: () => rascunho.value.user ? 'eu' : (rascunho.value.module_groups?.length || rascunho.value.roles?.length) ? 'grupos' : 'todos',
  set: (v: string) => mudar((x) => {
    x.user = v === 'eu' ? 7 : null
    if (v !== 'grupos') {
      x.module_groups = null
      x.roles = null
    }
    else if (!x.module_groups?.length) {
      x.module_groups = [GRUPOS[0]!.id]
    }
  }),
})

const opcoesQuemVe = computed(() => [
  { value: 'todos', label: props.t.painel.quemVeTodos, description: props.t.painel.quemVeTodosAjuda },
  { value: 'eu', label: props.t.painel.quemVeEu, description: props.t.painel.quemVeEuAjuda },
  { value: 'grupos', label: props.t.painel.quemVeGrupos, description: props.t.painel.quemVeGruposAjuda },
])

const grupos = computed({
  get: () => rascunho.value.module_groups ?? [],
  set: (v: number[]) => mudar((x) => { x.module_groups = v }),
})
const funcoes = computed({
  get: () => rascunho.value.roles ?? [],
  set: (v: number[]) => mudar((x) => { x.roles = v }),
})
</script>

<template>
  <aside class="flex h-full w-[22.5rem] shrink-0 flex-col border-l border-default bg-default" :aria-label="t.painel.titulo">
    <header class="flex items-start gap-2 border-b border-default px-4 py-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-highlighted">{{ t.painel.titulo }}</p>
        <p class="text-xs text-muted">{{ t.painel.subtitulo }}</p>
      </div>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.comum.fechar" @click="emit('fechar')" />
    </header>

    <div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4">
      <!-- Nome, ícone, descrição -->
      <section class="space-y-3">
        <div class="flex items-end gap-2">
          <UPopover v-model:open="iconeAberto" :content="{ align: 'start' }">
            <UButton
              :icon="rascunho.icon ?? 'i-lucide-table'"
              color="neutral"
              variant="outline"
              class="size-8 justify-center"
              :aria-label="t.painel.trocarIcone"
            />
            <template #content>
              <div class="w-80 p-3">
                <UxSeletorDeIcones v-model="iconeSemPrefixo" :altura="220" />
              </div>
            </template>
          </UPopover>
          <UFormField :label="t.painel.nome" class="flex-1">
            <UInput :model-value="rascunho.name ?? ''" class="w-full" @update:model-value="(v: string) => mudar(x => { x.name = v })" />
          </UFormField>
        </div>
        <UFormField :label="t.painel.descricao" :hint="t.comum.opcional">
          <UTextarea
            :model-value="rascunho.description ?? ''"
            :rows="2"
            :placeholder="t.painel.descricaoExemplo"
            class="w-full"
            @update:model-value="(v: string) => mudar(x => { x.description = v || null })"
          />
        </UFormField>
      </section>

      <!-- Tipo -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.exibicao }}</h3>
        <UFieldGroup class="w-full">
          <UButton
            v-for="o in [{ v: 'table' as const, l: t.criar.tabela, i: 'i-lucide-table' }, { v: 'kanban' as const, l: t.criar.kanban, i: 'i-lucide-square-kanban' }]"
            :key="o.v"
            :label="o.l"
            :icon="o.i"
            :color="rascunho.model_type === o.v ? 'primary' : 'neutral'"
            :variant="rascunho.model_type === o.v ? 'soft' : 'outline'"
            :aria-pressed="rascunho.model_type === o.v"
            class="flex-1 justify-center"
            @click="mudar(x => { x.model_type = o.v; if (o.v === 'kanban' && !x.config.groupBy) x.config.groupBy = 'status' })"
          />
        </UFieldGroup>
        <UFormField v-if="rascunho.model_type === 'kanban'" :label="t.criar.agruparPor">
          <USelect
            :model-value="rascunho.config.groupBy ?? 'status'"
            :items="camposDeAgrupar"
            class="w-full"
            @update:model-value="(v: string) => mudar(x => { x.config.groupBy = v })"
          />
        </UFormField>
      </section>

      <!-- Colunas -->
      <section v-if="rascunho.model_type === 'table'" class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.colunas }}</h3>
          <span class="text-xs text-muted">{{ t.painel.colunasContagem(visiveis.length, CAMPOS.length) }}</span>
        </div>
        <UInput v-model="buscaColuna" icon="i-lucide-search" :placeholder="t.painel.buscarCampo" size="sm" class="w-full" />
        <p class="text-xs text-muted">{{ t.painel.colunasAjuda }}</p>

        <ul class="space-y-0.5" @dragover.prevent @drop.prevent="soltarColuna">
          <TransitionGroup
            move-class="transition-transform duration-200 ease-out"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
          >
            <li
              v-for="(path, i) in visiveis"
              v-show="casaBusca(path)"
              :key="path"
              draggable="true"
              class="group/col relative flex items-center gap-2 rounded-md px-1.5 py-1 text-sm text-default hover:bg-elevated"
              :class="arrastandoColuna === i ? 'opacity-40' : ''"
              @dragstart="arrastandoColuna = i"
              @dragend="arrastandoColuna = null; alvoColuna = null"
              @dragover.prevent="(e: DragEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); alvoColuna = e.clientY < r.top + r.height / 2 ? i : i + 1 }"
            >
              <span v-if="alvoColuna === i && arrastandoColuna !== null" class="absolute inset-x-1 -top-px h-0.5 rounded-full bg-primary" />
              <span v-if="alvoColuna === i + 1 && i === visiveis.length - 1 && arrastandoColuna !== null" class="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary" />
              <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-dimmed" />
              <UIcon :name="ICONE_DO_TIPO[campoPorPath(path)!.tipo]" class="size-4 shrink-0 text-muted" />
              <span class="flex-1 truncate">{{ campoPorPath(path)!.label }}</span>
              <span class="flex items-center opacity-0 transition-opacity group-hover/col:opacity-100 group-focus-within/col:opacity-100">
                <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="t.painel.subir(campoPorPath(path)!.label)" @click="moverColuna(i, i - 1)" />
                <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === visiveis.length - 1" :aria-label="t.painel.descer(campoPorPath(path)!.label)" @click="moverColuna(i, i + 1)" />
              </span>
              <UButton icon="i-lucide-eye" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.ocultarColuna(campoPorPath(path)!.label)" @click="alternarColuna(path)" />
            </li>
          </TransitionGroup>
        </ul>

        <template v-if="ocultas.length">
          <p class="pt-2 text-xs font-medium text-muted">{{ t.painel.ocultas }}</p>
          <ul class="space-y-0.5">
            <li
              v-for="path in ocultas"
              v-show="casaBusca(path)"
              :key="path"
              class="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm text-muted hover:bg-elevated"
            >
              <span class="size-4 shrink-0" />
              <UIcon :name="ICONE_DO_TIPO[campoPorPath(path)!.tipo]" class="size-4 shrink-0 text-dimmed" />
              <span class="flex-1 truncate">{{ campoPorPath(path)!.label }}</span>
              <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.mostrarColuna(campoPorPath(path)!.label)" @click="alternarColuna(path)" />
            </li>
          </ul>
        </template>
      </section>

      <!-- Filtros -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.filtros }}</h3>
        <div class="space-y-2 rounded-md bg-elevated/50 p-3">
          <USwitch
            :model-value="rapidos.includes('isOwner')"
            :label="t.painel.soMeus"
            :description="t.painel.soMeusAjuda"
            size="sm"
            :ui="{ description: 'text-xs' }"
            @update:model-value="(v: boolean) => alternarRapido('isOwner', v)"
          />
          <USwitch
            :model-value="rapidos.includes('inGroups')"
            :label="t.painel.meusGrupos"
            :description="t.painel.meusGruposAjuda"
            size="sm"
            :ui="{ description: 'text-xs' }"
            @update:model-value="(v: boolean) => alternarRapido('inGroups', v)"
          />
        </div>

        <TransitionGroup
          tag="div"
          class="space-y-2"
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <div
            v-for="(f, i) in (rascunho.filters.field_filters ?? [])"
            :key="i"
            class="space-y-1.5 rounded-md border border-default p-2"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-8 shrink-0 text-xs text-muted">{{ i === 0 ? t.painel.onde : t.painel.e }}</span>
              <USelect
                :model-value="f.field"
                :items="camposDeFiltro"
                size="sm"
                class="min-w-0 flex-1"
                @update:model-value="(v: string) => mudarFiltro(i, { field: v })"
              />
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.tirarFiltro" @click="tirarFiltro(i)" />
            </div>
            <div class="flex items-center gap-1.5 pl-9.5">
              <USelect
                :model-value="f.op"
                :items="operadoresDe(f.field)"
                size="sm"
                class="w-36 shrink-0"
                @update:model-value="(v: string) => mudarFiltro(i, { op: v })"
              />
              <template v-if="!semValor(f.op)">
                <USelect
                  v-if="campoPorPath(f.field)?.tipo === 'selecao'"
                  :model-value="String(f.value)"
                  :items="campoPorPath(f.field)!.opcoes!"
                  size="sm"
                  class="min-w-0 flex-1"
                  @update:model-value="(v: string) => mudarFiltro(i, { value: v })"
                />
                <USelect
                  v-else-if="campoPorPath(f.field)?.tipo === 'usuario'"
                  :model-value="Number(f.value)"
                  :items="PESSOAS.map(p => ({ label: p.nome, value: p.id }))"
                  size="sm"
                  class="min-w-0 flex-1"
                  @update:model-value="(v: number) => mudarFiltro(i, { value: v })"
                />
                <UInput
                  v-else-if="campoPorPath(f.field)?.tipo === 'data' && f.op === 'next_days'"
                  :model-value="Number(f.value)"
                  type="number"
                  size="sm"
                  class="min-w-0 flex-1"
                  :ui="{ trailing: 'pointer-events-none' }"
                  @update:model-value="(v: string | number) => mudarFiltro(i, { value: Number(v) })"
                >
                  <template #trailing><span class="text-xs text-muted">{{ t.painel.dias }}</span></template>
                </UInput>
                <UInput
                  v-else-if="campoPorPath(f.field)?.tipo === 'data'"
                  :model-value="String(f.value)"
                  type="date"
                  size="sm"
                  class="min-w-0 flex-1"
                  @update:model-value="(v: string) => mudarFiltro(i, { value: v })"
                />
                <UInput
                  v-else
                  :model-value="String(f.value ?? '')"
                  :type="campoPorPath(f.field)?.tipo === 'moeda' ? 'number' : 'text'"
                  size="sm"
                  class="min-w-0 flex-1"
                  @update:model-value="(v: string | number) => mudarFiltro(i, { value: campoPorPath(f.field)?.tipo === 'moeda' ? Number(v) : v })"
                />
              </template>
            </div>
          </div>
        </TransitionGroup>
        <UButton :label="t.painel.adicionarFiltro" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="novoFiltro" />
      </section>

      <!-- Ordenação -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.ordenacao }}</h3>
        <p v-if="!ordenacoes.length" class="text-xs text-muted">{{ t.painel.semOrdenacao }}</p>
        <div v-for="(o, i) in ordenacoes" :key="i" class="flex items-center gap-1.5">
          <span class="w-14 shrink-0 text-xs text-muted">{{ i === 0 ? t.painel.ordenarPor : t.painel.depoisPor }}</span>
          <USelect
            :model-value="o.field"
            :items="camposDeFiltro"
            size="sm"
            class="min-w-0 flex-1"
            @update:model-value="(v: string) => mudarOrdenacao(i, { field: v })"
          />
          <USelect
            :model-value="o.direction"
            :items="[{ label: t.painel.crescente, value: 'asc' }, { label: t.painel.decrescente, value: 'desc' }]"
            size="sm"
            class="w-32 shrink-0"
            @update:model-value="(v: 'asc' | 'desc') => mudarOrdenacao(i, { direction: v })"
          />
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.tirarOrdenacao" @click="tirarOrdenacao(i)" />
        </div>
        <UButton :label="t.painel.adicionarOrdenacao" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="novaOrdenacao" />
      </section>

      <!-- Quem vê -->
      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.quemVe }}</h3>
        <URadioGroup v-model="quemVe" :items="opcoesQuemVe" size="sm" :ui="{ description: 'text-xs' }" />
        <div v-if="quemVe === 'grupos'" class="space-y-2 pl-6">
          <USelectMenu v-model="grupos" multiple :items="GRUPOS.map(g => ({ label: g.nome, value: g.id }))" value-key="value" :placeholder="t.painel.escolherGrupos" size="sm" class="w-full" />
          <USelectMenu v-model="funcoes" multiple :items="FUNCOES.map(f => ({ label: f.nome, value: f.id }))" value-key="value" :placeholder="t.painel.escolherFuncoes" size="sm" class="w-full" />
        </div>
      </section>
    </div>

    <footer class="flex items-center gap-2 border-t border-default px-4 py-3">
      <p class="min-w-0 flex-1 text-xs text-muted">
        <span v-if="modificada" class="flex items-center gap-1.5"><span class="size-2 shrink-0 rounded-full bg-warning" />{{ t.painel.naoSalvas }}</span>
        <span v-else>{{ t.painel.tudoSalvo }}</span>
      </p>
      <UButton :label="t.painel.descartar" color="neutral" variant="ghost" size="sm" :disabled="!modificada" @click="emit('descartar')" />
      <UButton :label="soComoNova ? t.painel.salvarComoNova : t.painel.salvar" size="sm" :disabled="!modificada" :loading="salvando" @click="emit('salvar')" />
    </footer>
  </aside>
</template>
