<script setup lang="ts">
/**
 * PROPOSTA. Uma entrada do changelog: 1 item da release, com título e resumo curtos.
 *
 * O título é o item ("Spaceflow: nó de espera por data"), não a versão. A versão vira dado técnico
 * no rodapé. Os rótulos dizem o estado (Em breve, Liberando, Disponível), o público, a fase de
 * acesso e se a mudança exige ação, com o prazo. A âncora (`id`) é o link permanente.
 *
 * Feito com o `UChangelogVersion`, o mesmo componente que a aba Releases já usa por versão.
 */
import { moduloDe, mudancaDe, type Entrada } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  e: Entrada
  t: Textos
  destacada?: boolean
  /** O mês tem post mensal: a entrada Tier 1 e 2 leva ao post. */
  temPost?: boolean
}>()

const emit = defineEmits<{
  copiar: [id: string]
  verMudanca: [id: string]
  verPost: [mes: string]
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const data = (iso: string, o?: Intl.DateTimeFormatOptions) => formatarData(iso, idioma.value, o)

const modulo = computed(() => moduloDe(props.e.modulo))
const mudanca = computed(() => mudancaDe(props.e.mudanca))
const corDoTipo = { novidade: 'primary', melhoria: 'info', correcao: 'neutral' } as const
const iconeDoEstado = { 'em-breve': 'i-lucide-calendar-clock', liberando: 'i-lucide-loader', disponivel: 'i-lucide-circle-check' } as const
const corDoEstado = { 'em-breve': 'neutral', liberando: 'info', disponivel: 'success' } as const
</script>

<template>
  <UChangelogVersion
    :id="e.id"
    :date="e.data"
    :ui="{
      root: 'scroll-mt-32',
      container: [
        'max-w-2xl w-full rounded-xl px-4 py-3 transition-[box-shadow,background-color] duration-500',
        destacada ? 'ring-2 ring-primary bg-primary/5 animate-[pulso-suave_1s_ease-in-out_2]' : 'ring-0 ring-transparent',
      ].join(' '),
      date: 'text-sm/6 text-toned',
      meta: 'flex flex-wrap items-center gap-1.5 mb-2',
      title: 'text-lg font-semibold text-highlighted',
      description: 'text-base text-muted mt-1',
      indicator: 'absolute start-0 top-3 w-32 hidden lg:flex items-center justify-end gap-3 min-w-0',
      dotInner: e.estado === 'disponivel' ? 'size-2 rounded-full bg-primary' : 'size-2 rounded-full bg-dimmed',
    }"
  >
    <template #date>
      {{ data(e.data, { day: 'numeric', month: 'short' }) }}
    </template>

    <template #badge>
      <!-- O que pede ação vem primeiro: é o rótulo que quem administra procura. -->
      <UBadge
        v-if="mudanca"
        color="warning"
        variant="outline"
        size="sm"
        icon="i-lucide-triangle-alert"
        class="bg-warning/10 text-highlighted"
        :ui="{ leadingIcon: 'text-warning' }"
        :label="`${t.entrada.exigeAcao} · ${t.entrada.agirAte(data(mudanca.fases.obrigatoria))}`"
      />
      <UBadge :color="corDoTipo[e.tipo]" variant="subtle" size="sm" :label="t.entrada.tipo[e.tipo]" />
      <UBadge color="neutral" variant="outline" size="sm" :icon="modulo.icone" :label="L(modulo.nome)" />
      <UBadge
        :color="corDoEstado[e.estado]"
        variant="subtle"
        size="sm"
        :icon="iconeDoEstado[e.estado]"
        :label="t.entrada.estado[e.estado]"
      />
      <UBadge v-if="e.acesso" color="secondary" variant="subtle" size="sm" icon="i-lucide-flask-conical" :label="t.entrada.acesso[e.acesso]" />
      <UBadge v-if="e.publico === 'alguns'" color="neutral" variant="subtle" size="sm" icon="i-lucide-users" :label="t.entrada.alguns" />
    </template>

    <template #title>
      {{ L(e.titulo) }}
    </template>

    <template #description>
      <p>{{ L(e.resumo) }}</p>
      <p v-if="e.estado === 'em-breve'" class="mt-1 text-sm text-toned">
        {{ t.entrada.previstoPara(data(e.data)) }}
      </p>
      <p v-else-if="e.estado === 'liberando' && e.todosAte" class="mt-1 text-sm text-toned">
        {{ t.entrada.paraTodosAte(data(e.todosAte)) }}
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1">
        <span class="mr-2 font-mono text-xs text-muted">{{ t.entrada.versao(e.versao) }}</span>
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-link"
          :label="t.entrada.copiarLink"
          class="cursor-pointer"
          @click="emit('copiar', e.id)"
        />
        <UButton
          v-if="mudanca"
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-list-checks"
          :ui="{ leadingIcon: 'text-warning' }"
          :label="t.entrada.verOQueFazer"
          class="cursor-pointer"
          @click="emit('verMudanca', mudanca.id)"
        />
        <UButton
          v-if="temPost && (e.tier === 1 || e.tier === 2) && e.estado !== 'em-breve'"
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-newspaper"
          :label="t.entrada.verNoPost"
          class="cursor-pointer"
          @click="emit('verPost', e.data.slice(0, 7))"
        />
      </div>
    </template>
  </UChangelogVersion>
</template>
