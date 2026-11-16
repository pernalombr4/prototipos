<script setup lang="ts">
/**
 * PROPOSTA: o registro de toda ação que grava, envia ou cobra, com quem
 * confirmou, o modelo e o custo (PESQUISA: Notion Activity, HubSpot Run
 * history, ServiceNow). Leitura simples não entra, para a lista servir à
 * auditoria. Lista na EnTable do SDK, como as listas do produto.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { pessoaPorId } from './mocks'
import { modeloPorId, ferramentaPorSlug, iconeDoEfeito } from './catalogo'
import { useAgentes } from './estado'

const props = defineProps<{ t: Textos }>()
const agentes = useAgentes()
const toast = useToast()
const at = computed(() => props.t.atividade)

type Resultado = 'confirmado' | 'direto' | 'cancelado' | 'erro' | 'simulado'
interface Registro { id: number, quando: string, agente: string, ferramenta: string, resumo: string, pessoa: number, modelo: string, resultado: Resultado, creditos: number }

const r = (id: number, quando: string, agente: string, ferramenta: string, resumo: string, pessoa: number, modelo: string, resultado: Resultado, creditos: number): Registro =>
  ({ id, quando, agente, ferramenta, resumo, pessoa, modelo, resultado, creditos })

const SONNET = 'anthropic/claude-sonnet-5.5'
const OPUS = 'anthropic/claude-opus-5.5'
const FLASH = 'google/gemini-3.8-flash'
const registros: Registro[] = [
  r(1, '16/11 14:32', 'respostas-a-oficios', 'sendEmail', 'campinas3cv@tjsp.jus.br', 3, SONNET, 'confirmado', 31),
  r(2, '16/11 14:05', 'respostas-a-oficios', 'sendEmail', 'saopaulo1vt@trt2.jus.br', 2, SONNET, 'cancelado', 18),
  r(3, '16/11 11:48', 'triagem-de-chamados', 'createTask', 'Chamado 2291: acesso bloqueado', 2, FLASH, 'confirmado', 6),
  r(4, '16/11 10:20', 'respostas-a-oficios', 'legalLookupCase', '0012345-67.2025.8.26.0114', 3, OPUS, 'confirmado', 52),
  r(5, '16/11 09:15', 'respostas-a-oficios', 'smartBatchCreateItems', '12 itens em Ofícios recebidos', 5, SONNET, 'confirmado', 44),
  r(6, '15/11 17:02', 'respostas-a-oficios', 'sendEmail', 'bh2vef@tjmg.jus.br', 3, SONNET, 'erro', 12),
  r(7, '15/11 16:40', 'triagem-de-chamados', 'updateItem', 'Chamado 2287: prioridade alta', 2, FLASH, 'direto', 4),
  r(8, '15/11 15:11', 'respostas-a-oficios', 'smartCreateItem', 'Ofício 3318/2026', 3, SONNET, 'confirmado', 9),
  r(9, '15/11 11:37', 'respostas-a-oficios', 'sendEmail', 'teste@exemplo.com', 1, OPUS, 'simulado', 0),
  r(10, '14/11 18:22', 'triagem-de-chamados', 'createTask', 'Chamado 2274: nota fiscal', 4, FLASH, 'confirmado', 5),
  r(11, '14/11 10:03', 'triagem-de-chamados', 'createTask', 'Chamado 2268: integração', 2, FLASH, 'cancelado', 3),
  r(12, '13/11 16:55', 'respostas-a-oficios', 'legalLookupCase', '0008821-14.2024.5.02.0012', 1, SONNET, 'cancelado', 7),
]

const filtroAgente = ref('todos')
const filtroResultado = ref<Resultado | 'todos'>('todos')
const opcoesAgente = computed(() => [{ value: 'todos', label: at.value.filtroAgente }, ...agentes.value.map(a => ({ value: a.slug, label: a.name }))])
const opcoesResultado = computed(() => [{ value: 'todos', label: at.value.filtroResultado }, ...(Object.keys(at.value.resultados) as Resultado[]).map(k => ({ value: k, label: at.value.resultados[k] }))])

const visiveis = computed(() => registros.filter(x => (filtroAgente.value === 'todos' || x.agente === filtroAgente.value)
  && (filtroResultado.value === 'todos' || x.resultado === filtroResultado.value)))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'quando', label: at.value.colunas.quando },
  { key: 'acao', label: at.value.colunas.acao },
  { key: 'agente', label: at.value.colunas.agente },
  { key: 'pessoa', label: at.value.colunas.pessoa },
  { key: 'modelo', label: at.value.colunas.modelo },
  { key: 'resultado', label: at.value.colunas.resultado },
  { key: 'creditos', label: at.value.colunas.creditos, align: 'right' },
])
const linhas = computed(() => visiveis.value.map(x => ({ ...x })))
type Linha = Registro

const corDoResultado: Record<Resultado, 'success' | 'neutral' | 'warning' | 'error' | 'info'> = { confirmado: 'success', direto: 'warning', cancelado: 'neutral', erro: 'error', simulado: 'info' }
const nomeDoAgente = (s: string) => agentes.value.find(a => a.slug === s)?.name ?? s
const idioma = useIdioma()
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">{{ at.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ at.subtitulo }}</p>
      </div>
      <UButton :label="at.exportar" icon="i-lucide-download" color="neutral" variant="outline" @click="toast.add({ title: at.exportar, icon: 'i-lucide-download' })" />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <USelect v-model="filtroAgente" :items="opcoesAgente" value-key="value" class="w-60" :aria-label="at.colunas.agente" />
      <USelect v-model="filtroResultado" :items="opcoesResultado" value-key="value" class="w-52" :aria-label="at.colunas.resultado" />
      <span class="ml-auto text-sm text-muted">{{ at.resumo(1482) }}</span>
    </div>

    <EnTable :columns="colunas" :rows="linhas" :locale="idioma" :empty-state="{ icon: 'i-lucide-activity', title: at.filtroResultado }">
      <template #cell-quando="{ row }">
        <span class="whitespace-nowrap text-xs tabular-nums text-muted">{{ (row as Linha).quando }}</span>
      </template>
      <template #cell-acao="{ row }">
        <span class="flex min-w-0 items-center gap-2 py-1">
          <UIcon :name="iconeDoEfeito[ferramentaPorSlug((row as Linha).ferramenta).efeito]" class="size-4 shrink-0 text-muted" />
          <span class="flex min-w-0 flex-col">
            <span class="text-sm font-medium text-highlighted">{{ t.ferramentas.nomes[(row as Linha).ferramenta] }}</span>
            <span class="max-w-64 truncate text-xs text-muted">{{ (row as Linha).resumo }}</span>
          </span>
        </span>
      </template>
      <template #cell-agente="{ row }">
        <span class="text-sm">{{ nomeDoAgente((row as Linha).agente) }}</span>
      </template>
      <template #cell-pessoa="{ row }">
        <span class="flex items-center gap-1.5 text-sm">
          <UAvatar :text="pessoaPorId((row as Linha).pessoa).iniciais" size="3xs" />
          <span class="max-w-40 truncate">{{ pessoaPorId((row as Linha).pessoa).nome }}</span>
        </span>
      </template>
      <template #cell-modelo="{ row }">
        <span class="text-xs text-muted">{{ modeloPorId((row as Linha).modelo)?.name }}</span>
      </template>
      <template #cell-resultado="{ row }">
        <UBadge :label="at.resultados[(row as Linha).resultado]" :color="corDoResultado[(row as Linha).resultado]" variant="soft" size="sm" />
      </template>
      <template #cell-creditos="{ row }">
        <span class="tabular-nums">{{ (row as Linha).creditos }}</span>
      </template>
    </EnTable>
  </div>
</template>
