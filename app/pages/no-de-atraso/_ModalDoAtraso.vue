<script setup lang="ts">
/**
 * O modal de configuração do nó Atraso.
 *
 * `versao="hoje"` reproduz o develop em 14/10/2026: Nome do Nó, Quantidade de
 * Tempo (campo de texto que aceita "abc") e Unidade. Não é proposta.
 *
 * `versao="proposta"` é a proposta inteira:
 * 1. "Tipo de atraso", um dropdown com 2 opções (Duração fixa, a de hoje com
 *    número validado, e Data de referência), descritas no help do campo;
 * 2. o campo de data é um campo aberto que recebe a variável arrastada do
 *    painel Variáveis de Entrada (o mesmo do develop, aberto pela faixa
 *    ENTRADA). Vazio, mostra o exemplo `{{nodes.trig.data_de_vencimento_contrato}}`;
 * 3. "Quando avançar" pergunta antes: na data da variável (só a variável)
 *    ou antes ou depois dela (a frase inteira): Avançar para o próximo nó [30] [dias] [antes de]
 *    Data de vencimento, sem fórmula;
 * 4. horário, data no passado e data vazia em dropdown. Todo campo tem uma
 *    instrução curta embaixo;
 *
 * A moldura (ENTRADA e SAÍDA dos lados, cabeçalho, rodapé com "Modificado",
 * Cancelar e Salvar e fechar) é a do develop.
 */
import type { ConfiguracaoDoAtraso, Direcao, Unidade, UnidadeDoDeslocamento, Variavel } from './mocks'
import type { Textos } from './textos'
import { EXEMPLO_DE_VARIAVEL, chaveDaVariavel, noDeGatilho } from './mocks'
import { campoEscolhido, horarios, lerVariavel } from './espera'

const props = defineProps<{
  t: Textos
  versao: 'hoje' | 'proposta'
  /** A árvore do painel Variáveis de Entrada. Vazia no cenário "sem variável". */
  variaveis: Variavel[]
  /** Abre já mostrando os erros de validação (estado do andaime). */
  validarAoAbrir?: boolean
}>()

const aberto = defineModel<boolean>('open', { required: true })
const config = defineModel<ConfiguracaoDoAtraso>('config', { required: true })
const emit = defineEmits<{ salvo: [] }>()

const toast = useToast()
const p = computed(() => props.t.proposta)

/* ---------- o rascunho, que só vira config no Salvar ---------- */

const rascunho = ref<ConfiguracaoDoAtraso>(structuredClone(toRaw(config.value)))
const tentouSalvar = ref(false)
const salvando = ref(false)

watch(aberto, (v) => {
  if (!v) return
  rascunho.value = structuredClone(toRaw(config.value))
  tentouSalvar.value = !!props.validarAoAbrir
}, { immediate: true })

const modificado = computed(() => JSON.stringify(rascunho.value) !== JSON.stringify(config.value))

/* ---------- validação ---------- */

const quantidadeValida = computed(() => Number.isInteger(Number(rascunho.value.delay)) && Number(rascunho.value.delay) >= 1)
const erroQuantidade = computed(() => tentouSalvar.value && rascunho.value.mode === 'duration' && !quantidadeValida.value)
/** O que a pessoa escreveu ou arrastou para o campo de data, lido como variável. */
const variavelLida = computed(() => lerVariavel(rascunho.value.date_source))
const erroCampo = computed<string | undefined>(() => {
  if (rascunho.value.mode !== 'until_date') return undefined
  const texto = rascunho.value.date_source?.trim()
  if (!texto) return tentouSalvar.value ? p.value.erroCampo : undefined
  if (!variavelLida.value) return p.value.naoReconhecida
  if (variavelLida.value.tipo !== 'Date') return p.value.naoEhData(variavelLida.value.label ?? variavelLida.value.refId)
  return undefined
})

function salvar() {
  tentouSalvar.value = true
  const semData = rascunho.value.mode === 'until_date' && !campo.value
  if (props.versao === 'proposta' && (erroQuantidade.value || erroCampo.value || semData)) return
  salvando.value = true
  setTimeout(() => {
    config.value = structuredClone(toRaw(rascunho.value))
    salvando.value = false
    aberto.value = false
    emit('salvo')
    toast.add({ title: p.value.salvo, icon: 'i-lucide-circle-check', color: 'success' })
  }, 450)
}

/* ---------- opções ---------- */

// Toda opção da proposta leva `ajuda`: o "?" com tooltip no fim da linha do dropdown.
const unidadesDeHoje = computed(() => (['second', 'minute', 'hour', 'day'] as Unidade[]).map(u => ({
  value: u,
  label: props.t.hoje.unidades[u],
  ajuda: props.versao === 'proposta' ? p.value.ajudas.unidade[u] : undefined,
})))

const modos = computed(() => [
  { value: 'duration' as const, label: p.value.modos.duration.titulo, description: p.value.modos.duration.descricao, ajuda: p.value.ajudas.tipo.duration },
  { value: 'until_date' as const, label: p.value.modos.until_date.titulo, description: p.value.modos.until_date.descricao, ajuda: p.value.ajudas.tipo.until_date },
])

/** No dropdown vão só nome e ajuda; a descrição longa fica no "?" do campo. */
const itensDeModo = computed(() => modos.value.map(({ value, label, ajuda }) => ({ value, label, ajuda })))

const unidadesDoDeslocamento = computed(() => (['day', 'week', 'month', 'hour'] as UnidadeDoDeslocamento[])
  .map(u => ({ value: u, label: p.value.unidadeDoDeslocamento(u, rascunho.value.offset_amount), ajuda: p.value.ajudas.deslocamento[u] })))

/*
 * "Momento" vem primeiro, como o "On date / Before date / After date" do
 * HubSpot: na data (só a variável) ou antes ou depois dela (deslocamento e
 * variável). Grava direto em `offset_direction`: 'on', 'before' ou 'after'.
 */
const momentos = computed(() => (['on', 'before', 'after'] as Direcao[]).map(d => ({ value: d, label: p.value.momentos[d], ajuda: p.value.ajudas.direcao[d] })))
const naData = computed(() => rascunho.value.offset_direction === 'on')

const campo = computed(() => campoEscolhido(rascunho.value))

const opcoesDeHorario = computed(() => [
  ...(campo.value?.comHora ? [{ value: 'field', label: p.value.horarioDoCampo }] : []),
  ...horarios.map(h => ({ value: h, label: h })),
])
const horarioDesligado = computed(() => rascunho.value.offset_unit === 'hour')

// quem troca para um campo sem hora não pode ficar com "o horário do campo"
watch(campo, (c) => {
  if (c && !c.comHora && rascunho.value.time === 'field') rascunho.value.time = '09:00'
})

const opcoesDePassou = computed(() => [
  { value: 'continue', label: p.value.continuarNaHora, ajuda: p.value.ajudas.passou.continue },
  { value: 'end', label: p.value.encerrar, ajuda: p.value.ajudas.passou.end },
])
const opcoesDeVazio = computed(() => [
  { value: 'end', label: p.value.encerrar, ajuda: p.value.ajudas.vazio.end },
  { value: 'continue', label: p.value.continuarNaHora, ajuda: p.value.ajudas.vazio.continue },
])

/* ---------- o painel Variáveis de Entrada e o arrasto ---------- */

const painelAberto = ref(false)
const filtro = ref('')
const dataAberto = ref(true)

// quem escolhe "Data de referência" com o campo vazio já vê de onde arrastar
watch(() => rascunho.value.mode, (m) => {
  if (m === 'until_date' && !rascunho.value.date_source) painelAberto.value = true
})

function bate(v: Variavel) {
  const f = filtro.value.trim().toLowerCase()
  return !f || (v.label ?? '').toLowerCase().includes(f) || v.refId.includes(f)
}
const arvore = computed(() => props.variaveis
  .map(v => v.filhos ? { ...v, filhos: v.filhos.filter(bate) } : v)
  .filter(v => v.filhos ? v.filhos.length > 0 : bate(v)))

/** O mesmo pacote que o painel do develop põe no arrasto, com a chave no formato do exemplo. */
function arrastar(e: DragEvent, v: Variavel) {
  const key = chaveDaVariavel(v)
  e.dataTransfer?.setData('application/json', JSON.stringify({ key, label: v.label, meta: { dataType: v.tipo } }))
  e.dataTransfer?.setData('text/plain', key)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
}

const sobreOCampo = ref(false)

/**
 * A chave aparece como texto quando a pessoa clica na etiqueta para editar, ou
 * quando o que está escrito não é uma variável conhecida (para dar para corrigir).
 */
const editandoChave = ref(false)
const campoDaChave = ref<{ inputRef?: HTMLInputElement } | null>(null)
const mostrarChave = computed(() => editandoChave.value || (!!rascunho.value.date_source?.trim() && !variavelLida.value))
function editar() {
  editandoChave.value = true
  nextTick(() => campoDaChave.value?.inputRef?.focus())
}
function soltar(e: DragEvent) {
  sobreOCampo.value = false
  const json = e.dataTransfer?.getData('application/json')
  let chave = e.dataTransfer?.getData('text/plain') ?? ''
  if (json) {
    try { chave = JSON.parse(json).key ?? chave }
    catch { /* fica o texto */ }
  }
  if (chave) rascunho.value.date_source = chave
  editandoChave.value = false
}

/**
 * Lista dos dropdowns da proposta: sem o ✓ (ele empurrava o "?" da opção) e
 * com a opção escolhida em fundo e semibold.
 */
const uiDaLista = {
  itemTrailingIcon: 'hidden',
  item: 'data-[state=checked]:font-semibold data-[state=checked]:text-highlighted data-[state=checked]:before:bg-elevated',
}

</script>

<template>
  <UModal
    v-model:open="aberto"
    :dismissible="!modificado"
    :ui="{ content: 'max-w-none w-auto bg-transparent shadow-none ring-0 divide-y-0 overflow-visible' }"
  >
    <template #content>
      <div class="flex items-center">
        <div
          class="relative z-10 flex max-h-[min(88dvh,820px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl"
          :class="versao === 'proposta' ? 'sm:w-[640px]' : 'sm:w-[548px]'"
        >
          <!-- Cabeçalho -->
          <div class="flex items-center gap-2 border-b border-default px-5 py-4">
            <UIcon name="i-lucide-clock" class="size-4 text-muted" />
            <h2 class="flex-1 text-base font-semibold text-highlighted">{{ t.hoje.titulo }}</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.hoje.fechar" @click="aberto = false" />
          </div>

          <!-- Corpo -->
          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <UFormField :label="t.hoje.nomeDoNo" :help="versao === 'proposta' ? p.instrucoes.nome : undefined">
              <template #hint>
                <UTooltip :text="t.hoje.ajudaNome"><UIcon name="i-lucide-circle-help" class="size-4 text-muted" /></UTooltip>
              </template>
              <UInput v-model="rascunho.label" class="w-full" />
            </UFormField>

            <!-- ============ COMO É HOJE ============ -->
            <template v-if="versao === 'hoje'">
              <UFormField :label="t.hoje.quantidade" :required="!rascunho.delay">
                <template #hint>
                  <UTooltip :text="t.hoje.ajudaQuantidade"><UIcon name="i-lucide-circle-help" class="size-4 text-muted" /></UTooltip>
                </template>
                <!-- Hoje é texto livre: "abc" e "{{" gravam sem erro -->
                <UInput v-model="rascunho.delay as string" class="w-full" />
              </UFormField>
              <UFormField :label="t.hoje.unidade">
                <template #hint>
                  <UTooltip :text="t.hoje.ajudaUnidade"><UIcon name="i-lucide-circle-help" class="size-4 text-muted" /></UTooltip>
                </template>
                <USelect v-model="rascunho.unit" :items="unidadesDeHoje" class="w-full">
                  <template #item-trailing="{ item }">
                    <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                      <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                    </UTooltip>
                  </template>
                </USelect>
              </UFormField>
            </template>

            <!-- ============ PROPOSTA ============ -->
            <template v-else>
              <UFormField :label="p.esperar" :help="p.instrucoes.tipo">
                <template #hint>
                  <!-- O help traz a descrição dos 2 tipos, como os "?" dos outros campos do nó -->
                  <UTooltip :ui="{ content: 'h-auto max-w-80 flex-col items-start gap-1.5 py-2 text-xs' }">
                    <UIcon name="i-lucide-circle-help" class="size-4 text-muted" />
                    <template #content>
                      <span v-for="m in modos" :key="m.value" class="block">
                        <strong class="text-highlighted">{{ m.label }}.</strong> {{ m.description }}
                      </span>
                    </template>
                  </UTooltip>
                </template>
                <USelect v-model="rascunho.mode" :ui="uiDaLista" :items="itensDeModo" class="w-full">
                  <template #item-trailing="{ item }">
                    <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                      <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                    </UTooltip>
                  </template>
                </USelect>
              </UFormField>

              <Transition
                mode="out-in"
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                leave-active-class="transition duration-100"
                leave-to-class="opacity-0"
              >
                <!-- Por um tempo -->
                <div v-if="rascunho.mode === 'duration'" key="tempo" class="grid gap-4 sm:grid-cols-2">
                  <UFormField :label="t.hoje.quantidade" required :help="p.instrucoes.quantidade" :error="erroQuantidade ? p.erroQuantidade : undefined">
                    <UInputNumber
                      :model-value="Number(rascunho.delay) || undefined"
                      :min="1"
                      :step="1"
                      class="w-full"
                      @update:model-value="(v) => (rascunho.delay = v ?? '')"
                    />
                  </UFormField>
                  <UFormField :label="t.hoje.unidade" :help="p.instrucoes.unidade">
                    <USelect v-model="rascunho.unit" :ui="uiDaLista" :items="unidadesDeHoje" class="w-full">
                      <template #item-trailing="{ item }">
                        <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                          <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                        </UTooltip>
                      </template>
                    </USelect>
                  </UFormField>
                </div>

                <!-- Data de referência -->
                <div v-else key="data" class="space-y-5">
                  <!-- A regra inteira numa frase: [30] [dias] [antes de] [variável da data].
                       O fim da frase é o lugar de soltar a variável arrastada de Variáveis de Entrada. -->
                  <!-- Sem :error no UFormField: ele pinta a frase inteira. Só a data fica vermelha, e a mensagem vem embaixo. -->
                  <UFormField :label="p.momento" :help="p.instrucoes.momento">
                    <USelect v-model="rascunho.offset_direction" :ui="uiDaLista" :items="momentos" class="w-full">
                      <template #item-trailing="{ item }">
                        <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                          <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                        </UTooltip>
                      </template>
                    </USelect>
                  </UFormField>

                  <!-- Na data: só o lugar da variável. Antes ou depois: [30] [dias] antes de [variável]. -->
                  <UFormField
                    :label="naData ? p.dataExata : p.continuar"
                    required
                    :help="naData ? p.instrucoes.dataExata : p.instrucoes.retomar"
                  >
                    <div class="flex flex-wrap items-center gap-2">
                      <Transition
                        enter-active-class="transition-all duration-200"
                        enter-from-class="opacity-0 -translate-x-1"
                        leave-active-class="transition-all duration-150"
                        leave-to-class="opacity-0"
                      >
                        <div v-if="!naData" class="flex flex-wrap items-center gap-2">
                          <UInputNumber
                            v-model="rascunho.offset_amount"
                            :min="1"
                            :max="999"
                            :step="1"
                            :aria-label="p.quanto"
                            class="w-24"
                          />
                          <USelect v-model="rascunho.offset_unit" :ui="uiDaLista" :items="unidadesDoDeslocamento" class="w-28">
                            <template #item-trailing="{ item }">
                              <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                                <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                              </UTooltip>
                            </template>
                          </USelect>
                          <span class="text-sm text-default">{{ p.direcoes[rascunho.offset_direction] }}</span>
                        </div>
                      </Transition>

                      <!-- O lugar da data: vazio (tracejado), etiqueta legível ou a chave em edição -->
                      <div
                        class="min-w-44 flex-1 rounded-md transition-shadow"
                        :class="sobreOCampo ? 'ring-2 ring-primary ring-offset-2 ring-offset-(--ui-bg)' : ''"
                        @dragenter.prevent="sobreOCampo = true"
                        @dragover.prevent
                        @dragleave="sobreOCampo = false"
                        @drop.prevent="soltar"
                      >
                        <UInput
                          v-if="mostrarChave"
                          ref="campoDaChave"
                          v-model="rascunho.date_source as string"
                          :placeholder="EXEMPLO_DE_VARIAVEL"
                          icon="i-lucide-braces"
                          class="w-full"
                          :color="erroCampo ? 'error' : 'primary'"
                          :highlight="!!erroCampo"
                          :ui="{ base: 'font-mono text-xs' }"
                          @blur="editandoChave = false"
                          @keydown.enter="editandoChave = false"
                        />
                        <UTooltip
                          v-else-if="variavelLida"
                          :text="rascunho.date_source ?? ''"
                          :ui="{ content: 'h-auto', text: 'font-mono whitespace-normal' }"
                        >
                          <span
                            class="flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-sm ring ring-inset transition-colors"
                            :class="erroCampo ? 'bg-error/10 text-error ring-error/40' : 'bg-primary/10 text-highlighted ring-primary/30'"
                          >
                            <UIcon :name="variavelLida.icone" class="size-4 shrink-0" :class="erroCampo ? '' : 'text-primary'" />
                            <button type="button" class="min-w-0 flex-1 truncate text-left font-medium" :aria-label="p.editarVariavel" @click="editar">
                              {{ variavelLida.label ?? variavelLida.refId }}
                            </button>
                            <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" :aria-label="p.limparVariavel" @click="rascunho.date_source = null" />
                          </span>
                        </UTooltip>
                        <button
                          v-else
                          type="button"
                          class="flex h-8 w-full items-center gap-1.5 rounded-md border border-dashed px-2 text-left text-sm transition-colors hover:bg-elevated"
                          :class="[
                            sobreOCampo ? 'border-primary bg-primary/5 text-primary' : erroCampo ? 'border-error text-error' : 'border-accented text-muted',
                          ]"
                          @click="painelAberto = true"
                        >
                          <UIcon name="i-lucide-calendar-plus" class="size-4 shrink-0" />
                          <span class="truncate">{{ sobreOCampo ? p.soltarAqui : p.arrasteADataAqui }}</span>
                        </button>
                      </div>
                    </div>
                    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-0.5">
                      <p v-if="erroCampo" class="mt-2 text-sm text-error" role="alert">{{ erroCampo }}</p>
                    </Transition>
                  </UFormField>

                  <UFormField :label="p.horario" :help="horarioDesligado ? p.horarioEmHoras : p.instrucoes.horario">
                    <USelect
                      v-model="rascunho.time"
                      :ui="uiDaLista"
                      :items="opcoesDeHorario"
                      :disabled="horarioDesligado"
                      icon="i-lucide-clock-3"
                      class="w-full"
                    />
                  </UFormField>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <UFormField :label="p.sePassou" :help="p.instrucoes.sePassou">
                      <USelect v-model="rascunho.if_past" :ui="uiDaLista" :items="opcoesDePassou" class="w-full">
                        <template #item-trailing="{ item }">
                          <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                            <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                          </UTooltip>
                        </template>
                      </USelect>
                    </UFormField>
                    <UFormField :label="p.seVazio" :help="p.instrucoes.seVazio">
                      <USelect v-model="rascunho.if_empty" :ui="uiDaLista" :items="opcoesDeVazio" class="w-full">
                        <template #item-trailing="{ item }">
                          <UTooltip v-if="(item as any).ajuda" :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                            <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="p.ajudaDaOpcao" />
                          </UTooltip>
                        </template>
                      </USelect>
                    </UFormField>
                  </div>

                </div>
              </Transition>

            </template>
          </div>

          <!-- Rodapé (cópia do develop) -->
          <div class="flex items-center gap-2 border-t border-default px-5 py-3">
            <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
              <span v-if="modificado" class="flex items-center gap-1.5 text-xs text-warning">
                <span class="size-1.5 rounded-full bg-warning" />{{ t.hoje.modificado }}
              </span>
            </Transition>
            <span class="flex-1" />
            <template v-if="modificado || versao === 'proposta' && tentouSalvar">
              <UButton :label="t.hoje.cancelar" color="neutral" variant="outline" @click="aberto = false" />
              <UButton :label="t.hoje.salvarEFechar" icon="i-lucide-check" :loading="salvando" @click="salvar" />
            </template>
            <UButton v-else :label="t.hoje.fechar" @click="aberto = false" />
          </div>
        </div>

        <!-- ENTRADA, à esquerda, como no develop: a faixa abre Variáveis de Entrada.
             Vem depois do formulário no DOM (order-first a põe à esquerda) para o
             primeiro foco do modal continuar no X, como no develop. -->
        <button
          v-if="!painelAberto"
          type="button"
          class="order-first -mr-2 hidden h-64 w-12 items-center justify-center rounded-l-xl border border-r-0 border-default bg-default/80 transition-colors hover:bg-elevated sm:flex"
          :aria-label="p.abrirVariaveis"
          @click="painelAberto = true"
        >
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary [writing-mode:vertical-rl]">
            {{ t.hoje.entrada }}
          </span>
        </button>
        <section
          v-else
          class="order-first -mr-1 hidden max-h-[min(70dvh,560px)] w-72 flex-col overflow-hidden rounded-l-xl border border-r-0 border-default bg-default shadow-lg sm:flex"
          :aria-label="t.hoje.variaveisDeEntrada"
        >
          <div class="flex items-center gap-2 border-b border-default px-3 py-3">
            <span class="flex size-7 items-center justify-center rounded-md bg-elevated text-primary">
              <UIcon name="i-lucide-arrow-right-to-line" class="size-4" />
            </span>
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ t.hoje.variaveisDeEntrada }}</h3>
            <UButton icon="i-lucide-panel-left-close" color="neutral" variant="ghost" size="xs" :aria-label="t.hoje.recolher" @click="painelAberto = false" />
          </div>
          <div class="space-y-2 px-3 pt-3">
            <p class="text-xs text-muted">{{ t.hoje.arrasteAsVariaveis }}</p>
            <UInput v-model="filtro" icon="i-lucide-search" :placeholder="t.hoje.filtrar" size="sm" class="w-full" />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-2 text-sm">
            <p v-if="!variaveis.length" class="px-2 py-3 text-xs text-muted">{{ p.semVariaveis }}</p>
            <template v-else>
              <p class="flex items-center gap-1 px-1 py-1 text-default">
                <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
                {{ noDeGatilho.rotulo }} - {{ t.hoje.gatilho }}
              </p>
              <template v-for="v in arvore" :key="v.refId">
                <template v-if="v.filhos">
                  <button type="button" class="flex w-full items-center gap-1.5 rounded px-1 py-1 pl-4 text-left text-default hover:bg-elevated" @click="dataAberto = !dataAberto">
                    <UIcon :name="dataAberto ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" class="size-3.5 text-muted" />
                    <UIcon :name="v.icone" class="size-3.5 text-muted" />
                    {{ v.label }}
                  </button>
                  <template v-if="dataAberto">
                    <div
                      v-for="f in v.filhos"
                      :key="f.refId"
                      draggable="true"
                      class="flex cursor-grab items-center gap-1.5 rounded py-1 pl-10 pr-2 transition-colors hover:bg-elevated active:cursor-grabbing"
                      :class="f.tipo === 'Date' ? 'text-highlighted' : 'text-default'"
                      :title="chaveDaVariavel(f)"
                      @dragstart="arrastar($event, f)"
                    >
                      <UIcon :name="f.icone" class="size-3.5 shrink-0" :class="f.tipo === 'Date' ? 'text-primary' : 'text-muted'" />
                      <span class="truncate">{{ f.label }}</span>
                    </div>
                  </template>
                </template>
                <div
                  v-else
                  draggable="true"
                  class="flex cursor-grab items-center gap-1.5 rounded py-1 pl-6 pr-2 transition-colors hover:bg-elevated active:cursor-grabbing"
                  :class="v.tipo === 'Date' ? 'text-highlighted' : 'text-default'"
                  :title="chaveDaVariavel(v)"
                  @dragstart="arrastar($event, v)"
                >
                  <UIcon :name="v.icone" class="size-3.5 shrink-0" :class="v.tipo === 'Date' ? 'text-primary' : 'text-muted'" />
                  <span class="truncate">{{ v.label }}</span>
                </div>
              </template>
            </template>
          </div>
        </section>

        <!-- SAÍDA, à direita -->
        <div class="-ml-2 hidden h-64 w-12 items-center justify-center rounded-r-xl border border-l-0 border-default bg-default/80 sm:flex">
          <span class="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-success [writing-mode:vertical-rl] rotate-180">
            {{ t.hoje.saida }}
          </span>
        </div>
      </div>
    </template>
  </UModal>
</template>
