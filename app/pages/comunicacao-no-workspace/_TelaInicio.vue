<script setup lang="ts">
/**
 * Tela inicial. Cópia do develop (saudação e os 3 cartões de tarefas), sem
 * proposta. A linha "Atalhos" das rodadas 1 a 4 saiu: ali não há destinatário,
 * item para vincular nem formulário certo para o link (ver DECISOES.md).
 */
import type { Textos } from './textos'
import { EU, HOJE, membroPorId, tarefas } from './mocks'
import { useComunicacao } from './estado'

const props = defineProps<{ t: Textos }>()

const { ir } = useComunicacao()

const abertas = computed(() => tarefas.filter(x => x.status !== 'completed'))
const atrasadas = computed(() => abertas.value.filter(x => x.due_date && x.due_date < HOJE))
const proximas = computed(() => abertas.value.filter(x => x.due_date && x.due_date >= HOJE).sort((a, b) => +a.due_date! - +b.due_date!).slice(0, 4))

function quando(d: Date) {
  const dias = Math.round((+d - +HOJE) / 86400000)
  return dias < 0 ? props.t.inicio.atrasadaHa(-dias) : props.t.inicio.venceEm(dias)
}

const cores = { low: 'neutral', normal: 'success', high: 'warning', urgent: 'error' } as const

const cartoes = computed(() => [
  { chave: 'atraso', icone: 'i-lucide-triangle-alert', titulo: props.t.inicio.emAtraso, tarefas: atrasadas.value, vazio: props.t.inicio.nenhumaEmAtraso },
  { chave: 'proximas', icone: 'i-lucide-clock-3', titulo: props.t.inicio.proximas, tarefas: proximas.value, vazio: props.t.inicio.nenhumaProxima },
  { chave: 'rapidas', icone: 'i-lucide-zap', titulo: props.t.inicio.rapidas, tarefas: atrasadas.value.slice(0, 2), vazio: props.t.inicio.nenhumaEmAtraso, largo: true },
])
</script>

<template>
  <div class="px-6 py-6">
    <h1 class="text-2xl font-bold text-highlighted">
      {{ t.inicio.saudacao(EU.nome) }} 👋
    </h1>
    <p class="mt-1 text-sm text-muted">
      {{ t.inicio.subtitulo }}
    </p>

    <div class="mt-6 grid gap-5 lg:grid-cols-2">
      <UCard
        v-for="(c, i) in cartoes"
        :key="c.chave"
        class="animate-[entrada_.35s_ease-out_both]"
        :class="c.largo ? 'lg:col-span-2' : ''"
        :style="{ animationDelay: `${i * 60}ms` }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon :name="c.icone" class="size-4 text-highlighted" />
            <h2 class="text-lg font-semibold text-highlighted">
              {{ c.titulo }}
            </h2>
            <UIcon name="i-lucide-chevron-down" class="size-4 text-muted" />
            <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="xs" class="ml-auto" :aria-label="t.inicio.atualizar" />
          </div>
        </template>

        <p v-if="c.tarefas.length" class="mb-2 text-xs text-muted">
          {{ t.inicio.mostrando(c.tarefas.length) }}
        </p>
        <ul v-if="c.tarefas.length" class="flex flex-col gap-2">
          <li
            v-for="tarefa in c.tarefas"
            :key="tarefa.id"
            class="flex cursor-pointer items-center gap-3 rounded-lg border border-default px-4 py-3 transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm"
            @click="ir('tarefas')"
          >
            <span class="size-1.5 shrink-0 rounded-full bg-muted" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">
                {{ tarefa.name }} <span class="text-xs font-normal text-muted">#{{ tarefa.id }}</span>
              </span>
              <span class="block truncate text-xs text-muted">{{ membroPorId(tarefa.assigned_to)?.email ?? t.tarefas.semResponsavel }}</span>
            </span>
            <span class="shrink-0 text-xs font-medium" :class="tarefa.due_date! < HOJE ? 'text-error' : 'text-muted'">
              {{ quando(tarefa.due_date!) }}
            </span>
            <UBadge :label="t.prioridade[tarefa.priority]" :color="cores[tarefa.priority]" variant="subtle" size="sm" />
          </li>
        </ul>
        <UEmpty v-else :title="c.vazio" size="sm" :actions="[{ label: t.inicio.acessarTarefas, color: 'neutral', variant: 'outline', onClick: () => ir('tarefas') }]" />
      </UCard>
    </div>
  </div>
</template>
