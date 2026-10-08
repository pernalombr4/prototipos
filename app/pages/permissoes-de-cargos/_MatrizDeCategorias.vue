<script setup lang="ts">
/**
 * A proposta para o pedaço que cresce com o workspace.
 *
 * Hoje: cada categoria abre 4 ações, e Criar, Ver e Atualizar abrem a lista
 * inteira de campos cada uma. Com 120 categorias são milhares de caixas.
 *
 * Aqui:
 * - um padrão de 4 caixas vale para toda categoria sem regra própria,
 *   inclusive as que forem criadas depois;
 * - uma linha por categoria, com as 4 ações em colunas fixas;
 * - campo e formulário saem da tabela e ficam em "Ajustar", na camada lateral;
 * - a caixa do cabeçalho marca a coluna inteira da lista filtrada.
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Acao, type CategoriaMock, acoes } from './mocks'
import {
  type EstadoDoCargo,
  acoesDaCategoria,
  formulariosProprios,
  resumoDeCampos,
  temAcesso,
} from './estado'

const props = defineProps<{
  t: Textos
  lista: CategoriaMock[]
  estado: EstadoDoCargo
  salvo: EstadoDoCargo
  somenteLeitura: boolean
  carregando: boolean
}>()

const emit = defineEmits<{ ajustar: [categoria: CategoriaMock] }>()

const toast = useToast()

type Filtro = 'todas' | 'proprias' | 'comAcesso' | 'semAcesso' | 'alteradas'
const busca = ref('')
const filtro = ref<Filtro>('todas')

const alterada = (c: CategoriaMock) =>
  JSON.stringify(props.estado.categorias[c.id]) !== JSON.stringify(props.salvo.categorias[c.id])
  || (!props.estado.categorias[c.id]?.proprio && JSON.stringify(props.estado.padrao) !== JSON.stringify(props.salvo.padrao))

const propria = (c: CategoriaMock) => !!props.estado.categorias[c.id]?.proprio

function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const passaNoFiltro: Record<Filtro, (c: CategoriaMock) => boolean> = {
  todas: () => true,
  proprias: propria,
  comAcesso: c => temAcesso(props.estado, c.id),
  semAcesso: c => !temAcesso(props.estado, c.id),
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
 * Escrever: uma regra igual ao padrão não é regra própria, e a linha
 * volta a seguir o padrão. Assim "Regra própria" quer dizer "diferente".
 * ------------------------------------------------------------------ */

function igualAoPadrao(m: Record<Acao, boolean>) {
  return acoes.every(a => m[a] === props.estado.padrao[a])
}

function definirAcao(c: CategoriaMock, acao: Acao, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = { ...acoesDaCategoria(props.estado, c.id), [acao]: valor }
  e.proprio = igualAoPadrao(novo) ? null : novo
}

function definirLinha(c: CategoriaMock, valor: boolean) {
  const e = props.estado.categorias[c.id]!
  const novo = { criar: valor, ver: valor, atualizar: valor, excluir: valor }
  e.proprio = igualAoPadrao(novo) ? null : novo
}

function voltarAoPadrao(c: CategoriaMock) {
  props.estado.categorias[c.id]!.proprio = null
}

function definirPadrao(acao: Acao, valor: boolean) {
  props.estado.padrao = { ...props.estado.padrao, [acao]: valor }
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
  const antes = new Map(alvo.map(c => [c.id, props.estado.categorias[c.id]!.proprio]))
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
      onClick: () => antes.forEach((p, id) => { props.estado.categorias[id]!.proprio = p }),
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

/** Quantas categorias fogem do padrão nesta ação (o "Revogado em N" do Twenty). */
const excecoes = (acao: Acao) =>
  props.lista.filter(c => acoesDaCategoria(props.estado, c.id)[acao] !== props.estado.padrao[acao]).length

const colunas = computed<TableColumn<CategoriaMock>[]>(() => [
  { accessorKey: 'name', header: props.t.colunaCategoria, meta: { class: { th: 'w-auto', td: 'w-auto' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-20 px-2', td: 'text-center w-20 px-2' } } })),
  { id: 'campos', header: props.t.colunaCampos, meta: { class: { th: 'w-24', td: 'w-24' } } },
  { id: 'formularios', header: props.t.colunaFormularios, meta: { class: { th: 'w-40', td: 'w-40' } } },
  { id: 'ajustar', header: '', meta: { class: { th: 'w-28 pl-0', td: 'w-28 pl-0 text-right' } } },
])

const meta = {
  class: {
    tr: (row: { original: CategoriaMock }) => alterada(row.original) ? 'bg-warning/5' : '',
  },
}
</script>

<template>
  <section class="space-y-4">
    <header>
      <h3 class="text-sm font-semibold text-highlighted">{{ t.categorias }}</h3>
      <p class="text-sm text-muted">{{ t.categoriasDesc }}</p>
    </header>

    <!-- O padrão: 4 caixas que valem para toda categoria sem regra própria. -->
    <div class="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 animate-[entrada_.3s_ease-out_both]">
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
          <UCheckbox
            :model-value="estado.padrao[a]"
            :label="t.acoes[a]"
            :disabled="somenteLeitura"
            @update:model-value="v => definirPadrao(a, v === true)"
          />
          <UButton
            v-if="excecoes(a)"
            :label="t.diferenteEm(excecoes(a))"
            size="xs"
            variant="link"
            color="neutral"
            class="-ml-1 px-1 text-xs"
            @click="filtro = 'proprias'"
          />
        </div>
      </div>
    </div>

    <!-- Busca, filtro e contagem. -->
    <div class="flex flex-wrap items-center gap-3">
      <UInput
        v-model="busca"
        icon="i-lucide-search"
        :placeholder="t.buscar"
        class="w-full sm:w-64"
        :aria-label="t.buscar"
      >
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

    <!-- Workspace sem categorias -->
    <UEmpty
      v-else-if="!lista.length"
      icon="i-lucide-layout-grid"
      :title="t.vazioWsTitulo"
      :description="t.vazioWsDesc"
      variant="naked"
      class="rounded-lg border border-dashed border-default py-10"
    />

    <UTable
      v-else
      :data="filtradas"
      :columns="colunas"
      :meta="meta"
      sticky
      class="max-h-[62dvh] rounded-lg border border-default"
      :ui="{ base: 'w-full min-w-[56rem] table-fixed', th: 'py-2 text-xs bg-default', td: 'py-2' }"
    >
      <template v-for="a in acoes" :key="a" #[`${a}-header`]>
        <UTooltip :text="estadoDaColuna(a) === true ? t.desmarcarColuna(t.acoes[a], filtradas.length) : t.marcarColuna(t.acoes[a], filtradas.length)">
          <span class="inline-flex flex-col items-center gap-1">
            <span>{{ t.acoes[a] }}</span>
            <UCheckbox
              :model-value="estadoDaColuna(a)"
              :disabled="somenteLeitura || !filtradas.length"
              :aria-label="t.marcarColuna(t.acoes[a], filtradas.length)"
              @update:model-value="v => definirColuna(a, v === true)"
            />
          </span>
        </UTooltip>
      </template>

      <template #name-cell="{ row }">
        <span class="flex min-w-0 items-center gap-2.5">
          <UCheckbox
            :model-value="estadoDaLinha(row.original)"
            :disabled="somenteLeitura"
            :aria-label="t.marcarLinha(row.original.name)"
            @update:model-value="v => definirLinha(row.original, v === true)"
          />
          <UIcon :name="row.original.icon ?? 'i-lucide-file'" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="flex min-w-0 items-center gap-2">
              <span class="truncate text-sm font-medium text-default" :title="row.original.name">{{ row.original.name }}</span>
              <UBadge v-if="propria(row.original)" :label="t.regraPropria" color="primary" variant="subtle" size="sm" class="shrink-0" />
              <UTooltip v-if="propria(row.original) && !somenteLeitura" :text="t.voltarAoPadrao">
                <UButton
                  icon="i-lucide-undo-2"
                  size="xs"
                  variant="ghost"
                  color="warning"
                  class="shrink-0"
                  :aria-label="`${t.voltarAoPadrao}: ${row.original.name}`"
                  @click="voltarAoPadrao(row.original)"
                />
              </UTooltip>
              <span v-if="alterada(row.original)" class="size-1.5 shrink-0 rounded-full bg-warning" :title="t.alterada" />
            </span>
            <span class="block truncate text-xs text-muted">
              {{ propria(row.original) ? t.meta(row.original.campos.length, row.original.formularios.length) : `${t.seguePadrao} · ${t.meta(row.original.campos.length, row.original.formularios.length)}` }}
            </span>
          </span>
        </span>
      </template>

      <template v-for="a in acoes" :key="a" #[`${a}-cell`]="{ row }">
        <!-- Seguindo o padrão, a caixa fica em cinza: o valor vem de cima. -->
        <UCheckbox
          :model-value="acoesDaCategoria(estado, row.original.id)[a]"
          :color="propria(row.original) ? 'primary' : 'neutral'"
          :disabled="somenteLeitura"
          :aria-label="`${t.acoes[a]}: ${row.original.name}`"
          class="inline-flex transition-transform active:scale-90"
          @update:model-value="v => definirAcao(row.original, a, v === true)"
        />
      </template>

      <template #campos-cell="{ row }">
        <template v-if="!temAcesso(estado, row.original.id)">
          <span class="text-xs text-dimmed">{{ t.camposNenhum }}</span>
        </template>
        <UBadge
          v-else-if="resumoDeCampos(estado, row.original)"
          :label="t.camposDe(resumoDeCampos(estado, row.original)!.liberados, resumoDeCampos(estado, row.original)!.total)"
          icon="i-lucide-eye-off"
          color="warning"
          variant="subtle"
          size="sm"
        />
        <span v-else class="text-xs text-muted">{{ t.camposTodos }}</span>
      </template>

      <template #formularios-cell="{ row }">
        <UBadge
          v-if="formulariosProprios(estado, row.original)"
          :label="t.formsProprios(formulariosProprios(estado, row.original))"
          icon="i-lucide-split"
          color="info"
          variant="subtle"
          size="sm"
        />
        <span v-else class="text-xs text-muted">{{ t.formsSeguem }}</span>
      </template>

      <template #ajustar-cell="{ row }">
        <UButton
          :label="t.ajustar"
          icon="i-lucide-sliders-horizontal"
          size="xs"
          variant="ghost"
          color="neutral"
          :aria-label="t.ajustarAria(row.original.name)"
          @click="emit('ajustar', row.original)"
        />
      </template>

      <template #empty>
        <UEmpty
          v-if="busca"
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
