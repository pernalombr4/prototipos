<script setup lang="ts">
/**
 * O quadro de Tarefas Rápidas: a pasta Tarefas do item e a página
 * Tarefas › Rápidas do menu (`variante="pagina"`).
 *
 * ⚠️ A estrutura NÃO É PROPOSTA. Copiada do develop em 11/11/2026: na pasta
 * (`?folder=tarefas`), chip Tarefas Rápidas, Visualizar, Nova tarefa, busca,
 * Criado em, Todo o período, Filtros por campo, 4 colunas e "Mostrando"; na
 * página (`/tasks/quick`), a mesma barra com Exportar, Dividir colunas,
 * Arquivadas, Lixeira, Nova tarefa e a seta de recolher, e o rodapé com
 * "500 por página" e a paginação. O cartão: nome, menu, descrição, avatar,
 * prioridade e data.
 *
 * A proposta, no cartão, só em texto (sem barra):
 * - "Checklist: 2 de 4" e "Subtarefas: 1 de 2", com "Ver subtarefas" que abre
 *   as filhas dentro do cartão;
 * - "Bloqueada por <tarefa>";
 * - "1 de 2 pendentes" dos apontamentos;
 * - a subtarefa não vira cartão, salvo com "Mostrar subtarefas como cartões",
 *   e aí mostra "Parte de <mãe>".
 *
 * Não é o `EnKanbanBoard`: o `EnKanbanCardConfig` só monta selos a partir de
 * campos de seleção; contador que muda com a tarefa pede um slot no cartão.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import { pendente } from './lista'
import { feitosDaChecklist, linhasDe } from './tarefas'

const props = defineProps<{ t: Textos, tarefas: TarefaDoItem[], lista: Pick<Lista, 'pessoas'>, variante?: 'pasta' | 'pagina' }>()
const emit = defineEmits<{ abrir: [t: TarefaDoItem] }>()

const colunas: { valor: Task['status'], icone: string, ponto: string, fundo: string }[] = [
  { valor: 'pending', icone: 'i-lucide-circle-ellipsis', ponto: 'bg-info', fundo: 'from-info/5' },
  { valor: 'working', icone: 'i-lucide-circle-dashed', ponto: 'bg-warning', fundo: 'from-warning/5' },
  { valor: 'blocked', icone: 'i-lucide-circle-pause', ponto: 'bg-error', fundo: 'from-error/5' },
  { valor: 'completed', icone: 'i-lucide-circle-check', ponto: 'bg-success', fundo: 'from-success/5' },
]
const corDaPrioridade: Record<string, 'neutral' | 'info' | 'warning' | 'error'> = { low: 'neutral', normal: 'info', high: 'warning', urgent: 'error' }

const mostrarSubtarefas = ref(false)
const abertas = ref(new Set<number>())
function alternar(id: number) {
  const s = new Set(abertas.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  abertas.value = s
}

const visiveis = computed(() => props.tarefas.filter(x => mostrarSubtarefas.value || !x.mae))
const porColuna = computed(() => Object.fromEntries(colunas.map(c => [c.valor, visiveis.value.filter(x => x.tarefa.status === c.valor)])) as Record<string, TarefaDoItem[]>)
const pendentes = (x: TarefaDoItem) => x.apontamentos.filter(a => pendente(a.estado)).length
const pessoaDe = (id: number | null | undefined) => props.lista.pessoas.find(p => p.id === id)
const porId = (id: number) => props.tarefas.find(x => x.tarefa.id === id)
const filhas = (x: TarefaDoItem) => props.tarefas.filter(y => y.mae === x.tarefa.id)
const concluidas = (xs: TarefaDoItem[]) => xs.filter(y => y.tarefa.status === 'completed').length
const feitos = (x: TarefaDoItem) => feitosDaChecklist(props.tarefas, x)
const totalDaChecklist = (x: TarefaDoItem) => linhasDe(x).length
const bloqueios = (x: TarefaDoItem) => x.bloqueadaPor.map(porId).filter((y): y is TarefaDoItem => !!y && y.tarefa.status !== 'completed')
const iconeDoStatus: Record<string, string> = { pending: 'i-lucide-circle', working: 'i-lucide-circle-dashed', blocked: 'i-lucide-circle-pause', completed: 'i-lucide-circle-check' }
const corDoStatus: Record<string, string> = { pending: 'text-info', working: 'text-warning', blocked: 'text-error', completed: 'text-success' }
</script>

<template>
  <div class="flex h-full min-h-0 flex-col" :class="variante === 'pagina' ? '' : 'gap-3 p-4'">
    <!-- Barra, copiada -->
    <template v-if="variante === 'pagina'">
      <div class="flex items-center gap-2 border-b border-default px-4 py-2">
        <UButton :label="t.tarefas.tarefasRapidas" icon="i-lucide-clipboard-check" color="primary" variant="soft" size="sm" />
        <span class="h-5 w-px bg-accented" aria-hidden="true" />
        <UButton :label="t.tarefas.visualizar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" />
      </div>
      <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2">
        <UInput icon="i-lucide-search" :placeholder="t.tarefas.pesquisar" size="sm" variant="ghost" class="w-56" />
        <UButton :label="t.tarefas.criadoEm" icon="i-lucide-calendar" color="neutral" variant="ghost" size="sm" />
        <UButton :label="t.tarefas.todoPeriodo" icon="i-lucide-arrow-left-right" color="neutral" variant="ghost" size="sm" />
        <span class="ml-auto flex items-center gap-1">
          <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefaRapida.pagina.exportar" />
          <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefaRapida.pagina.colunas" />
          <UButton icon="i-lucide-archive" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefaRapida.pagina.arquivadas" />
          <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefaRapida.pagina.lixeira" />
          <UButton :label="t.tarefas.novaTarefa" icon="i-lucide-plus" color="primary" variant="soft" size="sm" />
          <UButton icon="i-lucide-chevron-up" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefaRapida.pagina.recolher" />
        </span>
      </div>
      <div class="flex items-center gap-3 border-b border-default px-4 py-2">
        <UButton :label="t.tarefas.filtrosPorCampo" icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" />
        <!-- Proposta -->
        <USwitch v-model="mostrarSubtarefas" :label="t.tarefaRapida.cartao.mostrarSubtarefas" size="sm" class="ml-auto" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center gap-2">
        <UButton :label="t.tarefas.tarefasRapidas" icon="i-lucide-clipboard-list" color="primary" variant="soft" size="sm" />
        <UButton :label="t.tarefas.visualizar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" />
        <UButton :label="t.tarefas.novaTarefa" icon="i-lucide-plus" size="sm" class="ml-auto" />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UInput icon="i-lucide-search" :placeholder="t.tarefas.pesquisar" size="sm" variant="ghost" class="w-56" />
        <UButton :label="t.tarefas.criadoEm" icon="i-lucide-calendar" color="neutral" variant="ghost" size="sm" />
        <UButton :label="t.tarefas.todoPeriodo" icon="i-lucide-arrow-left-right" color="neutral" variant="ghost" size="sm" />
      </div>
      <div class="flex items-center gap-3">
        <UButton :label="t.tarefas.filtrosPorCampo" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" size="sm" />
        <!-- Proposta -->
        <USwitch v-model="mostrarSubtarefas" :label="t.tarefaRapida.cartao.mostrarSubtarefas" size="sm" class="ml-auto" />
      </div>
    </template>

    <div class="grid min-h-0 flex-1 grid-cols-[repeat(4,minmax(15rem,1fr))] gap-3 overflow-x-auto" :class="variante === 'pagina' ? 'p-4' : ''">
      <section v-for="c in colunas" :key="c.valor" class="flex min-h-0 flex-col rounded-lg border border-default bg-gradient-to-br to-transparent" :class="c.fundo">
        <header class="flex items-center gap-2 px-3 py-2.5 text-sm text-highlighted">
          <UIcon :name="c.icone" class="size-4" />
          <span>{{ porColuna[c.valor]!.length }} {{ t.tarefas.colunas[c.valor] }}</span>
          <span class="ml-auto size-2 rounded-full" :class="c.ponto" aria-hidden="true" />
        </header>
        <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
          <p v-if="!porColuna[c.valor]!.length" class="m-auto py-8 text-xs text-dimmed">{{ t.tarefas.nenhumResultado }}</p>
          <article
            v-for="(x, i) in porColuna[c.valor]"
            :key="x.tarefa.id"
            class="group relative flex flex-col gap-2 rounded-lg border border-default bg-default p-3 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-accented hover:shadow-md [animation:entrada_.3s_ease-out_both]"
            :style="{ animationDelay: `${i * 40}ms` }"
          >
            <!-- Proposta: a mãe da subtarefa, quando ela aparece como cartão -->
            <p v-if="x.mae && porId(x.mae)" class="flex items-center gap-1 text-[11px] text-muted">
              <UIcon name="i-lucide-corner-left-up" class="size-3" />{{ t.tarefaRapida.cartao.parteDe(porId(x.mae)!.tarefa.name) }}
            </p>
            <div class="flex items-start gap-2">
              <h4 class="flex-1 text-sm font-medium text-highlighted">
                <button type="button" class="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary" @click="emit('abrir', x)">
                  {{ x.tarefa.name }}
                </button>
              </h4>
              <UIcon name="i-lucide-ellipsis-vertical" class="size-4 text-dimmed" />
            </div>
            <p class="line-clamp-2 text-xs text-muted">{{ x.tarefa.description || t.tarefas.semDescricao }}</p>

            <!-- Proposta: as contagens, em texto -->
            <div v-if="totalDaChecklist(x) || filhas(x).length || x.apontamentos.length || bloqueios(x).length" class="flex flex-col gap-1 text-xs">
              <p v-if="bloqueios(x).length" class="flex items-center gap-1.5 text-error">
                <UIcon name="i-lucide-lock" class="size-3.5 shrink-0" />
                <span class="truncate">{{ t.tarefaRapida.cartao.bloqueadaPor(bloqueios(x)[0]!.tarefa.name) }}</span>
              </p>
              <p v-if="totalDaChecklist(x)" class="flex items-center gap-1.5 text-toned">
                <UIcon name="i-lucide-square-check" class="size-3.5 shrink-0" :class="feitos(x) === totalDaChecklist(x) ? 'text-success' : 'text-muted'" />
                {{ t.tarefaRapida.cartao.checklist(feitos(x), totalDaChecklist(x)) }}
              </p>
              <p v-if="x.apontamentos.length" class="flex items-center gap-1.5 text-toned">
                <UIcon name="i-lucide-list-checks" class="size-3.5 shrink-0 text-primary" />
                {{ t.tarefas.apontamentos(pendentes(x), x.apontamentos.length) }}
              </p>
              <div v-if="filhas(x).length" class="flex flex-col">
                <button
                  type="button"
                  class="relative z-10 -mx-1 flex items-center gap-1.5 rounded px-1 py-0.5 text-left text-toned transition-colors hover:bg-elevated"
                  :aria-expanded="abertas.has(x.tarefa.id)"
                  :aria-label="abertas.has(x.tarefa.id) ? t.tarefaRapida.cartao.esconderSubtarefas : t.tarefaRapida.cartao.verSubtarefas"
                  @click.stop="alternar(x.tarefa.id)"
                >
                  <UIcon name="i-lucide-git-branch" class="size-3.5 shrink-0 text-muted" />
                  {{ t.tarefaRapida.cartao.subtarefas(concluidas(filhas(x)), filhas(x).length) }}
                  <UIcon name="i-lucide-chevron-down" class="ml-auto size-3.5 transition-transform duration-200" :class="abertas.has(x.tarefa.id) ? 'rotate-180' : ''" />
                </button>
                <ul v-if="abertas.has(x.tarefa.id)" class="relative z-10 mt-1 flex flex-col border-l border-accented pl-2">
                  <li v-for="f in filhas(x)" :key="f.tarefa.id">
                    <button type="button" class="flex w-full items-center gap-1.5 rounded px-1 py-1 text-left transition-colors hover:bg-elevated" @click.stop="emit('abrir', f)">
                      <UIcon :name="iconeDoStatus[f.tarefa.status]" class="size-3.5 shrink-0" :class="corDoStatus[f.tarefa.status]" />
                      <span class="truncate" :class="f.tarefa.status === 'completed' ? 'text-muted line-through' : 'text-highlighted'">{{ f.tarefa.name }}</span>
                      <UAvatar v-if="pessoaDe(f.tarefa.assigned_to)" :text="pessoaDe(f.tarefa.assigned_to)!.iniciais" :alt="pessoaDe(f.tarefa.assigned_to)!.nome" size="3xs" class="ml-auto shrink-0" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <UAvatar v-if="pessoaDe(x.tarefa.assigned_to)" :text="pessoaDe(x.tarefa.assigned_to)!.iniciais" :alt="pessoaDe(x.tarefa.assigned_to)!.nome" size="xs" />
            <div class="flex flex-wrap items-center gap-2">
              <UBadge :label="t.tarefas.prioridades[x.tarefa.priority]" icon="i-lucide-gauge" :color="corDaPrioridade[x.tarefa.priority]" variant="soft" size="sm" />
            </div>
            <div class="-mx-3 -mb-3 border-t border-default px-3 py-1.5">
              <UBadge v-if="x.tarefa.due_date" :label="t.dataHora(x.tarefa.due_date)" icon="i-lucide-calendar" color="neutral" variant="outline" size="sm" />
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-if="variante === 'pagina'" class="flex items-center gap-3 border-t border-default px-4 py-2">
      <p class="text-xs text-muted">{{ t.tarefas.mostrando(visiveis.length) }}</p>
      <USelect :model-value="500" :items="[{ label: t.tarefaRapida.pagina.porPagina, value: 500 }]" size="sm" class="ml-auto w-40" />
      <UPagination :total="visiveis.length" :items-per-page="500" size="sm" show-edges />
    </div>
    <p v-else class="text-xs text-muted">{{ t.tarefas.mostrando(visiveis.length) }}</p>
  </div>
</template>
