<script setup lang="ts">
/**
 * Lateral da Agenda: mini calendário, camadas com cor (ligam e desligam sem recarregar) e filtro de responsável.
 * Substitui o painel de fontes do develop, que só liga e desliga e guarda a cor em hexadecimal (T7, T8).
 */
import type { CorDoCalendario } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { HOJE, diasDoMes, inicioDaSemana, nomeDoMes, somarMeses } from './datas'
import { campoSumiu, estado, eventos, fontesAtivas, provedoresEmBreve, rotuloDoCampo, type Camada } from './estado'
import { calendarios, categoriaPorSlug, EU, pessoas } from './mocks'

const props = defineProps<{ t: Textos, locale: string, conectando: boolean }>()
const emit = defineEmits<{ configurar: [], conectar: [] }>()

/* ---------- mini calendário ---------- */
const mes = ref(estado.data)
watch(() => estado.data, d => (mes.value = d))
const semana = computed(() => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(props.locale, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9, 25 + i)))))
const comEvento = computed(() => new Set(eventos.value.map(e => e.dia)))
const naSelecao = (d: string) => {
  if (estado.vista === 'dia') return d === estado.data
  if (estado.vista === 'semana') return inicioDaSemana(d) === inicioDaSemana(estado.data)
  return false
}

/* ---------- camadas ---------- */
const enspace = computed<{ id: Camada, rotulo: string, cor: CorDoCalendario }[]>(() => [
  ...(estado.tarefasNaAgenda
    ? [{ id: 'tarefas', rotulo: props.t.lateral.minhasTarefas, cor: 'primary' }, { id: 'rapidas', rotulo: props.t.lateral.rapidas, cor: 'neutral' }] as const
    : []),
  // A categoria que entra por mais de uma data mostra o campo de cada camada.
  ...fontesAtivas.value.filter(f => !campoSumiu(f)).map((f, _, l) => ({
    id: f.id,
    rotulo: l.filter(x => x.slug === f.slug).length > 1 ? `${categoriaPorSlug(f.slug).name} · ${rotuloDoCampo(f.slug, f.campo)}` : categoriaPorSlug(f.slug).name,
    cor: f.cor,
  })),
])
/** Os calendários que a conexão com o Outlook traz: o da pessoa e os compartilhados. */
const outlook = computed(() => calendarios.filter(c => c.provedor === 'outlook').map(c => ({ id: c.id, rotulo: props.t.lateral.calendariosDoOutlook[c.id], cor: c.cor })))

const opcoesDePessoa = pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } }))
</script>

<template>
  <aside class="flex w-60 shrink-0 flex-col gap-5 overflow-y-auto border-r border-default p-3">
    <!-- Mini calendário -->
    <section>
      <div class="mb-1 flex items-center justify-between">
        <p class="pl-1 text-sm font-medium text-highlighted first-letter:uppercase">{{ nomeDoMes(mes, locale) }}</p>
        <span class="flex">
          <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" :aria-label="t.lateral.mesAnterior" @click="mes = somarMeses(mes, -1)" />
          <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" :aria-label="t.lateral.proximoMes" @click="mes = somarMeses(mes, 1)" />
        </span>
      </div>
      <div class="grid grid-cols-7 text-center text-[11px] text-muted" aria-hidden="true">
        <span v-for="(d, i) in semana" :key="i" class="py-1">{{ d }}</span>
      </div>
      <div class="grid grid-cols-7 gap-y-0.5">
        <button
          v-for="d in diasDoMes(mes)"
          :key="d"
          type="button"
          class="relative mx-auto flex size-7 items-center justify-center rounded-full text-xs tabular-nums transition-colors hover:bg-accented"
          :class="[
            d === HOJE ? 'bg-primary font-semibold text-inverted hover:bg-primary' : naSelecao(d) ? 'bg-primary/15 text-highlighted' : d.slice(0, 7) !== mes.slice(0, 7) ? 'text-dimmed' : 'text-toned',
          ]"
          :aria-current="d === HOJE ? 'date' : undefined"
          @click="estado.data = d"
        >
          {{ Number(d.slice(8)) }}
          <span v-if="comEvento.has(d) && d !== HOJE" class="absolute bottom-0.5 size-1 rounded-full bg-primary/70" />
        </button>
      </div>
    </section>

    <!-- Camadas -->
    <section class="flex flex-col gap-3">
      <p class="pl-1 text-xs font-medium uppercase tracking-wide text-muted">{{ t.lateral.calendarios }}</p>

      <div class="flex flex-col gap-2 pl-1">
        <p class="text-xs font-semibold text-toned">{{ t.lateral.enspace }}</p>
        <UCheckbox v-for="c in enspace" :key="c.id" v-model="estado.camadas[c.id]" :label="c.rotulo" :color="c.cor" size="sm" />
        <UButton
          v-if="!fontesAtivas.length"
          :label="t.lateral.adicionarCategoria"
          icon="i-lucide-plus"
          color="neutral"
          variant="outline"
          size="xs"
          class="self-start"
          @click="emit('configurar')"
        />
      </div>

      <div class="flex flex-col gap-2 pl-1">
        <p class="text-xs font-semibold text-toned">{{ t.lateral.outlook }}</p>
        <template v-if="estado.outlook === 'conectado'">
          <UCheckbox v-for="c in outlook" :key="c.id" v-model="estado.camadas[c.id]" :label="c.rotulo" :color="c.cor" size="sm" />
          <p class="truncate text-[11px] text-muted">{{ EU.email }}</p>
        </template>
        <p v-else-if="estado.outlook === 'falha'" class="flex items-center gap-1.5 text-xs text-warning">
          <UIcon name="i-lucide-cloud-off" class="size-3.5" />{{ t.lateral.semConexao }}
        </p>
        <div v-else class="flex flex-col gap-2 rounded-md border border-default p-3">
          <p class="text-xs font-medium text-highlighted">{{ t.lateral.conectarTitulo }}</p>
          <p class="text-xs text-muted">{{ t.lateral.conectarTexto }}</p>
          <UButton :label="t.lateral.conectar" icon="i-lucide-calendar-plus" color="neutral" variant="outline" size="xs" class="self-start" :loading="conectando" @click="emit('conectar')" />
        </div>
        <p v-for="p in provedoresEmBreve" :key="p.id" class="flex items-center gap-1.5 text-xs text-dimmed" aria-disabled="true">
          <UIcon :name="p.icone" class="size-3.5" />{{ t.integracoes.provedor[p.id] }}
          <UBadge :label="t.integracoes.emBreve" color="neutral" variant="subtle" size="xs" class="ml-auto" />
        </p>
      </div>
    </section>

    <!-- Responsável -->
    <section class="flex flex-col gap-1.5 pl-1">
      <label for="agenda-responsavel" class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.lateral.responsavel }}</label>
      <USelectMenu
        id="agenda-responsavel"
        v-model="estado.responsaveis"
        :items="opcoesDePessoa"
        value-key="value"
        multiple
        size="sm"
        :placeholder="t.lateral.todas"
        :search-input="{ placeholder: t.casca.buscar }"
      />
    </section>
  </aside>
</template>
