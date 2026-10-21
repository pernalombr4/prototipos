<script setup lang="ts">
/**
 * TIPO DE MENU "FILA DE TAREFAS".
 *
 * Absorve Tarefas e Tarefas Geral. Tarefas Geral vira o recorte "Todas",
 * liberado só para quem gerencia a categoria.
 *
 * O que muda em relação ao legado:
 *   - o lote fica à vista: a seleção é a da tabela, e a trava de etapa
 *     acontece no gesto (marcou de outra etapa, a tela avisa e mantém só a
 *     etapa da primeira). Hoje a pessoa ativa um modo e escolhe a etapa antes;
 *   - processa só as marcadas (UI-TSK-10: pela API, o lote legado processa
 *     todas as carregadas) e devolve o resultado por tarefa;
 *   - "Todo o período" é o padrão; com outro período, a tela diz quantas
 *     tarefas ficaram de fora (U6, W5);
 *   - reabrir, atribuir a outra pessoa e pular etapa (bypass), que só
 *     Tarefas Geral tinha, ficam na gaveta da tarefa, por permissão;
 *   - o título é o nome do menu (hoje sai "Tarefas Program…" truncado).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { EU, HOJE, grupos, itens, membroPorId, membros, type EtapaDoFluxo, type TarefaDoPrototipo } from './mocks'
import { dataCurta, moeda } from './formatar'
import { esperar, useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [] }>()

const { cenario, perfil, tarefas, meusGrupos } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

type Escopo = 'minhas' | 'grupo' | 'todas'
type Periodo = 'tudo' | 'd7' | 'd30' | 'd90'
const escopo = ref<Escopo>('minhas')
const etapa = ref<EtapaDoFluxo | 'todas'>('todas')
const situacao = ref<'pendentes' | 'concluidas'>('pendentes')
const periodo = ref<Periodo>('tudo')
const pagina = ref(1)
const POR_PAGINA = 12

watch(perfil, (p) => { if (p === 'membro' && escopo.value === 'todas') escopo.value = 'minhas' })

const idsDosGrupos = computed(() => meusGrupos.value.map(g => g.id))

function noEscopo(x: TarefaDoPrototipo, e: Escopo) {
  if (e === 'minhas') return x.assigned_to === EU.id
  if (e === 'grupo') return x.grupo !== null && idsDosGrupos.value.includes(x.grupo)
  return true
}

const diasDoPeriodo: Record<Periodo, number | null> = { tudo: null, d7: 7, d30: 30, d90: 90 }
function noPeriodo(x: TarefaDoPrototipo) {
  const d = diasDoPeriodo[periodo.value]
  if (d === null) return true
  return (HOJE.getTime() - x.created_at.getTime()) / 86_400_000 <= d
}

const antesDoPeriodo = computed(() => tarefas.value.filter(x =>
  noEscopo(x, escopo.value)
  && (situacao.value === 'pendentes' ? x.status === 'pending' : x.status === 'completed')
  && (etapa.value === 'todas' || x.etapa === etapa.value)))

const filtradas = computed(() => antesDoPeriodo.value.filter(noPeriodo).sort((a, b) => (a.due_date?.getTime() ?? 0) - (b.due_date?.getTime() ?? 0)))
const foraDoPeriodo = computed(() => antesDoPeriodo.value.length - filtradas.value.length)

watch([escopo, etapa, situacao, periodo], () => {
  pagina.value = 1
  ids.value = []
})

const contagem = computed(() => {
  const pend = (e: Escopo) => tarefas.value.filter(x => x.status === 'pending' && noEscopo(x, e)).length
  return { minhas: pend('minhas'), grupo: pend('grupo'), todas: pend('todas') }
})

const abas = computed(() => (['minhas', 'grupo', 'todas'] as Escopo[]).map(e => ({
  value: e,
  label: props.t.fila.escopos[e],
  badge: { label: String(contagem.value[e]), color: 'neutral' as const, variant: 'soft' as const },
  disabled: e === 'todas' && perfil.value === 'membro',
})))

const opcoesDeEtapa = computed(() => [
  { label: props.t.fila.todasEtapas, value: 'todas' },
  ...(Object.keys(props.t.fila.etapas) as EtapaDoFluxo[]).map(e => ({ label: props.t.fila.etapas[e], value: e })),
])
const opcoesDePeriodo = computed(() => (Object.keys(props.t.fila.periodos) as Periodo[]).map(p => ({ label: props.t.fila.periodos[p], value: p })))
const opcoesDeSituacao = computed(() => [
  { label: props.t.fila.situacao.pendentes, value: 'pendentes' },
  { label: props.t.fila.situacao.concluidas, value: 'concluidas' },
])

/* ---------------- tabela ---------------- */

interface Linha extends Record<string, unknown> {
  id: number
  tarefa: string
  item: string
  etapa: EtapaDoFluxo
  responsavel: string
  prazo: Date | null
  valor: number | null
  criada: string
  x: TarefaDoPrototipo
}

function valorDoItem(x: TarefaDoPrototipo) {
  return itens.find(i => i.id === x.item)?.valor ?? null
}
function tituloDoItem(x: TarefaDoPrototipo) {
  return itens.find(i => i.id === x.item)?.titulo ?? ''
}

function nomeDoResponsavel(x: TarefaDoPrototipo) {
  if (x.assigned_to) return membroPorId(x.assigned_to)?.nome ?? ''
  const g = grupos.find(g => g.id === x.grupo)
  return g ? props.t.fila.grupo(g.nome) : props.t.comum.ninguem
}

/*
 * reactive(): o EnTable guarda a seleção num Set por referência e lê a célula
 * por `row.original`, que chega como proxy reativo. Com objeto cru, o Set não
 * acha a linha e o checkbox da linha nunca acende (achado do SDK, DECISOES.md).
 */
const todasAsLinhas = computed<Linha[]>(() => reactive(filtradas.value.map(x => ({
  id: x.id,
  tarefa: x.name,
  item: x.itemRef,
  etapa: x.etapa,
  responsavel: nomeDoResponsavel(x),
  prazo: x.due_date ?? null,
  valor: valorDoItem(x),
  criada: dataCurta(x.created_at, idioma.value),
  x,
}))) as Linha[])
const linhas = computed(() => todasAsLinhas.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.fila.colunas
  return [
    { key: 'tarefa', label: c.tarefa },
    { key: 'item', label: c.item },
    { key: 'etapa', label: c.etapa },
    { key: 'responsavel', label: c.responsavel },
    { key: 'prazo', label: c.prazo },
    { key: 'valor', label: c.valor, align: 'right' },
    { key: 'criada', label: c.criada },
  ]
})

function prazo(d: Date | null, concluida: boolean) {
  if (concluida) return { rotulo: props.t.fila.concluidaEm, cor: 'success' as const }
  if (!d) return { rotulo: '-', cor: 'neutral' as const }
  const dias = Math.floor((d.getTime() - HOJE.getTime()) / 86_400_000)
  if (dias < 0) return { rotulo: props.t.fila.atrasada(-dias), cor: 'error' as const }
  if (dias === 0) return { rotulo: props.t.fila.venceHoje, cor: 'warning' as const }
  return { rotulo: props.t.fila.venceEm(dias), cor: 'neutral' as const }
}

/* ---------------- o lote, com a trava de etapa ---------------- */

/*
 * A seleção guarda o id: o EnTable compara a linha por referência, e a linha
 * se refaz quando a tarefa muda. A seleção vale entre páginas.
 */
const ids = ref<number[]>([])
const selecionadas = computed(() => todasAsLinhas.value.filter(l => ids.value.includes(l.id)))
const selecionadasNaPagina = computed(() => linhas.value.filter(l => ids.value.includes(l.id)))
const etapaDoLote = computed(() => selecionadas.value[0]?.etapa ?? null)

function aoSelecionar(rows: Linha[]) {
  if (situacao.value === 'concluidas') {
    ids.value = []
    return
  }
  const daPagina = linhas.value.map(l => l.id)
  const fora = selecionadas.value.filter(l => !daPagina.includes(l.id))
  const juntas = [...fora, ...rows]
  const primeira = juntas[0]?.etapa
  const mesma = juntas.filter(r => r.etapa === primeira)
  if (mesma.length < juntas.length && primeira) {
    toast.add({ title: props.t.fila.loteTrava(props.t.fila.etapas[primeira]), icon: 'i-lucide-lock', color: 'warning' })
  }
  ids.value = mesma.map(l => l.id)
}

const totalDoLote = computed(() => selecionadas.value.reduce((s, r) => s + (r.valor ?? 0), 0))

const confirmando = ref<'aprovar' | 'reprovar' | null>(null)
const comentario = ref('')
const executando = ref(false)
const feitas = ref(0)
const resultado = ref<{ ok: number, falhas: Linha[] } | null>(null)
const tentouSemComentario = ref(false)

function pedir(acao: 'aprovar' | 'reprovar') {
  comentario.value = ''
  tentouSemComentario.value = false
  resultado.value = null
  confirmando.value = acao
}

async function executar() {
  if (confirmando.value === 'reprovar' && !comentario.value.trim()) {
    tentouSemComentario.value = true
    return
  }
  executando.value = true
  feitas.value = 0
  const lote = [...selecionadas.value]
  // A 3ª do lote falha de propósito, para mostrar o resultado por tarefa.
  const falhas = lote.filter((_, i) => i === 2)
  for (let i = 0; i < lote.length; i++) {
    await esperar(260)
    feitas.value = i + 1
  }
  for (const l of lote) {
    if (falhas.includes(l)) continue
    const x = tarefas.value.find(y => y.id === l.id)
    if (x) {
      x.status = 'completed'
      x.completed_by = EU.id
      x.completed_at = new Date(HOJE)
    }
  }
  executando.value = false
  resultado.value = { ok: lote.length - falhas.length, falhas }
  ids.value = falhas.map(l => l.id)
}

/* ---------------- a gaveta da tarefa ---------------- */

const aberta = ref<TarefaDoPrototipo | null>(null)
const atribuindo = ref<number | undefined>(undefined)
const pulando = ref(false)
const justificativa = ref('')
const gavetaAberta = computed({
  get: () => !!aberta.value,
  set: (v) => { if (!v) aberta.value = null },
})

const opcoesDeMembro = computed(() => membros.filter(m => m.id !== aberta.value?.assigned_to).map(m => ({ label: m.nome, value: m.id, avatar: { text: m.nome.split(' ').map(p => p[0]).slice(0, 2).join('') } })))

function abrirGaveta(x: TarefaDoPrototipo) {
  aberta.value = x
  atribuindo.value = undefined
  pulando.value = false
  justificativa.value = ''
}

function responder(acao: 'aprovar' | 'reprovar') {
  const x = aberta.value
  if (!x) return
  x.status = 'completed'
  x.completed_by = EU.id
  x.completed_at = new Date(HOJE)
  toast.add({ title: acao === 'aprovar' ? props.t.fila.aprovada : props.t.fila.reprovada, icon: acao === 'aprovar' ? 'i-lucide-check' : 'i-lucide-x', color: 'success' })
  aberta.value = null
}

function atribuir(id: number | undefined) {
  const x = aberta.value
  if (!x || !id) return
  x.assigned_to = id
  x.grupo = null
  toast.add({ title: props.t.fila.atribuida(membroPorId(id)?.nome ?? ''), icon: 'i-lucide-user-round-check', color: 'success' })
  aberta.value = null
}

function pular() {
  const x = aberta.value
  if (!x || !justificativa.value.trim()) return
  x.status = 'completed'
  x.completed_at = new Date(HOJE)
  toast.add({ title: props.t.fila.pulada, icon: 'i-lucide-skip-forward', color: 'success' })
  aberta.value = null
}

function reabrir() {
  const x = aberta.value
  if (!x) return
  x.status = 'pending'
  x.completed_at = null
  toast.add({ title: props.t.fila.reaberta, icon: 'i-lucide-rotate-ccw', color: 'success' })
  aberta.value = null
}

const corDaEtapa: Record<EtapaDoFluxo, 'info' | 'warning' | 'primary'> = { analise_juridica: 'info', aprovacao_financeira: 'warning', assinatura: 'primary' }
</script>

<template>
  <div class="relative flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-list-checks"
      :titulo="t.fila.titulo"
      :descricao="t.fila.descricao"
      :substitui="['Tarefas', 'Tarefas Geral']"
      onde="Tipo de menu, criado em Interface > Menus. Pede categoria, etapa do fluxo, recorte e colunas."
    />

    <EstadoDaTela :t="t" :cenario="cenario" forma="tabela" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-list-checks" :title="t.fila.vazioTitulo" :description="t.fila.vazioTexto" />
      </template>

      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTooltip :text="perfil === 'membro' ? t.fila.todasSoGestor : ''" :disabled="perfil !== 'membro'">
          <UTabs v-model="escopo" :items="abas" :content="false" size="sm" variant="pill" color="neutral" />
        </UTooltip>
        <USelect v-model="etapa" :items="opcoesDeEtapa" size="sm" icon="i-lucide-git-commit-horizontal" class="w-52" :aria-label="t.fila.etapa" />
        <USelect v-model="situacao" :items="opcoesDeSituacao" size="sm" icon="i-lucide-circle-dot" class="w-40" :aria-label="t.fila.situacao.pendentes" />
        <USelect v-model="periodo" :items="opcoesDePeriodo" size="sm" icon="i-lucide-calendar" class="w-48" :aria-label="t.fila.periodo" />
      </div>

      <!-- W5: o período que esconde tarefa diz quantas ficaram de fora -->
      <div v-if="foraDoPeriodo > 0" class="flex flex-wrap items-center gap-2 border-b border-default bg-warning/5 px-6 py-2 text-xs text-toned">
        <UIcon name="i-lucide-eye-off" class="size-3.5 text-warning" />
        <span>{{ t.fila.ocultosPeloPeriodo(foraDoPeriodo) }}</span>
        <UButton :label="t.fila.mostrarTudo" color="neutral" variant="link" size="xs" @click="periodo = 'tudo'" />
      </div>
      <div v-else-if="situacao === 'pendentes'" class="flex items-center gap-2 px-6 py-2 text-xs text-muted">
        <UIcon name="i-lucide-layers" class="size-3.5" />
        <span>{{ t.fila.loteDica }}</span>
      </div>

      <div :key="`${escopo}-${etapa}-${situacao}`" class="min-h-0 flex-1 overflow-auto pb-24 animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :selectable="situacao === 'pendentes'"
          :selected="selecionadasNaPagina"
          :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtradas.length / POR_PAGINA)), total: filtradas.length }"
          :empty-state="{ icon: 'i-lucide-inbox', title: t.fila.vazioTitulo, description: t.fila.vazioTexto }"
          :locale="idioma"
          @update:selected="(r) => aoSelecionar(r as Linha[])"
          @page-change="pagina = $event"
          @row-click="(r) => abrirGaveta((r as Linha).x)"
        >
          <template #cell-tarefa="{ row }">
            <span class="block">
              <span class="block text-sm text-highlighted">{{ (row as Linha).tarefa }}</span>
              <span class="block font-mono text-[11px] text-muted">{{ (row as Linha).x.reference }}</span>
            </span>
          </template>
          <template #cell-item="{ row }">
            <span class="flex max-w-72 items-center gap-2">
              <UBadge color="info" variant="subtle" size="sm" class="shrink-0 font-mono text-[11px]">{{ (row as Linha).item }}</UBadge>
              <span class="truncate text-sm text-toned" :title="tituloDoItem((row as Linha).x)">{{ tituloDoItem((row as Linha).x) }}</span>
            </span>
          </template>
          <template #cell-etapa="{ row }">
            <UBadge
              :label="t.fila.etapas[(row as Linha).etapa]"
              :color="corDaEtapa[(row as Linha).etapa]"
              variant="subtle"
              size="sm"
              :class="etapaDoLote && etapaDoLote !== (row as Linha).etapa ? 'opacity-50' : ''"
            />
          </template>
          <template #cell-responsavel="{ row }">
            <span class="flex items-center gap-2 text-sm">
              <UIcon v-if="!(row as Linha).x.assigned_to" name="i-lucide-users" class="size-4 text-muted" />
              <UAvatar v-else :text="(row as Linha).responsavel.split(' ').map(p => p[0]).slice(0, 2).join('')" size="2xs" />
              <span class="max-w-40 truncate">{{ (row as Linha).responsavel }}</span>
            </span>
          </template>
          <template #cell-prazo="{ row }">
            <UBadge
              :label="prazo((row as Linha).prazo, (row as Linha).x.status === 'completed').rotulo"
              :color="prazo((row as Linha).prazo, (row as Linha).x.status === 'completed').cor"
              variant="soft"
              size="sm"
            />
          </template>
          <template #cell-valor="{ row }">
            <span class="text-sm tabular-nums">{{ (row as Linha).valor === null ? '-' : moeda((row as Linha).valor, idioma) }}</span>
          </template>
        </EnTable>
      </div>

      <!-- A barra do lote: aparece com a seleção, como no Fluig e no Jira -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-4 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="translate-y-4 opacity-0"
      >
        <div
          v-if="selecionadas.length && etapaDoLote"
          class="absolute inset-x-6 bottom-20 z-20 flex flex-wrap items-center gap-3 rounded-lg border border-default bg-default px-4 py-3 shadow-lg"
          role="region"
          :aria-label="t.fila.lote(selecionadas.length, t.fila.etapas[etapaDoLote])"
        >
          <span class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary tabular-nums">{{ selecionadas.length }}</span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-highlighted">{{ t.fila.lote(selecionadas.length, t.fila.etapas[etapaDoLote]) }}</span>
            <span class="block text-xs text-muted tabular-nums">{{ t.fila.loteValor(moeda(totalDoLote, idioma)) }}</span>
          </span>
          <UButton :label="t.fila.removerSelecao" color="neutral" variant="ghost" size="sm" @click="ids = []" />
          <UButton :label="t.fila.reprovar" icon="i-lucide-x" color="error" variant="outline" size="sm" @click="pedir('reprovar')" />
          <UButton :label="t.fila.aprovar" icon="i-lucide-check" color="primary" size="sm" @click="pedir('aprovar')" />
        </div>
      </Transition>
    </EstadoDaTela>

    <!-- Confirmar o lote, processar e mostrar o resultado por tarefa -->
    <UModal
      :open="!!confirmando"
      :title="resultado ? t.fila.loteProcessado : confirmando ? t.fila.confirmarTitulo(confirmando, selecionadas.length) : ''"
      :dismissible="!executando"
      :close="!executando"
      @update:open="(v) => { if (!v && !executando) confirmando = null }"
    >
      <template #body>
        <div v-if="resultado" class="space-y-3">
          <p class="flex items-center gap-2 text-sm text-highlighted">
            <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
            {{ t.fila.resultadoTitulo(resultado.ok) }}
          </p>
          <template v-if="resultado.falhas.length">
            <p class="text-sm text-highlighted">{{ t.fila.resultadoFalha(resultado.falhas.length) }}</p>
            <ul class="space-y-2">
              <li v-for="f in resultado.falhas" :key="f.id" class="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm">
                <span class="font-mono text-xs text-error">{{ f.x.reference }} · {{ f.item }}</span>
                <span class="block text-toned">{{ t.fila.motivoFalha }}</span>
              </li>
            </ul>
          </template>
        </div>
        <div v-else class="space-y-4">
          <p class="text-sm text-toned">{{ t.fila.confirmarTexto }}</p>
          <ul class="max-h-48 space-y-1 overflow-auto rounded-md border border-default p-2">
            <li v-for="s in selecionadas" :key="s.id" class="flex items-center gap-2 text-sm">
              <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ s.item }}</UBadge>
              <span class="flex-1 truncate text-toned">{{ tituloDoItem(s.x) }}</span>
              <span class="tabular-nums text-muted">{{ s.valor === null ? '' : moeda(s.valor, idioma) }}</span>
            </li>
          </ul>
          <UFormField :label="t.fila.comentario" :required="confirmando === 'reprovar'" :error="tentouSemComentario ? t.fila.comentarioObrigatorio : undefined">
            <UTextarea v-model="comentario" :placeholder="t.fila.comentarioPlaceholder" :rows="3" class="w-full" autoresize />
          </UFormField>
          <UProgress v-if="executando" :model-value="feitas" :max="selecionadas.length" size="sm" />
          <p v-if="executando" class="text-xs text-muted tabular-nums" aria-live="polite">{{ t.fila.processando(feitas, selecionadas.length) }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <template v-if="resultado">
            <UButton :label="t.fila.entendi" color="primary" @click="confirmando = null" />
          </template>
          <template v-else>
            <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" :disabled="executando" @click="confirmando = null" />
            <UButton
              v-if="confirmando"
              :label="t.fila.executar(confirmando, selecionadas.length)"
              :icon="confirmando === 'aprovar' ? 'i-lucide-check' : 'i-lucide-x'"
              :color="confirmando === 'aprovar' ? 'primary' : 'error'"
              :loading="executando"
              @click="executar"
            />
          </template>
        </div>
      </template>
    </UModal>

    <!-- A gaveta da tarefa: responder, atribuir, pular etapa, reabrir -->
    <USlideover v-model:open="gavetaAberta" :title="aberta?.name ?? ''" :description="aberta ? `${aberta.reference} · ${t.fila.etapas[aberta.etapa]}` : ''">
      <template #body>
        <div v-if="aberta" class="space-y-6">
          <dl class="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-3 text-sm">
            <dt class="text-muted">{{ t.fila.item }}</dt>
            <dd class="text-highlighted">{{ aberta.itemRef }} · {{ tituloDoItem(aberta) }}</dd>
            <dt class="text-muted">{{ t.fila.colunas.responsavel }}</dt>
            <dd class="text-highlighted">{{ nomeDoResponsavel(aberta) }}</dd>
            <dt class="text-muted">{{ t.fila.colunas.prazo }}</dt>
            <dd><UBadge :label="prazo(aberta.due_date ?? null, aberta.status === 'completed').rotulo" :color="prazo(aberta.due_date ?? null, aberta.status === 'completed').cor" variant="soft" size="sm" /></dd>
            <dt class="text-muted">{{ t.fila.colunas.valor }}</dt>
            <dd class="tabular-nums text-highlighted">{{ moeda(valorDoItem(aberta), idioma) || '-' }}</dd>
          </dl>

          <div v-if="aberta.status === 'pending'" class="space-y-3">
            <USeparator />
            <UFormField :label="t.fila.atribuir">
              <USelectMenu v-model="atribuindo" :items="opcoesDeMembro" value-key="value" :placeholder="t.fila.atribuirA" class="w-full" @update:model-value="atribuir" />
            </UFormField>
            <div class="space-y-2">
              <UTooltip :text="t.fila.pularEtapaSoGestor" :disabled="perfil === 'gestor'">
                <UButton :label="t.fila.pularEtapa" icon="i-lucide-skip-forward" color="neutral" variant="outline" size="sm" :disabled="perfil !== 'gestor'" @click="pulando = !pulando" />
              </UTooltip>
              <div v-if="pulando" class="space-y-2 rounded-md border border-default p-3 animate-[entrada_.2s_ease-out]">
                <p class="text-xs text-muted">{{ t.fila.pularEtapaDica }}</p>
                <UTextarea v-model="justificativa" :placeholder="t.fila.justificativa" :rows="2" class="w-full" autoresize />
                <div class="flex justify-end">
                  <UButton :label="t.fila.pularEtapa" color="warning" size="sm" :disabled="!justificativa.trim()" @click="pular" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberta" class="flex w-full justify-end gap-2">
          <template v-if="aberta.status === 'pending'">
            <UButton :label="t.fila.reprovar" icon="i-lucide-x" color="error" variant="outline" @click="responder('reprovar')" />
            <UButton :label="t.fila.aprovar" icon="i-lucide-check" color="primary" @click="responder('aprovar')" />
          </template>
          <UButton v-else :label="t.fila.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="reabrir" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
