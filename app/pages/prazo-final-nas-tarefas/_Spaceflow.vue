<script setup lang="ts">
/**
 * O prazo final no Spaceflow.
 *
 * - RF009: o gatilho "Tarefa atualizada" entrega a variável Prazo final junto do Prazo;
 * - RF010: tarefa sem prazo final entrega a variável vazia, e o fluxo segue;
 * - RF011: mudar o prazo final dispara o gatilho, como mudar o prazo;
 * - P5 (resposta: sim): as ações "Criar tarefa rápida" e "Alterar tarefa rápida"
 *   gravam o prazo final, com a RN004 na configuração e na execução.
 *
 * O editor é reduzido a uma coluna de nós: o que se avalia é a configuração
 * do nó e o registro da execução, não o canvas.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { ConfiguracaoDaAcao, DataDoNo, Execucao, ModoDaData } from './mocks'
import { configuracaoInicial, execucoes, variaveisDoGatilho } from './mocks'
import { formatar, ordemValida } from './datas'

const props = defineProps<{ t: Textos, idioma: Idioma }>()
const toast = useToast()

const aba = ref<'editor' | 'execucoes'>('editor')
const abas = computed(() => [
  { label: props.t.sf.editor, value: 'editor', icon: 'i-lucide-workflow' },
  { label: props.t.sf.execucoes, value: 'execucoes', icon: 'i-lucide-list-checks' },
])

type No = 'gatilho' | 'acao' | 'email'
const noAtivo = ref<No>('acao')
const salva = ref<ConfiguracaoDaAcao>(configuracaoInicial())
const config = ref<ConfiguracaoDaAcao>(structuredClone(toRaw(salva.value)))
const tentou = ref(false)
const salvando = ref(false)

const nos = computed(() => [
  { chave: 'gatilho' as No, tipo: props.t.sf.gatilho, nome: props.t.sf.noGatilho, icone: 'i-lucide-zap' },
  { chave: 'acao' as No, tipo: props.t.sf.acao, nome: salva.value.acao === 'criar' ? props.t.sf.noCriar : props.t.sf.noAlterar, icone: 'i-lucide-clipboard-plus' },
  { chave: 'email' as No, tipo: props.t.sf.acao, nome: props.t.sf.noEmail, icone: 'i-lucide-mail' },
])

const modos = computed(() => {
  const r = config.value.acao === 'criar' ? props.t.sf.modos : props.t.sf.modosAlterar
  const lista: ModoDaData[] = config.value.acao === 'criar' ? ['vazio', 'fixa', 'variavel'] : ['manter', 'vazio', 'fixa', 'variavel']
  return lista.map(m => ({ label: r[m], value: m }))
})

watch(() => config.value.acao, (acao) => {
  for (const d of [config.value.prazo, config.value.prazoFinal]) {
    if (acao === 'criar' && d.modo === 'manter') d.modo = 'vazio'
  }
})

const variaveisDeData = computed(() => [[
  { type: 'label' as const, label: props.t.sf.grupoGatilho },
  ...variaveisDoGatilho.filter(v => v.tipo === 'data').map(v => ({
    label: props.t.sf.variaveis[v.chave],
    icon: v.chave === 'tarefa.prazo_final' ? 'i-lucide-flag' : 'i-lucide-calendar',
    chave: v.chave,
  })),
]])

function erroDa(d: DataDoNo): string | undefined {
  if (!tentou.value) return undefined
  if (d.modo === 'fixa' && !d.fixa) return props.t.sf.escolhaData
  if (d.modo === 'variavel' && !d.variavel) return props.t.sf.escolhaVariavel
  return undefined
}
/** RN004 na configuração: só dá para conferir quando as 2 datas são fixas. */
const erroDeOrdem = computed(() => {
  const { prazo, prazoFinal } = config.value
  if (prazo.modo !== 'fixa' || prazoFinal.modo !== 'fixa') return undefined
  return ordemValida(prazo.fixa, prazoFinal.fixa) ? undefined : props.t.erroPrazoFinalAntes(formatar(prazo.fixa, props.idioma))
})
const erroPrazo = computed(() => erroDa(config.value.prazo))
const erroPrazoFinal = computed(() => erroDa(config.value.prazoFinal) ?? erroDeOrdem.value)
const podeFalharNaExecucao = computed(() => config.value.prazo.modo === 'variavel' || config.value.prazoFinal.modo === 'variavel')

function salvar() {
  tentou.value = true
  if (erroPrazo.value || erroPrazoFinal.value) {
    toast.add({ title: props.t.sf.revise, color: 'error', icon: 'i-lucide-circle-alert' })
    return
  }
  salvando.value = true
  setTimeout(() => {
    salvando.value = false
    salva.value = structuredClone(toRaw(config.value))
    tentou.value = false
    toast.add({ title: props.t.sf.noSalvo, color: 'success', icon: 'i-lucide-check' })
  }, 600)
}
function cancelar() {
  config.value = structuredClone(toRaw(salva.value))
  tentou.value = false
}

const marcador = (chave: string) => `{{${chave}}}`

const execucaoAtiva = ref<Execucao>(execucoes[0]!)
const fmt = (d: string | null) => formatar(d, props.idioma)
function quando(iso: string) {
  return new Intl.DateTimeFormat(props.idioma, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
    <div>
      <nav class="flex flex-wrap items-center gap-1 text-xs text-muted" aria-label="breadcrumb">
        <template v-for="(p, i) in t.sf.trilha" :key="p">
          <span>{{ p }}</span>
          <UIcon v-if="i < t.sf.trilha.length - 1" name="i-lucide-chevron-right" class="size-3" aria-hidden="true" />
        </template>
      </nav>
      <h1 class="mt-1 text-lg font-semibold text-highlighted">{{ t.sf.fluxo }}</h1>
    </div>

    <UTabs v-model="aba" :items="abas" variant="link" :content="false" />

    <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
      <!-- EDITOR -->
      <div v-if="aba === 'editor'" key="editor" class="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <ol class="space-y-0">
          <li v-for="(no, i) in nos" :key="no.chave" class="flex flex-col items-center">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-lg border bg-default p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
              :class="noAtivo === no.chave ? 'border-primary ring-1 ring-primary' : 'border-default'"
              :aria-pressed="noAtivo === no.chave"
              :aria-label="t.sf.configurarNo(no.nome)"
              @click="noAtivo = no.chave"
            >
              <span class="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UIcon :name="no.icone" class="size-4" aria-hidden="true" />
              </span>
              <span>
                <span class="block text-xs text-muted">{{ no.tipo }}</span>
                <span class="block text-sm font-medium text-highlighted">{{ no.nome }}</span>
              </span>
            </button>
            <span v-if="i < nos.length - 1" class="h-6 w-px bg-accented" aria-hidden="true" />
          </li>
        </ol>

        <UCard :ui="{ body: 'space-y-4' }">
          <!-- Gatilho -->
          <template v-if="noAtivo === 'gatilho'">
            <div>
              <h2 class="text-base font-semibold text-highlighted">{{ t.sf.noGatilho }}</h2>
              <p class="mt-1 text-sm text-muted">{{ t.sf.noGatilhoDescricao }}</p>
            </div>
            <div>
              <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ t.sf.variaveisDisponiveis }}</h3>
              <ul class="divide-y divide-default rounded-lg border border-default">
                <li v-for="v in variaveisDoGatilho" :key="v.chave" class="flex items-center gap-2 px-3 py-2 text-sm">
                  <UIcon :name="v.tipo === 'data' ? 'i-lucide-calendar' : 'i-lucide-type'" class="size-4 text-muted" aria-hidden="true" />
                  <span class="text-highlighted">{{ t.sf.variaveis[v.chave] }}</span>
                  <code class="text-xs text-muted" v-text="marcador(v.chave)" />
                  <UBadge v-if="'nova' in v" :label="t.sf.novo" color="primary" variant="subtle" size="sm" class="ml-auto" />
                </li>
              </ul>
            </div>
          </template>

          <!-- Ação de tarefa -->
          <template v-else-if="noAtivo === 'acao'">
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField :label="t.sf.tipoDaAcao" name="acao">
                <USelect
                  v-model="config.acao"
                  :items="[{ label: t.sf.noCriar, value: 'criar' }, { label: t.sf.noAlterar, value: 'alterar' }]"
                  class="w-full"
                />
              </UFormField>
              <UFormField v-if="config.acao === 'criar'" :label="t.sf.nomeDaTarefa" name="nome">
                <UInput v-model="config.nome" class="w-full" />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div v-for="campo in (['prazo', 'prazoFinal'] as const)" :key="campo" class="space-y-2 rounded-lg border border-default p-3">
                <UFormField
                  :label="campo === 'prazo' ? t.colunas.prazo : t.colunas.prazoFinal"
                  :description="campo === 'prazo' ? t.prazoInstrucao : t.prazoFinalInstrucao"
                  :error="campo === 'prazo' ? erroPrazo : erroPrazoFinal"
                  :name="`sf-${campo}`"
                >
                  <div class="space-y-2">
                    <USelect
                      v-model="config[campo].modo"
                      :items="modos"
                      :aria-label="t.sf.comoPreencher(campo === 'prazo' ? t.colunas.prazo : t.colunas.prazoFinal)"
                      class="w-full"
                    />
                    <UInput
                      v-if="config[campo].modo === 'fixa'"
                      v-model="config[campo].fixa"
                      type="date"
                      class="w-full"
                      :aria-label="t.sf.escolhaData"
                    />
                    <UDropdownMenu
                      v-else-if="config[campo].modo === 'variavel'"
                      :items="variaveisDeData.map(g => g.map(it => 'chave' in it ? { ...it, onSelect: () => { config[campo].variavel = it.chave } } : it))"
                      :content="{ align: 'start' }"
                    >
                      <UButton
                        :label="config[campo].variavel ? t.sf.variaveis[config[campo].variavel!] : t.sf.escolherVariavel"
                        :icon="config[campo].variavel ? 'i-lucide-braces' : 'i-lucide-plus'"
                        trailing-icon="i-lucide-chevron-down"
                        color="neutral"
                        variant="outline"
                        class="w-full"
                      />
                    </UDropdownMenu>
                  </div>
                </UFormField>
              </div>
            </div>

            <UAlert
              v-if="podeFalharNaExecucao"
              icon="i-lucide-info"
              color="info"
              variant="subtle"
              :description="t.sf.regraNaExecucao"
            />

            <div class="flex justify-end gap-2 border-t border-default pt-4">
              <UButton :label="t.sf.cancelar" color="neutral" variant="outline" @click="cancelar" />
              <UButton :label="t.sf.salvar" :loading="salvando" @click="salvar" />
            </div>
          </template>

          <p v-else class="rounded-lg border border-dashed border-default p-6 text-center text-sm text-muted">
            {{ t.maqueteAba }}
          </p>
        </UCard>
      </div>

      <!-- EXECUÇÕES -->
      <div v-else key="execucoes" class="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <ul class="divide-y divide-default overflow-hidden rounded-lg border border-default">
          <li v-for="(e, i) in execucoes" :key="e.id" class="[animation:entrada_.3s_ease-out_both]" :style="{ animationDelay: `${i * 50}ms` }">
            <button
              type="button"
              class="grid w-full grid-cols-[6rem_1fr_auto] items-center gap-3 px-3 py-3 text-left text-sm transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary"
              :class="execucaoAtiva.id === e.id ? 'bg-elevated' : ''"
              :aria-pressed="execucaoAtiva.id === e.id"
              @click="execucaoAtiva = e"
            >
              <span class="text-xs text-muted">{{ quando(e.quando) }}</span>
              <span>
                <span class="block text-highlighted">{{ e.tarefa }}</span>
                <span class="block text-xs text-muted">{{ t.sf.colunasExecucao.mudou }}: {{ t.sf.mudancas[e.mudou] }}</span>
              </span>
              <UBadge
                :label="e.resultado === 'ok' ? t.sf.sucesso : t.sf.falha"
                :color="e.resultado === 'ok' ? 'success' : 'error'"
                variant="subtle"
                size="sm"
              />
            </button>
          </li>
        </ul>

        <UCard :ui="{ body: 'space-y-4' }">
          <h2 class="text-base font-semibold text-highlighted">{{ t.sf.detalheExecucao(execucaoAtiva.id) }}</h2>
          <div v-for="bloco in (['recebido', 'gravado'] as const)" :key="bloco">
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {{ bloco === 'recebido' ? t.sf.recebido : (execucaoAtiva.resultado === 'ok' ? t.sf.gravado : t.sf.naoGravado) }}
            </h3>
            <dl class="divide-y divide-default rounded-lg border border-default text-sm">
              <div v-for="c in (['prazo', 'prazoFinal'] as const)" :key="c" class="flex items-center justify-between gap-3 px-3 py-2">
                <dt class="flex items-center gap-1.5 text-toned">
                  <UIcon :name="c === 'prazo' ? 'i-lucide-calendar' : 'i-lucide-flag'" class="size-3.5 text-muted" aria-hidden="true" />
                  {{ c === 'prazo' ? t.colunas.prazo : t.colunas.prazoFinal }}
                </dt>
                <dd :class="execucaoAtiva[bloco][c] ? 'text-highlighted' : 'italic text-muted'">
                  {{ execucaoAtiva[bloco][c] ? fmt(execucaoAtiva[bloco][c]) : t.sf.vazio }}
                </dd>
              </div>
            </dl>
          </div>
          <UAlert
            v-if="execucaoAtiva.resultado === 'falha'"
            icon="i-lucide-circle-x"
            color="error"
            variant="subtle"
            :title="t.sf.noCriar"
            :description="t.sf.erroExecucao"
          />
        </UCard>
      </div>
    </Transition>
  </div>
</template>
