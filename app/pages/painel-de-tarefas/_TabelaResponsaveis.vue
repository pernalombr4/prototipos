<script setup lang="ts">
/**
 * Tarefas por responsável: pessoas, grupos, "Todo mundo", e-mail externo e
 * sem responsável, na mesma tabela.
 *
 * A tabela é o `EnTable` do SDK (regra 21). Ordenação em memória, pelo
 * `sort-change`, porque aqui não há servidor. Rolagem infinita dentro do
 * painel (rodada 2): as linhas chegam em lotes conforme a pessoa rola.
 *
 * 2 leituras, porque respondem perguntas diferentes:
 * - Designada para: a quem o processo mandou a tarefa (grupo Financeiro,
 *   "Todo mundo"). Mostra onde a fila se acumula;
 * - Quem assumiu: a pessoa que pegou ou concluiu. Mostra quem está fazendo.
 */
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { LinhaDeResponsavel, ModoDoResponsavel } from './metricas'
import { responsaveisDisponiveis } from './metricas'
import type { Textos } from './textos'
import Sentinela from './_Sentinela.vue'
import { duracao, numero, porcentagem } from './formatar'

const props = defineProps<{
  t: Textos
  linhas: LinhaDeResponsavel[]
  /** Recorte do MVP (andaime): só "Designada para", sem a troca de leitura. */
  semModo?: boolean
}>()

const modo = defineModel<ModoDoResponsavel>('modo', { required: true })
const emit = defineEmits<{ abrir: [chave: string] }>()

const ordem = ref<EnTableSort>({ key: 'vencidas', direction: 'desc' })

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.resp.responsavel, sortable: true },
  { key: 'pendentes', label: props.t.resp.pendentes, sortable: true, align: 'right' },
  { key: 'emAndamento', label: props.t.resp.emAndamento, sortable: true, align: 'right' },
  { key: 'vencidas', label: props.t.resp.vencidas, sortable: true, align: 'right' },
  { key: 'concluidas', label: props.t.resp.concluidas, sortable: true, align: 'right' },
  { key: 'noPrazoPct', label: props.t.resp.noPrazo, sortable: true, align: 'right' },
  { key: 'tempoMedio', label: props.t.resp.tempo, sortable: true, align: 'right' },
])

const linhasOrdenadas = computed(() => {
  const { key, direction } = ordem.value
  const sinal = direction === 'asc' ? 1 : -1
  return [...props.linhas]
    .sort((a, b) => {
      const va = a[key as keyof LinhaDeResponsavel]
      const vb = b[key as keyof LinhaDeResponsavel]
      if (va === vb) return a.nome.localeCompare(b.nome)
      if (va === null) return 1
      if (vb === null) return -1
      return (typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)) * sinal
    })
    .map(l => ({ ...l }) as Record<string, unknown> & LinhaDeResponsavel)
})

/** Lote pequeno de propósito: com 15 responsáveis no mock, dá para ver a rolagem carregar. */
const LOTE = 8
const visiveis = ref(LOTE)
watch([() => props.linhas, ordem, modo], () => { visiveis.value = LOTE })

/** Larguras iniciais: a tabela cabe nas 8 colunas do arranjo padrão sem rolar para o lado. */
const larguras = ref<Record<string, number>>({ nome: 230, pendentes: 110, emAndamento: 130, vencidas: 100, concluidas: 110, noPrazoPct: 96, tempoMedio: 120 })

const iniciais = new Map(responsaveisDisponiveis.pessoas.map(p => [p.chave, p.iniciais]))

const iconeDoTipo: Record<LinhaDeResponsavel['tipo'], string> = {
  pessoa: 'i-lucide-user',
  grupo: 'i-lucide-users',
  todos: 'i-lucide-globe',
  externo: 'i-lucide-mail',
  sem: 'i-lucide-user-x',
}

const abas = computed(() => [
  { value: 'designada', label: props.t.resp.designada },
  { value: 'executada', label: props.t.resp.executada },
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="!semModo" class="flex items-center gap-2 px-4 pb-2">
      <span class="text-xs text-muted">{{ t.resp.modo }}</span>
      <UTabs
        v-model="modo"
        :items="abas"
        :content="false"
        size="xs"
        color="neutral"
        :aria-label="t.resp.modo"
      />
    </div>

    <UScrollArea data-rolagem class="min-h-0 flex-1 border-t border-default">
      <EnTable
        :key="modo"
        class="animate-[entrada_0.25s_ease-out_both]"
        :columns="colunas"
        :rows="linhasOrdenadas.slice(0, visiveis)"
        :sort="ordem"
        resizable
        v-model:column-sizing="larguras"
        :empty-state="{ icon: 'i-lucide-users', title: t.resp.vazio }"
        @sort-change="ordem = $event"
        @row-click="emit('abrir', ($event as LinhaDeResponsavel).chave)"
      >
        <template #cell-nome="{ row }">
          <span class="flex min-w-0 items-center gap-2.5">
            <UAvatar
              v-if="(row as LinhaDeResponsavel).tipo === 'pessoa'"
              :text="iniciais.get((row as LinhaDeResponsavel).chave)"
              size="xs"
            />
            <span v-else class="flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated">
              <UIcon :name="iconeDoTipo[(row as LinhaDeResponsavel).tipo]" class="size-3.5 text-muted" />
            </span>
            <span class="min-w-0">
              <span class="block max-w-48 truncate text-highlighted">{{ (row as LinhaDeResponsavel).nome }}</span>
              <span
                v-if="(row as LinhaDeResponsavel).tipo === 'pessoa' || (row as LinhaDeResponsavel).tipo === 'grupo'"
                class="block text-xs text-muted"
              >{{ t.resp.tipo[(row as LinhaDeResponsavel).tipo] }}</span>
            </span>
          </span>
        </template>
        <template #cell-pendentes="{ value }">
          <span class="tabular-nums">{{ numero(value as number, t) }}</span>
        </template>
        <template #cell-emAndamento="{ value }">
          <span class="tabular-nums">{{ numero(value as number, t) }}</span>
        </template>
        <template #cell-vencidas="{ value }">
          <span class="tabular-nums" :class="(value as number) > 0 ? 'font-medium text-error-700 dark:text-error-300' : 'text-muted'">{{ numero(value as number, t) }}</span>
        </template>
        <template #cell-concluidas="{ value }">
          <span class="tabular-nums">{{ numero(value as number, t) }}</span>
        </template>
        <template #cell-noPrazoPct="{ value }">
          <span
            class="tabular-nums"
            :class="value === null ? 'text-muted' : (value as number) < 0.7 ? 'font-medium text-error-700 dark:text-error-300' : (value as number) < 0.85 ? 'text-warning-700 dark:text-warning-300' : 'text-success-700 dark:text-success-300'"
          >{{ porcentagem(value as number | null, t) }}</span>
        </template>
        <template #cell-tempoMedio="{ value }">
          <span class="tabular-nums text-toned">{{ duracao(value as number | null, t) }}</span>
        </template>
      </EnTable>
      <Sentinela v-if="linhasOrdenadas.length" :t="t" :tem-mais="visiveis < linhasOrdenadas.length" :total="linhasOrdenadas.length" @mais="visiveis += LOTE" />
    </UScrollArea>

    <p class="flex gap-2 border-t border-default px-4 py-2 text-xs text-muted">
      <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      <span class="line-clamp-2">{{ modo === 'designada' ? t.resp.avisoSoma : t.resp.avisoGrupo }}</span>
    </p>
  </div>
</template>
