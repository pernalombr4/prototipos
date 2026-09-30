<script setup lang="ts">
/**
 * As tarefas por trás de um número.
 *
 * Todo número do painel abre aqui (convenção de Jira, ClickUp, Linear, Wrike
 * e Pipefy: clicar no número abre a lista filtrada). Rodada 2: a lista segue a
 * estrutura de tabela do admin do ENSPACE (tela Usuários), que é a do template
 * de dashboard do Nuxt UI:
 * - barra de cima: busca à esquerda; "Colunas" e "Exportar" à direita;
 * - a tabela (`EnTable` do SDK, regra 21), com ordenação e colunas ocultáveis;
 * - rodapé: "Mostrando 1 a 20 de N" à esquerda; itens por página e a
 *   paginação com primeira e última página à direita.
 *
 * No produto, o recorte vira filtro da lista de Agendadas ou de Rápidas, e
 * cada linha abre a tarefa.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import { AGORA } from './mocks'
import type { TarefaDoPainel } from './metricas'
import { estaAberta, nomeDoResponsavel, situacao } from './metricas'
import type { Textos } from './textos'
import { dataHora, duracao, numero } from './formatar'

const props = defineProps<{
  t: Textos
  titulo: string
  tarefas: TarefaDoPainel[]
}>()

const aberto = defineModel<boolean>('open', { required: true })
const toast = useToast()

const pagina = ref(1)
const porPagina = ref(20)
const busca = ref('')
const ordem = ref<EnTableSort | null>(null)
const larguras = ref<Record<string, number>>({ nome: 300, prazo: 180, onde: 240 })
const visiveis = ref<Record<string, boolean>>({ criadaEm: false })

watch(() => props.tarefas, () => { pagina.value = 1; ordem.value = null; busca.value = '' })
watch([busca, porPagina], () => { pagina.value = 1 })

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.gaveta.tarefa, sortable: true },
  { key: 'status', label: props.t.gaveta.status },
  { key: 'prazo', label: props.t.gaveta.prazo, sortable: true },
  { key: 'responsavel', label: props.t.gaveta.responsavel },
  { key: 'onde', label: props.t.gaveta.onde },
  { key: 'criadaEm', label: props.t.gaveta.criada, sortable: true },
  { key: 'concluidaEm', label: props.t.gaveta.concluida, sortable: true },
])

/** "Colunas", como o "Colunas" do admin e o "Display" do template. A 1ª coluna não sai. */
const menuDeColunas = computed<DropdownMenuItem[]>(() => colunas.value.slice(1).map(c => ({
  label: c.label,
  type: 'checkbox' as const,
  checked: visiveis.value[c.key] !== false,
  onUpdateChecked(marcado: boolean) {
    visiveis.value = { ...visiveis.value, [c.key]: marcado }
  },
  onSelect(e?: Event) {
    e?.preventDefault()
  },
})))

const filtradas = computed(() => {
  const q = busca.value.trim().toLocaleLowerCase(props.t.locale)
  if (!q) return props.tarefas
  return props.tarefas.filter(x =>
    x.nome.toLocaleLowerCase(props.t.locale).includes(q)
    || String(x.id).includes(q)
    || (x.fluxo ?? '').toLocaleLowerCase(props.t.locale).includes(q),
  )
})

const ordenadas = computed(() => {
  if (!ordem.value) return filtradas.value
  const { key, direction } = ordem.value
  const sinal = direction === 'asc' ? 1 : -1
  return [...filtradas.value].sort((a, b) => {
    const va = a[key as keyof TarefaDoPainel] as number | string | null
    const vb = b[key as keyof TarefaDoPainel] as number | string | null
    if (va === vb) return 0
    if (va === null) return 1
    if (vb === null) return -1
    return (typeof va === 'string' ? va.localeCompare(vb as string) : va - (vb as number)) * sinal
  })
})

const linhas = computed(() =>
  ordenadas.value
    .slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value)
    .map(x => ({ ...x }) as Record<string, unknown> & TarefaDoPainel),
)

const faixaMostrada = computed(() => {
  const total = ordenadas.value.length
  if (!total) return null
  const de = (pagina.value - 1) * porPagina.value + 1
  const ate = Math.min(total, pagina.value * porPagina.value)
  return props.t.gaveta.mostrando(numero(de, props.t), numero(ate, props.t), numero(total, props.t))
})

const opcoesPorPagina = computed(() => [10, 20, 50].map(n => ({ value: n, label: props.t.gaveta.porPagina(n) })))

const corDaSituacao: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  no_prazo: 'success',
  a_vencer: 'warning',
  vencida: 'error',
  sem_prazo: 'neutral',
  concluida_no_prazo: 'success',
  atrasada: 'error',
  concluida_sem_prazo: 'neutral',
}

function prazoRelativo(x: TarefaDoPainel) {
  if (x.prazo === null) return props.t.gaveta.semPrazo
  if (!estaAberta(x)) return dataHora(x.prazo, props.t)
  const falta = x.prazo - AGORA
  return falta < 0 ? props.t.gaveta.venceuHa(duracao(-falta, props.t)) : props.t.gaveta.venceEm(duracao(falta, props.t))
}

function responsavel(x: TarefaDoPainel) {
  return x.designados.map(d => nomeDoResponsavel(d.chave, props.t.rotulos)).join(', ')
}

const temAgendada = computed(() => props.tarefas.some(x => x.motor === 'programadas'))
const temRapida = computed(() => props.tarefas.some(x => x.motor === 'rapidas'))

function maquete(titulo: string) {
  toast.add({ title: titulo, icon: 'i-lucide-construction', color: 'neutral' })
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="titulo"
    :description="t.gaveta.contagem(tarefas.length)"
    :ui="{ content: 'max-w-6xl', body: 'flex min-h-0 flex-col gap-3 p-0 sm:p-0' }"
  >
    <template #body>
      <!-- Barra de cima, como no admin -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
        <UInput
          v-model="busca"
          icon="i-lucide-search"
          :placeholder="t.gaveta.buscar"
          :aria-label="t.gaveta.buscar"
          size="sm"
          class="w-full max-w-64"
        />
        <div class="flex flex-wrap items-center gap-1.5">
          <UButton v-if="temAgendada" :label="t.gaveta.abrirAgendadas" icon="i-lucide-calendar-check" color="neutral" variant="ghost" size="sm" @click="maquete(t.gaveta.maquete)" />
          <UButton v-if="temRapida" :label="t.gaveta.abrirRapidas" icon="i-lucide-clipboard-list" color="neutral" variant="ghost" size="sm" @click="maquete(t.gaveta.maquete)" />
          <UDropdownMenu :items="menuDeColunas" :content="{ align: 'end' }">
            <UButton :label="t.gaveta.colunas" icon="i-lucide-columns-3" color="neutral" variant="outline" size="sm" />
          </UDropdownMenu>
          <UButton :label="t.gaveta.exportar" icon="i-lucide-file-down" color="primary" size="sm" @click="maquete(t.gaveta.maqueteExportar)" />
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto border-y border-default">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :sort="ordem"
          resizable
          v-model:column-sizing="larguras"
          v-model:column-visibility="visiveis"
          :empty-state="{ icon: 'i-lucide-list-x', title: t.gaveta.vazio }"
          @sort-change="ordem = $event"
          @row-click="maquete(t.gaveta.maquete)"
        >
          <template #cell-nome="{ row }">
            <span class="block min-w-0">
              <span class="block max-w-72 truncate font-medium text-highlighted">{{ (row as TarefaDoPainel).nome }}</span>
              <span class="flex items-center gap-1.5 text-xs text-muted">
                <UBadge :label="t.origemCurta[(row as TarefaDoPainel).origem]" color="neutral" variant="soft" size="sm" />
                <span class="font-mono">#{{ (row as TarefaDoPainel).id }}</span>
              </span>
            </span>
          </template>
          <template #cell-status="{ row }">
            <span class="flex flex-col items-start gap-1">
              <span class="text-sm text-toned">{{ t.status[(row as TarefaDoPainel).status] }}</span>
              <UBadge
                v-if="situacao(row as TarefaDoPainel)"
                :label="t.situacao[situacao(row as TarefaDoPainel)!]"
                :color="corDaSituacao[situacao(row as TarefaDoPainel)!]"
                variant="subtle"
                size="sm"
              />
            </span>
          </template>
          <template #cell-prazo="{ row }">
            <span
              class="text-sm tabular-nums"
              :class="situacao(row as TarefaDoPainel) === 'vencida' ? 'font-medium text-error-700 dark:text-error-300' : 'text-toned'"
            >{{ prazoRelativo(row as TarefaDoPainel) }}</span>
          </template>
          <template #cell-responsavel="{ row }">
            <span class="block max-w-48 truncate text-sm text-toned">{{ responsavel(row as TarefaDoPainel) }}</span>
          </template>
          <template #cell-onde="{ row }">
            <span v-if="(row as TarefaDoPainel).etapa" class="block max-w-56 truncate text-sm text-toned">
              {{ (row as TarefaDoPainel).fluxo }} › {{ (row as TarefaDoPainel).etapa }}
            </span>
            <span v-else-if="(row as TarefaDoPainel).fluxo" class="block max-w-56 truncate text-sm text-toned">{{ (row as TarefaDoPainel).fluxo }}</span>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #cell-criadaEm="{ value }">
            <span class="text-sm tabular-nums text-toned">{{ dataHora(value as number, t) }}</span>
          </template>
          <template #cell-concluidaEm="{ value }">
            <span class="text-sm tabular-nums text-toned">{{ dataHora(value as number | null, t) }}</span>
          </template>
        </EnTable>
      </div>

      <!-- Rodapé, como no admin: contagem à esquerda, página à direita -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-6">
        <span class="text-sm text-muted">{{ faixaMostrada }}</span>
        <div class="flex flex-wrap items-center gap-2">
          <USelect
            v-model="porPagina"
            :items="opcoesPorPagina"
            size="sm"
            class="w-36"
            :aria-label="t.gaveta.porPagina(porPagina)"
          />
          <UPagination
            v-model:page="pagina"
            :total="ordenadas.length"
            :items-per-page="porPagina"
            size="sm"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>
