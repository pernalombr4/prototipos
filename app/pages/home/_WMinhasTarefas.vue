<script setup lang="ts">
/**
 * Minhas tarefas: as tarefas abertas da pessoa, rápidas e agendadas, em 4 abas
 * por prazo (Em atraso, Hoje, Próximas, Sem prazo). É o "My Work" do monday e
 * do ClickUp, a convenção do mercado.
 *
 * Junta os 3 cartões da Home de hoje ("Tarefas em atraso", "Tarefas próximas"
 * e "Tarefas rápidas") num widget só. O filtro "Tipo de tarefa" devolve o
 * recorte antigo de "Tarefas rápidas".
 *
 * - Concluir em 1 clique, com Desfazer no aviso.
 * - "Adicionar tarefa" no pé cria ali mesmo, com o prazo da aba já preenchido
 *   (o "+" por grupo do ClickUp): Hoje vira hoje 18:00, Próximas vira amanhã.
 */
import type { TabsItem } from '@nuxt/ui'
import type { TarefaDaHome } from './mocks'
import { categoria } from './mocks'
import { abaDa, prazoDaTarefa } from './formatar'
import type { AbaDeTarefa } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tarefas: TarefaDaHome[]
  eu: number
}>()

const emit = defineEmits<{
  concluir: [id: number]
  criar: [nome: string, aba: AbaDeTarefa]
  abrir: [tarefa: TarefaDaHome]
  verTodas: []
}>()

const aba = ref<AbaDeTarefa>('atraso')
const origem = ref<'todas' | 'rapida' | 'agendada'>('todas')

const minhas = computed(() => props.tarefas.filter(x =>
  x.assigned_to === props.eu && x.status !== 'completed' && (origem.value === 'todas' || x.origem === origem.value),
))

const porAba = computed(() => {
  const r: Record<AbaDeTarefa, TarefaDaHome[]> = { atraso: [], hoje: [], proximas: [], semPrazo: [] }
  for (const x of minhas.value) {
    const a = abaDa(x)
    if (a) r[a].push(x)
  }
  for (const k of Object.keys(r) as AbaDeTarefa[]) r[k].sort((a, b) => (a.due_date?.getTime() ?? 0) - (b.due_date?.getTime() ?? 0))
  return r
})

const abas = computed<TabsItem[]>(() => (['atraso', 'hoje', 'proximas', 'semPrazo'] as AbaDeTarefa[]).map(a => ({
  label: props.t.tarefas.abas[a],
  value: a,
  badge: { label: String(porAba.value[a].length), color: a === 'atraso' && porAba.value[a].length ? 'error' : 'neutral', variant: 'subtle' },
})))

const origens = computed(() => [
  { label: props.t.tarefas.origem.todas, value: 'todas' },
  { label: props.t.tarefas.origem.rapidas, value: 'rapida' },
  { label: props.t.tarefas.origem.agendadas, value: 'agendada' },
])

/* Concluir: risca, espera um instante e sai da lista. */
const saindo = ref<number[]>([])
function concluir(x: TarefaDaHome) {
  saindo.value.push(x.id)
  setTimeout(() => {
    saindo.value = saindo.value.filter(i => i !== x.id)
    emit('concluir', x.id)
  }, 450)
}

/* Adicionar ali mesmo. */
const adicionando = ref(false)
const nova = ref('')
const campo = ref<{ inputRef?: HTMLInputElement } | null>(null)
function abrirAdicionar() {
  adicionando.value = true
  nextTick(() => campo.value?.inputRef?.focus())
}
function criar() {
  const nome = nova.value.trim()
  if (!nome) return
  emit('criar', nome, aba.value === 'atraso' ? 'hoje' : aba.value)
  if (aba.value === 'atraso') aba.value = 'hoje'
  nova.value = ''
}

const corDaPrioridade = { urgent: 'error', high: 'warning' } as const
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex flex-wrap items-center justify-between gap-2 px-4">
      <UTabs
        v-model="aba"
        :items="abas"
        :content="false"
        variant="link"
        size="sm"
        class="min-w-0"
        :ui="{ list: 'border-b-0 overflow-x-auto [scrollbar-width:none]', trigger: 'px-2 shrink-0', label: 'overflow-visible whitespace-nowrap' }"
      />
      <USelect
        v-model="origem"
        :items="origens"
        size="xs"
        variant="ghost"
        :aria-label="t.tarefas.rotuloOrigem"
        class="w-32"
        data-sem-arraste
      />
    </div>
    <USeparator />

    <UScrollArea class="min-h-0 flex-1">
      <TransitionGroup tag="ul" name="lista" class="divide-y divide-default">
        <li
          v-for="(x, i) in porAba[aba]"
          :key="x.id"
          class="group/linha flex items-start gap-3 px-4 py-2.5 transition-[opacity,background-color] duration-300 hover:bg-elevated/50"
          :class="saindo.includes(x.id) ? 'opacity-40' : ''"
          :style="{ animationDelay: `${i * 30}ms` }"
        >
          <UCheckbox
            :model-value="saindo.includes(x.id)"
            class="mt-0.5"
            :aria-label="t.tarefas.concluir(x.name)"
            @update:model-value="concluir(x)"
          />
          <button type="button" class="min-w-0 flex-1 text-left" @click="emit('abrir', x)">
            <span
              class="line-clamp-1 text-sm text-highlighted transition-colors group-hover/linha:text-primary"
              :class="saindo.includes(x.id) ? 'line-through' : ''"
              :title="x.name"
            >{{ x.name }}</span>
            <span class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <UBadge
                :label="x.origem === 'rapida' ? t.tarefas.rapida : t.tarefas.agendada"
                :icon="x.origem === 'rapida' ? 'i-lucide-zap' : 'i-lucide-calendar-check'"
                color="neutral"
                variant="soft"
                size="sm"
              />
              <span v-if="x.item" class="truncate">{{ x.item.reference }} · {{ categoria(x.item.categoria)?.name }}</span>
            </span>
          </button>
          <span class="flex shrink-0 flex-col items-end gap-1">
            <span
              class="text-xs font-medium tabular-nums"
              :class="aba === 'atraso' ? 'text-error-700 dark:text-error-300' : aba === 'hoje' ? 'text-highlighted' : 'text-muted'"
            >{{ prazoDaTarefa(x, t) }}</span>
            <UBadge
              v-if="x.priority === 'urgent' || x.priority === 'high'"
              :label="t.novaTarefa.prioridades[x.priority]"
              :color="corDaPrioridade[x.priority]"
              variant="subtle"
              size="sm"
            />
          </span>
        </li>
      </TransitionGroup>

      <p v-if="!porAba[aba].length" class="px-4 py-8 text-center text-sm text-muted">
        {{ t.tarefas.vazio[aba] }}
      </p>
    </UScrollArea>

    <div class="flex items-center gap-2 border-t border-default px-3 py-2">
      <UInput
        v-if="adicionando"
        ref="campo"
        v-model="nova"
        :placeholder="t.tarefas.placeholderNova"
        size="sm"
        icon="i-lucide-plus"
        class="flex-1"
        :aria-label="t.tarefas.adicionarEm(t.tarefas.abas[aba === 'atraso' ? 'hoje' : aba])"
        @keydown.enter="criar"
        @keydown.esc="adicionando = false"
        @blur="!nova && (adicionando = false)"
      />
      <UButton
        v-else
        :label="t.tarefas.adicionar"
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="abrirAdicionar"
      />
      <UButton
        :label="t.tarefas.verTodas"
        trailing-icon="i-lucide-arrow-right"
        color="neutral"
        variant="ghost"
        size="sm"
        class="ml-auto"
        @click="emit('verTodas')"
      />
    </div>
  </div>
</template>

<style scoped>
/* Entrada e saída das linhas. Sem equivalente em prop do Nuxt UI: `TransitionGroup` pede classes de transição. */
.lista-enter-active, .lista-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.lista-enter-from { opacity: 0; transform: translateY(-4px); }
.lista-leave-to { opacity: 0; transform: translateX(12px); }
</style>
