<script setup lang="ts">
/**
 * Os 4 widgets de lista simples: Atalhos, Recentes, Agenda de hoje e Tarefas
 * que delegei. Cada linha é um alvo só (regra 25), com o ícone, o nome e o
 * "onde" embaixo.
 *
 * - Atalhos: o que a pessoa fixou (categoria, visualização, formulário, tela,
 *   link). Diferente dos Favoritos da estrela (Ctrl+B), que guardam a tela
 *   aberta; aqui cabe também link externo. Em grade quando o widget é largo.
 * - Recentes: o que a pessoa abriu por último. NOVO: o produto não guarda
 *   esse histórico hoje.
 * - Agenda: os eventos de hoje das fontes da Agenda.
 * - Tarefas que delegei: abertas, criadas pela pessoa para outra.
 */
import type { Atalho, Evento, Recente, TarefaDaHome } from './mocks'
import { pessoa } from './mocks'
import { hora, prazoDaTarefa } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'atalhos' | 'recentes' | 'agenda' | 'tarefasDelegadas'
  atalhos?: Atalho[]
  recentes?: Recente[]
  eventos?: Evento[]
  delegadas?: TarefaDaHome[]
  /** Largura do widget em colunas: atalhos viram grade a partir de 6. */
  largura: number
}>()

const emit = defineEmits<{ abrir: [destino: string], configurar: [] }>()

const iconeDaFonte = { tarefa: 'i-lucide-list-checks', item: 'i-lucide-file-text', calendario: 'i-lucide-calendar' }
const agora = computed(() => props.eventos?.slice().sort((a, b) => a.inicio.getTime() - b.inicio.getTime()) ?? [])
</script>

<template>
  <UScrollArea class="min-h-0 flex-1">
    <!-- Atalhos -->
    <template v-if="tipo === 'atalhos'">
      <ul v-if="atalhos?.length" class="grid gap-1 px-2 pb-2" :class="largura >= 6 ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'">
        <li v-for="(a, i) in atalhos" :key="a.id" class="animate-[entrada_0.3s_ease-out_both]" :style="{ animationDelay: `${i * 30}ms` }">
          <button
            type="button"
            class="group/linha flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="emit('abrir', a.nome)"
          >
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated ring ring-inset ring-default transition-colors group-hover/linha:bg-primary/10 group-hover/linha:ring-primary/25">
              <UIcon :name="a.icone" class="size-4 text-toned group-hover/linha:text-primary" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ a.nome }}</span>
              <span class="block truncate text-xs text-muted">{{ t.atalhos.tipos[a.tipo] }} · {{ a.onde }}</span>
            </span>
            <UIcon v-if="a.tipo === 'link'" name="i-lucide-arrow-up-right" class="size-3.5 shrink-0 text-dimmed" />
          </button>
        </li>
      </ul>
      <div v-else class="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <p class="text-sm text-muted">
          {{ t.atalhos.vazio }}
        </p>
        <UButton :label="t.atalhos.escolher" icon="i-lucide-plus" color="neutral" variant="outline" size="xs" @click="emit('configurar')" />
      </div>
    </template>

    <!-- Recentes -->
    <ul v-else-if="tipo === 'recentes'" class="px-2 pb-2">
      <li v-for="(r, i) in recentes" :key="r.id" class="animate-[entrada_0.3s_ease-out_both]" :style="{ animationDelay: `${i * 30}ms` }">
        <button type="button" class="group/linha flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated" @click="emit('abrir', r.nome)">
          <UIcon :name="r.icone" class="size-4 shrink-0 text-muted group-hover/linha:text-primary" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm text-highlighted" :title="r.nome">{{ r.nome }}</span>
            <span class="block truncate text-xs text-muted">{{ t.recentes.tipos[r.tipo] }} · {{ r.onde }}</span>
          </span>
          <span class="shrink-0 text-xs tabular-nums text-dimmed">{{ t.recentes.ha(r.ha) }}</span>
        </button>
      </li>
      <li v-if="!recentes?.length" class="px-2 py-8 text-center text-sm text-muted">
        {{ t.recentes.vazio }}
      </li>
    </ul>

    <!-- Agenda de hoje -->
    <ol v-else-if="tipo === 'agenda'" class="relative px-4 pb-3">
      <li v-for="(e, i) in agora" :key="e.id" class="flex gap-3 py-1.5 animate-[entrada_0.3s_ease-out_both]" :style="{ animationDelay: `${i * 30}ms` }">
        <span class="w-11 shrink-0 pt-0.5 text-right text-xs font-medium tabular-nums text-muted">{{ hora(e.inicio, t) }}</span>
        <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="e.fonte === 'tarefa' ? 'bg-warning' : e.fonte === 'item' ? 'bg-info' : 'bg-primary'" />
        <button type="button" class="min-w-0 flex-1 text-left" @click="emit('abrir', e.titulo)">
          <span class="block truncate text-sm text-highlighted hover:text-primary">{{ e.titulo }}</span>
          <span class="flex items-center gap-1 text-xs text-muted">
            <UIcon :name="iconeDaFonte[e.fonte]" class="size-3" />{{ t.agenda.fontes[e.fonte] }}
          </span>
        </button>
      </li>
      <li v-if="!agora.length" class="py-8 text-center text-sm text-muted">
        {{ t.agenda.vazio }}
      </li>
    </ol>

    <!-- Tarefas que delegei -->
    <ul v-else class="divide-y divide-default">
      <li v-for="x in delegadas" :key="x.id">
        <button type="button" class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-elevated/50" @click="emit('abrir', x.name)">
          <UAvatar size="xs" :text="pessoa(x.assigned_to)?.iniciais" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm text-highlighted">{{ x.name }}</span>
            <span class="block truncate text-xs text-muted">{{ t.delegadas.para(pessoa(x.assigned_to)?.nome ?? '') }}</span>
          </span>
          <span
            class="shrink-0 text-xs font-medium tabular-nums"
            :class="x.due_date && x.due_date.getTime() < Date.parse('2026-11-11T17:30:00.000Z') ? 'text-error-700 dark:text-error-300' : 'text-muted'"
          >{{ prazoDaTarefa(x, t) }}</span>
        </button>
      </li>
      <li v-if="!delegadas?.length" class="px-4 py-8 text-center text-sm text-muted">
        {{ t.delegadas.vazio }}
      </li>
    </ul>
  </UScrollArea>
</template>
