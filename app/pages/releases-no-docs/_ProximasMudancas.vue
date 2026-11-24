<script setup lang="ts">
/**
 * PROPOSTA. A página "Próximas mudanças": só o que exige ação de quem administra o workspace, com a
 * data prevista, o prazo ("agir até"), o que fazer e as 3 fases (opcional, ligada por padrão com
 * opção de desligar, obrigatória). Mora dentro da aba Releases, ao lado do changelog, para não mexer
 * na barra do topo (regra 37).
 */
import { diasAte, faseAtual, moduloDe, mudancaAberta, mudancas, type ChaveDeFase, type Mudanca } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  destaque: string | null
}>()

const emit = defineEmits<{ verEntrada: [id: string] }>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const data = (iso: string, o?: Intl.DateTimeFormatOptions) => formatarData(iso, idioma.value, o ?? { day: 'numeric', month: 'long', year: 'numeric' })

const mostrarEncerradas = ref(false)

const lista = computed(() => {
  if (props.estado === 'vazio') return []
  return mudancas
    .filter(m => mostrarEncerradas.value || mudancaAberta(m))
    .sort((a, b) => Number(!mudancaAberta(a)) - Number(!mudancaAberta(b)) || a.fases.obrigatoria.localeCompare(b.fases.obrigatoria))
})

const ordemDasFases: ChaveDeFase[] = ['opt-in', 'opt-out', 'obrigatoria']
const iconeDaFase = { 'opt-in': 'i-lucide-toggle-left', 'opt-out': 'i-lucide-toggle-right', obrigatoria: 'i-lucide-lock' } as const

function fases(m: Mudanca) {
  return ordemDasFases.map(f => ({
    value: f,
    date: data(m.fases[f], { day: 'numeric', month: 'short', year: 'numeric' }),
    title: props.t.proximas.nomeFase[f],
    description: props.t.proximas.textoFase[f],
    icon: iconeDaFase[f],
  }))
}

/** O valor que o UTimeline acende: a fase de hoje. Antes do opt-in, nenhuma. */
const faseDaTimeline = (m: Mudanca) => {
  const f = faseAtual(m)
  return f === 'anunciada' ? undefined : f
}

const acesa = ref<string | null>(null)
watch(() => props.destaque, async (id) => {
  if (!id) return
  if (!mudancaAberta(mudancas.find(m => m.id === id)!)) mostrarEncerradas.value = true
  await nextTick()
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(`mudanca-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  acesa.value = id
  setTimeout(() => { if (acesa.value === id) acesa.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-2xl">
        <h2 class="text-2xl font-bold text-highlighted">
          {{ t.proximas.titulo }}
        </h2>
        <p class="mt-2 text-muted">
          {{ t.proximas.descricao }}
        </p>
        <p class="mt-2 flex items-center gap-1.5 text-sm text-toned">
          <UIcon name="i-lucide-info" class="size-4 shrink-0" />
          {{ t.proximas.datasPodemMudar }}
        </p>
      </div>
      <USwitch v-model="mostrarEncerradas" size="sm" :label="t.proximas.mostrarEncerradas" class="shrink-0" />
    </div>

    <div v-if="estado === 'carregando'" class="flex flex-col gap-6" aria-busy="true">
      <USkeleton v-for="i in 2" :key="i" class="h-72 w-full rounded-xl" />
    </div>

    <UEmpty
      v-else-if="!lista.length"
      icon="i-lucide-calendar-check"
      :title="t.proximas.vazioTitulo"
      :description="t.proximas.vazioTexto"
      variant="naked"
      class="animate-[entrada_.3s_ease-out_both]"
    />

    <div v-else class="flex flex-col gap-6">
      <UCard
        v-for="(m, i) in lista"
        :id="`mudanca-${m.id}`"
        :key="m.id"
        class="scroll-mt-32 animate-[entrada_.35s_ease-out_both] transition-[box-shadow] duration-500"
        :class="[
          acesa === m.id ? 'ring-2 ring-primary' : '',
          mudancaAberta(m) ? '' : 'opacity-70',
        ]"
        :style="{ animationDelay: `${i * 60}ms` }"
        :ui="{ body: 'flex flex-col gap-6' }"
      >
        <!-- Cabeçalho: módulo, título e o prazo -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-1.5">
              <UBadge color="neutral" variant="outline" size="sm" :icon="moduloDe(m.modulo).icone" :label="L(moduloDe(m.modulo).nome)" />
              <UBadge
                v-if="mudancaAberta(m)"
                color="warning"
                variant="outline"
                size="sm"
                icon="i-lucide-triangle-alert"
                class="bg-warning/10 text-highlighted"
                :ui="{ leadingIcon: 'text-warning' }"
                :label="t.entrada.exigeAcao"
              />
              <UBadge v-else color="neutral" variant="subtle" size="sm" icon="i-lucide-check" :label="t.proximas.encerradaEm(data(m.fases.obrigatoria))" />
            </div>
            <h3 class="text-lg font-semibold text-highlighted">
              {{ L(m.titulo) }}
            </h3>
          </div>

          <div v-if="mudancaAberta(m)" class="shrink-0 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2 sm:text-right">
            <p class="flex items-center gap-1 text-xs font-semibold tracking-wider text-highlighted uppercase sm:justify-end">
              <UIcon name="i-lucide-triangle-alert" class="size-3.5 text-warning" />
              {{ t.proximas.agirAte }}
            </p>
            <p class="text-lg font-bold text-highlighted">
              {{ data(m.fases.obrigatoria) }}
            </p>
            <p class="text-sm text-muted">
              {{ t.proximas.faltam(diasAte(m.fases.obrigatoria)) }}
            </p>
            <p v-if="m.dataAnterior" class="mt-1 text-xs text-toned">
              {{ t.proximas.dataMudou(data(m.dataAnterior, { day: 'numeric', month: 'short' })) }}
            </p>
          </div>
        </div>

        <!-- Por que, quem e o que fazer -->
        <div class="grid gap-6 md:grid-cols-2">
          <div class="flex flex-col gap-4">
            <div>
              <p class="mb-1 text-xs font-semibold tracking-wider text-toned uppercase">
                {{ t.proximas.porQue }}
              </p>
              <p class="text-sm text-default">
                {{ L(m.motivo) }}
              </p>
            </div>
            <div>
              <p class="mb-1 text-xs font-semibold tracking-wider text-toned uppercase">
                {{ t.proximas.quem }}
              </p>
              <p class="flex items-center gap-1.5 text-sm text-default">
                <UIcon name="i-lucide-users" class="size-4 shrink-0 text-muted" />
                {{ L(m.quem) }}
              </p>
            </div>
          </div>
          <div>
            <p class="mb-1 text-xs font-semibold tracking-wider text-toned uppercase">
              {{ t.proximas.oQueFazer }}
            </p>
            <ol class="flex flex-col gap-2 text-sm text-default">
              <li v-for="(passo, pi) in m.oQueFazer" :key="pi" class="flex gap-2">
                <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{{ pi + 1 }}</span>
                <span>{{ L(passo) }}</span>
              </li>
            </ol>
          </div>
        </div>

        <!-- As 3 fases -->
        <div>
          <p class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-toned uppercase">
            {{ t.proximas.fases }}
            <UBadge v-if="faseAtual(m) === 'anunciada'" color="neutral" variant="subtle" size="sm" :label="t.proximas.anunciada" />
          </p>
          <UTimeline
            :items="fases(m)"
            :model-value="faseDaTimeline(m)"
            orientation="horizontal"
            size="sm"
            :color="mudancaAberta(m) ? 'warning' : 'neutral'"
            class="w-full"
            :ui="{ item: 'flex-1 min-w-0', description: 'text-xs text-muted' }"
          >
            <template #date="{ item }">
              <span class="flex items-center gap-1.5">
                {{ item.date }}
                <UBadge v-if="faseDaTimeline(m) === item.value" color="warning" variant="outline" size="xs" class="bg-warning/10 text-highlighted" :label="t.proximas.agora" />
              </span>
            </template>
          </UTimeline>
        </div>

        <div v-if="m.entrada" class="flex justify-end border-t border-default pt-4">
          <UButton
            size="sm"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-arrow-right"
            :label="t.proximas.verNoChangelog"
            class="cursor-pointer"
            @click="emit('verEntrada', m.entrada!)"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
