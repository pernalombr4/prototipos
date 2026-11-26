<script setup lang="ts">
/**
 * O filtro no cabeçalho da coluna, copiado das telas novas do develop (Logs de
 * Auditoria, Itens, Relatórios), lido no código em 17/11/2026:
 *  - o funil abre um popover (`EntitySharedFiltersWrapper`), com um ponto
 *    quando a coluna tem filtro aplicado;
 *  - texto (`EntitySharedFiltersString` sobre o `EntitySharedFiltersBase`):
 *    "Filtrar <Campo>", uma frase por filtro ("É totalmente Igual a ..."), o ✓
 *    que aplica (pisca enquanto está pendente) e a lixeira que remove, e
 *    "Adicionar Filtro", travado enquanto há filtro sem aplicar. Cada operador
 *    vale uma vez;
 *  - seleção (`EntitySharedFiltersSelect`): busca, Todos, Limpar, a contagem e
 *    a lista de caixas de marcar, que aplica no clique.
 *  - único (rodada 15, PROPOSTA): 1 opção por vez, para a coluna Data, ligada ao
 *    período da barra. O develop filtra a data só pela barra; aqui o funil da
 *    coluna abre o mesmo período, para toda coluna ter filtro.
 * A chave do filtro segue a da API: `<campo>_<operador>`.
 * Diferença de cópia: o develop usa os ícones do conjunto Solar; o protótipo
 * só tem o Lucide, então o funil é o `i-lucide-funnel`.
 */
import type { Textos } from './textos'

export type Operador = 'eq' | 'ne' | 'contains' | 'ncontains' | 'containss' | 'ncontainss'
export type Filtros = Record<string, string | string[]>

const props = defineProps<{
  t: Textos
  campo: string
  rotulo: string
  tipo: 'texto' | 'selecao' | 'unico'
  opcoes?: { value: string, label: string, icon?: string }[]
  /** Único: a opção que quer dizer "sem filtro". */
  padrao?: string
}>()

const filtros = defineModel<Filtros>({ required: true })
/** Único: a opção escolhida (o período da barra, na coluna Data). */
const unico = defineModel<string>('unico')
const aberto = ref(false)

const OPERADORES: Operador[] = ['eq', 'ne', 'contains', 'ncontains', 'containss', 'ncontainss']
const f = computed(() => props.t.emails.filtro)

const temFiltro = computed(() => props.tipo === 'unico'
  ? unico.value !== props.padrao
  : Object.keys(filtros.value).some(k => k.startsWith(`${props.campo}_`)))

/* ---------- texto ---------- */

interface Linha { operador: Operador, valor: string, aplicado: boolean }
const linhas = ref<Linha[]>([])

watch(aberto, (v) => {
  if (!v || props.tipo !== 'texto') return
  linhas.value = OPERADORES
    .filter(o => typeof filtros.value[`${props.campo}_${o}`] === 'string')
    .map(o => ({ operador: o, valor: filtros.value[`${props.campo}_${o}`] as string, aplicado: true }))
  // Abre com a primeira linha pronta, como no develop.
  if (!linhas.value.length) linhas.value = [{ operador: 'contains', valor: '', aplicado: false }]
})

const usados = computed(() => new Set(linhas.value.map(l => l.operador)))
const livres = computed(() => OPERADORES.filter(o => !usados.value.has(o)))
const pendente = computed(() => linhas.value.some(l => !l.aplicado))

function opcoesDoOperador(atual: Operador) {
  return OPERADORES.map(o => ({ value: o, label: f.value.operadores[o], disabled: o !== atual && usados.value.has(o) }))
}

function acao(i: number) {
  const l = linhas.value[i]!
  const chave = `${props.campo}_${l.operador}`
  const novo = { ...filtros.value }
  if (l.aplicado) {
    delete novo[chave]
    linhas.value.splice(i, 1)
  }
  else {
    if (!l.valor.trim()) return
    novo[chave] = l.valor.trim()
    l.aplicado = true
  }
  filtros.value = novo
}

function trocarOperador(i: number, o: Operador) {
  const l = linhas.value[i]!
  if (l.aplicado) {
    const novo = { ...filtros.value }
    delete novo[`${props.campo}_${l.operador}`]
    filtros.value = novo
  }
  linhas.value[i] = { ...l, operador: o, aplicado: false }
}

function adicionar() {
  if (pendente.value || !livres.value.length) return
  // "Contém" primeiro, como a linha que abre o filtro; depois o primeiro livre.
  const o = livres.value.includes('contains') ? 'contains' : livres.value[0]!
  linhas.value.push({ operador: o, valor: '', aplicado: false })
}

/* ---------- seleção ---------- */

const busca = ref('')
const marcados = computed(() => new Set((filtros.value[`${props.campo}_in`] as string[] | undefined) ?? []))
const visiveis = computed(() => (props.opcoes ?? []).filter(o => o.label.toLowerCase().includes(busca.value.trim().toLowerCase())))

function gravar(v: Set<string>) {
  const novo = { ...filtros.value }
  if (v.size) novo[`${props.campo}_in`] = [...v]
  else delete novo[`${props.campo}_in`]
  filtros.value = novo
}
function alternar(v: string) {
  const s = new Set(marcados.value)
  if (s.has(v)) s.delete(v)
  else s.add(v)
  gravar(s)
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', sideOffset: 6, collisionPadding: 12 }">
    <UChip :show="temFiltro" color="primary" size="sm">
      <UButton
        icon="i-lucide-funnel"
        color="neutral"
        variant="link"
        size="xs"
        class="p-0 text-muted transition hover:text-primary"
        :class="temFiltro ? 'text-primary' : ''"
        :aria-label="`${f.filtrar} ${rotulo}`"
        :aria-pressed="temFiltro"
      />
    </UChip>

    <template #content>
      <div class="min-w-52 p-4 text-default" @click.stop>
        <!-- Texto -->
        <div v-if="tipo === 'texto'" class="space-y-3">
          <p class="text-sm">
            {{ f.filtrar }} <b class="text-primary">{{ rotulo }}</b>
          </p>
          <USeparator class="my-1" />
          <ul class="text-xs">
            <li v-for="(l, i) in linhas" :key="i" class="flex items-center justify-between gap-2">
              <span class="flex w-96 flex-wrap items-center gap-1">
                - {{ l.operador === 'eq' || l.operador === 'ne' ? f.totalmente : '' }}
                <USelectMenu
                  :model-value="l.operador"
                  :items="opcoesDoOperador(l.operador)"
                  value-key="value"
                  variant="none"
                  :search-input="false"
                  :trailing-icon="false"
                  size="xs"
                  class="cursor-pointer font-bold text-primary"
                  :ui="{ content: 'w-48', base: 'px-0 font-bold text-primary' }"
                  @update:model-value="trocarOperador(i, $event as Operador)"
                />
                <span>{{ f.preposicao[l.operador] }}</span>
                <UInput
                  v-model="l.valor"
                  variant="none"
                  size="xs"
                  autofocus
                  class="w-32 font-bold"
                  :placeholder="f.digiteValor"
                  :ui="{ base: 'text-primary px-0' }"
                  @update:model-value="l.aplicado = false"
                  @keydown.enter="acao(i)"
                />
              </span>
              <UTooltip :text="l.aplicado ? f.remover : f.aplicar" arrow>
                <UButton
                  size="xs"
                  variant="soft"
                  :color="l.aplicado ? 'error' : 'info'"
                  :icon="l.aplicado ? 'i-lucide-trash-2' : 'i-lucide-check'"
                  :class="l.aplicado ? '' : 'animate-pulse'"
                  :aria-label="l.aplicado ? f.remover : f.aplicar"
                  @click="acao(i)"
                />
              </UTooltip>
            </li>
          </ul>
          <UButton
            v-if="livres.length"
            :label="f.adicionar"
            icon="i-lucide-plus"
            :disabled="pendente"
            :title="pendente ? f.pendentes : ''"
            color="neutral"
            variant="ghost"
            size="xs"
            block
            @click="adicionar"
          />
        </div>

        <!-- Único -->
        <div v-else-if="tipo === 'unico'" class="w-60 space-y-2">
          <p class="text-sm">
            {{ f.filtrar }} <b class="text-primary">{{ rotulo }}</b>
          </p>
          <USeparator />
          <div class="space-y-0.5" role="radiogroup" :aria-label="`${f.filtrar} ${rotulo}`">
            <button
              v-for="o in opcoes"
              :key="o.value"
              type="button"
              role="radio"
              class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition"
              :class="unico === o.value ? 'bg-primary/10 font-medium text-primary' : 'text-default hover:bg-elevated'"
              :aria-checked="unico === o.value"
              @click="unico = o.value; aberto = false"
            >
              <UIcon :name="unico === o.value ? 'i-lucide-circle-dot' : 'i-lucide-circle'" class="shrink-0" :class="unico === o.value ? 'text-primary' : 'text-muted'" />
              <span class="truncate">{{ o.label }}</span>
            </button>
          </div>
        </div>

        <!-- Seleção -->
        <div v-else class="w-60 space-y-2">
          <UInput v-model="busca" :placeholder="f.buscarOpcoes" icon="i-lucide-search" size="xs" autofocus class="w-full" />
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <UButton :label="f.todos" color="neutral" variant="ghost" size="xs" @click="gravar(new Set((opcoes ?? []).map(o => o.value)))" />
              <UButton v-if="marcados.size" :label="f.limpar" icon="i-lucide-x" color="error" variant="ghost" size="xs" @click="gravar(new Set())" />
            </div>
            <span v-if="marcados.size" class="text-xs text-muted">{{ f.selecionados(marcados.size) }}</span>
          </div>
          <USeparator />
          <div class="max-h-56 space-y-0.5 overflow-y-auto">
            <p v-if="!visiveis.length" class="py-4 text-center text-xs text-muted">
              {{ f.nenhumResultado }}
            </p>
            <button
              v-for="o in visiveis"
              :key="o.value"
              type="button"
              class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition"
              :class="marcados.has(o.value) ? 'bg-primary/10 font-medium text-primary' : 'text-default hover:bg-elevated'"
              :aria-pressed="marcados.has(o.value)"
              @click="alternar(o.value)"
            >
              <UIcon :name="marcados.has(o.value) ? 'i-lucide-square-check' : 'i-lucide-square'" class="shrink-0" :class="marcados.has(o.value) ? 'text-primary' : 'text-muted'" />
              <UIcon v-if="o.icon" :name="o.icon" class="shrink-0" />
              <span class="truncate">{{ o.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
