<script setup lang="ts">
/**
 * PROPOSTA. A página "Próximas mudanças": só o que exige ação de quem administra o workspace, com a
 * data prevista, o prazo ("agir até"), o que fazer e as 3 fases (opcional, ligada por padrão com
 * opção de desligar, obrigatória). Mora dentro da aba Releases, ao lado do changelog, para não mexer
 * na barra do topo (regra 37).
 *
 * Rodada 2: a página usa a mesma linha do tempo da aba Releases, com o prazo ("agir até") no lugar
 * da data e a mesma largura e o mesmo alinhamento. O "por que muda" virou o resumo da entrada.
 */
import { diasAte, faseAtual, moduloDe, mudancaAberta, mudancas, type ChaveDeFase, type Mudanca } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  destaque: string | null
}>()

const emit = defineEmits<{ verEntrada: [id: string], voltar: [], assinar: [] }>()

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
  <div>
    <!-- Barra acima da linha do tempo, na coluna do conteúdo -->
    <div class="mx-auto mb-4 flex max-w-2xl items-center justify-between gap-2">
      <UButton
        size="sm"
        color="neutral"
        variant="link"
        icon="i-lucide-arrow-left"
        :label="t.hero.releasesHojeTitulo"
        class="-ml-2.5 cursor-pointer"
        @click="emit('voltar')"
      />
      <UButton
        size="sm"
        color="neutral"
        variant="link"
        icon="i-lucide-bell-plus"
        :label="t.releases.assinar"
        class="cursor-pointer"
        @click="emit('assinar')"
      />
    </div>
    <div class="mx-auto mb-12 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="mb-2 text-2xl font-bold text-highlighted">
          {{ t.proximas.titulo }}
        </h2>
        <p class="text-muted">
          {{ t.proximas.descricao }}
        </p>
        <p class="mt-2 flex items-center gap-1.5 text-sm text-toned">
          <UIcon name="i-lucide-info" class="size-4 shrink-0" />
          {{ t.proximas.datasPodemMudar }}
        </p>
      </div>
      <USwitch v-model="mostrarEncerradas" size="sm" :label="t.proximas.mostrarEncerradas" class="shrink-0 sm:mt-1" />
    </div>

    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <div v-for="i in 2" :key="i" class="flex flex-col gap-3">
        <USkeleton class="h-7 w-2/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-40 w-full rounded-lg" />
      </div>
    </div>

    <UEmpty
      v-else-if="!lista.length"
      icon="i-lucide-calendar-check"
      :title="t.proximas.vazioTitulo"
      :description="t.proximas.vazioTexto"
      variant="naked"
      class="mx-auto max-w-2xl animate-[entrada_.3s_ease-out_both]"
    />

    <!-- A mesma linha do tempo da aba Releases: a data à esquerda é o prazo -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="(m, i) in lista"
        :id="`mudanca-${m.id}`"
        :key="m.id"
        :title="L(m.titulo)"
        :description="L(m.motivo)"
        :date="m.fases.obrigatoria"
        class="scroll-mt-32 animate-[entrada_.35s_ease-out_both]"
        :class="mudancaAberta(m) ? '' : 'opacity-70'"
        :style="{ animationDelay: `${i * 80}ms` }"
        :ui="{
          container: [
            'max-w-2xl rounded-lg outline-offset-8 transition-[outline-color] duration-500',
            acesa === m.id ? 'outline-2 outline-primary' : 'outline-2 outline-transparent',
          ].join(' '),
          meta: 'flex flex-wrap items-center gap-1.5 mb-2',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed',
          dotInner: mudancaAberta(m) ? 'size-2 rounded-full bg-warning' : 'size-2 rounded-full bg-dimmed',
        }"
      >
        <template #date>
          {{ data(m.fases.obrigatoria, { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
        </template>

        <template #badge>
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
          <UBadge color="neutral" variant="outline" size="sm" :icon="moduloDe(m.modulo).icone" :label="L(moduloDe(m.modulo).nome)" />
        </template>

        <template #body>
          <div class="mt-5 flex flex-col gap-6">
            <!-- O prazo -->
            <div v-if="mudancaAberta(m)" class="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
              <span class="flex items-center gap-1 text-xs font-semibold tracking-wider text-highlighted uppercase">
                <UIcon name="i-lucide-triangle-alert" class="size-3.5 text-warning" />
                {{ t.proximas.agirAte }}
              </span>
              <span class="text-lg font-bold text-highlighted">{{ data(m.fases.obrigatoria) }}</span>
              <span class="text-sm text-muted">{{ t.proximas.faltam(diasAte(m.fases.obrigatoria)) }}</span>
              <span v-if="m.dataAnterior" class="text-xs text-toned">{{ t.proximas.dataMudou(data(m.dataAnterior, { day: 'numeric', month: 'short' })) }}</span>
            </div>

            <!-- Quem e o que fazer -->
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <p class="mb-1 text-xs font-semibold tracking-wider text-toned uppercase">
                  {{ t.proximas.quem }}
                </p>
                <p class="flex items-center gap-1.5 text-sm text-default">
                  <UIcon name="i-lucide-users" class="size-4 shrink-0 text-muted" />
                  {{ L(m.quem) }}
                </p>
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

            <div v-if="m.entrada">
              <UButton
                size="sm"
                color="neutral"
                variant="link"
                trailing-icon="i-lucide-arrow-right"
                :label="t.proximas.verNoChangelog"
                class="-ml-2.5 cursor-pointer"
                @click="emit('verEntrada', m.entrada!)"
              />
            </div>
          </div>
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>
