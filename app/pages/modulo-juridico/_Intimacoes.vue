<script setup lang="ts">
/**
 * PROPOSTA: Jurídico › Intimações. A caixa de entrada do que o DJEN e o Domicílio Judicial Eletrônico mandaram.
 *
 * - cada comunicação chega ligada ao processo pelo número CNJ;
 * - o teor sugere a regra; o motor calcula o prazo na hora, com a memória do cálculo;
 * - nada vira tarefa sem uma pessoa confirmar (revisão humana, tabela 3 da pesquisa);
 * - Domicílio: o teor fica fechado até alguém escolher abrir, porque abrir registra a ciência e começa o prazo.
 *
 * Referência de mercado: a fila de conferência do Legal One e do Projuris (PESQUISA.md).
 *
 * A tela é a lista de registros do ENSPACE (rodada 2): a mesma barra de visualizações e de ferramentas, o `EnTable`
 * com seleção, ações e paginação. O módulo instala 3 visualizações: Para revisar, Confirmadas e Descartadas. A
 * revisão abre num painel à direita, como o painel da tarefa em Tarefas.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Intimacao, RegraId } from './mocks'
import { HOJE, pessoaPorId, pessoas, processoPorCnj, regraPorId, regras, tribunais } from './mocks'
import { calcular, cienciaTacita, diferencaEmDias } from './prazos'
import { calcularPrazo, confirmar, descartar, diaDeEntrada, estado, registrarCiencia, voltarParaRevisao } from './estado'
import type { Textos } from './textos'
import { dataHora, dia } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'
import BarraDaLista from './_BarraDaLista.vue'

const props = defineProps<{
  t: Textos
  cenario: 'normal' | 'vazio' | 'erroCaptura' | 'carregando'
}>()
const emit = defineEmits<{ abrirProcesso: [number], irPrazos: [], irCaptura: [] }>()
const toast = useToast()
const idioma = useIdioma()

type Filtro = Intimacao['status']
const filtro = ref<Filtro>('revisar')
const busca = ref('')

const visiveis = computed(() => (props.cenario === 'vazio' ? estado.intimacoes.filter(i => i.status !== 'revisar') : estado.intimacoes))
const contagem = (f: Filtro) => visiveis.value.filter(i => i.status === f).length

const lista = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return visiveis.value
    .filter(i => i.status === filtro.value)
    .filter((i) => {
      if (!q) return true
      const p = processoPorCnj.get(i.numeroCnj)
      return [i.numeroCnj, i.orgao, p?.data.parteContraria, p?.reference].some(x => x?.toLowerCase().includes(q))
    })
    .sort((a, b) => (a.dia < b.dia ? 1 : -1))
})

const selecionadaId = ref<number | undefined>()
const painelAberto = computed({ get: () => selecionadaId.value !== undefined, set: (v) => { if (!v) selecionadaId.value = undefined } })
const sel = computed(() => estado.intimacoes.find(i => i.id === selecionadaId.value))
const processo = computed(() => (sel.value ? processoPorCnj.get(sel.value.numeroCnj) : undefined))

/* ---------- o prazo da intimação aberta ---------- */
const regraEscolhida = ref<RegraId | undefined>()
const responsavel = ref<number>(12)
watch(sel, (i) => {
  regraEscolhida.value = i?.regraSugerida
  const p = i ? processoPorCnj.get(i.numeroCnj) : undefined
  responsavel.value = p?.data.responsavel ?? 12
}, { immediate: true })

const regrasDoRito = computed(() => regras
  .filter(r => !processo.value || r.rito === processo.value.data.rito)
  .map(r => ({ label: `${r.ato} (${props.t.prazoDaRegra(r)})`, value: r.id })))
const itensResponsavel = computed(() => pessoas.filter(p => p.id !== 15).map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))

const calculo = computed(() => {
  const i = sel.value
  const p = processo.value
  const regra = regraEscolhida.value ? regraPorId.get(regraEscolhida.value) : undefined
  const d = i ? diaDeEntrada(i) : undefined
  if (!i || !p || !regra || !d) return undefined
  return calcular({ meio: i.meio, dia: d, regra, tribunal: p.data.tribunal, suspensoes: estado.suspensoes, antecedencia: estado.antecedencia })
})

const teorFechado = computed(() => sel.value?.meio === 'domicilio' && !sel.value.ciencia)
const prazoConfirmado = computed(() => estado.prazos.find(p => p.intimacao === sel.value?.id))

/* ---------- ações ---------- */
const confirmando = ref(false)
async function confirmarPrazo() {
  const i = sel.value
  if (!i || !regraEscolhida.value || !calculo.value) return
  confirmando.value = true
  await new Promise(r => setTimeout(r, 650))
  const interno = calculo.value.interno
  confirmar(i, regraEscolhida.value, responsavel.value)
  confirmando.value = false
  toast.add({
    title: props.t.intimacoes.confirmadoToast(processo.value?.reference ?? ''),
    description: props.t.intimacoes.confirmadoDesc(pessoaPorId.get(responsavel.value)?.nome ?? '', dia(interno, props.t.locale)),
    icon: 'i-lucide-circle-check',
    color: 'success',
  })
}

const modalCiencia = ref(false)
function abrirTeor() {
  if (!sel.value) return
  registrarCiencia(sel.value)
  modalCiencia.value = false
  toast.add({ title: props.t.intimacoes.cienciaRegistrada, icon: 'i-lucide-mail-open', color: 'neutral' })
}

const modalDescarte = ref(false)
const motivoDoDescarte = ref('')
watch(modalDescarte, (a) => { if (a) motivoDoDescarte.value = props.t.intimacoes.modalDescarte.opcoes[0]! })
function confirmarDescarte() {
  if (!sel.value) return
  descartar(sel.value, motivoDoDescarte.value)
  modalDescarte.value = false
  toast.add({ title: props.t.intimacoes.descartadaToast, icon: 'i-lucide-archive', color: 'neutral' })
}

function maquete() {
  toast.add({ title: props.t.geral.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
}

/* ---------- a lista ---------- */
const vistas = computed(() => (['revisar', 'confirmada', 'descartada'] as Filtro[]).map(f => ({
  chave: f,
  rotulo: props.t.intimacoes.filtros[f],
  icone: 'i-lucide-table',
  contagem: f === 'revisar' ? contagem(f) : undefined,
})))
const vista = computed({ get: () => filtro.value as string, set: (v: string) => { filtro.value = v as Filtro } })

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.intimacoes.colunas
  return [
    { key: 'dia', label: c.dia },
    { key: 'origem', label: c.origem },
    { key: 'processo', label: c.processo },
    { key: 'orgao', label: c.orgao },
    { key: 'prazo', label: c.prazo },
  ]
})

/** O prazo fatal pela regra sugerida, para a coluna. Domicílio fechado não tem prazo ainda. */
function fatalDaLinha(i: Intimacao) {
  const p = processoPorCnj.get(i.numeroCnj)
  const regra = i.regraSugerida ? regraPorId.get(i.regraSugerida) : undefined
  const d = diaDeEntrada(i)
  if (!p || !regra || !d) return undefined
  return calcular({ meio: i.meio, dia: d, regra, tribunal: p.data.tribunal, suspensoes: estado.suspensoes, antecedencia: estado.antecedencia }).fatal
}

function menuDaLinha(i: Intimacao): DropdownMenuItem[][] {
  const p = processoPorCnj.get(i.numeroCnj)
  return [[
    { label: i.status === 'revisar' ? props.t.intimacoes.revisar : props.t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => { selecionadaId.value = i.id } },
    ...(p ? [{ label: props.t.intimacoes.abrirProcesso, icon: 'i-lucide-arrow-up-right', onSelect: () => emit('abrirProcesso', p.id) }] : []),
  ]]
}

const diasAteATacita = (i: Intimacao) => diferencaEmDias(HOJE, cienciaTacita(i.dia))

const fatalConfirmado = (i: Intimacao) => {
  const p = estado.prazos.find(x => x.intimacao === i.id)
  return p ? calcularPrazo(p).fatal : undefined
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <BarraDaLista v-model:ativa="vista" v-model:busca="busca" :t="t" :vistas="vistas" :pesquisar="t.intimacoes.pesquisar" />

    <UAlert
      v-if="cenario === 'erroCaptura'"
      class="mx-4 mt-3 w-auto"
      :title="t.intimacoes.erroCaptura.titulo"
      :description="t.intimacoes.erroCaptura.desc"
      icon="i-lucide-plug-zap"
      color="error"
      variant="subtle"
      :actions="[{ label: t.config.captura.revisar, color: 'error', variant: 'outline', size: 'xs', onClick: () => emit('irCaptura') }]"
    />

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div :key="filtro" class="animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="lista"
          :loading="cenario === 'carregando'"
          selectable
          :pagination="{ page: 1, pageCount: 1, total: lista.length }"
          :locale="idioma"
          :empty-state="filtro === 'revisar' && !busca
            ? { icon: 'i-lucide-inbox', title: t.intimacoes.vazio.titulo, description: t.intimacoes.vazio.desc }
            : { icon: 'i-lucide-search-x', title: t.intimacoes.vazioFiltro.titulo, description: t.intimacoes.vazioFiltro.desc }"
          class="[&_tbody_tr]:cursor-pointer"
          @row-click="(r) => { selecionadaId = (r as Intimacao).id }"
        >
          <template #cell-dia="{ row }">
            <span class="flex flex-col py-1">
              <span class="text-sm tabular-nums text-highlighted">{{ dia((row as Intimacao).dia, t.locale) }}</span>
              <span class="text-xs text-muted">{{ t.intimacoes.tipos[(row as Intimacao).tipo] }}</span>
            </span>
          </template>
          <template #cell-origem="{ row }">
            <UBadge :label="(row as Intimacao).meio === 'djen' ? 'DJEN' : t.intimacoes.origens.domicilio" :color="(row as Intimacao).meio === 'djen' ? 'neutral' : 'info'" variant="subtle" size="sm" />
          </template>
          <template #cell-processo="{ row }">
            <span v-if="processoPorCnj.get((row as Intimacao).numeroCnj)" class="flex min-w-0 flex-col py-1">
              <span class="max-w-72 truncate text-sm text-highlighted">{{ processoPorCnj.get((row as Intimacao).numeroCnj)?.titulo }}</span>
              <span class="text-xs text-muted">{{ processoPorCnj.get((row as Intimacao).numeroCnj)?.reference }}</span>
            </span>
            <span v-else class="flex flex-col gap-1 py-1">
              <span class="font-mono text-xs text-toned">{{ (row as Intimacao).numeroCnj }}</span>
              <UBadge :label="t.intimacoes.semProcesso" icon="i-lucide-link-2-off" color="warning" variant="outline" size="sm" class="self-start" />
            </span>
          </template>
          <template #cell-orgao="{ row }">
            <span class="flex min-w-0 flex-col">
              <span class="max-w-60 truncate text-sm text-toned">{{ (row as Intimacao).orgao }}</span>
              <span class="text-xs text-muted">{{ tribunais[(row as Intimacao).tribunal].sigla }}</span>
            </span>
          </template>
          <template #cell-prazo="{ row }">
            <template v-if="(row as Intimacao).status === 'confirmada' && fatalConfirmado(row as Intimacao)">
              <span class="flex items-center gap-1.5 text-sm tabular-nums text-highlighted">
                <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
                {{ dia(fatalConfirmado(row as Intimacao)!, t.locale) }}
              </span>
            </template>
            <span v-else-if="(row as Intimacao).status === 'descartada'" class="text-sm text-muted">{{ (row as Intimacao).motivoDoDescarte }}</span>
            <UBadge
              v-else-if="(row as Intimacao).meio === 'domicilio' && !(row as Intimacao).ciencia"
              :label="t.intimacoes.tacitaEm(dia(cienciaTacita((row as Intimacao).dia), t.locale))"
              icon="i-lucide-hourglass"
              :color="diasAteATacita(row as Intimacao) <= 2 ? 'error' : 'neutral'"
              variant="outline"
              size="sm"
            />
            <span v-else-if="fatalDaLinha(row as Intimacao)" class="flex flex-col">
              <span class="text-sm font-medium tabular-nums text-highlighted">{{ dia(fatalDaLinha(row as Intimacao)!, t.locale) }}</span>
              <span class="text-xs text-muted">{{ regraPorId.get((row as Intimacao).regraSugerida!)?.ato }}</span>
            </span>
            <UBadge v-else-if="processoPorCnj.get((row as Intimacao).numeroCnj)" :label="t.intimacoes.semRegra" icon="i-lucide-circle-help" color="warning" variant="outline" size="sm" />
            <span v-else />
          </template>
          <template #actions="{ row }">
            <UDropdownMenu :items="menuDaLinha(row as Intimacao)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
            </UDropdownMenu>
          </template>
        </EnTable>
      </div>
    </div>

    <!-- A revisão, no painel à direita -->
    <USlideover
      v-model:open="painelAberto"
      :title="sel ? `${t.intimacoes.tipos[sel.tipo]} · ${processo?.reference ?? sel.numeroCnj}` : ''"
      :description="sel ? (processo?.titulo ?? sel.orgao) : ''"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #body>
        <div v-if="sel" class="flex flex-col gap-4">
            <!-- Identificação -->
            <div class="flex flex-col gap-1.5">
              <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
                <UBadge :label="t.intimacoes.tipos[sel.tipo]" color="neutral" variant="outline" size="sm" />
                <span>{{ tribunais[sel.tribunal].nome }}</span>
              </div>
              <h2 class="text-base font-semibold text-highlighted">{{ sel.orgao }}</h2>
              <p class="font-mono text-sm text-toned">{{ sel.numeroCnj }}</p>
            </div>

            <dl class="grid grid-cols-1 gap-3 rounded-lg border border-default p-4 text-sm sm:grid-cols-3">
              <div>
                <dt class="text-xs text-muted">{{ sel.meio === 'djen' ? t.intimacoes.disponibilizada : t.intimacoes.enviada }}</dt>
                <dd class="tabular-nums text-highlighted">{{ dia(sel.dia, t.locale) }}</dd>
              </div>
              <div v-if="sel.meio === 'domicilio'">
                <dt class="text-xs text-muted">{{ t.intimacoes.cienciaEm }}</dt>
                <dd class="tabular-nums" :class="sel.ciencia ? 'text-highlighted' : 'text-dimmed'">{{ sel.ciencia ? dia(sel.ciencia, t.locale) : t.intimacoes.naoLida }}</dd>
              </div>
              <div :class="sel.meio === 'djen' && 'sm:col-span-2'">
                <dt class="text-xs text-muted">{{ t.intimacoes.processo }}</dt>
                <dd v-if="processo" class="flex items-center gap-2">
                  <span class="truncate text-highlighted">{{ processo.reference }} · {{ processo.titulo }}</span>
                  <UButton :label="t.intimacoes.abrirProcesso" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" class="shrink-0" @click="emit('abrirProcesso', processo.id)" />
                </dd>
                <dd v-else class="text-warning">{{ t.intimacoes.semProcesso }}</dd>
              </div>
            </dl>

            <!-- Domicílio ainda não lido -->
            <UAlert
              v-if="teorFechado && sel.status === 'revisar'"
              :title="t.intimacoes.teorFechado"
              :description="t.intimacoes.avisoDomicilio(dia(cienciaTacita(sel.dia), t.locale))"
              icon="i-lucide-mail-warning"
              color="warning"
              variant="subtle"
              :actions="[{ label: t.intimacoes.abrirTeor, icon: 'i-lucide-mail-open', color: 'warning', variant: 'solid', size: 'xs', onClick: () => { modalCiencia = true } }]"
            />

            <!-- Teor -->
            <div v-else class="rounded-lg border border-default">
              <p class="border-b border-default px-4 py-2 text-xs font-medium text-muted">{{ t.intimacoes.teor }}</p>
              <p class="px-4 py-3 text-sm leading-relaxed text-highlighted">{{ sel.teor }}</p>
            </div>

            <!-- Sem processo -->
            <div v-if="!processo" class="flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/5 p-4">
              <UIcon name="i-lucide-link-2-off" class="size-5 shrink-0 text-warning" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-highlighted">{{ t.intimacoes.semProcessoBloco.titulo }}</p>
                <p class="text-sm text-muted">{{ t.intimacoes.semProcessoBloco.texto }}</p>
              </div>
              <UButton :label="t.intimacoes.semProcessoBloco.vincular" icon="i-lucide-link" size="sm" color="neutral" variant="outline" @click="maquete" />
              <UButton :label="t.intimacoes.semProcessoBloco.criar" icon="i-lucide-plus" size="sm" @click="maquete" />
            </div>

            <!-- Prazo: para revisar -->
            <div v-else-if="sel.status === 'revisar' && !teorFechado" class="flex flex-col gap-4 rounded-lg border border-default p-4">
              <p class="text-sm font-semibold text-highlighted">{{ t.intimacoes.prazo.titulo }}</p>

              <div class="grid gap-3 sm:grid-cols-2">
                <UFormField :label="t.intimacoes.prazo.regra" :hint="sel.regraSugerida && regraEscolhida === sel.regraSugerida ? t.intimacoes.prazo.sugerida : undefined">
                  <USelect v-model="regraEscolhida" :items="regrasDoRito" :placeholder="t.intimacoes.prazo.regraPh" class="w-full" />
                </UFormField>
                <UFormField :label="t.intimacoes.prazo.responsavel">
                  <USelect v-model="responsavel" :items="itensResponsavel" class="w-full" />
                </UFormField>
              </div>

              <UAlert v-if="!regraEscolhida" :description="t.intimacoes.prazo.semSugestao" icon="i-lucide-circle-help" color="warning" variant="subtle" />

              <template v-if="calculo && regraEscolhida">
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-md border border-error/30 bg-error/5 p-3">
                    <p class="text-xs text-muted">{{ t.intimacoes.prazo.fatal }}</p>
                    <p class="text-xl font-semibold tabular-nums text-highlighted">{{ dia(calculo.fatal, t.locale) }}</p>
                    <p class="text-xs text-muted">{{ t.geral.emDias(diferencaEmDias(HOJE, calculo.fatal)) }}</p>
                  </div>
                  <div class="rounded-md border border-primary/30 bg-primary/5 p-3">
                    <p class="text-xs text-muted">{{ t.intimacoes.prazo.interno }}</p>
                    <p class="text-xl font-semibold tabular-nums text-highlighted">{{ dia(calculo.interno, t.locale) }}</p>
                    <p class="text-xs text-muted">{{ t.intimacoes.prazo.tarefa }}</p>
                  </div>
                </div>
                <div>
                  <p class="mb-2 text-xs font-medium text-muted">{{ t.memoria.titulo }}</p>
                  <MemoriaDoCalculo :t="t" :calculo="calculo" :regra="regraPorId.get(regraEscolhida)!" :tribunal="tribunais[processo.data.tribunal]" />
                </div>
              </template>


            </div>

            <!-- Prazo: confirmado -->
            <div v-else-if="sel.status === 'confirmada'" class="flex flex-col gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
              <p class="flex items-center gap-2 text-sm text-highlighted">
                <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
                {{ prazoConfirmado ? t.intimacoes.confirmadaPor(pessoaPorId.get(prazoConfirmado.confirmadoPor)?.nome ?? '', dataHora(prazoConfirmado.confirmadoEm, t.locale)) : t.intimacoes.filtros.confirmada }}
              </p>
              <MemoriaDoCalculo
                v-if="calculo && regraEscolhida"
                :t="t"
                :calculo="calculo"
                :regra="regraPorId.get(regraEscolhida)!"
                :tribunal="tribunais[processo.data.tribunal]"
                compacto
              />
              <div class="flex flex-wrap justify-end gap-2">
                <UButton :label="t.intimacoes.voltarParaRevisao" icon="i-lucide-undo-2" size="sm" color="neutral" variant="ghost" @click="voltarParaRevisao(sel)" />
                <UButton :label="t.intimacoes.verPrazos" icon="i-lucide-alarm-clock" size="sm" color="neutral" variant="outline" @click="emit('irPrazos')" />
              </div>
            </div>

            <!-- Descartada -->
            <div v-else-if="sel.status === 'descartada'" class="flex flex-wrap items-center gap-3 rounded-lg border border-default bg-elevated/40 p-4">
              <UIcon name="i-lucide-archive" class="size-4 text-muted" />
              <p class="min-w-0 flex-1 text-sm text-toned">{{ t.intimacoes.descartadaPor(sel.motivoDoDescarte ?? '') }}</p>
              <UButton :label="t.intimacoes.voltarParaRevisao" icon="i-lucide-undo-2" size="sm" color="neutral" variant="outline" @click="voltarParaRevisao(sel)" />
            </div>
                  </div>
      </template>
      <template v-if="sel && processo && sel.status === 'revisar' && !teorFechado" #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.intimacoes.prazo.descartar" icon="i-lucide-archive" color="neutral" variant="outline" @click="modalDescarte = true" />
          <UButton :label="t.intimacoes.prazo.confirmar" icon="i-lucide-check" :loading="confirmando" :disabled="!calculo" @click="confirmarPrazo" />
        </div>
      </template>
    </USlideover>

    <!-- Abrir o teor do Domicílio -->
    <UModal v-model:open="modalCiencia" :title="t.intimacoes.modalCiencia.titulo" :description="t.intimacoes.modalCiencia.texto">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="outline" @click="modalCiencia = false" />
          <UButton :label="t.intimacoes.modalCiencia.confirmar" icon="i-lucide-mail-open" color="warning" @click="abrirTeor" />
        </div>
      </template>
    </UModal>

    <!-- Descartar -->
    <UModal v-model:open="modalDescarte" :title="t.intimacoes.modalDescarte.titulo">
      <template #body>
        <URadioGroup v-model="motivoDoDescarte" :legend="t.intimacoes.modalDescarte.motivo" :items="t.intimacoes.modalDescarte.opcoes" />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="outline" @click="modalDescarte = false" />
          <UButton :label="t.intimacoes.modalDescarte.confirmar" icon="i-lucide-archive" color="neutral" @click="confirmarDescarte" />
        </div>
      </template>
    </UModal>
  </div>
</template>
