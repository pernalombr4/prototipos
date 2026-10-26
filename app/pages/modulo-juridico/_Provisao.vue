<script setup lang="ts">
/**
 * PROPOSTA: Jurídico › Provisão. O risco e a perda estimada de cada processo, fechados por data-base.
 *
 * Risco e valor já existem como campos do caso de uso Contencioso. O que o módulo acrescenta:
 * - a foto por data-base, que não se edita depois de fechada (só acréscimo);
 * - a movimentação entre 2 datas-base (constituição, reversão e atualização monetária);
 * - o motivo obrigatório para cada mudança, antes de fechar.
 * Sem o módulo, mudar o risco apaga o valor anterior, e a controladoria refaz a conta numa planilha.
 *
 * Rodada 2: a tela é a lista de registros do ENSPACE. A barra de visualizações e de ferramentas é a mesma; a
 * data-base ocupa o lugar de "Criado em" e "Todo o período", porque é o recorte de data desta lista. Os totais e a
 * movimentação viram uma faixa de resumo acima da tabela, em vez de cartões de painel.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Risco } from './mocks'
import { ATUALIZACAO_DO_MES, pessoaPorId, processos, tribunais } from './mocks'
import { estado, fecharDataBase, provisionado } from './estado'
import type { Textos } from './textos'
import { dataHora, dia, dinheiro } from './formato'
import BarraDaLista from './_BarraDaLista.vue'

const props = defineProps<{ t: Textos, carregando?: boolean }>()
const emit = defineEmits<{ abrirProcesso: [number] }>()
const toast = useToast()
const idioma = useIdioma()

/* ---------- qual data-base ---------- */
const escolhida = ref(estado.dataBaseAberta)
watch(() => estado.dataBaseAberta, (d) => { escolhida.value = d })

const aberta = computed(() => escolhida.value === estado.dataBaseAberta)
const indice = computed(() => estado.datasBase.findIndex(b => b.dia === escolhida.value))
const fechada = computed(() => (aberta.value ? undefined : estado.datasBase[indice.value]))
const anterior = computed(() => (aberta.value ? estado.datasBase.at(-1) : estado.datasBase[indice.value - 1]))

const opcoes = computed(() => [
  { value: estado.dataBaseAberta, label: `${dia(estado.dataBaseAberta, props.t.locale)} · ${props.t.provisao.emAberto}` },
  ...[...estado.datasBase].reverse().map(b => ({ value: b.dia, label: `${dia(b.dia, props.t.locale)} · ${props.t.provisao.fechada}` })),
])

/* ---------- as linhas ---------- */
interface Linha { id: number, risco: Risco, estimado: number, antes?: { risco: Risco, estimado: number }, mudou: boolean, motivo: string }

const todas = computed<Linha[]>(() => processos.map((p) => {
  const agora = fechada.value ? fechada.value.fotos.find(f => f.processo === p.id)! : estado.riscos[p.id]!
  const antes = anterior.value?.fotos.find(f => f.processo === p.id)
  const mudou = !!antes && (antes.risco !== agora.risco || antes.estimado !== agora.estimado)
  const motivo = (fechada.value ? fechada.value.motivos?.[p.id] : estado.motivos[p.id]) ?? ''
  return { id: p.id, risco: agora.risco, estimado: agora.estimado, antes, mudou, motivo }
}))

const soMudancas = ref(false)
const busca = ref('')
const vista = ref('posicao')
const linhas = computed(() => todas.value
  .filter(l => !soMudancas.value || l.mudou)
  .filter((l) => {
    const q = busca.value.trim().toLowerCase()
    const p = processos.find(x => x.id === l.id)
    return !q || [p?.titulo, p?.reference].some(x => x?.toLowerCase().includes(q))
  })
  .sort((a, b) => Number(b.mudou) - Number(a.mudou) || provisionado(b.risco, b.estimado) - provisionado(a.risco, a.estimado) || b.estimado - a.estimado))

const mudancas = computed(() => todas.value.filter(l => l.mudou))
const semMotivo = computed(() => (aberta.value ? mudancas.value.filter(l => !estado.motivos[l.id]?.trim()) : []))

/* ---------- os cartões e a movimentação ---------- */
const soma = (r: Risco, ls = todas.value) => ls.filter(l => l.risco === r).reduce((s, l) => s + l.estimado, 0)
const conta = (r: Risco) => todas.value.filter(l => l.risco === r).length

const movimento = computed(() => {
  if (!anterior.value) return undefined
  let constituicao = 0
  let reversao = 0
  let continuam = 0
  for (const l of todas.value) {
    const a = l.antes ? provisionado(l.antes.risco, l.antes.estimado) : 0
    const d = provisionado(l.risco, l.estimado)
    if (d > a) constituicao += d - a
    if (d < a) reversao += d - a
    if (a && d) continuam += Math.min(a, d)
  }
  const saldoAnterior = anterior.value.fotos.reduce((s, f) => s + provisionado(f.risco, f.estimado), 0)
  const atualizacao = Math.round(continuam * ATUALIZACAO_DO_MES)
  return { saldoAnterior, constituicao, reversao, atualizacao, saldo: saldoAnterior + constituicao + reversao + atualizacao }
})

const cartoes = computed(() => (['provavel', 'possivel', 'remota'] as Risco[]).map((r) => {
  const valor = r === 'provavel' && movimento.value ? movimento.value.saldo : soma(r)
  const antes = anterior.value ? anterior.value.fotos.filter(f => f.risco === r).reduce((s, f) => s + f.estimado, 0) : undefined
  return { r, valor, n: conta(r), antes }
}))
const corDoRisco: Record<Risco, 'error' | 'warning' | 'neutral'> = { provavel: 'error', possivel: 'warning', remota: 'neutral' }

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.provisao.colunas
  return [
    { key: 'processo', label: c.processo },
    { key: 'risco', label: c.risco },
    { key: 'estimado', label: c.estimado },
    { key: 'provisionado', label: c.provisionado },
    ...(anterior.value ? [{ key: 'variacao', label: c.variacao }, { key: 'motivo', label: c.motivo }] : []),
  ]
})

function variacao(l: Linha) {
  if (!l.antes) return 0
  return provisionado(l.risco, l.estimado) - provisionado(l.antes.risco, l.antes.estimado)
}

/* ---------- fechar ---------- */
const confirmando = ref(false)
const fechando = ref(false)
async function fechar() {
  fechando.value = true
  await new Promise(r => setTimeout(r, 700))
  const d = estado.dataBaseAberta
  fecharDataBase()
  fechando.value = false
  confirmando.value = false
  toast.add({ title: props.t.provisao.fechadaToast(dia(d, props.t.locale)), description: props.t.provisao.fechadaDesc(dia(estado.dataBaseAberta, props.t.locale)), icon: 'i-lucide-lock', color: 'success' })
}

const exportando = ref(false)
async function exportar() {
  exportando.value = true
  await new Promise(r => setTimeout(r, 600))
  exportando.value = false
  toast.add({ title: props.t.provisao.exportarToast, description: props.t.provisao.exportarDesc, icon: 'i-lucide-file-spreadsheet', color: 'success' })
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <BarraDaLista v-model:ativa="vista" v-model:busca="busca" :t="t" :vistas="[{ chave: 'posicao', rotulo: t.provisao.vista, icone: 'i-lucide-table' }]">
      <template #periodo>
        <USelect v-model="escolhida" :items="opcoes" size="sm" variant="ghost" icon="i-lucide-calendar-check" class="w-60" :aria-label="t.provisao.dataBase" />
        <USwitch v-model="soMudancas" :label="t.provisao.soMudancas" size="sm" />
      </template>
      <template #antes-dos-icones>
        <UButton :label="t.provisao.exportar" icon="i-lucide-file-spreadsheet" color="neutral" variant="outline" size="sm" class="mr-1" :loading="exportando" @click="exportar" />
      </template>
    </BarraDaLista>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <UAlert
        v-if="fechada"
        class="mx-4 mt-3 w-auto"
        icon="i-lucide-lock"
        color="neutral"
        variant="subtle"
        :title="t.provisao.somenteLeitura"
        :description="t.provisao.fechadaPor(pessoaPorId.get(fechada.fechadaPor)?.nome ?? '', dataHora(fechada.fechadaEm, t.locale))"
      />

      <!-- Resumo da data-base: totais por risco e a movimentação -->
      <dl class="flex flex-wrap items-stretch gap-x-6 gap-y-2 border-b border-default px-4 py-3 text-sm">
        <div v-for="c in cartoes" :key="c.r" class="min-w-32">
          <dt class="flex items-center gap-1.5 text-xs text-muted">
            <span class="size-2 rounded-full" :class="{ provavel: 'bg-error', possivel: 'bg-warning', remota: 'bg-(--ui-text-dimmed)' }[c.r]" />
            {{ t.provisao.cartoes[c.r] }} · {{ t.provisao.processos(c.n) }}
          </dt>
          <dd class="font-semibold tabular-nums text-highlighted">{{ dinheiro(c.valor, t.locale) }}</dd>
        </div>
        <template v-if="movimento && anterior">
          <USeparator orientation="vertical" class="h-auto" />
          <div>
            <dt class="text-xs text-muted">{{ t.provisao.movimento.titulo(dia(anterior.dia, t.locale)) }}</dt>
            <dd class="flex flex-wrap gap-x-3 tabular-nums">
              <span class="text-error">{{ t.provisao.movimento.constituicao }} + {{ dinheiro(movimento.constituicao, t.locale) }}</span>
              <span class="text-success">{{ t.provisao.movimento.reversao }} {{ dinheiro(movimento.reversao, t.locale) }}</span>
              <span class="text-toned">{{ t.provisao.movimento.atualizacao }} + {{ dinheiro(movimento.atualizacao, t.locale) }}</span>
            </dd>
          </div>
          <span v-if="anterior" class="ml-auto self-end text-xs text-muted">{{ t.provisao.mudancas(mudancas.length) }}</span>
        </template>
      </dl>

      <EnTable
        :columns="colunas"
        :rows="linhas"
        :loading="carregando"
        selectable
        :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
        :locale="idioma"
        class="[&_tbody_tr]:cursor-pointer"
        @row-click="(r: Linha) => emit('abrirProcesso', r.id)"
      >
        <template #cell-processo="{ row }">
          <span class="flex min-w-0 flex-col py-1">
            <span class="max-w-48 truncate text-sm text-highlighted">{{ processos.find(p => p.id === (row as Linha).id)?.titulo }}</span>
            <span class="text-xs text-muted">
              {{ processos.find(p => p.id === (row as Linha).id)?.reference }} · {{ tribunais[processos.find(p => p.id === (row as Linha).id)!.data.tribunal].sigla }}
            </span>
          </span>
        </template>
        <template #cell-risco="{ row }">
          <span class="flex flex-wrap items-center gap-1.5">
            <UBadge :label="t.riscos[(row as Linha).risco]" :color="corDoRisco[(row as Linha).risco]" variant="subtle" size="sm" />
            <span v-if="(row as Linha).antes && (row as Linha).antes!.risco !== (row as Linha).risco" class="text-xs text-muted">
              {{ t.provisao.eraAntes(t.riscos[(row as Linha).antes!.risco]) }}
            </span>
          </span>
        </template>
        <template #cell-estimado="{ row }">
          <span class="flex flex-col">
            <span class="text-sm tabular-nums text-highlighted">{{ dinheiro((row as Linha).estimado, t.locale) }}</span>
            <span v-if="(row as Linha).antes && (row as Linha).antes!.estimado !== (row as Linha).estimado" class="text-xs tabular-nums text-muted">
              {{ t.provisao.eraAntes(dinheiro((row as Linha).antes!.estimado, t.locale)) }}
            </span>
          </span>
        </template>
        <template #cell-provisionado="{ row }">
          <span class="text-sm tabular-nums" :class="provisionado((row as Linha).risco, (row as Linha).estimado) ? 'font-medium text-highlighted' : 'text-dimmed'">
            {{ dinheiro(provisionado((row as Linha).risco, (row as Linha).estimado), t.locale) }}
          </span>
        </template>
        <template #cell-variacao="{ row }">
          <span
            v-if="variacao(row as Linha)"
            class="text-sm font-medium tabular-nums"
            :class="variacao(row as Linha) > 0 ? 'text-error' : 'text-success'"
          >
            {{ variacao(row as Linha) > 0 ? '+ ' : '' }}{{ dinheiro(variacao(row as Linha), t.locale) }}
          </span>
          <span v-else />
        </template>
        <template #cell-motivo="{ row }">
          <span v-if="!(row as Linha).mudou" />
          <template v-else>
            <UInput
              v-if="aberta"
              v-model="estado.motivos[(row as Linha).id]"
              :placeholder="t.provisao.motivoPh"
              size="sm"
              class="w-44"
              :color="estado.motivos[(row as Linha).id]?.trim() ? 'neutral' : 'warning'"
              :highlight="!estado.motivos[(row as Linha).id]?.trim()"
              :aria-label="t.provisao.colunas.motivo"
              @click.stop
              @keydown.stop
            />
            <span v-else class="text-sm text-toned">{{ (row as Linha).motivo }}</span>
          </template>
        </template>
      </EnTable>
    </div>

    <!-- Fechar a data-base: fixo no pé, só na data-base em aberto -->
    <div v-if="aberta" class="shrink-0 border-t border-default bg-default">
      <div class="flex w-full flex-wrap items-center justify-end gap-3 px-4 py-3">
        <p v-if="semMotivo.length" class="flex items-center gap-1.5 text-sm text-warning">
          <UIcon name="i-lucide-triangle-alert" class="size-4" />
          {{ t.provisao.faltaMotivo(semMotivo.length) }}
        </p>
        <UButton
          :label="t.provisao.fechar(dia(estado.dataBaseAberta, t.locale))"
          icon="i-lucide-lock"
          :disabled="semMotivo.length > 0"
          @click="confirmando = true"
        />
      </div>
    </div>

    <UModal v-model:open="confirmando" :title="t.provisao.modalFechar.titulo(dia(estado.dataBaseAberta, t.locale))" :description="t.provisao.modalFechar.texto">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="confirmando = false" />
          <UButton :label="t.provisao.modalFechar.confirmar" icon="i-lucide-lock" :loading="fechando" @click="fechar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
