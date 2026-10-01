<script setup lang="ts">
import Secao from './_Secao.vue'
import {
  avisosNativos,
  modelosDeEmail,
  type Direcao,
  type RegraDeAviso,
  type Unidade,
} from './mocks'
import { destaque, form } from './estado'

const toast = useToast()

/* ------------------------------------------------------------------ *
 * A regra vira frase. É o coração desta aba.
 *
 * Hoje a tela pede um número com sinal — `-1` avisa um dia antes, `2`
 * avisa dois dias depois —, e isso só está dito num parágrafo cinza de
 * 12 px. O padrão do mercado (monday, ClickUp — PESQUISA.md §3 e §4) é
 * escolher a direção numa lista e ler a regra em linguagem natural.
 * ------------------------------------------------------------------ */

const unidades: { label: string, value: Unidade }[] = [
  { label: 'minutos', value: 'minuto' },
  { label: 'horas', value: 'hora' },
  { label: 'dias', value: 'dia' },
  { label: 'semanas', value: 'semana' },
]

function plural(quantidade: number, unidade: Unidade) {
  const nomes: Record<Unidade, [string, string]> = {
    minuto: ['minuto', 'minutos'],
    hora: ['hora', 'horas'],
    dia: ['dia', 'dias'],
    semana: ['semana', 'semanas'],
  }
  return quantidade === 1 ? nomes[unidade][0] : nomes[unidade][1]
}

function nomeDoModelo(id: number | null) {
  return modelosDeEmail.find(m => m.id === id)?.nome ?? 'nenhum modelo'
}

function frase(r: { quantidade: number, unidade: Unidade, direcao: Direcao, modelo: number | null }) {
  const quando = r.direcao === 'antes'
    ? `${r.quantidade} ${plural(r.quantidade, r.unidade)} antes do vencimento`
    : `${r.quantidade} ${plural(r.quantidade, r.unidade)} depois do vencimento`
  return `Avisar ${quando}, com o modelo “${nomeDoModelo(r.modelo)}”.`
}

/* ------------------------- os dois escopos ------------------------- */

type Escopo = 'spaceflow' | 'agendadas'

const escopos: { chave: Escopo, titulo: string, resumo: string, icone: string }[] = [
  {
    chave: 'spaceflow',
    titulo: 'Tarefas rápidas (Spaceflow)',
    resumo: 'As tarefas que um Spaceflow cria no meio de um fluxo.',
    icone: 'i-lucide-zap',
  },
  {
    chave: 'agendadas',
    titulo: 'Tarefas agendadas',
    resumo: 'As tarefas que nascem de um fluxo de categoria, com prazo definido.',
    icone: 'i-lucide-calendar-clock',
  },
]

/**
 * Os dois escopos num cartão só.
 *
 * Eram dois cartões com a mesma estrutura: chave, linha do tempo, regras,
 * adicionar. Empilhados, custavam meia tela e repetiam o desenho inteiro para
 * dizer a mesma coisa duas vezes. Com o seletor no alto, a tela diz o que
 * estava implícito: **a regra é por tipo de tarefa**.
 */
const escopoAberto = ref<Escopo>('spaceflow')
const escopoAtual = computed(() => escopos.find(e => e.chave === escopoAberto.value)!)

// A busca da tela leva a "spaceflow" e a "agendadas": trocar o escopo é o que
// faz o destaque ter o que destacar.
watch(destaque, (secao) => {
  if (secao === 'spaceflow' || secao === 'agendadas') escopoAberto.value = secao
})

function regras(escopo: Escopo): RegraDeAviso[] {
  return escopo === 'spaceflow' ? form.notificacoes.regrasSpaceflow : form.notificacoes.regrasAgendadas
}

function personalizado(escopo: Escopo) {
  return escopo === 'spaceflow'
    ? form.notificacoes.spaceflowPersonalizado
    : form.notificacoes.agendadasPersonalizado
}

function alternarPersonalizado(escopo: Escopo, valor: boolean) {
  if (escopo === 'spaceflow') form.notificacoes.spaceflowPersonalizado = valor
  else form.notificacoes.agendadasPersonalizado = valor
}

/** Marcadores da linha do tempo, ordenados como o tempo acontece. */
function marcadores(escopo: Escopo) {
  const emMinutos = (r: RegraDeAviso) => {
    const fator: Record<Unidade, number> = { minuto: 1, hora: 60, dia: 1440, semana: 10080 }
    const m = r.quantidade * fator[r.unidade]
    return r.direcao === 'antes' ? -m : m
  }
  return [...regras(escopo)].filter(r => r.ativa).sort((a, b) => emMinutos(a) - emMinutos(b))
}

function rotuloCurto(r: RegraDeAviso) {
  return `${r.quantidade} ${plural(r.quantidade, r.unidade)}`
}

/**
 * A linha do tempo como sequência, com o vencimento no meio dela.
 *
 * Era marcação à mão: duas metades, posicionamento relativo e um chip
 * flutuante. Como sequência, o vencimento vira só mais um ponto, e é o ponto
 * que separa o que avisa antes do que avisa depois.
 */
function itensDaLinha(escopo: Escopo) {
  const pontos = marcadores(escopo)
  return [
    ...pontos.filter(r => r.direcao === 'antes').map(r => ({
      value: `antes-${r.id}`,
      title: `${rotuloCurto(r)} antes`,
      icon: 'i-lucide-alarm-clock',
    })),
    { value: 'vencimento', title: 'Vencimento', icon: 'i-lucide-flag' },
    ...pontos.filter(r => r.direcao === 'depois').map(r => ({
      value: `depois-${r.id}`,
      title: `${rotuloCurto(r)} depois`,
      icon: 'i-lucide-alarm-clock-off',
    })),
  ]
}

/* --------------------------- editor da regra ----------------------- */

const editando = ref(false)
const escopoEmEdicao = ref<Escopo>('agendadas')
const idEmEdicao = ref<number | null>(null)

const rascunho = reactive({
  direcao: 'antes' as Direcao,
  quantidade: 1,
  unidade: 'dia' as Unidade,
  modelo: modelosDeEmail[0]?.id ?? null,
})

function abrirNova(escopo: Escopo) {
  escopoEmEdicao.value = escopo
  idEmEdicao.value = null
  Object.assign(rascunho, { direcao: 'antes', quantidade: 1, unidade: 'dia', modelo: modelosDeEmail[0]?.id ?? null })
  editando.value = true
}

function abrirEdicao(escopo: Escopo, r: RegraDeAviso) {
  escopoEmEdicao.value = escopo
  idEmEdicao.value = r.id
  Object.assign(rascunho, { direcao: r.direcao, quantidade: r.quantidade, unidade: r.unidade, modelo: r.modelo })
  editando.value = true
}

function guardarRegra() {
  const lista = regras(escopoEmEdicao.value)
  if (idEmEdicao.value === null) {
    lista.push({ id: Date.now(), ativa: true, ...rascunho })
  }
  else {
    const r = lista.find(x => x.id === idEmEdicao.value)
    if (r) Object.assign(r, rascunho)
  }
  editando.value = false
  toast.add({
    title: 'Regra na lista',
    description: 'Ainda não está gravada: use Salvar, na barra de baixo.',
    icon: 'i-lucide-bell-plus',
    color: 'neutral',
  })
}

function removerRegra(escopo: Escopo, id: number) {
  const lista = regras(escopo)
  const i = lista.findIndex(r => r.id === id)
  if (i >= 0) lista.splice(i, 1)
}

const modelosParaSelect = computed(() =>
  modelosDeEmail.map(m => ({ label: m.nome, value: m.id })),
)
</script>

<template>
  <div class="space-y-5">
    <!-- 1. O QUE ACONTECE SEM VOCÊ FAZER NADA ------------------------ -->
    <Secao
      id="nativas"
      titulo="O que o ENSPACE já avisa sozinho"
      resumo="Toda tarefa com prazo recebe estes três e-mails, sem nenhuma configuração."
      style="animation: entrada .4s ease-out both"
    >
      <ul class="grid gap-2 sm:grid-cols-3">
        <li
          v-for="(a, i) in avisosNativos"
          :key="a.rotulo"
          class="rounded-lg bg-elevated/60 px-3 py-2.5"
          :style="`animation: entrada .35s ease-out both; animation-delay: ${i * 60}ms`"
        >
          <p class="text-sm font-medium text-highlighted">{{ a.rotulo }}</p>
          <p class="mt-0.5 text-xs text-toned">{{ a.detalhe }}</p>
        </li>
      </ul>

      <p class="mt-3 text-sm text-muted">
        Quando você liga as suas próprias regras para um tipo de tarefa, <strong class="text-toned">estes
          três avisos param</strong> para aquele tipo, e só o que você escrever é enviado.
      </p>
    </Secao>

    <!-- 2. OS DOIS ESCOPOS -------------------------------------------- -->
    <Secao
      :id="escopoAberto"
      :titulo="escopoAtual.titulo"
      :resumo="escopoAtual.resumo"
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <template #acoes>
        <UFieldGroup size="xs">
          <UButton
            v-for="op in escopos"
            :key="op.chave"
            :label="op.titulo.replace(' (Spaceflow)', '')"
            :icon="op.icone"
            :color="escopoAberto === op.chave ? 'primary' : 'neutral'"
            :variant="escopoAberto === op.chave ? 'soft' : 'outline'"
            :aria-pressed="escopoAberto === op.chave"
            @click="escopoAberto = op.chave"
          />
        </UFieldGroup>
      </template>

      <div class="flex items-start justify-between gap-6 border-b border-default pb-4">
        <div class="min-w-0">
          <p class="text-sm font-medium text-highlighted">Usar as minhas regras</p>
          <p class="mt-1 text-sm text-muted">
            <template v-if="personalizado(escopoAberto)">
              Os três avisos automáticos estão <strong class="text-toned">desligados</strong> para
              este tipo de tarefa.
            </template>
            <template v-else>
              Os três avisos automáticos estão <strong class="text-toned">ligados</strong>. Suas
              regras ficam guardadas, mas não são enviadas.
            </template>
          </p>
        </div>
        <USwitch
          :model-value="personalizado(escopoAberto)"
          :aria-label="`Usar minhas regras em ${escopoAtual.titulo}`"
          @update:model-value="(v: boolean) => alternarPersonalizado(escopoAberto, v)"
        />
      </div>

      <!-- linha do tempo: onde cada aviso cai em relação ao vencimento -->
      <div
        v-if="personalizado(escopoAberto) && regras(escopoAberto).length"
        class="mt-5 rounded-lg bg-elevated/40 px-4 py-5"
      >
        <UTimeline
          orientation="horizontal"
          size="xs"
          color="primary"
          :default-value="'vencimento'"
          :items="itensDaLinha(escopoAberto)"
        />
      </div>

      <!-- as regras, em português -->
      <TransitionGroup
        v-if="personalizado(escopoAberto)"
        tag="ul"
        class="mt-4 space-y-2"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition duration-200 ease-in absolute"
        leave-to-class="opacity-0 translate-x-4"
      >
        <li
          v-for="r in regras(escopoAberto)"
          :key="r.id"
          class="group flex items-center gap-3 rounded-lg bg-elevated/40 px-3 py-2.5 transition-colors hover:bg-elevated"
        >
          <UIcon
            :name="r.direcao === 'antes' ? 'i-lucide-alarm-clock' : 'i-lucide-alarm-clock-off'"
            class="size-4 shrink-0"
            :class="[r.direcao === 'antes' ? 'text-primary' : 'text-warning', !r.ativa && 'opacity-40']"
          />
          <span
            class="min-w-0 flex-1 text-sm"
            :class="r.ativa ? 'text-highlighted' : 'text-muted line-through decoration-1'"
          >{{ frase(r) }}</span>
          <UBadge v-if="!r.ativa" label="pausada" size="sm" color="neutral" variant="subtle" />
          <UTooltip :text="r.ativa ? 'Pausar esta regra' : 'Voltar a enviar'">
            <USwitch v-model="r.ativa" size="sm" :aria-label="`Enviar: ${frase(r)}`" />
          </UTooltip>
          <UButton
            label="Editar"
            size="xs"
            color="neutral"
            variant="ghost"
            class="opacity-60 transition-opacity group-hover:opacity-100 focus:opacity-100"
            @click="abrirEdicao(escopoAberto, r)"
          />
          <UButton
            icon="i-lucide-trash-2"
            size="xs"
            color="neutral"
            variant="ghost"
            :aria-label="`Remover regra: ${frase(r)}`"
            class="opacity-60 transition-opacity group-hover:opacity-100 focus:opacity-100"
            @click="removerRegra(escopoAberto, r.id)"
          />
        </li>
      </TransitionGroup>

      <!-- nenhuma regra e o toggle ligado: ninguém é avisado -->
      <UAlert
        v-if="personalizado(escopoAberto) && !regras(escopoAberto).length"
        class="mt-4"
        color="warning"
        variant="subtle"
        icon="i-lucide-bell-off"
        title="Nenhum aviso será enviado"
        description="Você desligou os avisos automáticos e ainda não escreveu nenhuma regra. Crie ao menos uma, ou volte a usar os avisos do ENSPACE."
      />

      <UButton
        v-if="personalizado(escopoAberto)"
        label="Adicionar regra"
        icon="i-lucide-plus"
        size="sm"
        color="neutral"
        variant="subtle"
        class="mt-4 transition-transform hover:-translate-y-0.5"
        @click="abrirNova(escopoAberto)"
      />

      <!-- desligado: mostra o que continua valendo, em vez de esconder -->
      <p v-else class="mt-4 text-sm text-muted">
        {{ regras(escopoAberto).length }} regras guardadas, sem efeito enquanto os avisos automáticos
        estiverem ligados.
      </p>
    </Secao>

    <!-- EDITOR DA REGRA ---------------------------------------------- -->
    <UModal
      v-model:open="editando"
      :title="idEmEdicao === null ? 'Nova regra de aviso' : 'Editar regra de aviso'"
    >
      <template #body>
        <div class="space-y-5">
          <UFormField label="Quando avisar">
            <div class="flex flex-wrap items-center gap-2">
              <div class="flex rounded-lg border border-default p-0.5">
                <button
                  v-for="d in (['antes', 'depois'] as Direcao[])"
                  :key="d"
                  type="button"
                  class="rounded-md px-3 py-1.5 text-sm capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  :class="rascunho.direcao === d
                    ? 'bg-primary text-inverted'
                    : 'text-muted hover:bg-elevated hover:text-highlighted'"
                  :aria-pressed="rascunho.direcao === d"
                  @click="rascunho.direcao = d"
                >
                  {{ d }}
                </button>
              </div>

              <UInputNumber v-model="rascunho.quantidade" :min="1" :max="99" class="w-28" />
              <USelect v-model="rascunho.unidade" :items="unidades" class="w-36" />
              <span class="text-sm text-muted">do vencimento</span>
            </div>
          </UFormField>

          <UFormField label="Modelo de e-mail">
            <template #help>
              O texto que a pessoa recebe. Os modelos se escrevem em
              <span class="text-toned">Configurações › E-mails › Modelos de E-mail</span>.
            </template>
            <USelect
              v-model="rascunho.modelo"
              :items="modelosParaSelect"
              placeholder="Escolha um modelo"
              class="w-full"
            />
          </UFormField>

          <!-- a regra escrita, sempre visível enquanto se edita -->
          <div class="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">
              A regra fica assim
            </p>
            <p class="mt-1 text-sm text-highlighted">{{ frase(rascunho) }}</p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="editando = false" />
          <UButton
            :label="idEmEdicao === null ? 'Adicionar regra' : 'Guardar alteração'"
            :disabled="!rascunho.modelo"
            @click="guardarRegra"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
