<script setup lang="ts">
/**
 * O painel da tarefa, aberto pelo cartão da pasta Tarefas.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo a aba Apontamentos. Copiado do develop em
 * 11/11/2026 (cartão da pasta Tarefas do item no workspace de exploração):
 * trilho de ícones à esquerda, abas Tarefa, Item, Comentários e Logs de
 * Auditoria, título, o selo "pending" em inglês (achado no BRIEFING), a
 * Reference, Detalhes da tarefa (Nome, Data limite, Descrição, Responsável,
 * Colaboradores, Prioridade) e o rodapé com Salvar alterações, Guardar
 * progresso e Concluir tarefa.
 *
 * A proposta: a aba Apontamentos, fixa como as outras (a tarefa não tem
 * pastas), entre Comentários e Logs, com o mesmo componente da pasta do item em
 * modo compacto.
 */
import type { Apontamento, TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import PastaDeApontamentos from './_PastaDeApontamentos.vue'
import { pendente } from './lista'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  lista: Lista
  quem: number
  estadoDaTela: string
}>()
const aberto = defineModel<boolean>('open', { required: true })
const aba = defineModel<string>('aba', { default: 'tarefa' })
const emit = defineEmits<{ converter: [a: Apontamento] }>()

const toast = useToast()
const pendentes = computed(() => props.lista.apontamentos.filter(a => pendente(a.estado)).length)

const abas = computed(() => [
  { value: 'tarefa', label: props.t.painelTarefa.abas.tarefa, icon: 'i-lucide-layers' },
  { value: 'item', label: props.t.painelTarefa.abas.item, icon: 'i-lucide-file-text' },
  { value: 'comentarios', label: props.t.painelTarefa.abas.comentarios, icon: 'i-lucide-message-circle' },
  { value: 'apontamentos', label: props.t.painelTarefa.abas.apontamentos, icon: 'i-lucide-list-checks', badge: pendentes.value || undefined },
  { value: 'logs', label: props.t.painelTarefa.abas.logs, icon: 'i-lucide-shield-check' },
])

const trilho = ['i-lucide-calculator', 'i-lucide-hash', 'i-lucide-tag', 'i-lucide-user', 'i-lucide-calendar-clock', 'i-lucide-calendar-check', 'i-lucide-calendar-plus', 'i-lucide-calendar-sync']

const prioridades = ['low', 'normal', 'high', 'urgent'] as const
const corDaPrioridade: Record<string, string> = { low: 'text-info bg-info/10', normal: 'text-info bg-info/10', high: 'text-warning bg-warning/10', urgent: 'text-error bg-error/10' }
const pessoa = computed(() => props.lista.pessoas.find(p => p.id === props.x.tarefa.assigned_to))

function aviso(titulo: string) {
  toast.add({ title: titulo, icon: 'i-lucide-check', color: 'success', duration: 2000 })
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    side="right"
    :title="x.tarefa.name"
    :ui="{ content: 'max-w-[42rem] w-full', header: 'hidden', body: 'p-0 sm:p-0 flex min-h-0', footer: 'justify-end gap-2 border-t border-default' }"
  >
    <template #body>
      <!-- Trilho de ícones, copiado -->
      <div class="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-default py-3 sm:flex" aria-hidden="true">
        <UIcon v-for="(i, n) in trilho" :key="n" :name="i" class="size-4 text-toned" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <UTabs
          v-model="aba"
          :items="abas"
          :content="false"
          variant="link"
          size="sm"
          class="border-b border-default"
          :ui="{ list: 'border-0 px-3 overflow-x-auto', trigger: 'shrink-0' }"
        >
          <template #trailing="{ item }">
            <UBadge v-if="item.badge" :label="String(item.badge)" size="sm" :color="aba === item.value ? 'primary' : 'neutral'" variant="soft" class="tabular-nums" />
          </template>
        </UTabs>

        <header class="flex items-start gap-3 px-4 pt-3">
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-lg font-semibold text-highlighted">{{ x.tarefa.name }}</h2>
            <p class="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-id-card" class="size-3.5" />
              <span class="font-medium text-toned">{{ t.painelTarefa.referencia }}</span>
              <span class="truncate font-mono">{{ x.tarefa.reference }}</span>
            </p>
          </div>
          <!-- "pending" em inglês: está assim no develop -->
          <UBadge :label="x.tarefa.status" color="neutral" variant="outline" size="sm" />
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.painelTarefa.fechar" @click="aberto = false" />
        </header>

        <div class="min-h-0 flex-1">
          <Transition mode="out-in" enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-75" leave-to-class="opacity-0">
            <!-- A proposta -->
            <PastaDeApontamentos
              v-if="aba === 'apontamentos'"
              key="apontamentos"
              :t="t"
              :lista="lista"
              :quem="quem"
              :estado-da-tela="estadoDaTela"
              :chave="`tarefa-${x.tarefa.id}`"
              compacto
              class="pt-1"
              @converter="(a: Apontamento) => emit('converter', a)"
            />

            <!-- Tarefa, copiada -->
            <div v-else-if="aba === 'tarefa'" key="tarefa" class="h-full overflow-y-auto px-4 py-4">
              <p class="mb-3 flex items-center gap-2 text-sm font-medium text-highlighted">
                <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-file-text" class="size-3.5" /></span>
                {{ t.painelTarefa.detalhes }}
              </p>
              <div class="flex flex-col gap-4 rounded-lg border border-default p-4">
                <div class="grid gap-3 sm:grid-cols-2">
                  <UFormField :label="t.painelTarefa.nome"><UInput :model-value="x.tarefa.name" class="w-full" /></UFormField>
                  <UFormField :label="t.painelTarefa.dataLimite"><UInput :model-value="x.tarefa.due_date ? t.dataHora(x.tarefa.due_date) : ''" trailing-icon="i-lucide-calendar" class="w-full" /></UFormField>
                </div>
                <UFormField :label="t.painelTarefa.descricao">
                  <div class="min-h-24 rounded-md border border-accented px-3 py-2 text-sm text-default">{{ x.tarefa.description || t.tarefas.semDescricao }}</div>
                </UFormField>
                <UFormField :label="t.painelTarefa.responsavel">
                  <UInput :model-value="pessoa?.nome" :avatar="pessoa ? { text: pessoa.iniciais, alt: pessoa.nome } : undefined" trailing-icon="i-lucide-chevron-down" class="w-full" />
                </UFormField>
                <UFormField :label="t.painelTarefa.prioridade">
                  <div class="flex flex-wrap gap-x-8 gap-y-2">
                    <label v-for="p in prioridades" :key="p" class="flex items-center gap-2 text-xs">
                      <span class="flex size-4 items-center justify-center rounded-full ring-1 ring-accented">
                        <span v-if="x.tarefa.priority === p" class="size-2 rounded-full bg-primary" />
                      </span>
                      <span class="rounded px-1.5 py-0.5" :class="corDaPrioridade[p]">{{ t.prioridades[p] }}</span>
                    </label>
                  </div>
                </UFormField>
              </div>
            </div>

            <!-- Fora do escopo -->
            <div v-else :key="aba" class="flex h-full items-center justify-center p-8 text-center">
              <p class="max-w-xs text-sm text-muted">{{ t.painelTarefa.foraDoEscopo(abas.find(a => a.value === aba)?.label ?? '') }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton :label="t.painelTarefa.salvarAlteracoes" color="neutral" variant="outline" size="sm" @click="aviso(t.painelTarefa.salvarAlteracoes)" />
      <UButton :label="t.painelTarefa.guardarProgresso" color="neutral" variant="outline" size="sm" @click="aviso(t.painelTarefa.guardarProgresso)" />
      <UButton :label="t.painelTarefa.concluir" size="sm" @click="aviso(t.painelTarefa.concluir)" />
    </template>
  </USlideover>
</template>
