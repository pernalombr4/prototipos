<script setup lang="ts">
/**
 * PROPOSTA. A aba Releases como changelog por item: 1 entrada por item, inclusive patch e correção,
 * agrupada por mês, com filtro por tipo, módulo e "Exige ação". Os filtros filtram de verdade,
 * sobre o mock, em memória.
 */
import EntradaDoChangelog from './_EntradaDoChangelog.vue'
import { entradas, modulos, mudancaAberta, mudancas, postsDaProposta, type ChaveDeModulo, type Tipo } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  /** Id da entrada a mostrar: limpa os filtros, rola até ela e acende o contorno. */
  destaque: string | null
}>()

const emit = defineEmits<{
  copiar: [id: string]
  verMudanca: [id: string]
  verPost: [mes: string]
  irProximas: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]

/* ---------------- Filtros ---------------- */
const tipo = ref<'todos' | Tipo>('todos')
const modulosEscolhidos = ref<ChaveDeModulo[]>([])
const soAcao = ref(false)

const temFiltro = computed(() => tipo.value !== 'todos' || modulosEscolhidos.value.length > 0 || soAcao.value)
function limpar() {
  tipo.value = 'todos'
  modulosEscolhidos.value = []
  soAcao.value = false
}

const opcoesDeTipo = ['todos', 'novidade', 'melhoria', 'correcao'] as const
const opcoesDeModulo = computed(() => modulos.map(m => ({ label: L(m.nome), value: m.id, icon: m.icone })))

const visiveis = computed(() => {
  if (props.estado === 'vazio') return []
  return entradas.filter(e =>
    (tipo.value === 'todos' || e.tipo === tipo.value)
    && (!modulosEscolhidos.value.length || modulosEscolhidos.value.includes(e.modulo))
    && (!soAcao.value || !!e.mudanca),
  )
})

/** Em breve primeiro; depois 1 grupo por mês, do mais novo ao mais antigo. */
const grupos = computed(() => {
  const mapa = new Map<string, typeof entradas>()
  for (const e of visiveis.value) {
    const chave = e.estado === 'em-breve' ? 'em-breve' : e.data.slice(0, 7)
    if (!mapa.has(chave)) mapa.set(chave, [])
    mapa.get(chave)!.push(e)
  }
  return [...mapa.entries()].map(([chave, lista]) => ({
    chave,
    titulo: chave === 'em-breve'
      ? props.t.releases.emBreve
      : formatarData(`${chave}-01`, idioma.value, { month: 'long', year: 'numeric' }),
    lista,
  }))
})

const mesesComPost = new Set(postsDaProposta.filter(p => p.mes).map(p => p.mes!))

/* ---------------- Aviso das mudanças abertas ---------------- */
/** Na tela estreita, a ação do aviso desce para baixo do texto. */
const estreita = ref(false)
onMounted(() => {
  const mq = window.matchMedia('(max-width: 640px)')
  estreita.value = mq.matches
  mq.addEventListener('change', e => { estreita.value = e.matches })
})
const abertas = computed(() => mudancas.filter(mudancaAberta).sort((a, b) => a.fases.obrigatoria.localeCompare(b.fases.obrigatoria)))

/* ---------------- Ir até uma entrada ---------------- */
const acesa = ref<string | null>(null)
let apagar: ReturnType<typeof setTimeout> | undefined
watch(() => props.destaque, async (id) => {
  if (!id) return
  limpar()
  await nextTick()
  // Espera a troca de vista e a entrada em cascata assentarem antes de rolar.
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  acesa.value = id
  clearTimeout(apagar)
  apagar = setTimeout(() => { acesa.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div>
    <!-- Aviso: as mudanças que pedem ação, com o prazo mais próximo -->
    <UAlert
      v-if="estado === 'cheio' && abertas.length"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      class="mx-auto mb-8 max-w-2xl animate-[entrada_.35s_ease-out_both]"
      :title="t.releases.aviso(abertas.length, formatarData(abertas[0]!.fases.obrigatoria, idioma))"
      :actions="[{ label: t.releases.verProximas, color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('irProximas') }]"
      :orientation="estreita ? 'vertical' : 'horizontal'"
    />

    <!-- Filtros -->
    <div class="mx-auto mb-10 flex max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <UFieldGroup size="sm" :aria-label="t.releases.tipo">
          <UButton
            v-for="op in opcoesDeTipo"
            :key="op"
            :label="t.releases.tipos[op]"
            :color="tipo === op ? 'primary' : 'neutral'"
            :variant="tipo === op ? 'solid' : 'outline'"
            :aria-pressed="tipo === op"
            class="cursor-pointer"
            @click="tipo = op"
          />
        </UFieldGroup>

        <USelectMenu
          v-model="modulosEscolhidos"
          :items="opcoesDeModulo"
          value-key="value"
          multiple
          size="sm"
          icon="i-lucide-blocks"
          :placeholder="t.releases.todosModulos"
          :search-input="false"
          :aria-label="t.releases.modulo"
          class="min-w-52"
        >
          <template #default>
            <span v-if="modulosEscolhidos.length" class="truncate text-highlighted">{{ t.releases.modulosEscolhidos(modulosEscolhidos.length) }}</span>
            <span v-else class="truncate text-muted">{{ t.releases.todosModulos }}</span>
          </template>
        </USelectMenu>

        <USwitch v-model="soAcao" size="sm" :label="t.releases.soExigeAcao" color="warning" />
      </div>

      <div class="flex min-h-7 items-center justify-between gap-2 text-sm text-muted">
        <span aria-live="polite">{{ estado === 'carregando' ? '' : t.releases.contagem(visiveis.length) }}</span>
        <UButton
          v-if="temFiltro"
          size="xs"
          color="neutral"
          variant="link"
          icon="i-lucide-x"
          :label="t.releases.limpar"
          class="cursor-pointer"
          @click="limpar"
        />
      </div>
    </div>

    <!-- Carregando -->
    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <div v-for="i in 4" :key="i" class="flex flex-col gap-2">
        <div class="flex gap-2">
          <USkeleton class="h-5 w-20" />
          <USkeleton class="h-5 w-24" />
          <USkeleton class="h-5 w-20" />
        </div>
        <USkeleton class="h-6 w-3/4" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-1/3" />
      </div>
    </div>

    <!-- Vazio: sem nenhuma entrada, ou nenhuma com os filtros -->
    <UEmpty
      v-else-if="!visiveis.length"
      class="mx-auto max-w-2xl animate-[entrada_.3s_ease-out_both]"
      :icon="temFiltro ? 'i-lucide-filter-x' : 'i-lucide-rocket'"
      :title="temFiltro ? t.releases.semResultadoTitulo : t.releases.vazioTitulo"
      :description="temFiltro ? t.releases.semResultadoTexto : t.releases.vazioTexto"
      :actions="temFiltro ? [{ label: t.releases.limpar, color: 'neutral', variant: 'outline', onClick: limpar }] : []"
      variant="naked"
    />

    <!-- A lista -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-4 sm:gap-y-4 lg:gap-y-4' }">
      <template v-for="(g, gi) in grupos" :key="g.chave">
        <h2
          class="mx-auto w-full max-w-2xl px-4 pt-4 text-sm font-semibold tracking-wider text-toned uppercase first:pt-0"
          :class="gi > 0 ? 'mt-6 border-t border-default pt-8' : ''"
        >
          {{ g.titulo }}
        </h2>
        <EntradaDoChangelog
          v-for="(e, i) in g.lista"
          :key="e.id"
          :e="e"
          :t="t"
          :destacada="acesa === e.id"
          :tem-post="mesesComPost.has(e.data.slice(0, 7))"
          class="animate-[entrada_.35s_ease-out_both]"
          :style="{ animationDelay: `${Math.min(i, 8) * 40}ms` }"
          @copiar="emit('copiar', $event)"
          @ver-mudanca="emit('verMudanca', $event)"
          @ver-post="emit('verPost', $event)"
        />
      </template>
    </UChangelogVersions>
  </div>
</template>
