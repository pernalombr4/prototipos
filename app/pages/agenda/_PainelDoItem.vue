<script setup lang="ts">
/**
 * Painel lateral do item, aberto sobre a própria Agenda (decisão 3 da redatora: uma porta). Abas Item e Tarefas são
 * o recorte da visualização rápida do item; a aba Agenda é a proposta: as reuniões do Outlook ligadas ao item, as
 * datas do item e "Agendar reunião", que volta para a grade com a próxima reunião já ligada (padrão do Odoo, visto
 * em tela).
 */
import type { Textos } from './textos'
import { HOJE, diaCurto, diaNumerico, hora } from './datas'
import { diaDe, estado, item, minutoDe, reunioesDo, situacao } from './estado'
import { categoriaPorSlug, pessoaPorId } from './mocks'

const props = defineProps<{ t: Textos, locale: string, itemId: number | null }>()
const aba = defineModel<'item' | 'tarefas' | 'agenda'>('aba', { default: 'agenda' })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ agendar: [id: number], abrirEvento: [chave: string] }>()

const it = computed(() => item(props.itemId))
const cat = computed(() => it.value ? categoriaPorSlug(it.value.categoria) : null)
const tarefas = computed(() => it.value ? estado.tarefas.filter(t => t.item === it.value!.id) : [])
const reunioes = computed(() => it.value ? reunioesDo(it.value.id) : [])
const proximas = computed(() => reunioes.value.filter(r => r.dia >= HOJE))
const anteriores = computed(() => reunioes.value.filter(r => r.dia < HOJE).reverse())
const datas = computed(() => cat.value?.campos.filter(c => c.tipo === 'data' && c.chave !== 'created_at' && it.value!.data[c.chave]) ?? [])

const abas = computed(() => [
  { label: props.t.painel.abas.item, value: 'item', icon: 'i-lucide-file-text' },
  { label: props.t.painel.abas.tarefas, value: 'tarefas', icon: 'i-lucide-list-checks', badge: tarefas.value.length || undefined },
  { label: props.t.painel.abas.agenda, value: 'agenda', icon: 'i-lucide-calendar-days', badge: reunioes.value.length || undefined },
])

const valor = (chave: string, tipo: string) => {
  const v = it.value!.data[chave]
  if (v === undefined || v === '') return '--'
  if (tipo === 'data') return diaNumerico(String(v), props.locale)
  if (tipo === 'hora') return hora(Number(v))
  return String(v)
}
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
</script>

<template>
  <USlideover v-model:open="aberto" :title="it ? `${it.reference} · ${it.titulo}` : ''" :description="cat?.name" :ui="{ content: 'max-w-md' }">
    <template #body>
      <div v-if="it" class="flex flex-col gap-4">
        <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="w-full" />

        <!-- Item -->
        <dl v-if="aba === 'item'" class="grid grid-cols-[9rem_1fr] gap-x-3 gap-y-2.5 text-sm">
          <template v-for="c in cat!.campos" :key="c.chave">
            <dt class="text-muted">{{ c.rotulo }}</dt>
            <dd class="text-highlighted">{{ valor(c.chave, c.tipo) }}</dd>
          </template>
          <dt class="text-muted">{{ t.painel.responsavel }}</dt>
          <dd class="flex items-center gap-1.5 text-highlighted"><UAvatar :text="pessoaPorId(it.responsavel)?.iniciais" size="3xs" />{{ pessoaPorId(it.responsavel)?.nome }}</dd>
        </dl>

        <!-- Tarefas -->
        <ul v-else-if="aba === 'tarefas'" class="flex flex-col divide-y divide-default">
          <li v-for="x in tarefas" :key="x.id" class="flex items-center gap-2 py-2.5">
            <UIcon :name="x.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check'" class="size-4 shrink-0" :class="x.origem === 'fluxo' ? 'text-primary' : 'text-muted'" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-highlighted" :class="x.status === 'completed' && 'line-through'">{{ x.name }}</span>
              <span v-if="x.due_date" class="block text-xs text-muted first-letter:uppercase">{{ t.quando(diaCurto(diaDe(x.due_date), locale), hora(minutoDe(x.due_date))) }}</span>
            </span>
            <UBadge :label="t.situacao[situacao(x)]" :color="corDaSituacao[situacao(x)]" variant="soft" size="sm" />
          </li>
          <li v-if="!tarefas.length" class="py-6 text-center text-sm text-muted">{{ t.painel.semTarefas }}</li>
        </ul>

        <!-- Agenda (proposta) -->
        <div v-else class="flex flex-col gap-4">
          <UButton :label="t.painel.agendar" icon="i-lucide-calendar-plus" class="self-start" size="sm" @click="emit('agendar', it.id)" />

          <section v-for="g in [{ id: 'proximas', titulo: t.painel.proximas, lista: proximas }, { id: 'anteriores', titulo: t.painel.anteriores, lista: anteriores }].filter(x => x.lista.length)" :key="g.id" class="flex flex-col gap-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ g.titulo }}</p>
            <button
              v-for="r in g.lista"
              :key="r.id"
              type="button"
              class="flex items-center gap-3 rounded-md border border-default p-2.5 text-left transition-colors hover:bg-elevated"
              :class="g.id === 'anteriores' && 'opacity-70'"
              @click="emit('abrirEvento', `r:${r.id}`)"
            >
              <span class="flex w-12 shrink-0 flex-col items-center rounded-md bg-info/10 py-1 text-info">
                <span class="text-[10px] uppercase">{{ diaCurto(r.dia, locale).split(',')[0] }}</span>
                <span class="text-base font-semibold leading-none">{{ Number(r.dia.slice(8)) }}</span>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-highlighted">{{ r.titulo }}</span>
                <span class="flex items-center gap-1.5 text-xs text-muted">
                  <UIcon :name="r.teams ? 'i-lucide-video' : 'i-lucide-map-pin'" class="size-3" />
                  {{ r.inicio === undefined ? t.detalhe.diaInteiro : t.grade.intervalo(hora(r.inicio), hora(r.fim ?? r.inicio + 60)) }}
                  · {{ t.detalhe.participantes(r.participantes.length) }}
                </span>
              </span>
            </button>
          </section>

          <UEmpty v-if="!reunioes.length" icon="i-lucide-calendar-x" :title="t.painel.semReunioes" :description="t.painel.semReunioesTexto" variant="naked" size="sm" />

          <section v-if="datas.length" class="flex flex-col gap-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.painel.datas }}</p>
            <p v-for="c in datas" :key="c.chave" class="flex items-center justify-between rounded-md bg-elevated px-2.5 py-2 text-sm">
              <span class="text-toned">{{ c.rotulo }}</span>
              <span class="tabular-nums text-highlighted">{{ diaNumerico(String(it.data[c.chave]), locale) }}</span>
            </p>
          </section>
        </div>
      </div>
    </template>
  </USlideover>
</template>
