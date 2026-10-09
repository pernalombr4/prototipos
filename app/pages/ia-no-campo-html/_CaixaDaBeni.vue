<script setup lang="ts">
/**
 * A caixa da BENI: abre logo abaixo do trecho (ou da linha do cursor), dentro
 * do campo HTML. PROPOSTA desta demanda.
 *
 * As fases, na ordem:
 *   pedido   campo de pedido livre + sugestões (UCommandPalette): digitar
 *            filtra as sugestões e põe "Seu pedido" no topo, para o Enter
 *            mandar o texto livre;
 *   gerando  a resposta chega palavra por palavra, com Parar;
 *   pronto   Substituir a seleção (ou Inserir), Inserir abaixo, Tentar de
 *            novo, Descartar e um campo para pedir ajuste sobre a resposta;
 *   erro     Tentar de novo e Descartar.
 *
 * A resposta fica nesta caixa até a pessoa aceitar: o campo só muda no
 * Substituir ou no Inserir, e o Ctrl Z do editor desfaz.
 * Esc descarta em qualquer fase.
 */
import { Beni } from '@be-enlighten/beni-avatar'
import '@be-enlighten/beni-avatar/style.css'
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Acao, Pedido } from './simulador'
import { camposDeContexto } from './mocks'
import { gerar, transmitir } from './simulador'

export interface AcaoInicial {
  acao: Acao
  parametro?: string
  rotulo: string
}

const props = defineProps<{
  t: Textos
  comSelecao: boolean
  /** O trecho selecionado ou o campo inteiro, blocos separados por \n. */
  texto: string
  campoVazio: boolean
  rotuloDoCampo: string
  /** Veio de uma ação da barra ou do "/": pula a fase de pedido. */
  inicial?: AcaoInicial
  /** Andaime: a BENI responde com erro. */
  falhar: boolean
}>()

const emit = defineEmits<{
  aplicar: [html: string, onde: 'substituir' | 'abaixo' | 'cursor']
  fechar: []
}>()

type Fase = 'pedido' | 'gerando' | 'pronto' | 'erro'
const fase = ref<Fase>('pedido')
const resposta = ref('')
const semRoteiro = ref(false)
const interrompida = ref(false)
const rotulo = ref('')
const busca = ref('')
const ajuste = ref('')
const usarCampos = ref(true)
let tentativa = 0
let ultimo: Pedido | null = null
let sinal = { parar: false }

const raiz = useTemplateRef<HTMLElement>('raiz')
const botaoPrincipal = useTemplateRef<{ $el: HTMLElement }>('botaoPrincipal')

/* ------------------------------------------------------------ gerar ---- */

async function executar(pedido: Pedido, rotuloDoPedido: string) {
  sinal.parar = true
  sinal = { parar: false }
  const meu = sinal
  ultimo = pedido
  rotulo.value = rotuloDoPedido
  resposta.value = ''
  semRoteiro.value = false
  interrompida.value = false
  ajuste.value = ''
  fase.value = 'gerando'

  if (props.falhar) {
    await new Promise(r => setTimeout(r, 1100))
    if (!meu.parar) fase.value = 'erro'
    return
  }

  const r = gerar(pedido)
  semRoteiro.value = !!r.semRoteiro
  const completa = await transmitir(r.html, (parcial) => { resposta.value = parcial }, meu)
  if (meu.parar && !completa) return
  fase.value = 'pronto'
  await nextTick()
  botaoPrincipal.value?.$el?.focus()
}

function pedidoDe(acao: Acao, parametro?: string, prompt?: string): Pedido {
  return { acao, parametro, prompt, texto: props.texto, usarCampos: usarCampos.value, tentativa }
}

function parar() {
  sinal.parar = true
  interrompida.value = true
  fase.value = resposta.value ? 'pronto' : 'pedido'
  nextTick(() => botaoPrincipal.value?.$el?.focus())
}

function tentarDeNovo() {
  if (!ultimo) return
  tentativa++
  executar({ ...ultimo, tentativa, usarCampos: usarCampos.value }, rotulo.value)
}

function pedirAjuste() {
  const q = ajuste.value.trim()
  if (!q || !ultimo) return
  executar({ ...pedidoDe('ajustar', undefined, q), anterior: resposta.value }, q)
}

onMounted(() => {
  if (props.inicial) {
    executar(pedidoDe(props.inicial.acao, props.inicial.parametro), props.inicial.rotulo)
  }
})

onBeforeUnmount(() => { sinal.parar = true })

/* -------------------------------------------------------- sugestões ---- */

const tb = computed(() => props.t.beni)

function sugestao(acao: Acao, rotuloDaAcao: string, icone: string, extra: Partial<CommandPaletteItem> = {}): CommandPaletteItem {
  return {
    label: rotuloDaAcao,
    icon: icone,
    onSelect: () => executar(pedidoDe(acao), rotuloDaAcao),
    ...extra,
  }
}

const grupos = computed<CommandPaletteGroup[]>(() => {
  const g: CommandPaletteGroup[] = []
  const q = busca.value.trim()
  if (q) {
    g.push({
      id: 'pedido',
      ignoreFilter: true,
      items: [{
        label: q,
        icon: 'i-lucide-send-horizontal',
        suffix: tb.value.seuPedido,
        onSelect: () => executar(pedidoDe('pedir', undefined, q), q),
      }],
    })
  }
  if (props.comSelecao) {
    g.push({
      id: 'selecao',
      label: tb.value.grupoSelecao,
      items: [
        sugestao('melhorar', tb.value.melhorar, 'i-lucide-wand-sparkles'),
        sugestao('corrigir', tb.value.corrigir, 'i-lucide-spell-check'),
        sugestao('encurtar', tb.value.encurtar, 'i-lucide-fold-vertical'),
        sugestao('expandir', tb.value.expandir, 'i-lucide-unfold-vertical'),
        {
          label: tb.value.tom,
          icon: 'i-lucide-mic-vocal',
          placeholder: tb.value.tom,
          children: (['formal', 'amigavel', 'direto'] as const).map(k => ({
            label: tb.value.tons[k]!,
            onSelect: () => executar(pedidoDe('tom', k), tb.value.paraTom(tb.value.tons[k]!)),
          })),
        },
        {
          label: tb.value.traduzir,
          icon: 'i-lucide-languages',
          placeholder: tb.value.traduzir,
          children: (['pt', 'en', 'es'] as const).map(k => ({
            label: tb.value.idiomas[k]!,
            onSelect: () => executar(pedidoDe('traduzir', k), tb.value.paraIdioma(tb.value.idiomas[k]!)),
          })),
        },
        sugestao('resumir', tb.value.resumirSelecao, 'i-lucide-list'),
      ],
    })
  }
  else {
    g.push({
      id: 'campo',
      label: tb.value.grupoCampo,
      items: [
        sugestao('continuar', tb.value.continuar, 'i-lucide-pen-line', { description: tb.value.continuarDescricao, disabled: props.campoVazio }),
        sugestao('resumir', tb.value.resumir, 'i-lucide-list', { description: tb.value.resumirDescricao, disabled: props.campoVazio }),
        sugestao('rascunhar', tb.value.rascunhar, 'i-lucide-file-pen-line', { description: tb.value.rascunharDescricao }),
      ],
    })
  }
  return g
})

/* ---------------------------------------------------------- aplicar ---- */

const ondePrincipal = computed(() => props.comSelecao ? 'substituir' : 'cursor')

function aplicar(onde: 'substituir' | 'abaixo' | 'cursor') {
  if (!resposta.value) return
  emit('aplicar', resposta.value, onde)
}

/* Clique fora da caixa: fecha só se nada foi gerado (nada a perder). */
function aoClicarFora(e: PointerEvent) {
  if (raiz.value?.contains(e.target as Node)) return
  if ((e.target as HTMLElement)?.closest('[data-reka-popper-content-wrapper]')) return
  if (fase.value === 'pedido' || fase.value === 'erro') emit('fechar')
}
onMounted(() => document.addEventListener('pointerdown', aoClicarFora, true))
onBeforeUnmount(() => document.removeEventListener('pointerdown', aoClicarFora, true))

const estadoDaBeni = computed(() => fase.value === 'gerando' ? 'working' : fase.value === 'erro' ? 'error' : 'idle')
</script>

<template>
  <div
    ref="raiz"
    role="dialog"
    :aria-label="tb.caixa"
    class="overflow-hidden rounded-lg border border-primary/30 bg-default shadow-xl shadow-primary/5"
    @keydown.esc.stop.prevent="emit('fechar')"
  >
    <!-- A RESPOSTA -->
    <div v-if="fase !== 'pedido'" class="border-b border-default">
      <div class="flex items-center gap-2 px-3 pt-2.5">
        <UBadge :label="rotulo" icon="i-lucide-sparkles" color="primary" variant="soft" size="sm" class="max-w-full truncate" />
        <span v-if="interrompida" class="text-xs text-muted">{{ tb.interrompido }}</span>
      </div>

      <div v-if="fase === 'erro'" class="px-3 py-3">
        <UAlert :title="tb.erroTitulo" :description="tb.erroTexto" icon="i-lucide-circle-alert" color="error" variant="subtle" />
      </div>
      <div
        v-else
        class="max-h-64 overflow-y-auto px-3 py-2 text-sm leading-6 text-default [&_li]:ms-5 [&_li]:list-disc [&_p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-highlighted [&_ul]:my-1"
        aria-live="polite"
      >
        <div v-html="resposta" />
        <span v-if="fase === 'gerando'" class="ms-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-primary" aria-hidden="true" />
        <p v-if="fase === 'pronto' && semRoteiro" class="mt-2 flex items-center gap-1.5 text-xs text-warning">
          <UIcon name="i-lucide-flask-conical" class="size-3.5" />{{ tb.simulacaoTraducao }}
        </p>
      </div>
    </div>

    <!-- PEDIDO: campo livre + sugestões -->
    <UCommandPalette
      v-if="fase === 'pedido'"
      size="sm"
      v-model:search-term="busca"
      :groups="grupos"
      :placeholder="comSelecao ? tb.placeholderSelecao : tb.placeholderPedido"
      icon="i-lucide-sparkles"
      :fuse="{ resultLimit: 12 }"
      :ui="{ root: 'max-h-80', label: 'text-xs', content: 'max-h-64' }"
    >
      <template #empty>
        <span class="text-sm text-muted">{{ tb.pedirDescricao }}</span>
      </template>
    </UCommandPalette>

    <!-- GERANDO -->
    <div v-else-if="fase === 'gerando'" class="flex items-center gap-2.5 px-3 py-2.5">
      <span class="flex size-7 shrink-0 items-center justify-center overflow-hidden [&>*]:size-full" aria-hidden="true">
        <Beni :state="estadoDaBeni" :eye-base-blink-interval="2500" />
      </span>
      <span class="flex-1 text-sm text-muted">{{ tb.escrevendo }}</span>
      <UButton :label="tb.parar" icon="i-lucide-square" color="neutral" variant="outline" size="xs" @click="parar" />
    </div>

    <!-- PRONTO -->
    <div v-else-if="fase === 'pronto'" class="flex flex-col gap-2 px-3 py-2.5">
      <div class="flex flex-wrap items-center gap-1.5">
        <UButton
          ref="botaoPrincipal"
          :label="comSelecao ? tb.substituir : tb.inserir"
          :icon="comSelecao ? 'i-lucide-replace' : 'i-lucide-corner-down-left'"
          size="sm"
          @click="aplicar(ondePrincipal)"
        />
        <UButton :label="tb.inserirAbaixo" icon="i-lucide-arrow-down-to-line" color="neutral" variant="outline" size="sm" @click="aplicar('abaixo')" />
        <UButton :label="tb.tentarDeNovo" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="sm" @click="tentarDeNovo" />
        <UButton :label="tb.descartar" icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="emit('fechar')" />
      </div>
      <form class="flex items-center gap-1.5" @submit.prevent="pedirAjuste">
        <UInput v-model="ajuste" :placeholder="tb.placeholderAjuste" icon="i-lucide-sparkles" size="sm" class="flex-1" :ui="{ leadingIcon: 'text-primary' }" />
        <UButton type="submit" icon="i-lucide-arrow-up" size="sm" color="neutral" variant="soft" :disabled="!ajuste.trim()" :aria-label="tb.enviar" />
      </form>
    </div>

    <!-- ERRO -->
    <div v-else class="flex items-center gap-1.5 px-3 py-2.5">
      <UButton :label="tb.tentarDeNovo" icon="i-lucide-rotate-ccw" size="sm" @click="tentarDeNovo" />
      <UButton :label="tb.descartar" icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="emit('fechar')" />
    </div>

    <!-- RODAPÉ: o que a BENI lê, o aviso e o Esc -->
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-default bg-elevated/50 px-3 py-1.5 text-xs text-muted">
      <UPopover :content="{ align: 'start', side: 'top', sideOffset: 6 }">
        <UButton
          :label="usarCampos ? tb.contexto(camposDeContexto.length) : tb.contextoSoCampo"
          icon="i-lucide-file-search"
          color="neutral"
          variant="link"
          size="xs"
          class="-ms-1.5 px-1.5 text-xs text-muted"
        />
        <template #content>
          <div class="w-72 p-3">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ tb.contextoTitulo }}</p>
            <ul class="mb-3 flex flex-col gap-1 text-sm">
              <li class="flex items-center gap-2 text-highlighted">
                <UIcon name="i-lucide-text-cursor-input" class="size-4 text-primary" />{{ tb.contextoCampo }} ({{ rotuloDoCampo }})
              </li>
              <li
                v-for="c in camposDeContexto"
                :key="c.chave"
                class="flex items-center gap-2 transition-opacity"
                :class="usarCampos ? 'text-default' : 'text-dimmed line-through'"
              >
                <UIcon name="i-lucide-square-dot" class="size-4 text-muted" />{{ c.rotulo }}
              </li>
            </ul>
            <USwitch v-model="usarCampos" :label="tb.usarCampos" size="sm" />
          </div>
        </template>
      </UPopover>
      <span class="ms-auto flex items-center gap-1.5">
        <UIcon name="i-lucide-info" class="size-3.5" />{{ tb.aviso }}
      </span>
      <span class="flex items-center gap-1"><UKbd value="Esc" size="sm" /> {{ tb.fechar }}</span>
    </div>
  </div>
</template>
