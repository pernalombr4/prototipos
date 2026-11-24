<script setup lang="ts">
/**
 * PROPOSTA. A página "Próximas mudanças": só o que exige ação de quem administra o workspace, com o
 * prazo ("agir até"), quem é afetado, o que fazer e as 3 fases (opcional, ligada por padrão com
 * opção de desligar, obrigatória). Mora dentro da aba Releases, ao lado do changelog, para não mexer
 * na barra do topo (regra 37).
 *
 * Rodada 3: só componentes do Nuxt UI e 1 escala de texto. O título e a descrição da página vão no
 * hero da seção (como "Versões do ENSPACE"); cada mudança é 1 `UChangelogVersion` com o título no
 * tamanho do título da versão; o prazo é 1 `UAlert`; "Quem é afetado" e "O que fazer" são
 * `UPageCard` com texto normal; as fases são 1 `UTimeline`. Mesma largura da trilha (`max-w-2xl`).
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
  const agora = faseAtual(m)
  return ordemDasFases.map(f => ({
    value: f,
    date: data(m.fases[f]),
    title: agora === f ? `${props.t.proximas.nomeFase[f]} · ${props.t.proximas.agora}` : props.t.proximas.nomeFase[f],
    description: props.t.proximas.textoFase[f],
    icon: iconeDaFase[f],
  }))
}

/** O valor que o UTimeline acende: a fase de hoje. Antes do opt-in, nenhuma. */
const faseDaTimeline = (m: Mudanca) => {
  const f = faseAtual(m)
  return f === 'anunciada' ? undefined : f
}

/** O texto do prazo: quantos dias faltam e, quando a data mudou, a data de antes. */
const textoDoPrazo = (m: Mudanca) => [
  props.t.proximas.faltam(diasAte(m.fases.obrigatoria)),
  m.dataAnterior ? props.t.proximas.dataMudou(data(m.dataAnterior)) : '',
].filter(Boolean).join('. ')

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
    <!-- Barra acima da linha do tempo, na coluna do conteúdo (max-w-2xl, como a trilha) -->
    <div class="mx-auto mb-12 flex max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UButton
          size="sm"
          color="neutral"
          variant="link"
          icon="i-lucide-arrow-left"
          :label="t.releases.voltar"
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
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted">
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-info" class="size-4 shrink-0" />
          {{ t.proximas.datasPodemMudar }}
        </span>
        <USwitch v-model="mostrarEncerradas" size="sm" :label="t.proximas.mostrarEncerradas" />
      </div>
    </div>

    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <div v-for="i in 2" :key="i" class="flex flex-col gap-3">
        <USkeleton class="h-7 w-2/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-16 w-full rounded-lg" />
        <USkeleton class="h-32 w-full rounded-lg" />
      </div>
    </div>

    <UEmpty
      v-else-if="!lista.length"
      icon="i-lucide-calendar-check"
      :title="t.proximas.vazioTitulo"
      :description="t.proximas.vazioTexto"
      variant="naked"
      class="mx-auto max-w-2xl"
    />

    <!-- A mesma linha do tempo da trilha: a data à esquerda é o prazo -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="m in lista"
        :id="`mudanca-${m.id}`"
        :key="m.id"
        :title="L(m.titulo)"
        :description="L(m.motivo)"
        :date="m.fases.obrigatoria"
        class="scroll-mt-32"
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
          <UBadge v-if="faseAtual(m) === 'anunciada'" color="neutral" variant="subtle" size="sm" :label="t.proximas.anunciada" />
          <UBadge color="neutral" variant="outline" size="sm" :icon="moduloDe(m.modulo).icone" :label="L(moduloDe(m.modulo).nome)" />
        </template>

        <template #body>
          <div class="mt-6 flex flex-col gap-4">
            <!-- O prazo -->
            <UAlert
              v-if="mudancaAberta(m)"
              color="warning"
              variant="subtle"
              icon="i-lucide-calendar-clock"
              :title="t.entrada.agirAte(data(m.fases.obrigatoria))"
              :description="textoDoPrazo(m)"
            />

            <!-- Quem é afetado e o que fazer -->
            <div class="grid gap-4 md:grid-cols-2">
              <UPageCard variant="subtle" icon="i-lucide-users" :title="t.proximas.quem" :description="L(m.quem)" />
              <UPageCard variant="subtle" icon="i-lucide-list-checks" :title="t.proximas.oQueFazer">
                <template #description>
                  <ol class="flex list-decimal flex-col gap-1.5 pl-5">
                    <li v-for="(passo, pi) in m.oQueFazer" :key="pi">
                      {{ L(passo) }}
                    </li>
                  </ol>
                </template>
              </UPageCard>
            </div>

            <!-- As 3 fases -->
            <UPageCard variant="subtle" icon="i-lucide-milestone" :title="t.proximas.fases">
              <UTimeline
                :items="fases(m)"
                :model-value="faseDaTimeline(m)"
                size="sm"
                :color="mudancaAberta(m) ? 'warning' : 'neutral'"
              />
            </UPageCard>

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
