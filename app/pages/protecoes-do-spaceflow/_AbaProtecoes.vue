<script setup lang="ts">
/**
 * PROPOSTA: a aba Proteções do editor do Spaceflow.
 *
 * - Topo: o que as proteções seguraram nas últimas 24 horas, cada número leva
 *   à lista de execuções filtrada;
 * - Corpo: as seções em cartões, com índice lateral no desktop. A versão
 *   Completa tem 7; o MVP tem 5, com menos campos e alguns valores fixos que a
 *   tela escreve em vez de perguntar;
 * - Rodapé: a barra de salvar aparece quando há alteração. Salvar não cria
 *   versão do fluxo: vale a partir da próxima execução.
 *
 * Tudo em memória. O "salvar" espera 900 ms e devolve sucesso, ou erro no
 * cenário "Erro ao salvar".
 */
import type { SelectMenuItem } from '@nuxt/ui'
import CartaoDeSecao from './_CartaoDeSecao.vue'
import Regra from './_Regra.vue'
import type { Cenario, Resumo24h, StatusDaExecucao } from './mocks'
import { camposDoWebhook, destinatariosPossiveis, gastoDeIa } from './mocks'
import type { EventoDeAviso, Gatilho, Protecoes, Secao } from './protecoes'
import { contarDiferencas, protecoesRecomendadas, secaoIcone, secaoLigada, secoesCompletas, secoesDoMvp, validar, valoresFixosDoMvp } from './protecoes'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  versao: 'completa' | 'mvp'
  gatilho: Gatilho
  cenario: Cenario
  resumo: Resumo24h
  pausado: boolean
  horaDaPausa: string
}>()

const emit = defineEmits<{
  irParaExecucoes: [filtro: StatusDaExecucao | 'todas']
  verNoEditor: []
  retomar: []
}>()

/** O que está gravado. O rascunho é a tela; salvar copia o rascunho para cá. */
const salvas = defineModel<Protecoes>({ required: true })
const rascunho = ref<Protecoes>(structuredClone(toRaw(salvas.value)))
watch(salvas, (v) => { rascunho.value = structuredClone(toRaw(v)) })

const toast = useToast()
const p = computed(() => props.t.protecoes)
const mvp = computed(() => props.versao === 'mvp')
const somenteLeitura = computed(() => props.cenario === 'semPermissao')

/* ---------- carregando ---------- */
const carregando = ref(true)
onMounted(() => setTimeout(() => { carregando.value = false }, 450))

/* ---------- seções visíveis ---------- */
const secoes = computed<Secao[]>(() => mvp.value ? secoesDoMvp : secoesCompletas)

const textoDaSecao = (s: Secao) => p.value[s]
const agiuDaSecao = (s: Secao) => {
  const n = s === 'avisos' ? 0 : (props.resumo.porSecao[s] ?? 0)
  return n > 0 ? p.value.agiu(n) : undefined
}

/* ---------- alterações e validação ---------- */
const alteracoes = computed(() => contarDiferencas(rascunho.value, salvas.value))
const invalidos = computed(() => validar(rascunho.value).filter(e => secoes.value.includes(e.secao)))
function erroDe(secao: Secao, campo: string, min: number, max: number) {
  return invalidos.value.some(e => e.secao === secao && e.campo === campo) ? p.value.numeroInvalido(min, max) : undefined
}

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 900))
  salvando.value = false
  if (props.cenario === 'erroAoSalvar') {
    toast.add({ title: p.value.salvar.erro, description: p.value.salvar.erroDesc, icon: 'i-lucide-circle-x', color: 'error' })
    return
  }
  salvas.value = structuredClone(toRaw(rascunho.value))
  toast.add({ title: p.value.salvar.salvo, description: p.value.salvar.salvoDesc, icon: 'i-lucide-check', color: 'success' })
}
function descartar() {
  rascunho.value = structuredClone(toRaw(salvas.value))
}
function restaurar() {
  rascunho.value = protecoesRecomendadas()
  toast.add({ title: p.value.restaurado, description: p.value.restauradoDesc, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}

/* ---------- índice lateral ---------- */
const secaoAtiva = ref<Secao>('volume')
function irPara(s: Secao) {
  secaoAtiva.value = s
  document.getElementById(`secao-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** O índice acompanha a rolagem: fica ativa a seção mais alta que está à vista. */
const rolagem = ref<HTMLElement | null>(null)
let observador: IntersectionObserver | undefined
watch(carregando, async (c) => {
  if (c) return
  await nextTick()
  observador = new IntersectionObserver((entradas) => {
    const visivel = entradas.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
    if (visivel) secaoAtiva.value = visivel.target.id.replace('secao-', '') as Secao
  }, { root: rolagem.value, rootMargin: '-20% 0px -55% 0px' })
  for (const s of secoes.value) {
    const el = document.getElementById(`secao-${s}`)
    if (el) observador.observe(el)
  }
})
onBeforeUnmount(() => observador?.disconnect())

/* ---------- opções dos menus ---------- */
const opcoes = <K extends string>(mapa: Record<K, { label: string, description: string }>, recomendado?: K) =>
  (Object.keys(mapa) as K[]).map(valor => ({
    value: valor,
    label: valor === recomendado ? `${mapa[valor].label} (${p.value.recomendado})` : mapa[valor].label,
    description: mapa[valor].description,
  }))

const periodos = computed(() => [
  { value: 'minuto', label: p.value.volume.periodos.minuto },
  { value: 'hora', label: p.value.volume.periodos.hora },
])

const itensDeDestinatario = computed<SelectMenuItem[][]>(() => [
  [
    { type: 'label', label: p.value.avisos.pessoas },
    ...destinatariosPossiveis.filter(d => d.tipo === 'pessoa').map(d => ({
      value: d.id,
      label: 'papel' in d ? `${d.nome} (${p.value.avisos.dono})` : d.nome,
      icon: 'i-lucide-user-round',
    })),
  ],
  [
    { type: 'label', label: p.value.avisos.cargos },
    ...destinatariosPossiveis.filter(d => d.tipo === 'cargo').map(d => ({ value: d.id, label: d.nome, icon: 'i-lucide-users-round' })),
  ],
])

const eventos: EventoDeAviso[] = ['segurou', 'pausou', 'cadeia', 'tetoIa', 'fila']
function alternarEvento(e: EventoDeAviso, ligado: boolean | 'indeterminate') {
  const lista = rascunho.value.avisos.eventos.filter(x => x !== e)
  rascunho.value.avisos.eventos = ligado === true ? [...lista, e] : lista
}

function alternarDia(d: number) {
  const dias = rascunho.value.volume.janela.dias
  rascunho.value.volume.janela.dias = dias.includes(d) ? dias.filter(x => x !== d) : [...dias, d].sort()
}

/* ---------- ciclo encontrado no fluxo ---------- */
const ciclo = computed<'nenhum' | 'aberto' | 'resolvido'>(() => {
  if (props.gatilho !== 'itens' && props.gatilho !== 'email') return 'nenhum'
  return rascunho.value.cadeia.ignorarFluxos ? 'resolvido' : 'aberto'
})

/* ---------- o resumo das 24 horas ---------- */
const blocosDoResumo = computed(() => {
  const r = props.resumo
  const todos = [
    { chave: 'execucoes', valor: r.execucoes, filtro: 'todas' as const, icone: 'i-lucide-play' },
    { chave: 'naFila', valor: r.naFila, filtro: 'queued' as const, icone: 'i-lucide-clock' },
    { chave: 'retidas', valor: r.retidas, filtro: 'held' as const, icone: 'i-lucide-hand', soCompleta: true },
    { chave: 'ignoradas', valor: r.ignoradas, filtro: 'skipped' as const, icone: 'i-lucide-skip-forward', soCompleta: true },
    { chave: 'interrompidas', valor: r.interrompidas, filtro: 'stopped' as const, icone: 'i-lucide-octagon-x' },
    { chave: 'pausas', valor: r.pausas, filtro: 'error' as const, icone: 'i-lucide-circle-pause' },
  ]
  return todos.filter(b => !b.soCompleta || !mvp.value)
})
const formatoNumero = computed(() => new Intl.NumberFormat(props.t.locale))
</script>

<template>
  <div ref="rolagem" class="relative min-h-0 flex-1 overflow-y-auto bg-elevated/30">
    <div class="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-28 pt-5 sm:px-6">
      <!-- Cabeçalho -->
      <header class="flex flex-wrap items-start gap-3">
        <div class="min-w-0 flex-1">
          <h2 class="flex items-center gap-2 text-xl font-semibold text-highlighted">
            <UIcon name="i-lucide-shield-check" class="size-5 text-primary" />
            {{ p.titulo }}
          </h2>
          <p class="mt-1 max-w-3xl text-sm text-muted">{{ p.descricao }}</p>
        </div>
        <UButton
          v-if="!somenteLeitura"
          :label="p.restaurar"
          icon="i-lucide-rotate-ccw"
          color="neutral"
          variant="outline"
          size="sm"
          @click="restaurar"
        />
      </header>

      <UAlert
        v-if="somenteLeitura"
        :title="p.semPermissao.titulo"
        :description="p.semPermissao.descricao"
        icon="i-lucide-lock"
        color="neutral"
        variant="subtle"
      />

      <!-- Resumo das últimas 24 horas -->
      <section :aria-label="p.resumo.titulo">
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ p.resumo.titulo }}</h3>
        <div v-if="carregando" class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <USkeleton v-for="n in blocosDoResumo.length" :key="n" class="h-[72px] rounded-lg" />
        </div>
        <p v-else-if="resumo.execucoes === 0" class="flex items-center gap-2 rounded-lg border border-dashed border-default bg-default px-4 py-5 text-sm text-muted">
          <UIcon name="i-lucide-chart-no-axes-column" class="size-5 shrink-0 text-dimmed" />
          {{ p.resumo.vazio }}
        </p>
        <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3" :class="mvp ? 'lg:grid-cols-4' : 'lg:grid-cols-6'">
          <button
            v-for="(b, i) in blocosDoResumo"
            :key="b.chave"
            type="button"
            class="group flex flex-col items-start gap-1 rounded-lg border border-default bg-default px-3 py-2.5 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
            :style="{ animation: `entrada .3s ease-out ${i * 40}ms backwards` }"
            :aria-label="`${p.resumo[b.chave as 'naFila']}: ${b.valor}. ${p.resumo.verNaLista}`"
            @click="b.chave === 'pausas' ? irPara('erros') : emit('irParaExecucoes', b.filtro)"
          >
            <span class="flex w-full items-center gap-1.5 text-xs text-muted">
              <UIcon :name="b.icone" class="size-3.5" />
              <span class="truncate">{{ p.resumo[b.chave as 'naFila'] }}</span>
              <UIcon name="i-lucide-arrow-up-right" class="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span class="text-2xl font-semibold tabular-nums" :class="b.valor > 0 && b.chave !== 'execucoes' ? 'text-highlighted' : 'text-toned'">
              {{ formatoNumero.format(b.valor) }}
            </span>
          </button>
        </div>
      </section>

      <div class="grid gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
        <!-- Índice lateral -->
        <nav class="hidden lg:block" :aria-label="p.indice.titulo">
          <div class="sticky top-4 flex flex-col gap-0.5">
            <p class="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ p.indice.titulo }}</p>
            <button
              v-for="s in secoes"
              :key="s"
              type="button"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
              :title="textoDaSecao(s).titulo"
              :aria-current="secaoAtiva === s ? 'location' : undefined"
              :class="secaoAtiva === s ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
              @click="irPara(s)"
            >
              <UIcon :name="secaoIcone[s]" class="size-4 shrink-0" />
              <span class="min-w-0 flex-1 truncate">{{ textoDaSecao(s).titulo }}</span>
              <UTooltip :text="secaoLigada(rascunho, s, gatilho) ? p.indice.ligada : p.indice.desligada">
                <span
                  class="size-2 shrink-0 rounded-full transition-colors"
                  :class="secaoLigada(rascunho, s, gatilho) ? 'bg-success' : 'bg-(--ui-border-accented)'"
                  :aria-label="secaoLigada(rascunho, s, gatilho) ? p.indice.ligada : p.indice.desligada"
                />
              </UTooltip>
            </button>
          </div>
        </nav>

        <!-- As seções -->
        <div v-if="carregando" class="flex flex-col gap-4" :aria-label="p.carregando" aria-busy="true">
          <USkeleton v-for="n in 3" :key="n" class="h-48 rounded-lg" />
        </div>
        <div v-else class="flex flex-col gap-4">
          <!-- 1. Volume de disparos -->
          <CartaoDeSecao id="secao-volume" :icone="secaoIcone.volume" :titulo="p.volume.titulo" :descricao="p.volume.descricao" :agiu="agiuDaSecao('volume')" :indice="0">
            <Regra
              v-model="rascunho.volume.porPeriodo.ativo"
              :label="p.volume.porPeriodo"
              :descricao="p.volume.porPeriodoAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('volume', 'porPeriodo', 1, 10000)"
            >
              <div class="flex flex-wrap items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.volume.porPeriodo.limite" :min="1" :max="10000" size="sm" class="w-28" :disabled="somenteLeitura" :color="erroDe('volume', 'porPeriodo', 1, 10000) ? 'error' : undefined" :highlight="!!erroDe('volume', 'porPeriodo', 1, 10000)" :aria-label="p.volume.porPeriodo" />
                <span>{{ p.volume.execucoesPor }}</span>
                <USelect v-if="!mvp" v-model="rascunho.volume.porPeriodo.periodo" :items="periodos" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.execucoesPor" />
                <span v-else>{{ p.volume.periodos.minuto }}</span>
              </div>
            </Regra>

            <Regra
              v-if="!mvp"
              v-model="rascunho.volume.porDia.ativo"
              :label="p.volume.porDia"
              :descricao="p.volume.porDiaAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('volume', 'porDia', 1, 1000000)"
            >
              <div class="flex flex-wrap items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.volume.porDia.limite" :min="1" :max="1000000" :step="100" size="sm" class="w-32" :disabled="somenteLeitura" :aria-label="p.volume.porDia" />
                <span>{{ p.volume.execucoesPorDia }}</span>
              </div>
            </Regra>

            <div v-if="!mvp" class="py-4">
              <UFormField :label="p.volume.excedente" :ui="{ label: 'text-sm font-medium text-highlighted' }">
                <USelect
                  v-model="rascunho.volume.excedente"
                  :items="opcoes(p.volume.excedentes, 'fila')"
                  size="sm"
                  class="w-full sm:w-96"
                  :disabled="somenteLeitura"
                  :ui="{ content: 'min-w-96' }"
                />
              </UFormField>
              <p class="mt-1.5 text-xs text-muted">{{ p.volume.excedentes[rascunho.volume.excedente].description }}</p>
            </div>
            <Regra v-else :label="p.volume.mvpFixo" />

            <Regra
              v-if="!mvp"
              v-model="rascunho.volume.janela.ativo"
              :label="p.volume.janela"
              :descricao="p.volume.janelaAjuda"
              :disabled="somenteLeitura"
            >
              <URadioGroup
                v-model="rascunho.volume.janela.modo"
                :items="opcoes(p.volume.modos)"
                :disabled="somenteLeitura"
                size="sm"
              />
              <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
                <div v-if="rascunho.volume.janela.modo === 'personalizado'" class="flex flex-wrap items-center gap-3 pl-6">
                  <div class="flex gap-1" role="group" :aria-label="p.volume.janela">
                    <UButton
                      v-for="(dia, d) in p.volume.dias"
                      :key="d"
                      :label="dia"
                      size="xs"
                      :color="rascunho.volume.janela.dias.includes(d) ? 'primary' : 'neutral'"
                      :variant="rascunho.volume.janela.dias.includes(d) ? 'soft' : 'outline'"
                      :aria-pressed="rascunho.volume.janela.dias.includes(d)"
                      :disabled="somenteLeitura"
                      @click="alternarDia(d)"
                    />
                  </div>
                  <span class="flex items-center gap-2 text-sm text-toned">
                    {{ p.volume.das }}
                    <UInput v-model="rascunho.volume.janela.inicio" type="time" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.das" />
                    {{ p.volume.as }}
                    <UInput v-model="rascunho.volume.janela.fim" type="time" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.as" />
                  </span>
                </div>
              </Transition>
            </Regra>
          </CartaoDeSecao>

          <!-- 2. Execuções ao mesmo tempo -->
          <CartaoDeSecao id="secao-simultaneas" :icone="secaoIcone.simultaneas" :titulo="p.simultaneas.titulo" :descricao="p.simultaneas.descricao" :agiu="agiuDaSecao('simultaneas')" :indice="1">
            <Regra
              v-model="rascunho.simultaneas.ativo"
              :label="p.simultaneas.limite"
              :descricao="p.simultaneas.limiteAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('simultaneas', 'limite', 1, 500)"
            >
              <div class="flex flex-wrap items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.simultaneas.limite" :min="1" :max="500" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.simultaneas.limite" />
                <span>{{ p.simultaneas.aoMesmoTempo }}</span>
              </div>
              <div class="flex items-start gap-2.5 rounded-md bg-info/10 px-3 py-2.5">
                <UIcon name="i-lucide-user-round-check" class="mt-0.5 size-4 shrink-0 text-info" />
                <p class="text-sm">
                  <span class="font-medium text-highlighted">{{ p.simultaneas.esperaTitulo }}.</span>
                  <span class="text-toned">{{ ` ${p.simultaneas.esperaTexto}` }}</span>
                </p>
              </div>
              <UFormField v-if="!mvp" :label="p.simultaneas.lotado" class="pt-1" :ui="{ label: 'text-sm font-medium text-highlighted' }">
                <USelect v-model="rascunho.simultaneas.lotado" :items="opcoes(p.simultaneas.lotados, 'esperar')" size="sm" class="w-full sm:w-96" :disabled="somenteLeitura" :ui="{ content: 'min-w-96' }" />
              </UFormField>
              <p v-else class="flex items-center gap-2 text-sm text-muted">
                <UIcon name="i-lucide-info" class="size-4 shrink-0 text-muted" />
                {{ p.simultaneas.mvpFixo }}
              </p>
            </Regra>

            <Regra
              v-if="!mvp && gatilho === 'itens'"
              v-model="rascunho.simultaneas.porItem"
              :label="p.simultaneas.porItem"
              :descricao="p.simultaneas.porItemAjuda"
              :disabled="somenteLeitura"
            />

            <Regra
              v-if="!mvp"
              v-model="rascunho.simultaneas.tempoNaFila.ativo"
              :label="p.simultaneas.tempoNaFila"
              :descricao="p.simultaneas.tempoNaFilaAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('simultaneas', 'tempoNaFila', 1, 168)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.simultaneas.tempoNaFila.horas" :min="1" :max="168" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.simultaneas.tempoNaFila" />
                <span>{{ p.simultaneas.horas }}</span>
              </div>
            </Regra>

            <div v-if="!mvp && gatilho === 'timer'" class="py-4">
              <UFormField :label="p.simultaneas.sobreposicao" :ui="{ label: 'text-sm font-medium text-highlighted' }">
                <USelect v-model="rascunho.simultaneas.sobreposicao" :items="opcoes(p.simultaneas.sobreposicoes, 'pular')" size="sm" class="w-full sm:w-96" :disabled="somenteLeitura" :ui="{ content: 'min-w-96' }" />
              </UFormField>
              <p class="mt-1.5 text-xs text-muted">{{ p.simultaneas.sobreposicoes[rascunho.simultaneas.sobreposicao].description }}</p>
            </div>
          </CartaoDeSecao>

          <!-- 3. Disparos repetidos (só na Completa) -->
          <CartaoDeSecao v-if="!mvp" id="secao-repetidos" :icone="secaoIcone.repetidos" :titulo="p.repetidos.titulo" :descricao="p.repetidos.descricao" :agiu="agiuDaSecao('repetidos')" :indice="2">
            <template v-if="gatilho === 'webhook'">
              <Regra v-model="rascunho.repetidos.webhook.ativo" :label="p.repetidos.webhook" :descricao="p.repetidos.webhookAjuda" :disabled="somenteLeitura" :erro="erroDe('repetidos', 'webhook', 1, 720)">
                <div class="flex flex-wrap items-end gap-3">
                  <UFormField :label="p.repetidos.chave" size="sm">
                    <USelect v-model="rascunho.repetidos.webhook.chave" :items="camposDoWebhook" size="sm" class="w-52 font-mono" :disabled="somenteLeitura" />
                  </UFormField>
                  <span class="flex items-center gap-2 pb-1.5 text-sm text-toned">
                    {{ p.repetidos.durante }}
                    <UInputNumber v-model="rascunho.repetidos.webhook.horas" :min="1" :max="720" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.repetidos.durante" />
                    {{ p.repetidos.horas }}
                  </span>
                </div>
              </Regra>
            </template>
            <template v-else-if="gatilho === 'itens'">
              <Regra v-model="rascunho.repetidos.juntarEdicoes.ativo" :label="p.repetidos.juntarEdicoes" :descricao="p.repetidos.juntarEdicoesAjuda" :disabled="somenteLeitura" :erro="erroDe('repetidos', 'juntarEdicoes', 1, 60)">
                <div class="flex items-center gap-2 text-sm text-toned">
                  <UInputNumber v-model="rascunho.repetidos.juntarEdicoes.minutos" :min="1" :max="60" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.repetidos.juntarEdicoes" />
                  {{ p.repetidos.minutosSemEdicao }}
                </div>
              </Regra>
              <Regra v-model="rascunho.repetidos.umaVezPorItem.ativo" :label="p.repetidos.umaVezPorItem" :disabled="somenteLeitura">
                <URadioGroup v-model="rascunho.repetidos.umaVezPorItem.modo" :items="opcoes(p.repetidos.umaVezPorItemOpcoes)" :disabled="somenteLeitura" size="sm" />
              </Regra>
            </template>
            <template v-else-if="gatilho === 'email'">
              <Regra v-model="rascunho.repetidos.emailRepetido.ativo" :label="p.repetidos.emailRepetido" :descricao="p.repetidos.emailRepetidoAjuda" :disabled="somenteLeitura" :erro="erroDe('repetidos', 'emailRepetido', 1, 1440)">
                <div class="flex items-center gap-2 text-sm text-toned">
                  <UInputNumber v-model="rascunho.repetidos.emailRepetido.minutos" :min="1" :max="1440" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.repetidos.emailRepetido" />
                  {{ p.repetidos.minutos }}
                </div>
              </Regra>
            </template>
            <p v-else class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-circle-slash" class="size-4 shrink-0 text-dimmed" />
              {{ p.repetidos.semRepeticao(t.gatilhos[gatilho]) }}
            </p>
          </CartaoDeSecao>

          <!-- 4. Repetição sem fim -->
          <CartaoDeSecao id="secao-cadeia" :icone="secaoIcone.cadeia" :titulo="p.cadeia.titulo" :descricao="p.cadeia.descricao" :agiu="agiuDaSecao('cadeia')" :indice="3">
            <div v-if="!mvp && ciclo !== 'nenhum'" class="pb-4">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ t.ciclos.titulo }}</p>
              <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-[.98]" leave-active-class="transition duration-100" leave-to-class="opacity-0">
                <UAlert
                  v-if="ciclo === 'aberto'"
                  key="aberto"
                  :description="gatilho === 'email' ? t.ciclos.email : t.ciclos.itens"
                  icon="i-lucide-repeat"
                  color="warning"
                  variant="subtle"
                  :actions="[{ label: t.ciclos.verNoEditor, icon: 'i-lucide-arrow-right', color: 'neutral', variant: 'outline', size: 'xs', onClick: () => emit('verNoEditor') }]"
                />
                <UAlert
                  v-else
                  key="resolvido"
                  :description="gatilho === 'email' ? t.ciclos.resolvidoEmail : t.ciclos.resolvido"
                  icon="i-lucide-shield-check"
                  color="success"
                  variant="subtle"
                />
              </Transition>
            </div>

            <Regra
              v-if="gatilho === 'itens' || gatilho === 'email'"
              v-model="rascunho.cadeia.ignorarFluxos"
              :label="gatilho === 'email' ? p.cadeia.ignorarEmail : p.cadeia.ignorarItens"
              :descricao="gatilho === 'email' ? p.cadeia.ignorarEmailAjuda : p.cadeia.ignorarItensAjuda"
              :disabled="somenteLeitura"
            />

            <Regra
              v-model="rascunho.cadeia.limite.ativo"
              :label="p.cadeia.limite"
              :descricao="p.cadeia.limiteAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('cadeia', 'niveis', 2, 50)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                {{ p.cadeia.depoisDe }}
                <UInputNumber v-model="rascunho.cadeia.limite.niveis" :min="2" :max="50" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.cadeia.limite" />
                {{ p.cadeia.disparosEncadeados }}
              </div>
            </Regra>
          </CartaoDeSecao>

          <!-- 5. Tempo e erros -->
          <CartaoDeSecao id="secao-erros" :icone="secaoIcone.erros" :titulo="p.erros.titulo" :descricao="p.erros.descricao" :agiu="agiuDaSecao('erros')" :indice="4">
            <div v-if="pausado" class="pb-4">
              <UAlert
                :title="p.erros.pausadoDesde(horaDaPausa)"
                icon="i-lucide-circle-pause"
                color="warning"
                variant="subtle"
                :actions="somenteLeitura ? [] : [{ label: t.banner.retomar, icon: 'i-lucide-play', color: 'primary', size: 'xs', onClick: () => emit('retomar') }]"
              />
            </div>

            <Regra
              v-if="!mvp"
              v-model="rascunho.erros.tempoMaximo.ativo"
              :label="p.erros.tempoMaximo"
              :descricao="p.erros.tempoMaximoAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('erros', 'tempoMaximo', 1, 720)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.erros.tempoMaximo.horas" :min="1" :max="720" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.erros.tempoMaximo" />
                {{ p.erros.horas }}
              </div>
            </Regra>

            <Regra
              v-model="rascunho.erros.pausarAposErros.ativo"
              :label="p.erros.pausar"
              :descricao="p.erros.pausarAjuda"
              :disabled="somenteLeitura"
              :erro="erroDe('erros', 'pausarAposErros', 1, 100)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                {{ p.erros.depoisDe }}
                <UInputNumber v-model="rascunho.erros.pausarAposErros.erros" :min="1" :max="100" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.erros.pausar" />
                {{ p.erros.errosSeguidos }}
              </div>
              <UFormField v-if="!mvp" :label="p.erros.duranteAPausa" class="pt-1" :ui="{ label: 'text-sm font-medium text-highlighted' }">
                <USelect v-model="rascunho.erros.duranteAPausa" :items="opcoes(p.erros.duranteAPausaOpcoes, 'guardar')" size="sm" class="w-full sm:w-96" :disabled="somenteLeitura" :ui="{ content: 'min-w-96' }" />
              </UFormField>
              <p v-else class="flex items-center gap-2 text-sm text-muted">
                <UIcon name="i-lucide-info" class="size-4 shrink-0 text-muted" />
                {{ p.erros.mvpFixo }}
              </p>
            </Regra>
          </CartaoDeSecao>

          <!-- 6. Custo de IA (só na Completa) -->
          <CartaoDeSecao v-if="!mvp" id="secao-ia" :icone="secaoIcone.ia" :titulo="p.ia.titulo" :descricao="p.ia.descricao" :agiu="agiuDaSecao('ia')" :indice="5">
            <Regra
              v-model="rascunho.ia.porExecucao.ativo"
              :label="p.ia.porExecucao"
              :descricao="p.ia.porExecucaoAjuda(gastoDeIa.mediaPorExecucao, gastoDeIa.maiorExecucao)"
              :disabled="somenteLeitura"
              :erro="erroDe('ia', 'porExecucao', 1, 100000)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.ia.porExecucao.creditos" :min="1" :max="100000" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.ia.porExecucao" />
                {{ p.ia.creditos }}
              </div>
            </Regra>
            <Regra
              v-model="rascunho.ia.porDia.ativo"
              :label="p.ia.porDia"
              :disabled="somenteLeitura"
              :erro="erroDe('ia', 'porDia', 1, 1000000)"
            >
              <div class="flex items-center gap-2 text-sm text-toned">
                <UInputNumber v-model="rascunho.ia.porDia.creditos" :min="1" :max="1000000" :step="100" size="sm" class="w-32" :disabled="somenteLeitura" :aria-label="p.ia.porDia" />
                {{ p.ia.creditos }}
              </div>
              <div class="flex max-w-sm flex-col gap-1">
                <UProgress :model-value="Math.min(gastoDeIa.hoje, rascunho.ia.porDia.creditos || 1)" :max="rascunho.ia.porDia.creditos || 1" size="sm" :color="gastoDeIa.hoje / (rascunho.ia.porDia.creditos || 1) > 0.8 ? 'warning' : 'primary'" />
                <span class="text-xs text-muted">{{ p.ia.gastoHoje(gastoDeIa.hoje, rascunho.ia.porDia.creditos || 0) }}</span>
              </div>
            </Regra>
            <div v-if="rascunho.ia.porExecucao.ativo || rascunho.ia.porDia.ativo" class="py-4">
              <UFormField :label="p.ia.noTeto" :ui="{ label: 'text-sm font-medium text-highlighted' }">
                <USelect v-model="rascunho.ia.noTeto" :items="opcoes(p.ia.noTetoOpcoes, 'aprovar')" size="sm" class="w-full sm:w-96" :disabled="somenteLeitura" :ui="{ content: 'min-w-96' }" />
              </UFormField>
              <p class="mt-1.5 text-xs text-muted">{{ p.ia.noTetoOpcoes[rascunho.ia.noTeto].description }}</p>
            </div>
          </CartaoDeSecao>

          <!-- 7. Avisos -->
          <CartaoDeSecao id="secao-avisos" :icone="secaoIcone.avisos" :titulo="p.avisos.titulo" :descricao="p.avisos.descricao" :indice="6">
            <template v-if="!mvp">
              <Regra
                v-model="rascunho.avisos.ativo"
                :label="p.avisos.ativo"
                :descricao="p.avisos.ativoAjuda"
                :disabled="somenteLeitura"
                :erro="invalidos.some(e => e.campo === 'destinatarios') ? p.avisos.destinatariosVazio : undefined"
              >
                <div class="grid gap-3 sm:grid-cols-2">
                  <UFormField :label="p.avisos.destinatarios" size="sm">
                    <USelectMenu
                      v-model="rascunho.avisos.destinatarios"
                      :items="itensDeDestinatario"
                      value-key="value"
                      multiple
                      :placeholder="p.avisos.destinatariosPlaceholder"
                      size="sm"
                      class="w-full"
                      :disabled="somenteLeitura"
                    />
                  </UFormField>
                  <UFormField :label="p.avisos.frequencia" size="sm">
                    <USelect v-model="rascunho.avisos.frequencia" :items="opcoes(p.avisos.frequencias, 'naHora')" size="sm" class="w-full" :disabled="somenteLeitura" :ui="{ content: 'min-w-80' }" />
                  </UFormField>
                </div>
                <fieldset class="flex flex-col gap-2 pt-1">
                  <legend class="mb-2 text-sm font-medium text-highlighted">{{ p.avisos.eventos }}</legend>
                  <div v-for="e in eventos" :key="e" class="flex flex-wrap items-center gap-2">
                    <UCheckbox
                      :model-value="rascunho.avisos.eventos.includes(e)"
                      :label="p.avisos.eventosOpcoes[e]"
                      :disabled="somenteLeitura"
                      @update:model-value="alternarEvento(e, $event)"
                    />
                    <template v-if="e === 'fila'">
                      <UInputNumber v-model="rascunho.avisos.filaAcimaDe" :min="1" :max="100000" size="xs" class="w-24" :disabled="somenteLeitura || !rascunho.avisos.eventos.includes('fila')" :aria-label="p.avisos.eventosOpcoes.fila" />
                      <span class="text-sm text-toned">{{ p.avisos.execucoes }}</span>
                    </template>
                  </div>
                </fieldset>
              </Regra>
            </template>
            <Regra
              v-else
              v-model="rascunho.avisos.ativo"
              :label="p.avisos.mvpAtivo"
              :descricao="p.avisos.mvpAjuda"
              :disabled="somenteLeitura"
            />
          </CartaoDeSecao>
        </div>
      </div>
    </div>

    <!-- Barra de salvar -->
    <Transition
      enter-active-class="transition-[opacity,transform] duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      leave-active-class="transition-[opacity,transform] duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-3"
    >
      <div v-if="alteracoes > 0 && !somenteLeitura" class="sticky bottom-0 z-20 border-t border-default bg-default/95 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <span class="flex items-center gap-2 text-sm" :class="invalidos.length ? 'text-error' : 'text-toned'" role="status">
            <UIcon :name="invalidos.length ? 'i-lucide-circle-alert' : 'i-lucide-pencil'" class="size-4" />
            {{ invalidos.length ? p.salvar.invalidos(invalidos.length) : p.salvar.alteracoes(alteracoes) }}
          </span>
          <span class="ml-auto flex gap-2">
            <UButton :label="p.salvar.descartar" color="neutral" variant="outline" size="sm" :disabled="salvando" @click="descartar" />
            <UButton :label="p.salvar.salvar" icon="i-lucide-shield-check" size="sm" :loading="salvando" :disabled="invalidos.length > 0" @click="salvar" />
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>
