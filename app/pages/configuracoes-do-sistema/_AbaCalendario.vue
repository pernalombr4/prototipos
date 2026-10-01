<script setup lang="ts">
import DiasUteis from './_DiasUteis.vue'
import Secao from './_Secao.vue'
import {
  diasDaSemana,
  feriadosDisponiveisBR,
  type Feriado,
  type Ocorrencia,
} from './mocks'
import { destaque, form } from './estado'

const toast = useToast()

/* ---------------------------- dias úteis --------------------------- */

const resumoDosDias = computed(() => {
  const n = form.calendario.diasUteis.length
  if (n === 0) return 'Nenhum dia útil. Todo prazo do workspace fica parado.'
  if (n === 7) return 'Todos os dias contam como úteis, inclusive o fim de semana.'
  const nomes = diasDaSemana
    .filter(d => form.calendario.diasUteis.includes(d.chave))
    .map(d => d.nome.replace('-feira', ''))
  return `${n} dias úteis por semana: ${nomes.join(', ')}.`
})

/* ----------------------------- feriados ---------------------------- */

const paises = [
  { label: 'Brasil', value: 'BR' },
  { label: 'Estados Unidos', value: 'US' },
]

const paisDaImportacao = ref<'BR' | 'US'>('BR')
const importando = ref(false)
const escolhendoFeriados = ref(false)
const selecionados = ref<number[]>([])

const previa = computed(() =>
  feriadosDisponiveisBR.filter(f => !form.calendario.feriados.some(g => g.data === f.data)),
)

watch(escolhendoFeriados, aberto => {
  if (aberto) selecionados.value = previa.value.map(f => f.id)
})

const feriadosPorPais = computed(() => {
  const mapa = new Map<string, Feriado[]>()
  for (const f of [...form.calendario.feriados].sort((a, b) => a.data.localeCompare(b.data))) {
    const lista = mapa.get(f.pais) ?? []
    lista.push(f)
    mapa.set(f.pais, lista)
  }
  return [...mapa.entries()]
})

const nomeDoPais: Record<string, string> = { BR: 'Brasil', US: 'Estados Unidos' }

async function importar() {
  importando.value = true
  await new Promise(r => setTimeout(r, 700))
  const novos = previa.value.filter(f => selecionados.value.includes(f.id))
  form.calendario.feriados.push(...novos.map(f => ({ ...f })))
  importando.value = false
  escolhendoFeriados.value = false
  toast.add({
    title: `${contar(novos.length, 'feriado adicionado', 'feriados adicionados')}`,
    description: 'Ainda não estão gravados: use Salvar, na barra de baixo.',
    icon: 'i-lucide-calendar-plus',
    color: 'neutral',
  })
}

function removerFeriado(id: number) {
  const i = form.calendario.feriados.findIndex(f => f.id === id)
  if (i >= 0) form.calendario.feriados.splice(i, 1)
}

/* --------------------------- ocorrências --------------------------- */

const criandoOcorrencia = ref(false)
const nova = reactive<{ data: string, ate: string, nome: string, tipo: Ocorrencia['tipo'], contaComoUtil: boolean }>({
  data: '2026-09-30',
  ate: '',
  nome: '',
  tipo: 'Evento interno',
  contaComoUtil: true,
})

const tipos = [
  { label: 'Evento interno', value: 'Evento interno' },
  { label: 'Recesso', value: 'Recesso' },
  { label: 'Ponto facultativo', value: 'Ponto facultativo' },
]

function adicionarOcorrencia() {
  if (!nova.nome.trim()) return
  form.calendario.ocorrencias.push({
    id: Date.now(),
    data: nova.data,
    // Data final só entra se for depois do começo: "até" vazio ou invertido é
    // ocorrência de um dia, não erro para a pessoa resolver.
    ate: nova.ate && nova.ate > nova.data ? nova.ate : undefined,
    nome: nova.nome.trim(),
    tipo: nova.tipo,
    contaComoUtil: nova.contaComoUtil,
  })
  nova.nome = ''
  nova.ate = ''
  criandoOcorrencia.value = false
}

function removerOcorrencia(id: number) {
  const i = form.calendario.ocorrencias.findIndex(o => o.id === id)
  if (i >= 0) form.calendario.ocorrencias.splice(i, 1)
}

/* ---------------------------- o calendário -------------------------- */

const HOJE = '2026-09-16'
const mes = ref(new Date(2026, 8, 1))

const nomeDoMes = computed(() => {
  const texto = mes.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
})

/** "1 feriado" e não "1 feriados". */
function contar(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Celula {
  data: string
  dia: number
  doMes: boolean
  diaDaSemana: number
  feriado?: Feriado
  ocorrencia?: Ocorrencia
  util: boolean
  motivo: string
}

const celulas = computed<Celula[]>(() => {
  const primeiro = new Date(mes.value)
  const inicio = new Date(primeiro)
  inicio.setDate(1 - primeiro.getDay())

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    const data = iso(d)
    const feriado = form.calendario.feriados.find(f => f.data === data)
    const ocorrencia = form.calendario.ocorrenciasHabilitadas
      ? form.calendario.ocorrencias.find(o => data >= o.data && data <= (o.ate ?? o.data))
      : undefined
    const naSemana = form.calendario.diasUteis.includes(d.getDay())

    let util = naSemana
    let motivo = naSemana ? 'Dia útil.' : 'Não é dia útil: o dia da semana está fora do expediente.'
    if (feriado) {
      util = false
      motivo = `Feriado: ${feriado.nome} (${nomeDoPais[feriado.pais]}).`
    }
    else if (ocorrencia && !ocorrencia.contaComoUtil) {
      util = false
      motivo = `${ocorrencia.tipo}: ${ocorrencia.nome}.`
    }

    return {
      data,
      dia: d.getDate(),
      doMes: d.getMonth() === primeiro.getMonth(),
      diaDaSemana: d.getDay(),
      feriado,
      ocorrencia,
      util,
      motivo,
    }
  })
})

const resumoDoMes = computed(() => {
  const doMes = celulas.value.filter(c => c.doMes)
  return {
    uteis: doMes.filter(c => c.util).length,
    feriados: doMes.filter(c => c.feriado).length,
    ocorrencias: doMes.filter(c => c.ocorrencia).length,
  }
})

function andarMes(passo: number) {
  const d = new Date(mes.value)
  d.setMonth(d.getMonth() + passo)
  mes.value = d
}

/* ---------------------- o dia como coisa clicável ------------------- */

/**
 * O calendário deixou de ser desenho e virou lugar de perguntar e de agir,
 * mas só sobre UMA data. A regra semanal continua sendo editada lá em cima:
 * clicar numa terça não pode desligar todas as terças do ano.
 */
const diaAberto = ref<string | null>(null)

/**
 * O calendário tem dois modos, e os dois editam.
 *
 * Quem pensa em data trabalha no mês; quem pensa em lista (e quem precisa ver
 * o ano inteiro de uma vez) trabalha na lista. Um não é a prévia do outro: são
 * duas formas da mesma coisa, e a troca é um botão só.
 */
const modoLista = ref(false)

// A busca da tela leva a "feriados" e a "ocorrências", que só existem na
// lista: trocar de modo é o que faz o destaque ter o que destacar.
watch(destaque, (secao) => {
  if (secao === 'feriados' || secao === 'ocorrencias') modoLista.value = true
  if (secao === 'mes' || secao === 'dias-uteis') modoLista.value = false
})

/**
 * Um só ponto de parada no mês inteiro, e as setas andam por dentro. Sem
 * isso, chegar ao fim da tabela custaria 42 tabulações.
 */
const focoNoDia = ref(HOJE)

watch(mes, () => {
  const primeiro = celulas.value.find(c => c.doMes)
  if (primeiro) focoNoDia.value = primeiro.data
})

function andarNoTeclado(e: KeyboardEvent) {
  const passos: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: 7,
    ArrowUp: -7,
  }
  const passo = passos[e.key]
  if (passo === undefined) return

  const atual = celulas.value.findIndex(c => c.data === focoNoDia.value)
  if (atual < 0) return
  const destino = atual + passo
  if (destino < 0 || destino > celulas.value.length - 1) return

  e.preventDefault()
  focoNoDia.value = celulas.value[destino]!.data
  nextTick(() => {
    document.querySelector<HTMLElement>(`[data-dia="${focoNoDia.value}"]`)?.focus()
  })
}

const DIAS_POR_EXTENSO = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const MESES_POR_EXTENSO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

function diaPorExtenso(c: Celula) {
  const [, m, d] = c.data.split('-')
  return `${Number(d)} de ${MESES_POR_EXTENSO[Number(m) - 1]}, ${DIAS_POR_EXTENSO[c.diaDaSemana]}`
}

/** O que o leitor de tela anuncia na célula: a data e o estado, nesta ordem. */
function rotuloDoDia(c: Celula) {
  return `${diaPorExtenso(c)}. ${c.motivo}`
}

/**
 * Abrir exceção a partir do dia clicado.
 *
 * O padrão do "mantém o expediente" sai do próprio dia: marcar exceção num
 * dia útil quase sempre é suspender, e num sábado quase sempre é o contrário.
 */
function novaOcorrenciaEm(c: Celula) {
  nova.data = c.data
  nova.ate = ''
  nova.nome = ''
  nova.tipo = 'Evento interno'
  nova.contaComoUtil = !c.util
  diaAberto.value = null
  criandoOcorrencia.value = true
}

function alternarOcorrencia(o: Ocorrencia) {
  o.contaComoUtil = !o.contaComoUtil
  diaAberto.value = null
}

function removerFeriadoDoDia(f: Feriado) {
  removerFeriado(f.id)
  diaAberto.value = null
}

function removerOcorrenciaDoDia(o: Ocorrencia) {
  removerOcorrencia(o.id)
  diaAberto.value = null
}

/**
 * O fim de semana não se edita pela célula: a regra é da coluna.
 * O popover leva o foco até o cabeçalho dela, e quem decide é a pessoa.
 */
function focarColuna(diaDaSemana: number) {
  diaAberto.value = null
  nextTick(() => {
    document.querySelector<HTMLElement>(`[data-coluna="${diaDaSemana}"]`)?.focus()
  })
}

function formatarData(data: string) {
  const [a, m, d] = data.split('-')
  return `${d}/${m}/${a}`
}

/** "28/12/2026 a 30/12/2026" quando dura mais de um dia. */
function periodoDaOcorrencia(o: Ocorrencia) {
  return o.ate ? `${formatarData(o.data)} a ${formatarData(o.ate)}` : formatarData(o.data)
}
</script>

<template>
  <div class="space-y-5">
    <!--
      O CALENDÁRIO INTEIRO NUM LUGAR SÓ

      Eram quatro seções, depois duas. Agora é uma: tudo o que define o
      expediente se faz sobre o próprio mês.

        a regra da semana ...... no cabeçalho da coluna
        feriado e ocorrência ... clicando no dia
        importar feriados ...... na barra, porque é operação de muitos meses
        a lista ................ embaixo, para quando a pergunta é "quais são?"

      O que NÃO virou clique no dia: trocar o dia útil da semana. Clicar numa
      quarta-feira para desligar todas as quartas seria uma data mudando 52.
      Por isso a regra ficou na coluna, que é a forma dela.
    -->
    <!--
      O manual fica FORA do cartão, acima dele: é instrução sobre a tela, não
      conteúdo dela. Sem moldura, para não acrescentar uma caixa à tela que
      passou três rodadas perdendo caixa.
    -->
    <div class="flex items-start gap-3 rounded-lg bg-elevated/50 px-4 py-3">
      <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-muted" />
      <div class="min-w-0">
        <p class="text-sm font-medium text-highlighted">
          Como editar o calendário
        </p>
        <ul v-if="!modoLista" class="mt-1 space-y-0.5 text-sm text-muted">
          <li>
            Para mudar os dias úteis, clique no
            <strong class="text-toned">cabeçalho da coluna</strong>. Vale para todas as semanas.
          </li>
          <li>
            Para abrir feriado, ocorrência ou exceção, clique no
            <strong class="text-toned">dia do mês</strong>.
          </li>
          <li>
            Para ver o ano inteiro, use <strong class="text-toned">Editar em lista</strong>.
            Você edita as mesmas coisas.
          </li>
        </ul>
        <ul v-else class="mt-1 space-y-0.5 text-sm text-muted">
          <li>
            Para mudar os dias úteis, clique no
            <strong class="text-toned">dia da semana</strong>. Vale para todas as semanas.
          </li>
          <li>
            Para mudar feriado ou ocorrência, use as listas abaixo.
          </li>
          <li>
            Para ver o mês, use <strong class="text-toned">Editar em calendário</strong>.
            Você edita as mesmas coisas.
          </li>
        </ul>
      </div>
    </div>

    <Secao
      id="dias-uteis"
      titulo="Calendário do workspace"
      resumo="Dias úteis, feriados e ocorrências. Edite no mês, ou em lista se preferir."
      style="animation: entrada .4s ease-out both"
    >
      <template #acoes>
        <UButton
          :label="modoLista ? 'Editar em calendário' : 'Editar em lista'"
          :icon="modoLista ? 'i-lucide-calendar-days' : 'i-lucide-list'"
          size="xs"
          color="neutral"
          variant="subtle"
          @click="modoLista = !modoLista"
        />
        <UButton
          label="Importar feriados"
          icon="i-lucide-download"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="escolhendoFeriados = true"
        />
      </template>

      <template v-if="!modoLista">

        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-chevron-left"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Mês anterior"
              @click="andarMes(-1)"
            />
            <span class="min-w-40 text-center text-sm font-medium text-highlighted">
              {{ nomeDoMes }}
            </span>
            <UButton
              icon="i-lucide-chevron-right"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Próximo mês"
              @click="andarMes(1)"
            />
          </div>

          <p class="text-sm text-muted">
            <strong class="text-toned">{{ resumoDoMes.uteis }}</strong> dias úteis ·
            {{ contar(resumoDoMes.feriados, 'feriado', 'feriados') }} ·
            {{ contar(resumoDoMes.ocorrencias, 'dia com ocorrência', 'dias com ocorrência') }}
          </p>

          <div class="flex flex-wrap items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-default ring-1 ring-default" /> Dia útil
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-elevated ring-1 ring-default" /> Fora do expediente
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-warning/25 ring-1 ring-warning/40" /> Feriado
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-sm bg-primary/20 ring-1 ring-primary/40" /> Ocorrência
            </span>
          </div>
        </div>

        <div id="mes" class="scroll-mt-40 overflow-hidden rounded-lg border border-default">
          <!--
            O cabeçalho da coluna É a regra da semana.

            Clicar num dia muda uma data; clicar numa coluna muda todas as
            terças do ano, e é por isso que a regra mora aqui e não na célula:
            a coluna é a forma da regra. O estado fica escrito ("útil" ou
            "folga") e a coluna inteira muda de fundo junto.
          -->
          <div class="grid grid-cols-7 border-b border-default bg-elevated">
            <DiasUteis formato="coluna" />
          </div>

          <!--
            A grade inteira tem uma parada de tabulação só, e as setas andam por
            dentro. 42 tabulações para atravessar um mês seria pior que não ter
            teclado nenhum.
          -->
          <div class="grid grid-cols-7" role="grid" @keydown="andarNoTeclado">
            <UPopover
              v-for="c in celulas"
              :key="c.data"
              :open="diaAberto === c.data"
              @update:open="(v: boolean) => diaAberto = v ? c.data : null"
            >
              <button
                type="button"
                :data-dia="c.data"
                :tabindex="c.data === focoNoDia ? 0 : -1"
                :aria-label="rotuloDoDia(c)"
                class="relative flex h-16 w-full flex-col gap-0.5 border-b border-r border-default p-1.5 text-left transition-colors last:border-r-0 hover:ring-1 hover:ring-inset hover:ring-primary/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                :class="[
                  !c.doMes && 'opacity-35',
                  c.feriado
                    ? 'bg-warning/10'
                    : c.ocorrencia
                      ? 'bg-primary/5'
                      : c.util ? 'bg-default' : 'bg-elevated',
                ]"
                @focus="focoNoDia = c.data"
              >
                <span
                  class="text-xs tabular-nums"
                  :class="c.data === HOJE
                    ? 'flex size-5 items-center justify-center rounded-full bg-primary-700 font-semibold text-white'
                    : c.util ? 'text-toned' : 'text-muted'"
                >
                  {{ c.dia }}
                </span>

                <span
                  v-if="c.feriado"
                  class="line-clamp-2 text-[11px] leading-tight text-warning"
                >
                  {{ c.feriado.nome }}
                </span>
                <span
                  v-else-if="c.ocorrencia"
                  class="line-clamp-2 text-[11px] leading-tight text-primary"
                >
                  {{ c.ocorrencia.nome }}
                </span>
              </button>

              <template #content>
                <div class="w-72 space-y-3 p-3">
                  <div>
                    <p class="text-sm font-medium text-highlighted">{{ diaPorExtenso(c) }}</p>
                    <p class="mt-0.5 text-sm text-muted">{{ c.motivo }}</p>
                  </div>

                  <div class="flex flex-col items-start gap-1 border-t border-default pt-2">
                    <!-- Feriado e ocorrência se resolvem no próprio dia. -->
                    <UButton
                      v-if="c.feriado"
                      :label="`Remover ${c.feriado.nome}`"
                      icon="i-lucide-x"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="c.feriado && removerFeriadoDoDia(c.feriado)"
                    />

                    <template v-if="c.ocorrencia">
                      <UButton
                        :label="c.ocorrencia.contaComoUtil
                          ? 'Suspender o expediente neste dia'
                          : 'Voltar a contar como dia útil'"
                        :icon="c.ocorrencia.contaComoUtil ? 'i-lucide-alarm-clock-off' : 'i-lucide-alarm-clock'"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        @click="c.ocorrencia && alternarOcorrencia(c.ocorrencia)"
                      />
                      <UButton
                        :label="`Remover ${c.ocorrencia.nome}`"
                        icon="i-lucide-x"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        @click="c.ocorrencia && removerOcorrenciaDoDia(c.ocorrencia)"
                      />
                    </template>

                    <UButton
                      v-if="!c.feriado && !c.ocorrencia"
                      label="Marcar como exceção"
                      icon="i-lucide-calendar-plus"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="novaOcorrenciaEm(c)"
                    />

                    <!--
                      Fim de semana não se edita daqui: clicar num sábado mudaria
                      todos os sábados do ano. A célula leva até a regra.
                    -->
                    <UButton
                      v-if="!form.calendario.diasUteis.includes(c.diaDaSemana)"
                      label="Ver a regra desta coluna"
                      icon="i-lucide-arrow-up-right"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="focarColuna(c.diaDaSemana)"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>


      </template>

      <!--
        O modo lista responde o que o mês não responde: "quais feriados existem
        no ano?". São doze telas de calendário para uma lista só.
      -->
      <div v-else>
        <!--
          No modo lista a regra da semana vem primeiro: sem ela, "editar em
          lista" não editaria tudo, e a pessoa teria de voltar ao calendário
          justamente para a coisa que ela não estava conseguindo fazer lá.
        -->
        <div class="mb-8">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Dias úteis da semana
          </h3>
          <div class="flex flex-wrap gap-2">
            <DiasUteis formato="linha" />
          </div>
          <p
            class="mt-3 text-sm"
            :class="form.calendario.diasUteis.length === 0 ? 'text-error' : 'text-muted'"
          >
            {{ resumoDosDias }}
          </p>
        </div>

      <div class="grid gap-x-10 gap-y-8 @4xl:grid-cols-2">
        <div id="feriados" class="min-w-0 scroll-mt-40">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Feriados
          </h3>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-muted">
            {{ contar(form.calendario.feriados.length, 'feriado', 'feriados') }} no calendário deste
            workspace.
          </p>

        </div>

        <div v-for="[pais, lista] in feriadosPorPais" :key="pais" class="mb-4 last:mb-0">
          <div class="mb-2 flex items-center gap-2">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">
              {{ nomeDoPais[pais] }}
            </h3>
            <UBadge :label="String(lista.length)" size="sm" color="neutral" variant="subtle" />
            <UBadge
              v-if="pais !== 'BR'"
              label="fora do país do workspace"
              size="sm"
              color="warning"
              variant="subtle"
            />
          </div>

          <ul class="divide-y divide-default">
            <li
              v-for="f in lista"
              :key="f.id"
              class="group flex items-center gap-3 px-3 py-2 transition-colors hover:bg-elevated"
            >
              <span class="w-20 shrink-0 text-sm tabular-nums text-muted">{{ formatarData(f.data) }}</span>
              <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ f.nome }}</span>
              <span class="hidden text-xs text-muted sm:block">{{ f.abrangencia }}</span>
              <UButton
                icon="i-lucide-x"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="`Remover ${f.nome}`"
                class="opacity-60 transition-opacity group-hover:opacity-100 focus:opacity-100"
                @click="removerFeriado(f.id)"
              />
            </li>
          </ul>
        </div>
        </div>

        <div id="ocorrencias" class="min-w-0 scroll-mt-40">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Ocorrências da operação
          </h3>
        <div class="mb-4 flex items-start justify-between gap-6">
          <div>
            <p class="text-sm font-medium text-highlighted">
              Registrar ocorrências no calendário
            </p>
            <p class="mt-1 text-sm text-muted">
              Desligado, as datas continuam guardadas, mas deixam de afetar prazo e Agenda.
            </p>
          </div>
          <USwitch v-model="form.calendario.ocorrenciasHabilitadas" aria-label="Registrar ocorrências" />
        </div>

        <div v-if="form.calendario.ocorrenciasHabilitadas">
          <ul
            v-if="form.calendario.ocorrencias.length"
            class="divide-y divide-default"
          >
            <li
              v-for="o in form.calendario.ocorrencias"
              :key="o.id"
              class="group flex items-center gap-3 px-3 py-2 transition-colors hover:bg-elevated"
            >
              <span class="shrink-0 text-sm tabular-nums text-muted">{{ periodoDaOcorrencia(o) }}</span>
              <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ o.nome }}</span>
              <UBadge :label="o.tipo" size="sm" color="neutral" variant="subtle" />
              <UBadge
                :label="o.contaComoUtil ? 'expediente normal' : 'suspende o expediente'"
                size="sm"
                :color="o.contaComoUtil ? 'neutral' : 'warning'"
                variant="subtle"
              />
              <UButton
                icon="i-lucide-x"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="`Remover ${o.nome}`"
                class="opacity-60 transition-opacity group-hover:opacity-100 focus:opacity-100"
                @click="removerOcorrencia(o.id)"
              />
            </li>
          </ul>

          <UButton
            label="Adicionar ocorrência"
            icon="i-lucide-plus"
            size="sm"
            color="neutral"
            variant="subtle"
            class="mt-3 transition-transform hover:-translate-y-0.5"
            @click="criandoOcorrencia = true"
          />
        </div>
        </div>
      </div>
      </div>
    </Secao>

    <!-- Importação de feriados: prévia antes de gravar. -->
    <UModal v-model:open="escolhendoFeriados" title="Importar feriados">
      <template #body>
        <UFormField label="País" help="O calendário importado é o oficial do país escolhido.">
          <USelect v-model="paisDaImportacao" :items="paises" class="w-full sm:max-w-xs" />
        </UFormField>

        <p class="mt-4 text-sm text-muted">
          Estes feriados ainda não estão no calendário. Desmarque o que não se aplica:
        </p>

        <ul class="mt-2 max-h-72 divide-y divide-default overflow-y-auto rounded-lg border border-default">
          <li
            v-for="(f, i) in previa"
            :key="f.id"
            class="flex items-center gap-3 px-3 py-2"
            :style="`animation: entrada .3s ease-out both; animation-delay: ${i * 35}ms`"
          >
            <UCheckbox
              :model-value="selecionados.includes(f.id)"
              :aria-label="f.nome"
              @update:model-value="(v: boolean) => v
                ? selecionados.push(f.id)
                : selecionados.splice(selecionados.indexOf(f.id), 1)"
            />
            <span class="w-20 shrink-0 text-sm tabular-nums text-muted">{{ formatarData(f.data) }}</span>
            <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ f.nome }}</span>
          </li>
        </ul>

        <p v-if="!previa.length" class="mt-2 text-sm text-muted">
          Todos os feriados deste país já estão no calendário.
        </p>
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-between gap-2">
          <span class="text-sm text-muted">
            {{ selecionados.length }} selecionados
          </span>
          <span class="flex gap-2">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="escolhendoFeriados = false" />
            <UButton
              :label="`Importar ${contar(selecionados.length, 'feriado', 'feriados')}`"
              :disabled="!selecionados.length"
              :loading="importando"
              @click="importar"
            />
          </span>
        </div>
      </template>
    </UModal>

    <!-- Nova ocorrência -->
    <UModal v-model:open="criandoOcorrencia" title="Nova ocorrência">
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <UFormField label="De" class="min-w-40 flex-1">
              <UInput v-model="nova.data" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Até" help="Vazio: vale só um dia." class="min-w-40 flex-1">
              <UInput v-model="nova.ate" type="date" :min="nova.data" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Nome" help="É o texto que aparece no dia, no calendário.">
            <UInput v-model="nova.nome" placeholder="Recesso de fim de ano" class="w-full" />
          </UFormField>
          <UFormField label="Tipo">
            <USelect v-model="nova.tipo" :items="tipos" class="w-full sm:max-w-xs" />
          </UFormField>
          <div class="flex items-start justify-between gap-6">
            <div>
              <p class="text-sm font-medium text-highlighted">Mantém o expediente</p>
              <p class="mt-0.5 text-sm text-muted">
                Desligado, o dia deixa de contar como útil nos prazos.
              </p>
            </div>
            <USwitch v-model="nova.contaComoUtil" aria-label="Mantém o expediente" />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="criandoOcorrencia = false" />
          <UButton label="Adicionar" :disabled="!nova.nome.trim()" @click="adicionarOcorrencia" />
        </div>
      </template>
    </UModal>
  </div>
</template>
