<script setup lang="ts">
/**
 * O modal de configuração de um nó, na proposta.
 *
 * A moldura é a do develop (modal central, faixa ENTRADA à esquerda, faixa
 * SAÍDA à direita, rodapé com Modificado, Cancelar e Salvar e fechar). Muda o
 * que está dentro:
 * - cabeçalho com o tipo, o grupo e onde o nó está ("Depois de: Aprovação");
 * - campos em seções com título; o secundário vem recolhido, com "opcional";
 * - todo campo com instrução embaixo e "?" com a explicação longa;
 * - variável entra pelo botão {x} do campo: o painel ENTRADA abre e o clique
 *   na variável insere no campo marcado (o arraste continua valendo);
 * - a faixa SAÍDA mostra o que o nó entrega aos próximos;
 * - o rodapé diz quantos obrigatórios faltam e leva até eles. Dá para salvar
 *   incompleto, como hoje: o card mostra o que falta.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Aresta, No } from './mocks'
import type { Textos } from './textos'
import { ESCOPO_ITEM_SEM_CATEGORIA, definicoes, ehItem, grupos, pendencias } from './nos'
import { variaveisDeEntrada } from './apoio'
import CampoDoNo from './_CampoDoNo.vue'

const props = defineProps<{
  t: Textos
  i: Idioma
  no: No | null
  nos: No[]
  arestas: Aresta[]
  /** Abre já mostrando os obrigatórios vazios (clique no card com pendência). */
  mostrarPendencias?: boolean
}>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ salvar: [id: string, data: Record<string, any>] }>()

const m = computed(() => props.t.modal)
const def = computed(() => (props.no ? definicoes[props.no.type] : undefined))
const grupo = computed(() => grupos.find(g => g.id === def.value?.grupo))

/* ---------- rascunho ---------- */

const rascunho = ref<Record<string, any>>({})
const original = ref('')
const mostrarErros = ref(false)
const confirmarDescarte = ref(false)
const salvando = ref(false)
const aba = ref('requisicao')
const abertas = ref<Record<string, boolean>>({})

watch(() => [aberto.value, props.no?.id] as const, ([a]) => {
  if (!a || !props.no) return
  rascunho.value = structuredClone(toRaw(props.no.data)) as Record<string, any>
  original.value = JSON.stringify(rascunho.value)
  // O editor de texto rico reescreve o HTML ao montar (põe <p> em volta).
  // Retrato de novo depois disso: abrir e fechar sem mexer não é "Modificado".
  setTimeout(() => (original.value = JSON.stringify(rascunho.value)), 450)
  mostrarErros.value = !!props.mostrarPendencias
  confirmarDescarte.value = false
  painel.value = null
  alvo.value = null
  aba.value = 'requisicao'
  abertas.value = Object.fromEntries((def.value?.secoes ?? []).map(s => [s.id, !s.recolhida]))
}, { immediate: true })

const modificado = computed(() => JSON.stringify(rascunho.value) !== original.value)

const secoesVisiveis = computed(() => (def.value?.secoes ?? [])
  .filter(s => !s.visivel || s.visivel(rascunho.value))
  .filter(s => !def.value?.abas || s.aba === aba.value))

/** Item, Tarefa ou Membro: trocar a origem do Início troca as seções, e a troca anima. */
const origemDoEscopo = computed(() => (props.no?.type === 'trigger' ? (ehItem(rascunho.value) || rascunho.value.scope === ESCOPO_ITEM_SEM_CATEGORIA ? 'item' : String(rascunho.value.scope ?? '')) : ''))

const faltam = computed(() => (def.value ? pendencias(def.value, rascunho.value) : []))

function camposVisiveis(s: (typeof secoesVisiveis.value)[number]) {
  return s.campos.filter(c => !c.visivel || c.visivel(rascunho.value))
}

/**
 * Meia linha só quando há par: campo de meia largura sem vizinho de meia
 * largura ocupa a linha inteira (rodada 10 do `no-de-atraso`: campo pela
 * metade deixa a tela com cara de quebrada).
 */
function emPar(s: (typeof secoesVisiveis.value)[number]) {
  const lista = camposVisiveis(s)
  const par = new Set<string>()
  for (let k = 0; k < lista.length; k++) {
    if (lista[k]!.metade && lista[k + 1]?.metade) {
      par.add(lista[k]!.chave)
      par.add(lista[k + 1]!.chave)
      k++
    }
  }
  return par
}

/** Quantos campos da seção estão preenchidos: aparece no título recolhido. */
function preenchidos(s: (typeof secoesVisiveis.value)[number]) {
  return camposVisiveis(s).filter(c => c.tipo !== 'aviso' && c.tipo !== 'webhook').filter((c) => {
    const v = c.chave.split('.').reduce<any>((o, k) => o?.[k], rascunho.value)
    return Array.isArray(v) ? v.length : v !== undefined && v !== null && v !== '' && v !== false
  }).length
}

/* ---------- onde o nó está ---------- */

const anteriores = computed(() => props.arestas.filter(a => a.target === props.no?.id).map(a => props.nos.find(n => n.id === a.source)?.data.label).filter(Boolean))
const saidas = computed(() => def.value?.saidas?.(rascunho.value) ?? [])

/* ---------- painéis ENTRADA e SAÍDA ---------- */

const painel = ref<'entrada' | 'saida' | null>(null)
const filtro = ref('')
const alvo = ref<string | null>(null)
let inserirNoAlvo: ((v: string) => void) | null = null

const gruposDeVariaveis = computed(() => {
  if (!props.no) return []
  const f = filtro.value.trim().toLowerCase()
  return variaveisDeEntrada(props.no.id, props.nos, props.arestas, props.i)
    .map(g => ({ ...g, variaveis: g.variaveis.filter(v => !f || v.rotulo.toLowerCase().includes(f) || v.chave.toLowerCase().includes(f)) }))
    .filter(g => g.variaveis.length)
})
const chaveDe = (k: string) => `{{nodes.${props.no?.id}.${k}}}`
const variaveisDeSaida = computed(() => def.value?.variaveis?.(rascunho.value) ?? [])

function marcar(chave: string, inserir: (v: string) => void) {
  alvo.value = chave
  inserirNoAlvo = inserir
  painel.value = 'entrada'
}
function clicarVariavel(chave: string) {
  if (inserirNoAlvo) inserirNoAlvo(chave)
}
function arrastar(e: DragEvent, chave: string, rotulo: string) {
  e.dataTransfer?.setData('text/plain', chave)
  e.dataTransfer?.setData('application/json', JSON.stringify({ key: chave, label: rotulo }))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
}
const iconeDoTipo = (tipo?: string) => ({ date: 'i-lucide-calendar', number: 'i-lucide-hash', file: 'i-lucide-paperclip', email: 'i-lucide-at-sign', select: 'i-lucide-list' } as Record<string, string>)[tipo ?? ''] ?? 'i-lucide-type'

/* ---------- pendências, salvar e fechar ---------- */

function irParaPendencia() {
  mostrarErros.value = true
  const primeira = faltam.value.find(f => f.chave)
  if (!primeira) return
  const secao = def.value?.secoes.find(s => s.campos.some(c => c.chave === primeira.chave))
  if (secao?.aba) aba.value = secao.aba
  if (secao) abertas.value[secao.id] = true
  nextTick(() => document.querySelector(`[data-campo="${primeira.chave}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}

const toast = useToast()
function salvar() {
  if (!props.no) return
  salvando.value = true
  setTimeout(() => {
    emit('salvar', props.no!.id, structuredClone(toRaw(rascunho.value)))
    salvando.value = false
    aberto.value = false
    toast.add({ title: m.value.salvo, icon: 'i-lucide-circle-check', color: 'success' })
  }, 380)
}
function fechar() {
  if (modificado.value && !confirmarDescarte.value) {
    confirmarDescarte.value = true
    return
  }
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :dismissible="!modificado"
    :ui="{ content: 'max-w-none w-auto bg-transparent shadow-none ring-0 divide-y-0 overflow-visible' }"
  >
    <template #content>
      <div v-if="no && def" class="flex items-center">
        <div class="relative z-10 flex max-h-[min(88dvh,860px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl sm:w-[660px]">
          <!-- Cabeçalho: tipo, grupo e posição no fluxo -->
          <div class="flex items-start gap-3 border-b border-default px-5 py-4">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon :name="def.icone" class="size-5" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="truncate text-base font-semibold text-highlighted">{{ def.nome[i] }}</h2>
                <UBadge :label="grupo?.nome[i]" :icon="grupo?.icone" color="neutral" variant="subtle" size="sm" />
              </div>
              <p class="mt-0.5 text-sm text-muted">{{ def.descricao[i] }}</p>
              <p class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-arrow-right-to-line" class="size-3.5" />
                  <template v-if="def.semEntrada">{{ m.inicioDoFluxo }}</template>
                  <template v-else>{{ m.depoisDe }}: <strong class="font-medium text-default">{{ anteriores.join(', ') || '…' }}</strong></template>
                </span>
                <span v-if="saidas.length" class="flex items-center gap-1">
                  <UIcon name="i-lucide-split" class="size-3.5" />
                  {{ m.saidasDoNo }}: <strong class="font-medium text-default">{{ saidas.map(s => s.rotulo[i]).join(', ') }}</strong>
                </span>
              </p>
            </div>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="m.fechar" @click="fechar" />
          </div>

          <!-- Abas, só no nó que tem (HTTP) -->
          <div v-if="def.abas" class="border-b border-default px-5 pt-2">
            <UTabs v-model="aba" :items="def.abas.map(a => ({ label: a.rotulo[i], value: a.id }))" variant="link" :content="false" size="sm" />
          </div>

          <!-- Corpo -->
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100"
              leave-to-class="opacity-0"
            >
              <div :key="`${aba}-${rascunho.type ?? ''}-${rascunho.action ?? ''}-${origemDoEscopo}`" class="space-y-3">
                <section
                  v-for="(s, si) in secoesVisiveis"
                  :key="s.id"
                  class="overflow-hidden rounded-xl border border-default"
                  :style="{ animation: `entrada .3s ease-out ${si * 40}ms backwards` }"
                >
                  <UCollapsible v-model:open="abertas[s.id]" :unmount-on-hide="false">
                    <!--
                      Rodada 4: o título da seção se separa dos campos por 3 sinais.
                      Faixa de fundo (bg-elevated), peso (título semibold e highlighted,
                      rótulo do campo medium e default) e a frase do que a seção decide.
                    -->
                    <button
                      type="button"
                      class="flex w-full items-center gap-3 bg-elevated/50 px-4 py-3 text-left transition-colors hover:bg-elevated"
                      :class="abertas[s.id] ? 'border-b border-default' : ''"
                    >
                      <span class="min-w-0 flex-1">
                        <span class="flex flex-wrap items-center gap-2">
                          <span class="text-sm font-semibold text-highlighted">{{ s.titulo[i] }}</span>
                          <UBadge v-if="s.opcional" :label="m.opcional" color="neutral" variant="outline" size="sm" />
                        </span>
                        <span v-if="s.descricao" class="mt-0.5 block text-xs text-muted">{{ s.descricao[i] }}</span>
                      </span>
                      <span v-if="!abertas[s.id] && preenchidos(s)" class="shrink-0 text-xs text-muted">{{ m.preenchidos(preenchidos(s)) }}</span>
                      <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted transition-transform duration-200" :class="abertas[s.id] ? 'rotate-180' : ''" />
                    </button>
                    <template #content>
                      <div class="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-4">
                        <CampoDoNo
                          v-for="c in camposVisiveis(s)"
                          :key="c.chave"
                          :campo="c"
                          :dado="rascunho"
                          :t="t"
                          :i="i"
                          :nos="nos"
                          :alvo="alvo"
                          :mostrar-erros="mostrarErros"
                          :class="emPar(s).has(c.chave) ? 'col-span-2 sm:col-span-1' : 'col-span-2'"
                          @marcar="marcar"
                        />
                      </div>
                    </template>
                  </UCollapsible>
                </section>
              </div>
            </Transition>
          </div>

          <!-- Rodapé -->
          <div class="flex flex-wrap items-center gap-2 border-t border-default px-5 py-3">
            <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
              <span v-if="confirmarDescarte" key="d" class="text-sm font-medium text-highlighted">{{ m.descartar }}</span>
              <UTooltip v-else-if="faltam.length" key="p" :text="m.pendenciaSalva">
                <UButton
                  :label="m.pendencias(faltam.length)"
                  icon="i-lucide-circle-alert"
                  color="warning"
                  variant="soft"
                  size="xs"
                  @click="irParaPendencia"
                />
              </UTooltip>
              <span v-else-if="modificado" key="m" class="flex items-center gap-1.5 text-xs text-warning">
                <span class="size-1.5 rounded-full bg-warning" />{{ m.modificado }}
              </span>
            </Transition>
            <span class="flex-1" />
            <template v-if="confirmarDescarte">
              <UButton :label="m.descartarNao" color="neutral" variant="outline" @click="confirmarDescarte = false" />
              <UButton :label="m.descartarSim" color="error" @click="aberto = false" />
            </template>
            <template v-else-if="modificado">
              <UButton :label="m.cancelar" color="neutral" variant="outline" @click="fechar" />
              <UButton :label="m.salvarEFechar" icon="i-lucide-check" :loading="salvando" @click="salvar" />
            </template>
            <UButton v-else :label="m.fechar" @click="aberto = false" />
          </div>
        </div>

        <!-- ENTRADA, à esquerda (do develop): abre Variáveis de entrada -->
        <button
          v-if="painel !== 'entrada' && !def.semEntrada"
          type="button"
          class="order-first -mr-2 hidden h-64 w-12 items-center justify-center rounded-l-xl border border-r-0 border-default bg-default/80 transition-colors hover:bg-elevated sm:flex"
          :aria-label="m.abrirEntrada"
          @click="painel = 'entrada'"
        >
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary [writing-mode:vertical-rl]">
            <UIcon name="i-lucide-arrow-right-to-line" class="size-4 rotate-90" />{{ m.entrada }}
          </span>
        </button>
        <section
          v-else-if="painel === 'entrada'"
          class="order-first -mr-1 hidden max-h-[min(72dvh,600px)] w-72 flex-col overflow-hidden rounded-l-xl border border-r-0 border-default bg-default shadow-lg sm:flex"
          :aria-label="m.variaveisDeEntrada"
        >
          <div class="flex items-center gap-2 border-b border-default px-3 py-3">
            <span class="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon name="i-lucide-arrow-right-to-line" class="size-4" /></span>
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ m.variaveisDeEntrada }}</h3>
            <UButton icon="i-lucide-panel-left-close" color="neutral" variant="ghost" size="xs" :aria-label="m.recolher" @click="painel = null; alvo = null" />
          </div>
          <div class="space-y-2 px-3 pt-3">
            <p class="text-xs text-muted">{{ m.arraste }}</p>
            <UInput v-model="filtro" icon="i-lucide-search" :placeholder="m.filtrar" size="sm" class="w-full" />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-2 text-sm">
            <p v-if="!gruposDeVariaveis.length" class="px-2 py-3 text-xs text-muted">{{ m.semVariaveis }}</p>
            <div v-for="g in gruposDeVariaveis" :key="g.noId" class="mb-2">
              <p class="flex items-center gap-1.5 px-1 py-1 text-xs font-semibold text-muted">
                <UIcon :name="g.icone" class="size-3.5" />{{ g.no }}
              </p>
              <button
                v-for="v in g.variaveis"
                :key="v.chave"
                type="button"
                draggable="true"
                class="flex w-full cursor-grab items-center gap-1.5 rounded py-1 pl-5 pr-2 text-left text-default transition-colors hover:bg-elevated active:cursor-grabbing"
                :title="v.chave"
                @dragstart="arrastar($event, v.chave, v.rotulo)"
                @click="clicarVariavel(v.chave)"
              >
                <UIcon :name="iconeDoTipo(v.tipo)" class="size-3.5 shrink-0 text-muted" />
                <span class="truncate">{{ v.rotulo }}</span>
                <UIcon v-if="alvo" name="i-lucide-corner-down-left" class="ms-auto size-3.5 shrink-0 text-primary opacity-60" />
              </button>
            </div>
          </div>
        </section>

        <!-- SAÍDA, à direita: o que o nó entrega -->
        <button
          v-if="painel !== 'saida' && !def.semSaida"
          type="button"
          class="-ml-2 hidden h-64 w-12 items-center justify-center rounded-r-xl border border-l-0 border-default bg-default/80 transition-colors hover:bg-elevated sm:flex"
          :aria-label="m.abrirSaida"
          @click="painel = 'saida'"
        >
          <span class="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-success [writing-mode:vertical-rl]">
            {{ m.saida }}<UIcon name="i-lucide-arrow-right-from-line" class="size-4 rotate-90" />
          </span>
        </button>
        <section
          v-else-if="painel === 'saida'"
          class="-ml-1 hidden max-h-[min(72dvh,600px)] w-64 flex-col overflow-hidden rounded-r-xl border border-l-0 border-default bg-default shadow-lg sm:flex"
          :aria-label="m.variaveisDeSaida"
        >
          <div class="flex items-center gap-2 border-b border-default px-3 py-3">
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ m.variaveisDeSaida }}</h3>
            <UButton icon="i-lucide-panel-right-close" color="neutral" variant="ghost" size="xs" :aria-label="m.recolher" @click="painel = null" />
          </div>
          <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm">
            <p class="text-xs text-muted">{{ variaveisDeSaida.length ? m.saidaDescricao : m.semSaida }}</p>
            <div v-for="v in variaveisDeSaida" :key="v.chave" class="rounded-md bg-elevated/60 px-2 py-1.5">
              <p class="font-medium text-highlighted">{{ v.rotulo[i] }}</p>
              <p class="truncate font-mono text-[11px] text-muted">{{ chaveDe(v.chave) }}</p>
            </div>
            <div v-if="saidas.length">
              <p class="mb-1 text-xs font-semibold text-muted">{{ m.saidasDoNo }}</p>
              <div class="flex flex-wrap gap-1.5">
                <UBadge v-for="s in saidas" :key="s.id" :label="s.rotulo[i]" color="success" variant="subtle" icon="i-lucide-arrow-right" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </UModal>
</template>
