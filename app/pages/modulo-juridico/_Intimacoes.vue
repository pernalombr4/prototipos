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
 */
import type { Intimacao, RegraId } from './mocks'
import { HOJE, pessoaPorId, pessoas, processoPorCnj, regraPorId, regras, tribunais } from './mocks'
import { calcular, cienciaTacita, diferencaEmDias } from './prazos'
import { confirmar, descartar, diaDeEntrada, estado, registrarCiencia, voltarParaRevisao } from './estado'
import type { Textos } from './textos'
import { dataHora, dia } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'

const props = defineProps<{
  t: Textos
  cenario: 'normal' | 'vazio' | 'erroCaptura' | 'carregando'
}>()
const emit = defineEmits<{ abrirProcesso: [number], irPrazos: [], irCaptura: [] }>()
const toast = useToast()

type Filtro = Intimacao['status']
const filtro = ref<Filtro>('revisar')
const origem = ref<'todas' | 'djen' | 'domicilio'>('todas')
const busca = ref('')

const visiveis = computed(() => (props.cenario === 'vazio' ? estado.intimacoes.filter(i => i.status !== 'revisar') : estado.intimacoes))
const contagem = (f: Filtro) => visiveis.value.filter(i => i.status === f).length

const lista = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return visiveis.value
    .filter(i => i.status === filtro.value)
    .filter(i => origem.value === 'todas' || i.meio === origem.value)
    .filter((i) => {
      if (!q) return true
      const p = processoPorCnj.get(i.numeroCnj)
      return [i.numeroCnj, i.orgao, p?.data.parteContraria, p?.reference].some(x => x?.toLowerCase().includes(q))
    })
    .sort((a, b) => (a.dia < b.dia ? 1 : -1))
})

const selecionadaId = ref<number | undefined>()
watch(lista, (l) => {
  if (!l.some(i => i.id === selecionadaId.value)) selecionadaId.value = l[0]?.id
}, { immediate: true })
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

const filtros = computed(() => (['revisar', 'confirmada', 'descartada'] as Filtro[]).map(f => ({
  value: f,
  label: props.t.intimacoes.filtros[f],
  badge: f === 'revisar' && contagem(f) ? { label: String(contagem(f)), color: 'primary' as const, variant: 'soft' as const } : undefined,
})))
const origens = computed(() => (['todas', 'djen', 'domicilio'] as const).map(o => ({ value: o, label: props.t.intimacoes.origens[o] })))

const diasAteATacita = (i: Intimacao) => diferencaEmDias(HOJE, cienciaTacita(i.dia))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-end gap-3 border-b border-default px-5 pb-0 pt-4">
      <div class="min-w-0 flex-1">
        <h1 class="text-lg font-semibold text-highlighted">{{ t.intimacoes.titulo }}</h1>
        <p class="max-w-3xl text-sm text-muted">{{ t.intimacoes.descricao }}</p>
        <UTabs v-model="filtro" :items="filtros" :content="false" variant="link" size="sm" class="mt-2" />
      </div>
      <div class="mb-2 flex flex-wrap items-center gap-2">
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.intimacoes.buscar" size="sm" class="w-64" />
        <USelect v-model="origem" :items="origens" size="sm" class="w-40" :aria-label="t.intimacoes.origens.todas" />
      </div>
    </div>

    <UAlert
      v-if="cenario === 'erroCaptura'"
      class="mx-5 mt-3 w-auto"
      :title="t.intimacoes.erroCaptura.titulo"
      :description="t.intimacoes.erroCaptura.desc"
      icon="i-lucide-plug-zap"
      color="error"
      variant="subtle"
      :actions="[{ label: t.config.captura.revisar, color: 'error', variant: 'outline', size: 'xs', onClick: () => emit('irCaptura') }]"
    />

    <!-- Carregando -->
    <div v-if="cenario === 'carregando'" class="flex min-h-0 flex-1">
      <div class="flex w-96 shrink-0 flex-col gap-3 border-r border-default p-4">
        <USkeleton v-for="n in 6" :key="n" class="h-16 w-full" />
      </div>
      <div class="flex flex-1 flex-col gap-3 p-6">
        <USkeleton class="h-6 w-1/3" />
        <USkeleton class="h-24 w-full" />
        <USkeleton class="h-48 w-2/3" />
      </div>
    </div>

    <div v-else class="flex min-h-0 flex-1">
      <!-- Lista -->
      <ul class="w-full shrink-0 overflow-y-auto border-r border-default md:w-96" role="listbox" :aria-label="t.intimacoes.titulo">
        <li v-if="!lista.length" class="p-6">
          <UEmpty
            :icon="filtro === 'revisar' && !busca && origem === 'todas' ? 'i-lucide-inbox' : 'i-lucide-search-x'"
            :title="filtro === 'revisar' && !busca && origem === 'todas' ? t.intimacoes.vazio.titulo : t.intimacoes.vazioFiltro.titulo"
            :description="filtro === 'revisar' && !busca && origem === 'todas' ? t.intimacoes.vazio.desc : t.intimacoes.vazioFiltro.desc"
            variant="naked"
          />
        </li>
        <li
          v-for="(i, n) in lista"
          :key="i.id"
          role="option"
          :aria-selected="i.id === selecionadaId"
          tabindex="0"
          class="animate-[entrada_.25s_ease-out_both] cursor-pointer border-b border-default px-4 py-3 transition-colors"
          :class="i.id === selecionadaId ? 'bg-primary/8 shadow-[inset_3px_0_0_var(--ui-primary)]' : 'hover:bg-elevated/60'"
          :style="{ animationDelay: `${n * 30}ms` }"
          @click="selecionadaId = i.id"
          @keydown.enter="selecionadaId = i.id"
        >
          <div class="flex items-center gap-2 text-xs text-muted">
            <UBadge :label="i.meio === 'djen' ? 'DJEN' : t.intimacoes.origens.domicilio" :color="i.meio === 'djen' ? 'neutral' : 'info'" variant="subtle" size="sm" />
            <span>{{ t.intimacoes.tipos[i.tipo] }}</span>
            <span class="ml-auto tabular-nums">{{ dia(i.dia, t.locale) }}</span>
          </div>
          <p class="mt-1 truncate text-sm font-medium text-highlighted">
            {{ processoPorCnj.get(i.numeroCnj)?.titulo ?? i.numeroCnj }}
          </p>
          <p class="truncate text-xs text-toned">{{ tribunais[i.tribunal].sigla }} · {{ i.orgao }}</p>
          <div class="mt-1.5 flex flex-wrap gap-1.5">
            <UBadge v-if="!processoPorCnj.get(i.numeroCnj)" :label="t.intimacoes.semProcesso" icon="i-lucide-link-2-off" color="warning" variant="outline" size="sm" />
            <UBadge v-else-if="i.status === 'revisar' && !i.regraSugerida" :label="t.intimacoes.semRegra" icon="i-lucide-circle-help" color="warning" variant="outline" size="sm" />
            <UBadge v-if="i.meio === 'domicilio' && !i.ciencia && i.status === 'revisar'" :label="t.intimacoes.tacitaEm(dia(cienciaTacita(i.dia), t.locale))" icon="i-lucide-hourglass" :color="diasAteATacita(i) <= 2 ? 'error' : 'neutral'" variant="outline" size="sm" />
          </div>
        </li>
      </ul>

      <!-- Detalhe -->
      <section class="hidden min-w-0 flex-1 overflow-y-auto md:block">
        <Transition mode="out-in" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <div v-if="!sel" key="nada" class="flex h-full items-center justify-center p-10">
            <UEmpty icon="i-lucide-mouse-pointer-click" :title="t.intimacoes.escolha" variant="naked" />
          </div>

          <div v-else :key="sel.id" class="mx-auto flex max-w-4xl flex-col gap-4 p-6">
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

              <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-3">
                <UButton :label="t.intimacoes.prazo.descartar" icon="i-lucide-archive" color="neutral" variant="outline" @click="modalDescarte = true" />
                <UButton :label="t.intimacoes.prazo.confirmar" icon="i-lucide-check" :loading="confirmando" :disabled="!calculo" @click="confirmarPrazo" />
              </div>
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
        </Transition>
      </section>
    </div>

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
